# QA report

Date: 13 October 2026. Scope: local MVP at http://127.0.0.1:4173. Independent QA agent; automated installed Google Chrome via Playwright. Cloud approval and production checks pending.

## Results

Critical browser automation: **11 check groups passed after the UAT changes**, including slider, role-specific result ordering, English/Urdu and input-security checks. Total repayment is also checked against the independent formula. No critical or high defect found in these exercised flows.

| Story | Evidence |
|---|---|
| US1 | Inclusive flat 1,500 sq ft, plot 10 marla and PKR 1m–10m principal in PKR 100k steps accepted; oversized/missing/nonpositive inputs rejected; property changes clear size and update units. |
| US2 | 10% default; all 11 tenure choices; 20% equity produces PKR 1.25m equity and PKR 6.25m implied cost for PKR 5m principal; payment unchanged; invalid equity rejected; slider min/max/step and ArrowRight increment verified. |
| US3 | 10-, 15- and 20-year monthly phases and every yearly row match independent closed-form amortization; 10-year later phase hidden; KIBOR changes later payment; final principal rounds to zero. |
| US4 | Correct row counts, yearly payments/balances and result replacement; changed/invalid inputs hide stale results. |
| US5 | Local KnowledgeCity logo loaded; official programme link correct; income qualification, independent-app identification and owned-land limitation present. |
| US6 | 320px and 390px page widths have no page-wide overflow; keyboard tab navigation and invalid-field focus work; labels/error associations and polite result status present. Urdu lang/dir, translated labels/results/errors and RTL320/390 layouts passed. Role changes preserve values/results and reorder their actual DOM sections; eligibility follows the calculator. |
| US7 | Calculation generates zero network requests and leaves local/session storage empty. Focused SEC01 injection test (numeric control tampered to text) rejected HTML payload without a dialog or result; excessive 66-character numeric input rejected. Independent code/security review is recorded in security-review.md. Production checks remain pending. |

Reference example: PKR 5m, 20 years, assumed KIBOR 12%: initial payment PKR 32,997.7869608; later payment PKR 50,192.5298800. Fixture uses closed-form balance and payment equations rather than importing application logic. Display rounding is checked separately from unrounded totals.

## Automation and limitations

Suite: `tests/browser-smoke.mjs`. Verified with Playwright 1.62.1 and installed Google Chrome. Optional reproducible setup:

```sh
npm install --no-save --package-lock=false playwright@1.62.1
npx playwright install chromium
node tests/browser-smoke.mjs
```

 Run with an installed Playwright module and Chrome, supplying `PLAYWRIGHT_MODULE`, `CHROME_PATH` and optional `APP_URL`; default import is `playwright`, default URL is local port 4173. Optional `QA_SCREENSHOT_DIR` writes desktop/mobile screenshots.

The review exercised one Chromium browser, not a cross-browser/device matrix. Accessibility checks are targeted DOM/keyboard checks, not a full screen-reader audit. Infrastructure HTTPS/headers cannot be verified until cloud hosting after user sign-off. No claim of complete eligibility assessment or guaranteed financial/security accuracy is made.

## Performance and affected checks

Parent dev-lead measurements: 26,833 bytes application assets; 1,000 calculation runs under Node 24.19.0 gave p99 0.045 ms and maximum 0.908 ms. These are local CPU timings, not browser/network load capacity measurements. Targets passed.

Focused follow-up confirmed one actual DOM header; viewport-only captures avoid full-page screenshot stitching duplication. Input-length and injection checks passed after the final security changes. The reusable suite includes both cases.

## Release status

Local critical browser flows pass. Independent code/security review and local performance checks completed; see security-review.md. User local sign-off, release packaging and production verification remain pending. Story status must retain those distinctions.

## UAT regression evidence

After the approved slider, role and Urdu changes: all eight unit tests and all eleven browser groups passed. Source re-review found no unsafe rendering in static i18n; local `/i18n.js` has the existing restrictive security headers and documentation paths remain 404. Viewport screenshots captured in English/Urdu at desktop/mobile sizes. The capture surface can repeat header pixels despite one verified DOM header; avoid treating capture stitching artifacts as app defects.

Updated UAT performance measurement: 40,365 bytes across all six application assets, including the translation module and logo. After 100 warm-up runs, 1,000 calculations on local Node 24.19.0 gave p99 0.048 ms and maximum 0.340 ms. This verifies local calculation/asset targets, not national traffic capacity.
