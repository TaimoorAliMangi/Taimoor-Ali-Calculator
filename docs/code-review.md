# Independent dev-lead code review

Date: 13 October 2026. Scope: all current browser assets, calculation module, local server, package manifest and unit tests. This review precedes local user sign-off and cloud publication.

## Outcome

No critical or high-severity code/security finding identified within this scope. The implementation is small, dependency-free at runtime, and calculations are isolated from DOM rendering. Eight unit tests passed independently. Browser acceptance and production hosting checks are tracked separately; this report does not declare those complete.

## Financial correctness

Independently calculated a PKR 5,000,000, 20-year scenario at 5% initially and 12% assumed KIBOR plus 3% later, using the closed-form amortization equations in a separate Python calculation:

| Quantity | Independent result (PKR) |
|---|---:|
| Initial monthly instalment | 32,997.786960833 |
| Principal after payment 120 | 3,111,075.912510746 |
| Later monthly instalment | 50,192.529879986 |
| Total repayment | 9,982,838.020898260 |

These match implementation reference cases. The initial payment amortizes the full selected term; payment 121 correctly re-amortizes remaining principal over remaining months. Final repayment clears the balance. Annual totals sum actual unrounded payments. Equity correctly changes implied project cost without changing repayment for fixed principal.

## Code and infrastructure observations

- All input-derived output uses `textContent` and created DOM nodes; no unsafe HTML insertion or dynamic execution found.
- Validation checks finite numeric values, property/tenure enums and ranges. Repayment loops are bounded to 240 months. PKR 1,000,000 principal minimum, PKR 100,000 slider step and 100% KIBOR modeling ceiling are explicit implementation defaults.
- Input changes hide old results; property changes clear size and update units. Errors are associated with fields, first invalid input receives focus and status changes have a live region.
- Local server is restricted to named application assets and loopback. HTTP tests returned 404 for documents, transcript, manifest, Git configuration and traversal attempts; POST returned 405. Security headers were verified locally.
- Manifest contains no dependency declarations. No runtime storage, analytics, network API or credential pattern found in inspected application files. Public package and Git-history scans must be repeated against final artifacts.

## Remaining findings

**CR-01 — Low, resolved: numeric text length initially had no explicit application cap.** Implementation now rejects raw numeric strings above 64 characters before conversion. Source fix was re-inspected and a focused numeric conversion/validation check confirmed a 65-character principal is rejected. Browser integration regression remains part of QA. No unresolved code finding remains in this review.

Cloud HTTPS/header behavior, deployed file exposure, final ZIP/transcript confidentiality and browser network checks are not inferred from local source review. Record their actual evidence when performed.

## Approved UAT changes — review update

Re-reviewed static Urdu dictionary, language switching, result role ordering and slider validation. Translations use text-node/textContent assignment without runtime HTML injection. All eight unit tests and eleven browser groups passed. Role/language changes preserve financial state; slider bounds and keyboard increments, translated errors and RTL narrow layouts passed. Local i18n response security headers verified. No new unresolved code finding identified.
