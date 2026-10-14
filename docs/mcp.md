# MCP servers

`.mcp.json` carries the servers that need no account. Versions are pinned so a server cannot
change under the project between sessions.

| Server            | Package                                  | Purpose                                                                                           |
| ----------------- | ---------------------------------------- | ------------------------------------------------------------------------------------------------- |
| `playwright`      | `@playwright/mcp` 0.0.83 (local install) | Driving a real browser while writing or debugging end-to-end specs                                |
| `mantine`         | `@mantine/mcp-server@9.7.1`              | Component docs, props and search across the library, matching the installed `@mantine/core` 9.7.1 |
| `chrome-devtools` | `chrome-devtools-mcp@1.10.1`             | Performance traces for LCP, INP and CLS, which Playwright cannot produce                          |

All three answer an MCP `initialize` handshake from this repository.

Two browser downloads are involved and they are not the same one:

```bash
npx playwright install chromium                          # for the e2e runner
npx @playwright/mcp install-browser chrome-for-testing   # for the MCP server
```

The automated served-HTML suite needs neither — it reads raw responses through the `request`
fixture. The e2e runner needs the first if a spec ever opens a page; the MCP server needs the
second and fails with "Browser 'chrome-for-testing' is not installed" until it is there. The
MCP server pins its own Chromium build, so installing one does not satisfy the other.

## Which tool for which job

Three browser-ish tools exist here and they are not interchangeable.

- **`toolchain/bin/agent-browser.mjs`** is the only browser the `browser-verify` role may use. It is the accelerator's project-owned adapter, it is what Doctor checks, and it is what the evidence protocol expects. Reaching for Playwright MCP there breaks the readiness check and the evidence chain.
- **Playwright MCP** is for authoring and debugging the specs in `e2e/`, interactively.
- **Chrome DevTools MCP** is for Core Web Vitals work: real traces, not score estimates. CWV are an acceptance criterion measured per template, so this is the tool that answers "why is LCP slow on the product hub".

## Figma

Figma is connected at the account level through the claude.ai connector, not through
`.mcp.json`. Nothing to configure in the repository.

What is still needed: access to the WS-C file (Brand & Visual System, UI kit and tokens). Read
tokens and variables through the connector rather than eyeballing a screenshot, and export
assets rather than recreating them - the icon set is a custom system, not a generic pack.

## Pending accounts

Neither server is enabled yet, because neither account exists. Both entries below are ready to
paste into `.mcp.json` once they do. JSON has no comments, which is why they live here.

### Webflow

Remote, OAuth, authorised by a site owner or admin:

```json
"webflow": {
  "type": "http",
  "url": "https://mcp.webflow.com/mcp"
}
```

Local, with a token in the environment:

```json
"webflow": {
  "command": "npx",
  "args": ["-y", "webflow-mcp-server@1.0.0"],
  "env": { "WEBFLOW_TOKEN": "${WEBFLOW_TOKEN}" }
}
```

The MCP surface does **not** cover creating localised CMS items, configuring webhooks, or
authoring IX3 interactions. Those go through the Data API directly. Do not plan a flow that
depends on the MCP for them. Some Designer-side tools additionally require the Webflow MCP
Bridge App to be running in the Designer.

### HubSpot

```json
"hubspot": {
  "command": "npx",
  "args": ["-y", "@hubspot/mcp-server@0.4.0"],
  "env": { "PRIVATE_APP_ACCESS_TOKEN": "${HUBSPOT_TOKEN}" }
}
```

A HubSpot connector also exists at the claude.ai account level and needs authorising there.

## Authorisation

Anything OAuth-based - the Figma connector, Webflow, HubSpot - is authorised by a person, in
an interactive session or in claude.ai connector settings. An agent cannot complete an OAuth
flow, and should never be handed a token, an authorisation code or a callback URL in chat.

Tokens belong in the environment. `.env.local` is ignored by git; `.env.example` documents the
names without the values.
