const MAX_FILE_BYTES = 4 * 1024 * 1024;
const MAX_TEXT_LENGTH = 5000;
const MIN_FILL_TIME_MS = 1200;
const WIX_TOKEN_URL = 'https://www.wixapis.com/oauth2/token';
const WIX_SUBMISSION_URL = 'https://www.wixapis.com/form-submission-service/v4/submissions';
const WIX_MEDIA_URL = `${WIX_SUBMISSION_URL}/media-upload-url`;
// Field keys of the "Project enquiry" form in Wix Forms (each field's settings show its key).
const WIX_FIELD_TARGETS = Object.freeze({
  fullName: 'form_field',
  email: 'form_field_1',
  phone: 'form_field_2',
  message: 'form_field_3',
  file: 'form_field_4',
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

  const fullName = clean(values.fullName, 160);
  const email = clean(values.email, 254).toLowerCase();
  const phone = normalizePhone(values.phone);
  const message = clean(values.message);

  if (!fullName || !email || !message) {
    throw new PublicError('נא למלא שם, אימייל ותיאור הפרויקט.');
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
    data: { fullName, email, phone, message },
  };
}

export function buildSubmissionMap(data, uploadedFileUrl = '') {
  const fields = Object.fromEntries(
    Object.entries(data).map(([field, value]) => [WIX_FIELD_TARGETS[field], value]),
  );
  if (uploadedFileUrl) fields[WIX_FIELD_TARGETS.file] = uploadedFileUrl;
  return Object.fromEntries(Object.entries(fields).filter(([target, value]) => target && value));
}

const GUID_PATTERN = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i;

// Accepts the bare form ID, or a pasted dashboard URL such as .../wix-forms/form/<id>/edit.
export function parseFormId(value) {
  const raw = String(value || '').trim();
  const fromUrl = raw.match(new RegExp(`/form/(${GUID_PATTERN.source})`, 'i'));
  return (fromUrl?.[1] || raw.match(GUID_PATTERN)?.[0] || '').toLowerCase();
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

export async function handleSubmission(request, env) {
  if (request.method !== 'POST') return json({ ok: false, message: 'Method not allowed' }, 405);

  try {
    const clientId = env.WIX_CLIENT_ID;
    const clientSecret = env.WIX_CLIENT_SECRET;
    const formId = parseFormId(env.WIX_FORM_ID);
    if (env.WIX_FORM_ID && !formId) {
      console.error('WIX_FORM_ID is not a form ID', { length: String(env.WIX_FORM_ID).length });
    }
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

export default function handler(request) {
  return handleSubmission(request, process.env);
}

export const config = { path: '/api/submit-project' };
