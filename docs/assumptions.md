# Assumptions and scheme evidence

Status: Revised UAT verified locally 13 October 2026; production and final packaging checks pending. Evidence checked 13 October 2026.

## Verified scheme facts

The [March 2026 SBP amendment](https://www.sbp.org.pk/circulars/shsfd-circular-letter-no-01-of-2026) expands house size to 10 marla / 2,720 sq ft, flats to 1,500 sq ft and loans to PKR 10 million; customer fixed pricing becomes 5%. It retains other original features.

The [September 2025 SBP circular](https://www.sbp.org.pk/circulars/shsfd-circular-no-03-of-2025) provides a maximum 20-year term, 10-year subsidy, one-year KIBOR + 3% bank pricing and 90:10 financing/equity. It includes first-time homeowners, construction on an owned plot and plot purchase plus construction. Its original smaller size/loan tiers are superseded by the cited amendment.

## Agreed discussion assumptions

- English and Urdu MVP following approved UAT feedback; government-inspired green and white visual theme without government endorsement or official crest.
- Inclusive maximum sizes: flat 1,500 sq ft; plot/construction 10 marla. Marla definitions vary locally: accept marla as entered and do not introduce a general conversion.
- Whole-year tenure dropdown 10–20. The 10-year minimum is a user requirement, not established by the cited maximum-tenor rule.
- Amount means principal, not property cost; cap PKR 10,000,000. Default equity/down payment 10%; allow 10% to below 100%.
- Project cost = principal / (1 − equity fraction). Equity = project cost − principal. Equity changes do not change instalments while principal stays fixed.
- For owned land, equity is an illustrative contribution; the app does not value existing land or determine whether it satisfies bank equity requirements.
- Monthly reducing-balance amortization; 5% annual nominal rate for payments 1–120. Initial payment uses the full chosen term. Re-amortize remaining principal at payment 121 over remaining months using assumed one-year KIBOR + 3 percentage points.
- KIBOR is editable and held constant after year 10 for the estimate. Use a dated official source at implementation; confirm quote convention with source and label it. This is not a future-rate prediction.
- Full initial disbursement, no grace period; exclude taxes, insurance, fees, staged construction and prepayments. Excluding fees does not imply the scheme charges processing fees.
- Maintain full precision internally; display rounded PKR; cap final repayment to clear balance. Yearly table distinguishes monthly instalment from annual total and year-end principal.
- Browser-only calculations, no accounts/database/personal-data collection/runtime AI/tracking. Inputs remain in memory; reload resets them.
- Public personal-account GitHub repository `Taimoor-Ali-Calculator`; account identity is to be verified, not guessed. Full accessible user-visible transcript may be public, with credentials redacted.
- Independent dev-lead/code, QA and basic security reviews; no known critical/high findings at release. Security review cannot guarantee immunity from hacking.
- Approve desktop/mobile mocks before app implementation. Approve local app before cloud hosting. Sites static hosting intended; domain optional and no purchase authorized.
- Source ZIP, Markdown/PDF product documents, README and transcript are required. README records exact prerequisites/commands, AI tool and verified model, human edits and assumptions.
- Estimate national reach using official data and explicit low/base/high adoption scenarios. Potential users are not measured concurrent traffic; CDN/local calculations reduce server computation, while provider limits require separate verification.
- Efficiency: bounded agent tasks, targeted tests, consolidated feedback. Available usage percentage is a constraint to monitor, not a guaranteed resource budget.

## Outstanding facts before release

Implementation safety defaults: principal range PKR 1,000,000–10,000,000 in PKR 100,000 steps; assumed KIBOR modeling range 0–100%. The KIBOR ceiling is a calculator guardrail, not a scheme rate limit or prediction.

Contractual KIBOR reset/quote convention; connected GitHub account and repository availability; hosting security-header support and limits; national reach source data; measured performance; complete transcript availability; confirmed AI model identity. These do not block visual mock approval.

## Approved additions and current evidence

- Add a compact eligibility section and direct [official programme homepage](https://apnaghar.gov.pk/) link. Use current name: Wazir-e-Azam Apna Ghar Program – Ghar Ho Tu Apna. Do not confuse it with Punjab's Apni Chhat Apna Ghar or older Mera Pakistan Mera Ghar terms.
- First-time Pakistani homebuyers with valid CNIC and no housing unit are the official core audience. Age, income, credit history, repayment capacity and maximum age at maturity remain subject to bank assessment. The calculator does not collect or validate these personal details.
- User requested age 18+ and income PKR 50,000 context. Present adulthood/age 18+ as a basic planning note with bank confirmation, not a complete universal age criterion. Do not label PKR 50,000 as a national minimum: the [official portal calculator](https://apnaghar.gov.pk/loan-details) uses it as a sample income and states PKR 25,000 for its own input minimum. [Meezan's scheme page](https://www.meezanbank.com/apna-ghar-program/) states PKR 40,000 gross and minimum age 18, with maturity-age/employment conditions. Minimum income requirements vary by bank.
- [SBP 28 April 2026 facilitation](https://www.sbp.org.pk/circulars/shsfd-circular-no-02-of-2026) allows total monthly amortization obligations up to 65% of net disposable income. This is contextual information, not an affordability approval calculation in this MVP.
- Add the requested KnowledgeCity credit; identify the tool as independently developed and avoid implying endorsement by the government or a bank. No remote brand assets are needed.
- Default assumed one-year KIBOR: **12.75% offer**, dated **12 October 2026**, as displayed on the [SBP homepage](https://www.sbp.org.pk/) when checked 13 October 2026. The same table shows 12-month bid 12.25%. Use offer as an explicit estimator convention; bank-contract quote/reset conventions must be confirmed with the lender. Assumed later annual rate is therefore 15.75%. Do not label this quote as today's rate or a live feed.
- The calculator does not retrieve rates during use. Changing KIBOR changes the illustrative later phase; future quotes may differ.

- Numeric input text longer than 64 characters is rejected before conversion as a bounded-input security convention; the documented amount, tenure, size and rate limits still apply.

## Approved UAT changes on 13 October 2026

Role selector offers borrower monthly-first, family adviser equity/annual-first and housing-finance adviser rates/schedule-first presentations, reordering actual result blocks with shared calculator behavior. Roles are public views, not security permissions. Principal slider: PKR 1,000,000–10,000,000, step PKR 100,000; no separate exact principal input. English/Urdu toggle translates all visible functional text, validation, guidance and results; switching preserves scenario and selected role and applies RTL to Urdu. Numeric PKR figures may use Latin digits consistently. Eligibility section moves below inputs/results. No income, identity or age fields are added.
