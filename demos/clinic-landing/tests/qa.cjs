// Real browser checks following the repository's standalone demo QA pattern.
const {chromium}=require(process.env.CODELV8_PLAYWRIGHT_PATH || 'playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const evidence=path.join(__dirname,'evidence');
fs.mkdirSync(evidence,{recursive:true});
const checks=[],audits=[],errors=[],external=[];
function check(name,value){assert.ok(value,name);checks.push(name)}
(async()=>{
  const browser=await chromium.launch({headless:true,executablePath:chromium.executablePath()});
  const page=await browser.newPage();
  page.on('pageerror',e=>errors.push(e.message));
  page.on('response',r=>{if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`)});
  page.on('request',r=>{if(!r.url().startsWith('http://127.0.0.1:8772/'))external.push(r.url())});
  const axePath=process.env.CODELV8_AXE_PATH;
  assert.ok(axePath&&fs.existsSync(axePath),'Set CODELV8_AXE_PATH to an installed axe-core file');
  async function audit(state){
    const result=await page.evaluate(()=>axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}}));
    audits.push({state,violations:result.violations.map(v=>({id:v.id,targets:v.nodes.map(n=>n.target)}))});
    check(`axe: ${state}`,!result.violations.length);
  }
  try{
    await page.goto('http://127.0.0.1:8772/');
    await page.evaluate(()=>document.fonts.ready);
    await page.locator('#about img').scrollIntoViewIfNeeded();
    await page.waitForFunction(()=>Array.from(document.querySelectorAll('main img')).every(i=>i.complete&&i.naturalWidth>0));
    await page.evaluate(()=>scrollTo(0,0));
    await page.addScriptTag({path:axePath});
    check('Local Thai font loaded',await page.evaluate(()=>document.fonts.check('16px "LINE Seed"')));
    for(const width of [320,390,768,1440]){
      await page.setViewportSize({width,height:960});
      check(`No overflow ${width}`,await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
      check(`Both generated images loaded ${width}`,await page.locator('main img').evaluateAll(images=>images.every(i=>i.complete&&i.naturalWidth>0)));
      await page.screenshot({path:path.join(evidence,`landing-${width}.png`),fullPage:true});
      await audit(`viewport-${width}`);
    }
    await page.screenshot({path:path.join(evidence,'preview-desktop.png')});
    await page.getByRole('button',{name:'ดูแลสิว',exact:true}).click();
    check('Acne filter shows one package',await page.locator('.package:visible').count()===1);
    check('Acne pressed state',await page.locator('[data-filter=clear]').getAttribute('aria-pressed')==='true');
    await page.getByRole('button',{name:'ผิวชุ่มชื้น',exact:true}).focus();await page.keyboard.press('Enter');
    check('Keyboard moisture filter shows two packages',await page.locator('.package:visible').count()===2);
    await page.getByRole('button',{name:'ทั้งหมด',exact:true}).click();
    for(const key of ['glow','clear','ritual']){
      const trigger=page.locator(`[data-package=${key}]`);
      await trigger.click();check(`Package ${key} opens`,await page.locator('#detail-dialog').evaluate(d=>d.open));
      check(`Package ${key} details`,(await page.locator('#detail-title').innerText()).length>0);
      await page.keyboard.press('Escape');check(`Package ${key} focus restored`,await trigger.evaluate(e=>e===document.activeElement));
    }
    for(const key of ['dry','acne','routine']){
      await page.locator(`[data-case=${key}]`).click();
      check(`Case ${key} clearly labeled`,(await page.locator('#detail-kicker').innerText()).includes('เคสจำลอง'));
      await page.locator('#detail-dialog [data-close]').click();
    }
    await page.locator('[data-package=clear]').click();await page.locator('#detail-book').click();
    check('Package booking preserves service',await page.locator('input[value="Clear & Calm"]').isChecked());
    check('Name focused on booking',await page.locator('#booking-name').evaluate(e=>e===document.activeElement));
    await page.getByRole('button',{name:'ทดลองส่งคำขอนัดหมาย'}).click();
    check('Empty fields expose errors',await page.locator('#booking-name').getAttribute('aria-invalid')==='true'&&await page.locator('#booking-date').getAttribute('aria-invalid')==='true');
    await page.locator('#booking-name').fill('ผู้ทดลอง');await page.locator('#booking-date').fill('2020-01-01');
    await page.getByRole('button',{name:'ทดลองส่งคำขอนัดหมาย'}).click();
    check('Past date rejected and name retained',await page.locator('#booking-date').getAttribute('aria-invalid')==='true'&&await page.locator('#booking-name').inputValue()==='ผู้ทดลอง');
    const min=await page.locator('#booking-date').getAttribute('min');await page.locator('#booking-date').fill(min);
    await page.getByRole('button',{name:'ทดลองส่งคำขอนัดหมาย'}).click();
    check('Success explains no confirmed appointment',(await page.locator('#form-result').innerText()).includes('ยังไม่ใช่การยืนยันนัดหมาย'));
    await audit('booking-success');
    await page.setViewportSize({width:390,height:844});await page.screenshot({path:path.join(evidence,'booking-mobile.png')});
    check('Mobile modal fits',await page.locator('#booking-dialog').evaluate(d=>{const r=d.getBoundingClientRect();return r.left>=0&&r.right<=innerWidth&&r.top>=0&&r.bottom<=innerHeight}));
    for(let i=0;i<12;i++){await page.keyboard.press(i%3===0?'Shift+Tab':'Tab');check(`Modal focus containment ${i}`,await page.evaluate(()=>document.querySelector('#booking-dialog').contains(document.activeElement)))}
    await page.keyboard.press('Escape');check('Booking closes',await page.locator('#booking-dialog').evaluate(d=>!d.open));
    check('Original package opener focus restored',await page.locator('[data-package=clear]').evaluate(e=>e===document.activeElement));
    await page.locator('.hero-actions [data-book]').click();check('Reopen clears personal data',await page.locator('#booking-name').inputValue()==='');
    await page.getByRole('button',{name:'ปิดแบบฟอร์ม'}).click();
    await page.locator('.menu-toggle').click();check('Mobile menu opens',await page.locator('.menu-toggle').getAttribute('aria-expanded')==='true');
    await page.keyboard.press('Escape');check('Menu Escape returns focus',await page.locator('.menu-toggle').getAttribute('aria-expanded')==='false'&&await page.locator('.menu-toggle').evaluate(e=>e===document.activeElement));
    await page.locator('.menu-toggle').click();await page.locator('#navigation a[href="#packages"]').click();check('Mobile link closes menu',await page.locator('.menu-toggle').getAttribute('aria-expanded')==='false');
    await page.locator('summary').first().focus();await page.keyboard.press('Enter');check('FAQ keyboard toggles',await page.locator('details').first().evaluate(d=>d.open));await page.keyboard.press('Enter');
    await page.emulateMedia({reducedMotion:'reduce'});check('Reduced motion applied',await page.evaluate(()=>getComputedStyle(document.documentElement).scrollBehavior==='auto'));
    await page.setViewportSize({width:768,height:960});await page.evaluate(()=>document.body.style.zoom='1.25');check('125% zoom no overflow',await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await page.evaluate(()=>document.body.style.zoom='');
    await page.setViewportSize({width:390,height:844});await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:path.join(evidence,'preview-mobile.png')});
    check('No runtime or asset errors',!errors.length);check('No external requests',!external.length);
    check('No localStorage or sessionStorage',await page.evaluate(()=>localStorage.length===0&&sessionStorage.length===0));
    fs.writeFileSync(path.join(evidence,'results.json'),JSON.stringify({browser:browser.version(),checks,audits,errors,external},null,2));
    console.log(`${checks.length}/${checks.length} checks passed; ${audits.length} axe audits; Chromium ${browser.version()}`);
  }catch(e){fs.writeFileSync(path.join(evidence,'failure.json'),JSON.stringify({error:e.message,checks,audits,errors},null,2));throw e}finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
