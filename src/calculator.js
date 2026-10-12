export const MAX_LOAN = 10_000_000;
export function validate(input) {
  const errors = {};
  if (!['flat','plot','owned'].includes(input.property)) errors.property = 'Select a property type.';
  const limit = input.property === 'flat' ? 1500 : 10;
  if (!Number.isFinite(input.size) || input.size <= 0 || input.size > limit) errors.size = `Enter a size above zero and up to ${limit} ${input.property === 'flat' ? 'sq ft' : 'marla'}.`;
  if (!Number.isFinite(input.principal) || input.principal < 1_000_000 || input.principal > MAX_LOAN || input.principal % 100_000 !== 0) errors.principal = 'Choose PKR 1,000,000–10,000,000 in PKR 100,000 steps.';
  if (!Number.isInteger(input.tenure) || input.tenure < 10 || input.tenure > 20) errors.tenure = 'Choose a whole-year tenure from 10 to 20 years.';
  if (!Number.isFinite(input.downPayment) || input.downPayment < 10 || input.downPayment >= 100) errors.downPayment = 'Enter a down payment from 10% to below 100%.';
  if (!Number.isFinite(input.kibor) || input.kibor < 0 || input.kibor > 100) errors.kibor = 'Enter assumed KIBOR from 0% to 100% (modelling limit).';
  return errors;
}
export function payment(balance, annualRate, months) {
  const r = annualRate / 12;
  return r === 0 ? balance / months : balance * r / (-Math.expm1(-months * Math.log1p(r)));
}
export function calculate(input) {
  const errors = validate(input);
  if (Object.keys(errors).length) throw new RangeError(Object.values(errors).join(' '));
  const months = input.tenure * 12;
  const firstPayment = payment(input.principal, .05, months);
  let instalment = firstPayment, balance = input.principal, totalRepayment = 0, laterPayment = null;
  const yearly = [], schedule = [];
  for (let month = 1; month <= months; month++) {
    if (month === 121) laterPayment = instalment = payment(balance, (input.kibor + 3) / 100, months - 120);
    const annualRate = month <= 120 ? .05 : (input.kibor + 3) / 100;
    const interest = balance * annualRate / 12;
    const paid = month === months ? balance + interest : instalment;
    balance = month === months ? 0 : Math.max(0, balance + interest - paid);
    totalRepayment += paid;
    schedule.push({month, payment: paid, interest, principal: paid - interest, balance});
    const year = Math.ceil(month / 12);
    if (month % 12 === 1) yearly.push({year, monthlyPayment: instalment, annualPayments: 0, outstanding: 0});
    yearly[year - 1].annualPayments += paid;
    yearly[year - 1].outstanding = balance;
  }
  const projectCost = input.principal / (1 - input.downPayment / 100);
  return {firstPayment, laterPayment, projectCost, equity: projectCost - input.principal, totalRepayment, yearly, schedule};
}
