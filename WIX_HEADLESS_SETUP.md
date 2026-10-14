# Wix Headless form setup

The public website remains hosted on Netlify. Wix is used as the protected business-data backend for project enquiries.

## 1. Create the Wix form

In the Wix dashboard for project `82253800-6895-427d-a2ff-50d61b830877`:

1. Install or open **Wix Forms**.
2. Create a form named `Project enquiry`.
3. Add the fields below. Wix generates the storage targets automatically; the current production targets are recorded here so code and schema can be audited together:

| Wix target | Purpose |
| --- | --- |
| `first_name_46d5` | Full name |
| `company_name_7742` | Company |
| `email_6195` | Email |
| `phone_9102` | Phone |
| `long_answer_f959` | Project description |
| `short_answer_0787` | Required quantity |
| `short_answer_95c1` | Target date |
| `long_answer_1835` | Additional requirements |
| `file_upload_292c` | Uploaded project file |

4. Form ID: `51af4f13-f6d2-4511-a6dc-e458df274161`. It is stored as `WIX_FORM_ID` in Netlify.

## 2. Create Wix server credentials

In **Headless Settings**, create a client secret for the existing OAuth client.

- Client ID: `1db002e9-d9cc-4317-b122-59a71e3df405`
- Required permission: **Manage Submissions**

The secret is displayed once. Store it directly in Netlify and do not commit it to Git.

## 3. Configure Netlify

Open the Netlify site settings, then add these environment variables for the Functions scope:

```text
WIX_CLIENT_ID=1db002e9-d9cc-4317-b122-59a71e3df405
WIX_CLIENT_SECRET=<the generated Wix secret>
WIX_FORM_ID=<the Wix form ID>
```

Trigger a new production deploy after adding or changing the variables.

## 4. Verify

1. Open `contact.html` on the Netlify preview URL.
2. Submit a test enquiry without a file.
3. Confirm that it appears under Wix Forms submissions.
4. Submit another enquiry with a small supported file.
5. Confirm that the file is accessible from the saved submission.

The form accepts STL, STEP, STP, OBJ, PDF, DWG, IGES, IGS, JPG, JPEG, and PNG files up to 4 MB.

## Domain migration

Do not connect the production domain to Wix. The production domain should point to Netlify because Netlify serves the frontend. Wix remains the headless backend. Change DNS only after the preview URL and form workflow pass the verification steps above.
