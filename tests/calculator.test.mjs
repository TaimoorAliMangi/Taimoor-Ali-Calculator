import test from 'node:test';
import assert from 'node:assert/strict';
import {calculate,validate,payment} from '../src/calculator.js';
const sample = {property:'flat',size:1200,principal:5_000_000,tenure:20,downPayment:10,kibor:12};
const close = (actual,expected,tolerance=.01) => assert.ok(Math.abs(actual-expected)<tolerance, `${actual} differs from ${expected}`);
test('known twenty-year first payment and independent transition balance',()=>{
 const result=calculate(sample);close(result.firstPayment,32997.7869608329);
 const r=.05/12,n=120;const balance=sample.principal*(1+r)**n-result.firstPayment*((1+r)**n-1)/r;
 close(result.schedule[119].balance,balance);close(result.laterPayment,balance*(.15/12)/(1-(1+.15/12)**-120));
 assert.equal(result.schedule[119].month,120);close(result.schedule[120].payment,result.laterPayment);assert.equal(result.schedule.at(-1).balance,0);
 close(result.totalRepayment,result.firstPayment*120+result.laterPayment*120);
});
test('ten-year loan has no reset and known payment',()=>{const r=calculate({...sample,tenure:10});close(r.firstPayment,53032.7576195377);assert.equal(r.laterPayment,null);assert.equal(r.yearly.length,10);assert.equal(r.schedule.length,120);assert.equal(r.yearly.at(-1).outstanding,0);});
test('fifteen-year loan resets over remaining sixty months',()=>{const r=calculate({...sample,tenure:15});assert.equal(r.schedule.length,180);close(r.laterPayment,payment(r.schedule[119].balance,.15,60));});
test('equity does not affect repayments for fixed principal',()=>{const a=calculate(sample),b=calculate({...sample,downPayment:20});close(a.projectCost,5555555.555555556);close(a.equity,555555.555555556);assert.equal(a.firstPayment,b.firstPayment);close(b.equity,1250000);});
test('annual aggregation matches monthly schedule',()=>{const r=calculate(sample);for(const y of r.yearly){const months=r.schedule.slice((y.year-1)*12,y.year*12);close(y.annualPayments,months.reduce((s,m)=>s+m.payment,0),1e-6);assert.equal(y.outstanding,months.at(-1).balance);}close(r.yearly.reduce((s,y)=>s+y.annualPayments,0),r.totalRepayment,1e-6);});
test('inclusive limits and lower valid boundaries',()=>{assert.deepEqual(validate({...sample,size:1500,principal:10000000}),{});assert.deepEqual(validate({...sample,property:'plot',size:10}),{});assert.deepEqual(validate({...sample,property:'owned',size:10}),{});assert.deepEqual(validate({...sample,principal:1000000,kibor:0,tenure:10}),{});});
test('reject unsafe and out-of-range values',()=>{for(const [key,values] of Object.entries({principal:[0,999999,1000001,10000001,Infinity,NaN],size:[0,1501,NaN],tenure:[9,21,10.5,Infinity],downPayment:[9,100,NaN],kibor:[-1,101,Infinity,NaN],property:['other','<script>']})){for(const value of values){const input={...sample,[key]:value};assert.ok(validate(input)[key]);assert.throws(()=>calculate(input),RangeError);}}assert.ok(validate({...sample,property:'plot',size:10.01}).size);});
test('zero interest formula and bounded output at modelling cap',()=>{close(payment(12000,0,12),1000);const r=calculate({...sample,kibor:100});assert.ok(Number.isFinite(r.totalRepayment));assert.equal(r.schedule.at(-1).balance,0);});
