# Pakistan Housing Loan Calculator

[Open the public calculator](https://pakistan-housing-calculator-taimoor.snug-rhino-1056.chatgpt.site)

An English and Urdu, browser-based planning calculator for prospective subsidised housing borrowers, family advisers and housing-finance advisers. Developer credit: KnowledgeCity, as requested by the project owner. This is an independent estimator, not a government service or a bank offer.

## Run locally

Prerequisite: Node.js 20 or newer with npm. The application has no production dependencies and needs no API keys.

From this folder:

```sh
npm install
npm start
```

Open http://127.0.0.1:4173/. The development server listens only on your computer and serves application assets, not documentation or transcripts.

```sh
npm test
```

Optional critical browser tests (with the local server running):

```sh
npm install --no-save --package-lock=false playwright@1.62.1
npx playwright install chromium
node tests/browser-smoke.mjs
```

Eight unit tests and eleven critical browser scenario groups pass for this UAT version. See docs/qa-report.md for evidence. Local UAT was signed off on 13 October 2026; the project owner authorized merging into main. Public hosting is verified at https://pakistan-housing-calculator-taimoor.snug-rhino-1056.chatgpt.site; security limitations are documented in docs/security-review.md.

## Calculation assumptions

- Choose loan principal with the slider, from PKR 1,000,000 (10 lakh) to PKR 10,000,000 (100 lakh), in PKR 100,000 steps; default PKR 5,000,000. Choose a whole-year term from 10 to 20.
- Flats may be up to 1,500 sq ft; plot scenarios up to 10 marla. Do not convert local marla definitions automatically.
- Down payment defaults to 10%. Project cost is principal divided by one minus the equity fraction. Equity changes do not change repayment when principal remains fixed.
- Initial monthly reducing-balance repayments amortize the whole selected term at 5% annually. After 120 payments, re-amortize the remaining balance over the remaining term at assumed one-year KIBOR plus three percentage points.
- KIBOR defaults to the SBP one-year offer quote of 12.75%, dated 12 October 2026. Selecting the offer quote is an estimator convention. It is editable and held constant after year 10; it is not a prediction or live data feed.
- Full initial disbursement; no grace period, staged construction disbursements, prepayments, taxes, insurance or fees. Owned-plot equity is indicative and requires bank confirmation.
- Internal calculations retain precision; displayed PKR values are rounded.
- Eligibility information is guidance. Income and age requirements depend on the bank; PKR 50,000 is not a universal verified minimum.

See [all agreed assumptions](docs/assumptions.md) and [user stories](docs/user-stories.md).

## Sources and branding

- [Official Prime Minister housing programme](https://apnaghar.gov.pk/)
- [SBP revised scheme limits](https://www.sbp.org.pk/circulars/shsfd-circular-letter-no-01-of-2026)
- [SBP KIBOR source](https://www.sbp.org.pk/)
- [Meezan eligibility example](https://www.meezanbank.com/apna-ghar-program/)
- KnowledgeCity logo is the official [website asset](https://www.knowledgecity.com/logos/kc-logo-full.svg), stored locally to avoid external runtime requests. Branding was requested by the project owner; government endorsement is not claimed.

## AI and human edits

Developed with OpenAI Codex desktop and collaborating agents. The system identifies the agent as GPT-6 based; the exact deployed model identifier is not exposed in this session and is not guessed. No human code edits have been reported as of this version. Project-owner feedback approved the UI and requested eligibility text and KnowledgeCity branding.

## Delivery status

Local implementation is complete. Independent code/security review and critical QA passed; no unresolved critical/high code finding was identified. Production critical checks passed; hosting-specific defense-in-depth limitations are documented in docs/security-review.md. The reviewed UAT source and three product PDFs are delivered through the uat-feedback branch. The full available user-visible text transcript is saved in transcripts/session-01.md with a matching PDF. A ZIP of this package is delivered alongside the source folder. Never publish credentials, installed dependencies or temporary review files. The hosted application must contain only application assets; public GitHub documentation and transcript are separate deliverables.

GitHub repository name: **Taimoor-Ali-Calculator** (exact capitalization requested by the project owner).

## UAT interface

Select Prospective borrower, Family adviser or Housing-finance adviser to prioritize monthly repayments, equity/annual commitments or rate/schedule detail. This changes presentation, not permissions or financial formulas. Role and English/Urdu switches preserve entered values and calculated results. Urdu uses right-to-left layout; PKR values retain readable Latin digits. Eligibility guidance appears below the calculator. Language selection stays in page memory.

GitHub review branch: [uat-feedback](https://github.com/TaimoorAliMangi/Taimoor-Ali-Calculator/tree/uat-feedback). The project owner signed off on local UAT on 13 October 2026 and authorized the merge into main. Public hosting follows the original delivery request.

## AI chat transcript

[Markdown transcript](transcripts/session-01.md) and [PDF transcript](transcripts/session-01.pdf) preserve the available user-visible session, including plans, progress, questions and selected responses. Internal reasoning, system context and raw tool logs are excluded. The export records its cutoff; later messages require a new export.

## Public hosting

[Live calculator](https://pakistan-housing-calculator-taimoor.snug-rhino-1056.chatgpt.site). The supplied Site identity is in .openai/hosting.json; it is not a credential. Run npm run build to create dist/ from only the six allowlisted app assets. Documents, transcript, tests and Git files are not deployed. The hosting workflow requires separately authenticated Sites access; no token is stored in this package.

The app does not transmit or persist entered financial scenarios. Hosting infrastructure processes normal request/security metadata and may set Cloudflare security cookies. Browser meta policies restrict executable resources and referrers. Sites currently ignores _headers, so server-only framing and MIME-sniffing header controls are not claimed. See the security review for evidence and limits.

A custom domain is optional. Compare registration and renewal prices at Cloudflare Registrar (https://domains.cloudflare.com/) and Porkbun (https://porkbun.com/products/domains). No domain purchase is necessary for the supplied public URL.
