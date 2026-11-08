# Wix Headless form setup

The public website is hosted on Cloudflare Pages. Wix is used as the protected business-data backend for project enquiries.

## 1. Create the Wix form

In the client's Wix dashboard, open **Forms & Submissions** and create a new standalone form named `Project enquiry` with these fields. The site's previous contact form uses the legacy Wix Forms app, which this integration cannot write to.

| Website field | Wix field type | Required |
| --- | --- | --- |
| First name | First name | Yes |
| Last name | Last name | |
| Email | Email | Yes |
| Phone | Phone | Yes |
| Job title | Short answer | |
| Subject | Short answer | |
| Project description | Long answer | |
| File | File upload (STL, STEP, STP, OBJ, PDF, DWG, IGES, IGS, JPG, PNG) | |

Wix generates a key for every field. Copy each key from the field's settings into `WIX_FIELD_TARGETS` in `netlify/functions/submit-project.mjs`; the values there now are placeholders. Store the form ID as `WIX_FORM_ID` in Cloudflare.

## 2. Create Wix server credentials

In **Settings > Development & integrations > Headless Settings**, create a headless client, then open its settings and generate a client secret.

The secret is displayed once. Store it directly in Cloudflare and do not commit it to Git.

## 3. Configure Cloudflare Pages

Create a Pages project connected to the GitHub repository with `npm run build` as the build command and `dist` as the build output directory. In **Settings > Variables and Secrets**, add these for both Production and Preview, marking `WIX_CLIENT_SECRET` as a secret:

```text
WIX_CLIENT_ID=<the headless client ID>
WIX_CLIENT_SECRET=<the generated Wix secret>
WIX_FORM_ID=<the Wix form ID>
```

Trigger a new production deploy after adding or changing the variables.

## 4. Verify

1. Open `contact.html` on the `pages.dev` URL.
2. Submit a test enquiry without a file.
3. Confirm that it appears under Wix Forms submissions.
4. Submit another enquiry with a small supported file.
5. Confirm that the file is accessible from the saved submission.

The form accepts STL, STEP, STP, OBJ, PDF, DWG, IGES, IGS, JPG, JPEG, and PNG files up to 4 MB.

## Domain migration

The production domain should point to Cloudflare Pages, which serves the frontend. Wix remains the headless backend. The apex domain requires Cloudflare to manage the zone's nameservers, so before changing them, copy every existing DNS record, including the Google MX, SPF and verification records. Change DNS only after the `pages.dev` URL and form workflow pass the verification steps above.
