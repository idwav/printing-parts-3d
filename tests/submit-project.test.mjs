import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildMediaUploadRequest,
  buildSubmissionMap,
  handleSubmission,
  normalizePhone,
  validateSubmission,
} from '../netlify/functions/submit-project.mjs';

const validValues = {
  name: 'ישראל ישראלי', email: 'Test@Example.com', phone: '050-123-4567',
  details: 'חלק מכני לסדרה קטנה', loadedAt: '1000',
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

test('removes empty Wix fields', () => {
  const map = buildSubmissionMap({
    name: 'Tom', email: 'tom@example.com', phone: '+972501234567', details: 'Part', company: '',
    quantity: '', deadline: '', requirements: '',
  });
  assert.deepEqual(map, {
    first_name_46d5: 'Tom',
    email_6195: 'tom@example.com',
    phone_9102: '+972501234567',
    long_answer_f959: 'Part',
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
const wixEnv = { WIX_CLIENT_ID: 'id', WIX_CLIENT_SECRET: 'secret', WIX_FORM_ID: 'form' };

test('rejects non-POST requests', async () => {
  const response = await handleSubmission(new Request('https://example.test/api/submit-project'), wixEnv);
  assert.equal(response.status, 405);
});

test('reports a missing Wix configuration from the injected environment', async () => {
  const response = await handleSubmission(formRequest({ name: 'x' }), {});
  assert.equal(response.status, 503);
});

test('reads the Wix configuration from the injected environment', async () => {
  const response = await handleSubmission(formRequest({ name: 'x' }), wixEnv);
  assert.equal(response.status, 400);
});
