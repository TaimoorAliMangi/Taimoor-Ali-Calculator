# Security review — design checklist

**Status:** Local source and basic local infrastructure review performed 13 October 2026. Production checks and final package review remain pending. No critical/high finding was identified in the reviewed local scope; this is not an assurance of complete security.

**Scope:** A static, browser-based mortgage estimator with no accounts, database, payment handling, personal-data collection or runtime AI. Inputs remain in the browser. Review will cover application code, dependencies, the local server, deployment configuration and the public deliverable package.

## Controls required for implementation

| Area | Requirement | Verification evidence to capture |
|---|---|---|
| Browser rendering | Render input-derived content as text using safe DOM APIs. Do not interpolate user values into HTML, URLs, styles or executable attributes. Prohibit `eval`, `new Function` and dynamic code execution. | Source review and injection tests. |
| Numeric inputs | Require finite numbers and validate permitted property sizes, principal, 10–20 whole-year tenure, down payment and KIBOR. Reject malformed or excessive-length values. Verify all intermediate and final calculations remain finite. Bound repayment loops to at most 240 months. | Boundary, malformed-input and non-finite calculation tests. |
| Privacy | Perform calculations locally. No analytics, third-party tracking or outbound transmission of entered values. Avoid external fonts, scripts and runtime dependencies. | Source inspection and browser network inspection during calculation. |
| Dependencies | Keep production dependency count minimal, preferably zero. Development/test dependencies must not be delivered to the browser. Pin dependencies through the lockfile and check relevant published advisories before release. | Dependency inventory, advisory-check date/results and deployment asset list. |
| Local server | Bind to loopback, not all network interfaces. Serve only intended application files from `src/`. Disable directory listing. Reject traversal, encoded traversal and resolved paths outside the application root, including symlink escapes. | Server source review and HTTP tests. |
| Hosting | Require HTTPS. Use a restrictive Content Security Policy with same-origin scripts/styles, no inline execution, no objects and no outbound connections. Configure supported framing, MIME sniffing and referrer protections. Record platform limitations. | Production response headers and browser console/network results. |
| Public assets | Deploy only application assets. Do not deploy `docs/`, `transcripts/`, test files, development configuration, dotfiles or the ZIP. Keep public repository documentation separate from the hosted application artifact. | Deployment manifest and negative URL checks. |
| Secrets and public repository | Scan source, Git history being published, ZIP, documents and transcript for credentials and unintended private content. Redact credentials before publication. Record that the approved public repository includes product documents and the user-visible transcript; these are public by design. | Scan results and manual package inspection. |

Use a same-origin policy suitable for a static app, such as `default-src 'none'; script-src 'self'; style-src 'self'; img-src 'self'; font-src 'self'; connect-src 'none'; object-src 'none'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'`. Deliver `frame-ancestors` as an HTTP header, not a meta tag. Verify what the chosen host actually supports before declaring infrastructure controls complete.

## Critical security QA scenarios

Scenario definitions below are retained for traceability. Actual local evidence and remaining checks follow the table.

| ID | Given / When / Then acceptance criteria |
|---|---|
| SEC-01 | Given input fields and result rendering, when HTML or script-like text is entered, then validation rejects it or it is rendered as inert text, and no script executes. |
| SEC-02 | Given numeric fields, when non-finite, out-of-range, fractional tenure or excessive-length values are supplied, then calculation is rejected with an understandable message and no invalid result is displayed. |
| SEC-03 | Given extreme but accepted values, when the calculator runs, then every output is finite, execution remains bounded and the page remains responsive. |
| SEC-04 | Given valid loan inputs, when a calculation runs, then entered values cause no outbound network request and are not persisted in browser storage. |
| SEC-05 | Given the local server, when a client requests traversal variants, dotfiles or paths outside `src/`, then no private or unintended file is returned. |
| SEC-06 | Given the local server configuration, when its listening address is inspected, then it accepts connections only on loopback. |
| SEC-07 | Given the deployed app, when response headers and browser behavior are inspected, then HTTPS and supported security headers are effective, and unexpected script execution or outbound connections are blocked. |
| SEC-08 | Given the published site, when documentation, transcript, test and development paths are requested, then those package files are not served. |
| SEC-09 | Given the proposed public repository and ZIP, when secret scans and manual inspection run, then no credentials or unintended private material are found. |
| SEC-10 | Given the dependency inventory, when advisory checks and browser asset inspection run, then no unresolved critical/high applicable advisory remains and test dependencies are absent from deployed assets. |

## Review evidence and release gate

### Local evidence — 13 October 2026

- Reviewed all current `src/` files, `server.mjs`, manifest and unit tests. Input values are rendered with `textContent`; no `eval`, dynamic execution, unsafe HTML rendering, storage or browser network APIs were found. Eight calculation unit tests passed independently.
- SEC-02/03: malformed/nonfinite/out-of-range validation and bounded-output cases passed unit tests; schedule is limited to 240 months. **CR-01, Low, resolved:** numeric values above 64 raw characters are now rejected before conversion; source inspection and focused conversion/validation check passed. Independent browser QA confirmed a 66-character numeric input is rejected. No critical/high vulnerability identified.
- SEC-05/08 (local): `/docs/security-review.md`, `/transcripts/session-01.md`, `/package.json`, `/.git/config`, `/%2e%2e/README.md`, `/..%2fREADME.md` and `/assets/../../README.md` returned 404. `/app.js` returned 200; POST `/` returned 405. Server uses an allowlist plus canonical-path checks.
- SEC-06: listening socket was verified as `127.0.0.1:4173`, not an external interface.
- SEC-07 (local header portion): verified restrictive CSP, `nosniff`, `no-referrer`, `DENY` framing and restricted Permissions-Policy on HTTP responses. Local loopback HTTP is for development; production HTTPS/header behavior is pending.
- SEC-10 (current runtime portion): manifest has no dependencies. No third-party runtime asset is requested by source. Independent browser QA verified zero requests during calculation and no local/session storage. Final test-dependency and deployed asset checks remain pending.
- SEC-01/04 passed independent browser QA: an injected HTML payload produced neither execution nor a result; calculations generated no requests and no browser storage. SEC-07/08 production checks and SEC-09 final package/Git-history review remain pending. Initial source credential-pattern inspection found no credentials; this does not replace the final artifact scan.

After mock approval and implementation, perform independent code review plus the basic infrastructure review. Record each finding with an ID, severity, affected component, reproducible evidence, remediation and retest outcome. Severity reflects practical impact and exploitability, not merely scanner labels.

Release requires **zero known unresolved critical or high-severity findings**, passing critical security scenarios and evidence of deployed controls. Record lower-severity findings, unsupported controls and limitations explicitly. Do not silently mark unavailable checks as passed. Security review reduces known risk; it cannot establish that an application has no possible vulnerabilities.

Cloud publication remains pending explicit user sign-off on the tested local application. Production-only security verification takes place after deployment and before the hosted result is declared ready.

UAT branch package scan: all 23 intended files, including the three product PDFs, were checked for common GitHub/OpenAI token and private-key patterns; none found. Existing repository history contains only the inspected Git attributes initial commit. Future transcript/ZIP and production checks remain pending.
