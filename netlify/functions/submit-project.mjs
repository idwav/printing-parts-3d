const MAX_FILE_BYTES = 4 * 1024 * 1024;
const MAX_TEXT_LENGTH = 5000;
const MIN_FILL_TIME_MS = 1200;
const WIX_TOKEN_URL = 'https://www.wixapis.com/oauth2/token';
const WIX_SUBMISSION_URL = 'https://www.wixapis.com/form-submission-service/v4/submissions';
const WIX_MEDIA_URL = `${WIX_SUBMISSION_URL}/media-upload-url`;
const WIX_FIELD_TARGETS = Object.freeze({
  name: 'first_name_46d5',
  company: 'company_name_7742',
  email: 'email_6195',
  phone: 'phone_9102',
  details: 'long_answer_f959',
  quantity: 'short_answer_0787',
  deadline: 'short_answer_95c1',
  requirements: 'long_answer_1835',
  file: 'file_upload_292c',
});
const ALLOWED_EXTENSIONS = new Set([
  'stl', 'step', 'stp', 'obj', 'pdf', 'dwg', 'iges', 'igs', 'jpg', 'jpeg', 'png',
]);

class PublicError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.status = status;
  }
}

function clean(value, maxLength = MAX_TEXT_LENGTH) {
  return String(value || '').trim().slice(0, maxLength);
}

function getExtension(filename) {
  return clean(filename, 300).split('.').pop()?.toLowerCase() || '';
}

export function normalizePhone(value) {
  const phone = clean(value, 60).replace(/[()\s.-]/g, '');
  if (!phone) return '';
  if (phone.startsWith('+')) return phone;
  if (phone.startsWith('00972')) return `+972${phone.slice(5)}`;
  if (phone.startsWith('972')) return `+${phone}`;
  if (phone.startsWith('0')) return `+972${phone.slice(1)}`;
  return phone;
}

export function validateSubmission(values, file, now = Date.now()) {
  if (clean(values.website, 200)) return { spam: true };

  const loadedAt = Number(values.loadedAt);
  if (Number.isFinite(loadedAt) && now - loadedAt < MIN_FILL_TIME_MS) return { spam: true };

  const name = clean(values.name, 160);
  const email = clean(values.email, 254).toLowerCase();
  const phone = normalizePhone(values.phone);
  const details = clean(values.details);

  if (!name || !email || !phone || !details) {
    throw new PublicError('נא למלא שם, אימייל, טלפון ותיאור הפרויקט.');
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new PublicError('כתובת האימייל אינה תקינה.');
  }

  if (file?.size) {
    if (file.size > MAX_FILE_BYTES) throw new PublicError('הקובץ גדול מדי. ניתן לצרף קובץ עד 4MB.');
    if (!ALLOWED_EXTENSIONS.has(getExtension(file.name))) throw new PublicError('סוג הקובץ אינו נתמך.');
  }

  return {
    spam: false,
    data: {
      name,
      company: clean(values.company, 200),
      email,
      phone,
      details,
      quantity: clean(values.quantity, 100),
      deadline: clean(values.deadline, 160),
      requirements: clean(values.requirements),
    },
  };
}

export function buildSubmissionMap(data, uploadedFileUrl = '') {
  const fields = {
    [WIX_FIELD_TARGETS.name]: data.name,
    [WIX_FIELD_TARGETS.company]: data.company,
    [WIX_FIELD_TARGETS.email]: data.email,
    [WIX_FIELD_TARGETS.phone]: data.phone,
    [WIX_FIELD_TARGETS.details]: data.details,
    [WIX_FIELD_TARGETS.quantity]: data.quantity,
    [WIX_FIELD_TARGETS.deadline]: data.deadline,
    [WIX_FIELD_TARGETS.requirements]: data.requirements,
  };
  if (uploadedFileUrl) fields[WIX_FIELD_TARGETS.file] = uploadedFileUrl;
  return Object.fromEntries(Object.entries(fields).filter(([, value]) => value));
}

export function buildMediaUploadRequest(formId, file) {
  return {
    form_id: formId,
    filename: clean(file.name, 300),
    mimeType: file.type || 'application/octet-stream',
  };
}

async function wixRequest(url, token, body) {
  const response = await fetch(url, {
    method: 'POST',
    headers: { Authorization: token, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    console.error('Wix API error', response.status, (await response.text()).slice(0, 1000));
    throw new PublicError('לא הצלחנו לשמור את הפנייה כרגע. נסו שוב בעוד כמה דקות.', 502);
  }
  return response.json();
}

async function getWixAccessToken(clientId, clientSecret) {
  const response = await fetch(WIX_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ grant_type: 'client_credentials', client_id: clientId, client_secret: clientSecret }),
  });
  if (!response.ok) {
    console.error('Wix authentication failed', response.status, await response.text());
    throw new PublicError('שירות השליחה אינו זמין כרגע.', 503);
  }
  const result = await response.json();
  if (!result.access_token) throw new PublicError('שירות השליחה אינו זמין כרגע.', 503);
  return result.access_token;
}

async function uploadFileToWix(file, formId, token) {
  if (!file?.size) return '';
  const { uploadUrl } = await wixRequest(
    WIX_MEDIA_URL,
    token,
    buildMediaUploadRequest(formId, file),
  );
  if (!uploadUrl) throw new PublicError('לא הצלחנו להכין את הקובץ להעלאה.', 502);

  const uploadResponse = await fetch(uploadUrl, {
    method: 'PUT',
    headers: { 'Content-Type': file.type || 'application/octet-stream' },
    body: await file.arrayBuffer(),
  });
  if (!uploadResponse.ok) {
    console.error('Wix media upload failed', uploadResponse.status, await uploadResponse.text());
    throw new PublicError('העלאת הקובץ נכשלה. נסו קובץ אחר או שלחו ללא קובץ.', 502);
  }
  return uploadUrl;
}

async function createSubmission(token, formId, submissions) {
  const result = await wixRequest(WIX_SUBMISSION_URL, token, {
    submission: { formId, submissions },
  });
  if (result.submission?.status !== 'PENDING') return result.submission;

  const confirmed = await wixRequest(
    `${WIX_SUBMISSION_URL}/${result.submission.id}/confirm`,
    token,
    {},
  );
  return confirmed.submission;
}

function json(body, status = 200) {
  return Response.json(body, {
    status,
    headers: { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' },
  });
}

export default async function handler(request) {
  if (request.method !== 'POST') return json({ ok: false, message: 'Method not allowed' }, 405);

  try {
    const clientId = process.env.WIX_CLIENT_ID;
    const clientSecret = process.env.WIX_CLIENT_SECRET;
    const formId = process.env.WIX_FORM_ID;
    if (!clientId || !clientSecret || !formId) {
      console.error('Missing Wix environment variables');
      throw new PublicError('טופס הפנייה עדיין אינו מחובר. אפשר ליצור קשר ישירות דרך האתר.', 503);
    }

    const formData = await request.formData();
    const fileValue = formData.get('file');
    const file = fileValue && typeof fileValue !== 'string' ? fileValue : null;
    const values = Object.fromEntries([...formData.entries()].filter(([, value]) => typeof value === 'string'));
    const validated = validateSubmission(values, file);
    if (validated.spam) return json({ ok: true });

    const token = await getWixAccessToken(clientId, clientSecret);
    const uploadedFileUrl = await uploadFileToWix(file, formId, token);
    const submission = await createSubmission(
      token,
      formId,
      buildSubmissionMap(validated.data, uploadedFileUrl),
    );
    return json({ ok: true, submissionId: submission?.id || null });
  } catch (error) {
    if (!(error instanceof PublicError)) console.error('Unexpected form error', error);
    return json({
      ok: false,
      message: error instanceof PublicError ? error.message : 'אירעה שגיאה בשליחת הפנייה. נסו שוב בעוד כמה דקות.',
    }, error instanceof PublicError ? error.status : 500);
  }
}

export const config = { path: '/api/submit-project' };
