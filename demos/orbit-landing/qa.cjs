// Real Chromium checks for the standalone fixture, following the repository's demo QA pattern.
const { chromium } = require('playwright');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const output = path.join(__dirname, 'evidence');
fs.mkdirSync(output, { recursive: true });
const checks = [], errors = [], audits = [];
const check = (name, result) => { assert.ok(result, name); checks.push(name); };
(async () => {
  const browser = await chromium.launch({headless:true,executablePath:chromium.executablePath()});
  const page = await browser.newPage();
  page.on('pageerror', e => errors.push(e.message));
  const requests = [];
  page.on('request', request => requests.push({url:request.url(),method:request.method()}));
  try {
    await page.goto('http://127.0.0.1:8768/demos/orbit-landing/');
    await page.evaluate(() => document.fonts.ready);
    check('Local LINE Seed font loaded', await page.evaluate(() => document.fonts.check('16px "LINE Seed"')));
    for (const width of [320,390,768,1440]) {
      await page.setViewportSize({width,height:960});
      check(`No horizontal overflow at ${width}`, await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
      await page.screenshot({path:path.join(output,`landing-${width}.png`),fullPage:true});
      if (process.env.CODELV8_AXE_PATH) {
        await page.addScriptTag({path:process.env.CODELV8_AXE_PATH});
        const result = await page.evaluate(() => axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}}));
        audits.push({width,violations:result.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}))});
        check(`Axe scan no violations at ${width}`,result.violations.length===0);
      }
    }
    await page.getByRole('button',{name:'รายปี'}).click();
    check('Annual pricing and total update', await page.locator('#team-price').innerText()==='฿152' && (await page.locator('#billing-note').innerText()).includes('1,824'));
    await page.getByRole('button',{name:'รายเดือน',exact:true}).focus();
    await page.keyboard.press('Enter');
    check('Keyboard restores monthly price', await page.locator('#team-price').innerText()==='฿190');
    await page.getByRole('button',{name:'รายการงาน',exact:true}).click();
    check('List view and accessible state update', await page.locator('#workspace-items').evaluate(el=>el.classList.contains('list-view')) && await page.locator('[data-view="list"]').getAttribute('aria-pressed')==='true');
    await page.getByRole('button',{name:'บอร์ดงาน',exact:true}).click();
    check('Board view restored', await page.locator('#workspace-items').evaluate(el=>el.classList.contains('board-view')));
    await page.locator('summary').first().focus();
    await page.keyboard.press('Enter');
    check('FAQ works with keyboard', await page.locator('details').first().evaluate(el=>el.open));
    await page.keyboard.press('Enter');
    const opener=page.locator('.hero-actions [data-start]');
    await opener.click();
    check('Modal opens with field focus', await page.locator('#start-dialog').evaluate(el=>el.open) && await page.locator('#team-name').evaluate(el=>el===document.activeElement));
    await page.locator('button[type="submit"]').click();
    check('Empty inputs show errors', await page.locator('#team-name').getAttribute('aria-invalid')==='true' && await page.locator('#email').getAttribute('aria-invalid')==='true');
    await page.locator('#team-name').fill('ทีมออกแบบตัวอย่าง');
    await page.locator('#email').fill('invalid');
    await page.locator('button[type="submit"]').click();
    check('Invalid email keeps team input',await page.locator('#team-name').inputValue()==='ทีมออกแบบตัวอย่าง' && await page.locator('#email').getAttribute('aria-invalid')==='true');
    await page.locator('#email').fill('team@example.com');
    await page.locator('button[type="submit"]').click();
    check('Valid form gives truthful demo success', (await page.locator('#form-result').innerText()).includes('ทีมออกแบบตัวอย่าง'));
    await page.setViewportSize({width:390,height:844});
    await page.screenshot({path:path.join(output,'modal-mobile.png')});
    check('Mobile dialog fits viewport',await page.locator('#start-dialog').evaluate(el=>{const r=el.getBoundingClientRect();return r.left>=0&&r.right<=innerWidth&&r.top>=0&&r.bottom<=innerHeight}));
    if(process.env.CODELV8_AXE_PATH){const result=await page.evaluate(()=>axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}}));audits.push({state:'dialog',violations:result.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}))});check('Dialog axe scan',result.violations.length===0)}
    for(let i=0;i<8;i++){await page.keyboard.press('Tab');check(`Modal Tab containment ${i+1}`,await page.evaluate(()=>document.querySelector('#start-dialog').contains(document.activeElement)||document.activeElement===document.body))}
    await page.keyboard.press('Escape');
    check('Escape closes and restores opener focus',await page.locator('#start-dialog').evaluate(el=>!el.open)&&await opener.evaluate(el=>el===document.activeElement));
    await opener.click();
    check('Close clears personal input',await page.locator('#team-name').inputValue()==='');
    await page.locator('.close-button').click();
    check('Close button dismisses dialog',await page.locator('#start-dialog').evaluate(el=>!el.open));
    await page.emulateMedia({reducedMotion:'reduce'});
    check('Reduced motion disables smooth scrolling',await page.evaluate(()=>getComputedStyle(document.documentElement).scrollBehavior==='auto'));
    await page.setViewportSize({width:720,height:900});
    check('200 percent equivalent reflow',await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
    check('No submission or external network requests',requests.every(r=>r.method==='GET'&&r.url.startsWith('http://127.0.0.1:8768/')));
    check('No runtime errors',errors.length===0);
    await page.emulateMedia({reducedMotion:'no-preference'});
    for(const [width,height,name] of [[1440,1000,'preview-desktop'],[390,844,'preview-mobile']]){await page.setViewportSize({width,height});await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));await page.screenshot({path:path.join(output,`${name}.png`)});}
    const results={date:'2026-10-13',browser:browser.version(),passed:checks.length,checks,errors,audits,scope:'Standalone fictional landing page only. No backend, payments, accounts, or user approval tested.'};
    fs.writeFileSync(path.join(output,'results.json'),JSON.stringify(results,null,2));
    console.log(JSON.stringify(results,null,2));
  } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
