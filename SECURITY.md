# Security notes for Ideabloom

Ideabloom is a static, local-first app: there is no backend, no account and no network API.
All data lives in the user's own browser (IndexedDB). That removes most server-side risks;
what is left is XSS, hostile imported files, supply chain and server configuration.

## What was checked (and how)

| Area                       | Result                                                                                                                                                                                                                            | Evidence                                                                                                                                                                                                |
| -------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Dependency vulnerabilities | `pnpm audit --prod`: none. One moderate advisory exists in a dev-only transitive dependency of Jest (`sprintf-js`); it is not in the shipped bundle.                                                                              | CI runs `pnpm audit --prod` on every push                                                                                                                                                               |
| XSS sinks                  | No `dangerouslySetInnerHTML`, `innerHTML`, `eval`, `new Function`, `document.write`, `window.open`. All user text is rendered by React as text.                                                                                   | `grep` review; e2e `security › markup in user content...` renders `<img onerror>`, `<script>` and `<svg onload>` in ideas, descriptions, notes, tags, list view and search and asserts nothing executes |
| Content-Security-Policy    | `script-src 'self'` (no inline scripts, no `eval`), `object-src 'none'`, `base-uri 'self'`, `frame-ancestors 'none'` (header only). `style-src` needs `'unsafe-inline'` because React Flow positions nodes with style attributes. | e2e `security › ...Content-Security-Policy without violations` runs the production build through create, edit, PNG export, theme and language switching                                                 |
| Imported backup files      | Validated with Zod: field types, max lengths, id format, palette range, coordinate range, array caps; 10 MB file limit; unknown and prototype-polluting keys are stripped; an invalid file writes nothing.                        | Jest `security.test.ts` (13 cases) and e2e `a malicious backup file is rejected`                                                                                                                        |
| Input size                 | `maxLength` on every text control (500 chars idea text, 20,000 description/note, 48 tag).                                                                                                                                         | code review                                                                                                                                                                                             |
| Stored preferences         | `localStorage` values for theme and language are whitelisted before use (also in `public/theme-init.js`).                                                                                                                         | code review                                                                                                                                                                                             |
| Search                     | Plain `includes` matching, no regular expressions built from user input (no ReDoS).                                                                                                                                               | code review                                                                                                                                                                                             |
| Service worker             | Same-origin GET only, only caches `response.ok`, no third-party origins.                                                                                                                                                          | `public/sw.js`                                                                                                                                                                                          |
| Third-party requests       | None at runtime: fonts are self-hosted (`@fontsource`), no analytics, no CDN.                                                                                                                                                     | CSP `connect-src 'self'` would block them anyway                                                                                                                                                        |

## Server hardening

The app runs as a container: `dist` served by an unprivileged Nginx (`Dockerfile`, uid 101,
read-only filesystem, 64 MB). `nginx/` holds its config and a shared security-headers snippet:
HSTS, CSP, `nosniff`, `X-Frame-Options`, `Referrer-Policy: no-referrer`, `Permissions-Policy`,
COOP/CORP, GET/HEAD only, no dotfiles or source maps, no version banner, immutable caching for
hashed assets and `no-cache` for `index.html`, `sw.js`, `manifest`. The host Nginx in front
(`deploy/nginx.conf`) terminates HTTPS, compresses and also allows only GET/HEAD.

Remember (project rules): `nginx -t` before every reload, certbot for the certificate, ufw only
22/9011, 80 and 443, deploy only through deploy-kit's forced `deploy-app` command, secrets only in GitHub secrets.

## Known limits

- Data is not encrypted at rest: anyone with access to the browser profile can read it. Use JSON
  backups for safekeeping and do not store secrets in notes.
- A browser extension or another script on the same origin could read IndexedDB. Do not host other
  apps on this exact origin (that is why it gets its own subdomain).
- Clearing site data deletes everything; export a backup first.

## Reporting

Open a private issue or email the repository owner.
