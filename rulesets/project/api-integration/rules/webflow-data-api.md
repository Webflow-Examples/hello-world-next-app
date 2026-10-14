# Webflow Data API

Webflow is the headless CMS. Next.js owns rendering and routing; Webflow owns content.

**The account is not provisioned yet.** Until it is, model the integration against the
documented API and label every contract detail provisional. Never promote a guessed field
name, collection shape or limit to specification truth.

## Credentials and call sites

- Server-only. A token never appears in a Client Component, in a `NEXT_PUBLIC_` variable, or in the client bundle.
- Call from Server Components, route handlers or build-time data loaders.
- Keep API access behind a typed module. Components receive project types, never raw CMS payloads.

## Contract handling

- Validate every response at the boundary and narrow it to a project type. A CMS editor can rename or retype a field without a deploy; the failure must surface as a typed error, not as `undefined` rendered into a page.
- Treat an unexpected shape as a failure to report, not something to coerce.
- Record which Webflow collection and field backs every slot in a template, so a claims change can be traced from the register to the CMS.

## Known constraints

- Rate limits and pagination are first-class concerns, not retrofits. A page build that resolves many items will hit them.
- Reference and multi-reference fields cost extra requests. Decide a resolution strategy per template.
- Collection count and locale availability depend on the plan tier, which is unconfirmed. Record the assumption with the owner who must confirm it.
- The Webflow MCP server cannot create localised CMS items, configure webhooks, or author IX3 interactions. Those go through the Data API directly. Never design a flow that depends on the MCP for them.

## Localisation

- `/us` inherits the root structure and substitutes only gated slots. The substitution layer is built once and reused by every page.
- A locale without content for a slot serves the substituted slot. Never a 404, never a fallback to another locale's wording, never an empty page.
