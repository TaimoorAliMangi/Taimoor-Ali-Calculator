import assert from 'node:assert/strict';
// Prefer a normal installed dependency; accept an explicit bundled runtime for this review.
const {chromium} = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const browser = await chromium.launch({headless:true, executablePath:process.env.CHROME_PATH || undefined});
const page = await browser.newPage();
const checks = [];
const url = process.env.APP_URL || 'http://127.0.0.1:4173';
const number = text => Number(text.replace(/[^\d.-]/g,''));
const read = async id => number(await page.locator(id).textContent());
async function slider(value) { await page.locator('#principal').evaluate((el,v)=>{el.value=String(v);el.dispatchEvent(new Event('input',{bubbles:true}));},value); }
async function submit() {await page.locator('#loan-form button[type=submit]').click();}
const payment = (principal,rate,months) => principal * rate / (1 - Math.pow(1+rate,-months));
// Independent closed-form reference: do not import app calculation code.
function fixture(years,kibor=12) {
  const principal=5e6,r=.05/12,first=payment(principal,r,years*12);
  const balance = n => principal*Math.pow(1+r,n)-first*(Math.pow(1+r,n)-1)/r;
  const remaining=balance(120),later=years===10?null:payment(remaining,(kibor+3)/1200,(years-10)*12);
  return {first,later,rows:Array.from({length:years},(_,i)=>{
    const y=i+1,n=y*12,after=y>10;
    const outstanding=after?remaining*Math.pow(1+(kibor+3)/1200,n-120)-later*(Math.pow(1+(kibor+3)/1200,n-120)-1)/((kibor+3)/1200):balance(n);
    return [y,Math.round(after?later:first),Math.round((after?later:first)*12),Math.max(0,Math.round(outstanding))];
  })};
}
async function calculate(years=20) {
  await page.locator('#tenure').selectOption(String(years));
  await page.locator('#kibor').fill('12');
  await submit();
}
try {
  await page.goto(url); await page.locator('#loan-form').waitFor();
  assert.equal(await page.locator('#downPayment').inputValue(),'10');
  assert.equal(await page.locator('#kibor').inputValue(),'12.75');
  assert.equal(await page.locator('#tenure option').count(),11);
  assert.equal(await page.locator('#developer-logo').evaluate(img=>img.complete&&img.naturalWidth>0),true);
  assert.equal(await page.getByRole('link',{name:/official housing/}).getAttribute('href'),'https://apnaghar.gov.pk/');
  assert.match(await page.locator('#eligibility-text').textContent(),/not a universal scheme threshold/);
  checks.push('Defaults, local KnowledgeCity logo, official link and qualified eligibility');
  for(const years of [20,10,15]) {
    await calculate(years); const f=fixture(years);
    assert.equal(await read('#first-payment'),Math.round(f.first));
    assert.equal(await page.locator('#later').isVisible(),years>10);
    if(years>10) assert.equal(await read('#later-payment'),Math.round(f.later));
    assert.equal(await read('#total'),Math.round(f.first*120+(f.later||0)*(years-10)*12));
    const actual=await page.locator('#yearly tr').evaluateAll(rows=>rows.map(row=>Array.from(row.cells).map(cell=>Number(cell.textContent.replace(/,/g,'')))));
    assert.deepEqual(actual,f.rows);
    checks.push(`${years}-year phase payments and every yearly row match independent closed-form fixture`);
  }
  await calculate(20); const initial=await read('#first-payment'),later=await read('#later-payment');
  await page.locator('#downPayment').fill('20'); assert.equal(await page.locator('#results').isVisible(),false);
  await submit();
  assert.equal(await read('#first-payment'),initial); assert.equal(await read('#equity'),1250000); assert.equal(await read('#project-cost'),6250000);
  await page.locator('#kibor').fill('0'); await submit();
  assert.equal(await read('#first-payment'),initial); assert.ok(await read('#later-payment')<later);
  checks.push('Equity formula, unchanged initial payment, KIBOR change and stale clearing');
  for(const [id,value] of [['size','1501'],['downPayment','9'],['downPayment','100'],['kibor','-1'],['size',''],['size','0'],['size','0'.repeat(65)+'1']]) {
    await page.reload(); await page.locator(`#${id}`).fill(value); await submit();
    assert.equal(await page.locator('#results').isVisible(),false);
    assert.equal(await page.locator(`#${id}`).getAttribute('aria-invalid'),'true');
    assert.ok((await page.locator(`#${id}-error`).textContent()).length>0);
    assert.equal(await page.locator(`#${id}`).evaluate(el=>el===document.activeElement),true);
  }
  let dialogs=0; page.on('dialog',async d=>{dialogs++;await d.dismiss();});
  await page.reload(); await page.locator('#size').evaluate(el=>el.type='text');
  await page.locator('#size').fill('<img src=x onerror=alert(1)>'); await submit();
  assert.equal(dialogs,0); assert.equal(await page.locator('#results').isVisible(),false); assert.equal(await page.locator('#size').getAttribute('aria-invalid'),'true');
  checks.push('Invalid/missing boundaries, excessive length and injection blocked with accessible error and focus');
  await page.reload(); await page.locator('#property').selectOption('plot'); assert.equal(await page.locator('#size').inputValue(),'');
  await page.locator('#size').fill('10'); await slider(10000000); await calculate(20); assert.equal(await page.locator('#results').isVisible(),true);
  await page.locator('#size').fill('10.01'); await submit(); assert.equal(await page.locator('#results').isVisible(),false);
  await page.locator('#property').selectOption('owned'); assert.equal(await page.locator('#size').inputValue(),'');
  await page.locator('#size').fill('10'); await calculate(20); assert.equal(await page.locator('#results').isVisible(),true);
  await page.locator('#property').selectOption('flat'); await page.locator('#size').fill('1500'); await calculate(20); assert.equal(await page.locator('#results').isVisible(),true);
  checks.push('Inclusive property/principal maxima, oversized plot rejection and unit reset');
  await page.reload();
  const range=page.locator('#principal');assert.equal(await range.getAttribute('type'),'range');
  assert.equal(await range.getAttribute('min'),'1000000');assert.equal(await range.getAttribute('max'),'10000000');assert.equal(await range.getAttribute('step'),'100000');
  await slider(1000000);await calculate(10);assert.equal(await read('#first-payment'),Math.round(payment(1e6,.05/12,120)));
  await slider(5000000);await range.focus();await page.keyboard.press('ArrowRight');assert.equal(await range.inputValue(),'5100000');
  await slider(5000000);await calculate(20);const preserved=await read('#first-payment');
  for(const [role,order]of [['family',['summary-block','table-block','monthly-block']],['adviser',['table-block','monthly-block','summary-block']],['borrower',['monthly-block','summary-block','table-block']]]){
    await page.locator('#role').selectOption(role);assert.deepEqual(await page.locator('#results').evaluate(el=>Array.from(el.children).map(x=>x.id)),order);assert.equal(await read('#first-payment'),preserved);assert.equal(await range.inputValue(),'5000000');assert.ok((await page.locator('#role-guidance').textContent()).length>0);
  }
  assert.equal(await page.locator('header').count(),1);assert.ok(await page.locator('.eligibility').evaluate(el=>Boolean(el.compareDocumentPosition(document.querySelector('.grid'))&Node.DOCUMENT_POSITION_PRECEDING)));
  checks.push('Slider min/max/step and keyboard; role ordering preserves inputs/results; eligibility below calculator');
  await page.locator('#language-toggle').click();assert.equal(await page.locator('html').getAttribute('lang'),'ur');assert.equal(await page.locator('html').getAttribute('dir'),'rtl');assert.equal(await read('#first-payment'),preserved);
  const untranslated=await page.evaluate(()=>{const w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);const bad=[];while(w.nextNode()){const n=w.currentNode;const parent=n.parentElement;if(!parent||!parent.getClientRects().length||parent.closest('[hidden]'))continue;const text=n.textContent.replace(/KnowledgeCity|PKR|KIBOR|SBP|CNIC|NICOP|POC|English/g,'');if(/[A-Za-z]/.test(text))bad.push(n.textContent.trim());}return bad;});assert.deepEqual(untranslated,[]);
  for(const width of [320,390]){await page.setViewportSize({width,height:844});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`RTL overflow at ${width}px`);}
  await page.locator('#size').fill('0');await submit();assert.match(await page.locator('#size-error').textContent(),/[\u0600-\u06ff]/);assert.doesNotMatch(await page.locator('#size-error').textContent(),/[A-Za-z]/);
  await page.locator('#language-toggle').click();assert.equal(await page.locator('html').getAttribute('dir'),'ltr');await page.locator('#size').fill('1200');await calculate(20);
  checks.push('Complete Urdu labels/results/errors, RTL mobile layout and language toggle preserves state');
  let requests=0; const track=()=>requests++; page.on('request',track);
  await slider(5000000); await calculate(20); await page.waitForTimeout(150); page.off('request',track); assert.equal(requests,0);
  assert.equal(await page.evaluate(()=>localStorage.length+sessionStorage.length),0);
  checks.push('Calculation sends zero requests and persists no browser storage');
  for(const width of [320,390]) {
    await page.setViewportSize({width,height:844});
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth),`Page overflow at ${width}px`);
  }
  await page.locator('#principal').focus(); await page.keyboard.press('Tab'); assert.equal(await page.locator('#tenure').evaluate(el=>el===document.activeElement),true);
  assert.equal(await page.locator('#form-status').getAttribute('aria-live'),'polite');
  checks.push('320/390px layouts without page overflow and keyboard tab navigation');
  if(process.env.QA_SCREENSHOT_DIR) {
    await page.setViewportSize({width:1440,height:1100}); await page.screenshot({path:`${process.env.QA_SCREENSHOT_DIR}/qa-desktop.png`,fullPage:false});
    await page.setViewportSize({width:390,height:844}); await page.screenshot({path:`${process.env.QA_SCREENSHOT_DIR}/qa-mobile.png`,fullPage:false});
  }
  console.log(JSON.stringify({status:'PASS',checks},null,2));
} finally {await browser.close();}
