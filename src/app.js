import {validate, calculate} from './calculator.js';
import {ur} from './i18n.js';
const $ = id => document.getElementById(id);
const fields = ['property','size','principal','tenure','downPayment','kibor'];
const currency = new Intl.NumberFormat('en-PK', {maximumFractionDigits:0});
const pkr = value => `PKR ${currency.format(value)}`;
let language = 'en', current = null, emptyMessage = 'Enter your loan details and calculate to see your estimate.', lastErrors = {};
const textNodes = [];
const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
while (walker.nextNode()) { const node = walker.currentNode; const text = node.textContent.trim(); if (text) textNodes.push({node,text,prefix:node.textContent.match(/^\s*/)[0],suffix:node.textContent.match(/\s*$/)[0]}); }
const t = text => language === 'ur' ? ur[text] || text : text;
function read() { return Object.fromEntries(fields.map(id => [id, id === 'property' ? $(id).value : $(id).value.length > 64 || $(id).value.trim() === '' ? NaN : Number($(id).value)])); }
function showPrincipal() { const value = Number($('principal').value); $('principal-output').textContent = `${pkr(value)} · ${value / 100000} ${language === 'ur' ? 'لاکھ' : 'lakh'}`; $('principal').setAttribute('aria-valuetext', $('principal-output').textContent); }
function sizeLabels() {const flat = $('property').value === 'flat'; $('size-label').textContent=t(flat?'Flat size (sq ft)':'Plot size (marla)'); $('size-hint').textContent=t(flat?'Up to 1,500 sq ft.':'Up to 10 marla.');}
function errorText(id, message) { if(language !== 'ur') return message; if(id === 'size') return `صفر سے زیادہ اور ${$('property').value === 'flat' ? '1,500 مربع فٹ' : '10 مرلہ'} تک رقبہ درج کریں۔`; return t(message); }
function renderErrors() { for(const id of fields) {$(id+'-error').textContent=lastErrors[id]?errorText(id,lastErrors[id]):'';$(id).setAttribute('aria-invalid',lastErrors[id]?'true':'false');} }
function roleOrder() {
 const role = $('role').value;
 const guidance = {borrower:'Focus on your monthly payment and whether it fits your budget.',family:'Review required family equity and yearly cash commitments first.',adviser:'Review rate assumptions and the annual balance schedule first.'};
 $('role-guidance').textContent=t(guidance[role]);
 const order = role === 'family' ? ['summary-block','table-block','monthly-block'] : role === 'adviser' ? ['table-block','monthly-block','summary-block'] : ['monthly-block','summary-block','table-block'];
 for(const id of order) $('results').append($(id));
}
function clearResults(message) {current=null;emptyMessage=message;$('results').hidden=true;$('empty').hidden=false;$('empty').textContent=t(message);$('form-status').textContent='';}
function renderResults() {
 if(!current)return;
 const {input,result}=current;
 $('first-payment').textContent=pkr(result.firstPayment);$('later').hidden=result.laterPayment===null;
 const laterRate=Number((input.kibor+3).toFixed(6));
 if(result.laterPayment!==null){$('later-label').textContent=language==='ur'?`سال 11–${input.tenure} · فرض کردہ سالانہ شرح ${laterRate}%`:`Years 11–${input.tenure} · Assumed ${laterRate}% annual rate`;$('later-payment').textContent=pkr(result.laterPayment);}
 $('equity').textContent=pkr(result.equity);$('project-cost').textContent=pkr(result.projectCost);$('total').textContent=pkr(result.totalRepayment);
 $('annual-emphasis').textContent=language==='ur'?`پہلے سال کی ادائیگیاں: ${pkr(result.yearly[0].annualPayments)}`:`First-year payments: ${pkr(result.yearly[0].annualPayments)}`;
 $('rate-emphasis').textContent=result.laterPayment===null ? (language==='ur'?'پورے 10 سال: سالانہ شرح 5%':'All 10 years: 5% annual rate') : language==='ur'?`سال 1–10: 5%؛ اس کے بعد: ${laterRate}% (فرض کردہ KIBOR + 3%)`:`Years 1–10: 5%; thereafter: ${laterRate}% (assumed KIBOR + 3%)`;
 const fragment=document.createDocumentFragment();for(const year of result.yearly){const row=document.createElement('tr');if(year.year===11)row.className='rate-change';for(const value of [year.year,currency.format(year.monthlyPayment),currency.format(year.annualPayments),currency.format(year.outstanding)]){const cell=document.createElement('td');cell.textContent=String(value);row.append(cell);}fragment.append(row);}
 $('yearly').replaceChildren(fragment);$('empty').hidden=true;$('results').hidden=false;
 $('form-status').textContent=language==='ur'?`تخمینہ تیار ہے: سال 1–10 میں ماہانہ ${pkr(result.firstPayment)}${result.laterPayment===null?'۔':`؛ اس کے بعد فرض کردہ شرح پر ماہانہ ${pkr(result.laterPayment)}۔`}`:`Estimate ready: ${pkr(result.firstPayment)} per month for years 1–10${result.laterPayment===null?'.':`; ${pkr(result.laterPayment)} thereafter at the assumed rate.`}`;
 roleOrder();
}
for(const id of fields)$(id).addEventListener('input',()=>{clearResults('Your details changed. Calculate again to update your estimate.');delete lastErrors[id];renderErrors();if(id==='principal')showPrincipal();});
$('property').addEventListener('change',()=>{const flat=$('property').value==='flat';$('size').max=flat?'1500':'10';$('size').value='';delete lastErrors.size;sizeLabels();renderErrors();clearResults('Property type changed. Enter the size in the displayed unit and calculate again.');});
$('role').addEventListener('change',roleOrder);
$('language-toggle').addEventListener('click',()=>{
 language=language==='en'?'ur':'en';document.documentElement.lang=language;document.documentElement.dir=language==='ur'?'rtl':'ltr';document.title=language==='ur'?'پاکستان ہاؤسنگ قرض کیلکولیٹر · KnowledgeCity':'Pakistan Housing Calculator · KnowledgeCity';
 for(const {node,text,prefix,suffix} of textNodes){let translated=t(text);if(/^\d+ years$/.test(text)&&language==='ur')translated=text.replace('years','سال');node.textContent=prefix+translated+suffix;}
 $('language-toggle').textContent='🌐 English / اردو';$('language-toggle').setAttribute('aria-label',language==='ur'?'زبان بدلیں: English / اردو':'Switch language: English / اردو');
 document.querySelector('.table-wrap').setAttribute('aria-label',language==='ur'?'قرض کی سالانہ ادائیگیوں کی تفصیل':'Yearly repayment breakdown');sizeLabels();showPrincipal();renderErrors();roleOrder();
 if(current)renderResults();else{$('empty').textContent=t(emptyMessage);if(Object.keys(lastErrors).length)$('form-status').textContent=language==='ur'?`${Object.keys(lastErrors).length} خانوں کو درست کریں۔`:`${Object.keys(lastErrors).length} field(s) need correction.`;}
});
$('loan-form').addEventListener('submit',event=>{event.preventDefault();const input=read();lastErrors=validate(input);renderErrors();if(Object.keys(lastErrors).length){clearResults('Correct the highlighted fields to calculate your estimate.');$('form-status').textContent=language==='ur'?`${Object.keys(lastErrors).length} خانوں کو درست کریں۔`:`${Object.keys(lastErrors).length} field(s) need correction.`;$(Object.keys(lastErrors)[0]).focus();return;}current={input,result:calculate(input)};renderResults();});
showPrincipal();roleOrder();
