import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildMediaUploadRequest,
  buildSubmissionMap,
  handleSubmission,
  normalizePhone,
  parseFormId,
  validateSubmission,
} from '../netlify/functions/submit-project.mjs';

const validValues = {
  fullName: 'ישראל ישראלי', email: 'Test@Example.com', phone: '050-123-4567',
  message: 'חלק מכני לסדרה קטנה', loadedAt: '1000',
};

test('normalizes a valid project submission', () => {
  const result = validateSubmission(validValues, null, 5000);
  assert.equal(result.spam, false);
  assert.equal(result.data.email, 'test@example.com');
  assert.equal(result.data.phone, '+972501234567');
});

test('normalizes common Israeli phone formats for Wix', () => {
  assert.equal(normalizePhone('03 123 4567'), '+97231234567');
  assert.equal(normalizePhone('+972 50 123 4567'), '+972501234567');
});

test('silently accepts honeypot spam without sending it to Wix', () => {
  assert.equal(validateSubmission({ ...validValues, website: 'https://spam.example' }, null, 5000).spam, true);
});

test('rejects unsupported files', () => {
  assert.throws(() => validateSubmission(validValues, { name: 'payload.exe', size: 100 }, 5000), /סוג הקובץ אינו נתמך/);
});

test('requires a name, email and project description', () => {
  assert.throws(() => validateSubmission({ ...validValues, message: '' }, null, 5000), /נא למלא שם, אימייל ותיאור הפרויקט/);
});

test('accepts a submission without a phone number', () => {
  assert.equal(validateSubmission({ ...validValues, phone: '' }, null, 5000).data.phone, '');
});

test('maps form fields to Wix targets and removes empty ones', () => {
  const map = buildSubmissionMap({
    fullName: 'Tom Cohen', email: 'tom@example.com', phone: '', message: 'Ten brackets',
  }, 'https://upload.example/file');
  assert.deepEqual(map, {
    form_field: 'Tom Cohen',
    form_field_1: 'tom@example.com',
    form_field_3: 'Ten brackets',
    form_field_4: 'https://upload.example/file',
  });
});

test('builds the Wix REST media upload request', () => {
  assert.deepEqual(buildMediaUploadRequest('form-123', {
    name: 'drawing.png',
    type: 'image/png',
  }), {
    form_id: 'form-123',
    filename: 'drawing.png',
    mimeType: 'image/png',
  });
});

const formRequest = (fields = {}) => {
  const body = new FormData();
  Object.entries(fields).forEach(([key, value]) => body.append(key, value));
  return new Request('https://example.test/api/submit-project', { method: 'POST', body });
};
const wixEnv = { WIX_CLIENT_ID: 'id', WIX_CLIENT_SECRET: 'secret', WIX_FORM_ID: 'a8743983-bbf3-46f0-946b-e9f3420ecc38' };

test('rejects non-POST requests', async () => {
  const response = await handleSubmission(new Request('https://example.test/api/submit-project'), wixEnv);
  assert.equal(response.status, 405);
});

test('reports a missing Wix configuration from the injected environment', async () => {
  const response = await handleSubmission(formRequest({ fullName: 'x' }), {});
  assert.equal(response.status, 503);
});

test('reads the Wix configuration from the injected environment', async () => {
  const response = await handleSubmission(formRequest({ fullName: 'x' }), wixEnv);
  assert.equal(response.status, 400);
});

test('reads the form ID from a bare ID, a padded value or a pasted dashboard URL', () => {
  const id = 'a8743983-bbf3-46f0-946b-e9f3420ecc38';
  assert.equal(parseFormId(id), id);
  assert.equal(parseFormId(` "${id.toUpperCase()}"\n`), id);
  assert.equal(parseFormId(`https://manage.wix.com/dashboard/94e24c65-0cd4-4ef1-957e-68e7dc47690d/wix-forms/form/${id}/edit`), id);
  assert.equal(parseFormId('Project enquiry'), '');
});
