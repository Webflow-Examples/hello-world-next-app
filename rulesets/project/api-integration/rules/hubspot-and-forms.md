# HubSpot And Forms

The contact and demo section is the heaviest single block in the estimate: a
Product/Partnership tab switcher, a validated lead form (name, email, phone, country,
institution, job title, message, consent checkbox) and the HubSpot hookup.

**The HubSpot account is not provisioned yet.** Build against the documented Forms API, keep
portal and form identifiers in configuration, and label the contract provisional.

## Submission path

- Submit through a server route handler, never directly from the browser to HubSpot. The server owns the credential, the validation and the error mapping.
- Validate on the server with the same schema the client uses. Client validation is a convenience; the server decision is the real one.
- Treat the submission as untrusted input. Never reflect raw user input into HTML or into a log line that someone will read as trusted.
- Be idempotent where the API allows it, and make a retry safe.

## Consent and data protection

- The consent checkbox is never pre-checked and never bundled with another agreement.
- Collect only the fields the register's page actually needs. A field nobody uses is a data-protection liability.
- The privacy and data-protection pages are the controlling text. Never write new consent wording; it falls under [Claims And Gates](../../shared/claims-and-gates.md).
- Never log form contents. Log a correlation identifier and the outcome.

## User-visible behaviour

Specify and implement all of these; a lead form that silently drops a submission is a
business failure, not a UI detail.

- Pending state that prevents double submission.
- Field-level validation errors, announced and tied to the field.
- A transport or API failure: the visitor is told what happened and what to do next, and the entered data is preserved.
- Success: what happens next, who replies and within what timeframe. The approved wording comes from the page register, not from the implementer.
- Accessibility per [Accessibility: WCAG 2.1 AA](../../ui-designer/rules/accessibility-aa.md).

## Analytics

- Evaluation routes carry an event model: pilot programme, lighthouse centres, request demonstration, collaborate on evidence.
- Events fire on the real outcome, not on the click that precedes it. A failed submission is not a conversion.
