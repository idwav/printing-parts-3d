import { handleSubmission } from '../../netlify/functions/submit-project.mjs';

export const onRequest = ({ request, env }) => handleSubmission(request, env);
