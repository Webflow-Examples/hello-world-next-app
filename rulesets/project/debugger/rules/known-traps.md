# Known Traps

Failures already paid for on this project. Check these before a deep investigation.

## `Element type is invalid ... but got: undefined` during prerender

A compound component reached across the React Server Components boundary. `<List.Item>` on a
client module resolves to `undefined` on the server, because the module arrives as a reference
proxy and a static property that is not itself a named export does not exist on it. The error
names no component and no file.

Use the flat export (`ListItem`, `AccordionItem`, `MenuDropdown`, `CardSection`). ESLint bans
the compound form under `src/app/**`.

## Stale route types after moving or deleting a route file

`tsc --noEmit` reports errors in `.next/types/validator.ts` about modules that no longer
exist. The generated route types are stale, not the source. Rebuild, or remove `.next`, before
investigating further.

## ESLint flat config and a plugin registered by `eslint-config-next`

- Spreading a preset that registers an already-registered plugin fails with `Cannot redefine plugin`.
- Applying only that preset's rules, in a config object whose file pattern is wider than the one the plugin was registered for, fails with `could not find plugin`.

Apply the rules and scope the object to the same file pattern. `eslint.config.mjs` records
this.

## A locale route behaving unexpectedly

Check `src/proxy.ts` first. Unprefixed paths are rewritten into the default locale segment and
`/en` is redirected to `/`. A path that looks absent may be a matcher gap rather than a missing
route. Metadata routes are deliberately excluded from the matcher.

## The browser adapter hangs on `open`

A previous session left managed Chrome processes alive, and they hold the profile, so the next
launch waits forever with no output. `close --all` reports success without actually reaping
them. Find the survivors by their cache path and kill only those — never every `chrome.exe`,
which would take the developer's own browser with it:

```powershell
Get-CimInstance Win32_Process -Filter "Name='chrome.exe'" |
  Where-Object { $_.CommandLine -like '*frontend-accelerator*' } |
  ForEach-Object { Stop-Process -Id $_.ProcessId -Force }
```

## Playwright MCP refuses to start a browser

`Browser "chrome-for-testing" is not installed` means the MCP server's own pinned Chromium is
missing. `npx playwright install chromium` does not satisfy it; the MCP server needs
`npx @playwright/mcp install-browser chrome-for-testing`. See `docs/mcp.md`.

## Prettier and the accelerator payload

Running a formatter over `.claude/`, `.agents/`, `rulesets/` or `toolchain/` changes files
that are verified against `.frontend-accelerator/installation.json`, after which
`frontend-accelerator update` refuses to write and reports a conflict. Both ESLint and
Prettier are configured to ignore them; restore the file from git rather than reformatting it
back.

## A test that checks a URL's shape proves nothing about the URL

`sitemap - contains only absolute canonical-origin URLs` passed while 34 of the 35 URLs it
checked answered 404, because it only inspected the string. `seo.spec.ts - resolves in one hop,
with no chain` passed on a 301 landing in a 404, because it asserted the status was neither 301
nor 308. Both held for weeks.

For anything a crawler consumes, fetch it. The assertion is `200` and the absence of `noindex`,
not a regular expression over the href. See `docs/adr/0002-built-routes-gate.md`.

## The page register is a plan, not a routing table

`PAGE_REGISTER` is a transcription of a spreadsheet of 51 intended pages. `Indexation: Index,
follow` describes the finished page; it does not mean a route segment exists. Anything that
decides what a crawler is told reads `BUILT_ROUTES` in `src/shared/config/built-routes.ts`,
which is hand-maintained and says what this deployment actually serves.

Building a page is two steps: add the route segment, then add its `BUILT_ROUTES` entry.

## `docs/spec/` is hand-maintained; there is nothing to regenerate

Python scripts used to transcribe the spreadsheets in `docs/` into `docs/spec/` and into
`src/shared/config/page-register.ts`. They were removed once the transcription was done: it was
a start-of-project job, not a build step. The spreadsheets stay as provenance.

If a document or a comment tells you to regenerate something here, it is stale — fix it. Do not
reintroduce a script that rewrites one of these files: `fe-scope.md` and `locales.md` carry
hand-written sections that a whole-file writer silently ate once already, 33 lines and 15 lines.

## Rules for this role

- Reproduce before fixing. A fix without a reproduction is a guess.
- One minimal fix for the proven cause, plus regression coverage when the failure could recur.
- Never widen the change to unrelated cleanup.
