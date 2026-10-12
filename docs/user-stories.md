# Epic, features and user stories

Mocks approved 13 October 2026 with eligibility text and KnowledgeCity credit additions. UAT feedback approved for implementation 13 October 2026. US1–US6 verified locally against the revised app with 8 unit tests and 11 browser check groups. US7 locally verified; production checks remain pending. Cloud publication awaits user sign-off.

## E1 — Understand a subsidised housing-finance commitment

Enable prospective borrowers and their advisers to estimate permitted housing scenarios, upfront equity and repayments across subsidised and assumed market-rate periods.

Epic acceptance: valid scenarios produce consistent estimates and yearly balances; invalid inputs cannot produce a current plan; assumptions remain visible; critical tests pass and critical/high review findings are resolved before release.

| Feature | Description | Feature acceptance |
|---|---|---|
| F1 — Scenario inputs | Enter property, principal, term, equity and assumed KIBOR. | Valid boundaries accepted; invalid/missing values explained beside fields; no stale result presented as current. |
| F2 — Repayment estimate | Compute two-phase amortization and equity. | Independently verified reference cases pass; 10-year plans have no later phase; final principal is zero within numerical tolerance. |
| F3 — Understand results | Present monthly commitments and yearly schedule. | PKR units, periods and assumptions explicit; accessible on mobile and keyboard. |
| F4 — Safe delivery | Review, test and publish the approved app. | Critical automation passes; release has no known unresolved critical/high findings; approval gates respected. |

## US1 — Enter a permitted scenario

**Feature:** F1. **Jobs:** J1, J10. **Status:** Verified locally — revised UAT critical QA passed 13 October 2026.

As a prospective borrower, I want to select my property type and enter its size and loan principal, so that I can model a scenario within the calculator's limits.

- Given a flat of 1,500 sq ft or plot of 10 marla and principal PKR 10,000,000, when I submit otherwise valid inputs, then these inclusive maxima are accepted.
- Given any property type, when size is blank, nonfinite, zero, negative or above its limit, or principal is outside PKR 1m–10m or not a PKR 100,000 increment, then a field-specific error appears and no current repayment result is shown.
- Given the principal slider, when I adjust it, then it covers PKR 1m–10m in PKR 100,000 steps and updates the displayed loan amount; keyboard adjustments use the same step.
- Given I switch property type, when its size unit changes, then the label and maximum update and the old size is cleared to prevent unit confusion.

## US2 — Choose tenure and equity

**Feature:** F1. **Jobs:** J2, J3. **Status:** Verified locally — revised UAT critical QA passed 13 October 2026.

As a prospective borrower, I want to choose my term and equity percentage, so that I can compare commitments and upfront funding.

- Given first load, when I inspect equity, then it defaults to 10% and every whole-year term from 10–20 is selectable.
- Given a valid principal, when I calculate with equity from 10% to below 100%, then project cost and equity follow the documented formula.
- Given fixed principal, term and KIBOR, when I change equity, then project cost/equity change but monthly repayment does not.
- Given equity below 10%, 100% or more, or a tampered invalid term, when I calculate, then validation prevents a result.

## US3 — Calculate rate phases

**Feature:** F2. **Jobs:** J2. **Status:** Verified locally — revised UAT critical QA passed 13 October 2026.

As a prospective borrower, I want to see subsidised and later estimated monthly payments, so that I can judge the change after year 10.

- Given valid inputs, when I calculate, then payments 1–120 use 5% annually and initial amortization uses the selected full term.
- Given a term above 10 years, when payment 120 completes, then the remaining principal is re-amortized for remaining months at assumed one-year KIBOR plus 3 percentage points.
- Given a 10-year term, when I calculate, then there is no year-11 payment phase and principal is fully repaid.
- Given editable KIBOR, when I enter a finite nonnegative value, then the later-rate assumption and dated source are explicit; invalid values prevent calculation.
- Given any valid term, when the schedule ends, then final principal is zero within calculation tolerance and no extra instalment is added.

## US4 — Inspect yearly results and recalculate

**Feature:** F3. **Jobs:** J4. **Status:** Verified locally — revised UAT critical QA passed 13 October 2026.

As a family adviser, I want a readable yearly repayment table, so that I can explain payments and outstanding debt.

- Given a valid plan, when results appear, then prominent initial/later monthly payments, equity, project cost and total repayment are shown in PKR.
- Given the schedule, when I inspect each year, then its monthly instalment, summed annual payments and year-end outstanding principal are shown; row count equals term.
- Given inputs change after calculation, when I inspect old results, then they are hidden or clearly marked as needing recalculation; submitting valid inputs replaces them.
- Given invalid submission after a valid plan, when validation fails, then previous results are not presented as current.

## US5 — Understand limitations

**Feature:** F3. **Jobs:** J5. **Status:** Verified locally — revised UAT critical QA passed 13 October 2026.

As a housing-finance adviser, I want visible assumptions and source links, so that I can explain why a calculator estimate may differ from a bank offer.

- Given the page or results, when I read the supporting text, then independent-app identification, illustrative future KIBOR, excluded costs and bank confirmation are clear.
- Given an owned-plot scenario, when equity is displayed, then it is described as an estimate rather than a land valuation or bank eligibility decision.
- Given scheme context, when I inspect eligibility information, then first-time homeowner/CNIC criteria, adulthood and bank-dependent income/age requirements are explained without collecting identity information or claiming complete eligibility assessment. PKR 50,000 is never represented as a universal scheme minimum.
- Given programme and branding context, when I inspect the page, then a direct official programme homepage link and KnowledgeCity credit are visible without suggesting official endorsement.

## US6 — Use mobile and keyboard

**Feature:** F3. **Jobs:** J6, J8, J9. **Status:** Verified locally — revised UAT critical QA passed 13 October 2026.

As a prospective borrower, I want accessible mobile controls, so that I can calculate without assistance.

- Given any role, when I select borrower, family adviser or housing-finance adviser, then actual result blocks reorder: borrower monthly-first, family equity/annual-first, adviser rates/schedule-first; calculation behavior remains identical; no login or permissions are introduced.
- Given a scenario with valid results, when I switch English/Urdu, then role, input values and results are preserved; all functional labels, guidance, validation and results translate, and Urdu uses RTL.
- Given the revised layout, when I inspect the page, then eligibility appears below calculator/results.
- Given a narrow phone viewport, when I use inputs and results, then content remains readable without page-wide horizontal scrolling; the table may scroll in a labelled region.
- Given keyboard-only use, when I navigate, then all controls and Calculate are reachable with visible focus, meaningful labels and understandable errors.
- Given calculation success or failure, when displayed, then assistive technology can identify updated results or error messages.

## US7 — Safe and efficient calculations

**Feature:** F4. **Jobs:** J7. **Status:** Verified locally — privacy/security review passed; production and final packaging checks pending.

As a prospective borrower, I want my scenario calculated safely in my browser, so that I can estimate without transmitting personal financial records.

- Given normal use, when I calculate, then no scenario data is sent to an application API, saved in browser storage or submitted to third-party tracking.
- Given injection strings, excessive inputs or malformed values, when submitted, then they cannot execute code or trigger unbounded calculation loops.
- Given release review, when findings are assessed, then dependency/secret/code/infrastructure checks are documented and all critical/high findings are fixed and retested.
- Given production deployment, when anonymously accessed, then HTTPS and supported security controls are verified and only intended app assets are served.
- Given measured reference environments, when performance is recorded, then calculation targets under 100 ms and initial uncompressed app assets under 100 KB exclude documents; deviations are documented and addressed before sign-off.

## Delivery acceptance gates

Status: Local verification complete; production and final packaging checks pending. These are project release conditions, not additional app features.

- Given mocks approved 13 October 2026, when implementation proceeds, then it follows the approved layout and eligibility/credit additions.
- Given completed local review/QA/security, when I inspect the app, then story status and known findings are available and cloud publishing remains pending my explicit sign-off.
- Given final packaging, when I inspect it, then README, source, tests, Markdown/PDF product documents, review reports and accessible redacted transcript are included in a ZIP and synchronized public repository.
- Given my local sign-off, when hosting completes, then the live URL and anonymous-access/security checks are reported.
