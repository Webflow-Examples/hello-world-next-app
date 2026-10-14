# Data And Boundaries

## Content comes from Webflow as a headless CMS

Next.js owns the whole frontend. Webflow is a content source reached through the Data API; it
does not render pages and it does not own routing.

- Webflow credentials are server-only. Never expose a token to the client, never call the Data API from a Client Component, never put a token in a `NEXT_PUBLIC_` variable.
- Fetch in Server Components or route handlers. Validate every response at the boundary and narrow it to a project type; a CMS field can disappear or change type without a deploy.
- Plan for rate limits and pagination from the first integration, not after the first failure.
- Reference and multi-reference fields resolve to extra requests. Decide the resolution strategy per template rather than per component, or page builds will fan out unpredictably.
- Collection and locale limits depend on the Webflow plan, which is not confirmed. Record the assumption; do not design around a tier nobody has bought.

## Serverless

- Node.js serverless functions are in scope for form submission, webhooks and revalidation. The platform is undecided, so keep handlers framework-portable: plain request and response handling, no provider-specific globals in business logic.
- A webhook handler verifies its signature before acting, is idempotent, and returns quickly. Webflow webhooks are outside the MCP surface and are configured through the Data API.

## Failure behaviour

Decide these explicitly per template; they are user-visible states, not edge cases.

- The CMS is unreachable at build time.
- The CMS is unreachable at revalidation time: serve the last good content rather than an error.
- A required slot is empty because the claims gate has not cleared it. The page renders without the slot's content and without inventing a substitute.
- HubSpot rejects a submission. The visitor sees what happened and what to do; no silent drop.

## What not to introduce without a decision

- A client-side data-fetching library, a global state manager, or a second styling system.
- An ORM, a database, or a server-side session. Nothing in the current brief needs one.
- A second browser automation provider. Browser verification uses the project-owned adapter only.
