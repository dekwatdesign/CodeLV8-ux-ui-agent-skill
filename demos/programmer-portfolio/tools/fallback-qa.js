async(page)=>{
  const test=await page.context().newPage();
  await test.addInitScript(()=>{
    const original=HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext=function(type,...args){if(type==='webgl'||type==='webgl2'||type==='experimental-webgl')return null;return original.call(this,type,...args)};
  });
  await test.goto('http://127.0.0.1:8768/demos/programmer-portfolio/');
  await test.waitForFunction(()=>document.querySelector('#scene').dataset.state==='fallback');
  if(!await test.locator('#scene-poster').isVisible())throw new Error('WebGL fallback poster missing');
  await test.locator('[data-project=orbit]').click();
  if(!await test.locator('#project-dialog').evaluate(el=>el.open))throw new Error('Fallback broke project modal');
  await test.keyboard.press('Escape');await test.screenshot({path:'output/playwright/portfolio-no-webgl.png',fullPage:true});
  await test.close();
  await page.locator('#contact-open').click();
  await page.evaluate(()=>{Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:text=>{window.__demoCopied=text;return Promise.resolve()}}})});
  await page.locator('#copy-email').click();
  if(await page.evaluate(()=>window.__demoCopied)!=='phakin@example.com'||!(await page.locator('#copy-status').textContent()).includes('คัดลอกอีเมลตัวอย่างแล้ว'))throw new Error('Clipboard success feedback missing');
  await page.keyboard.press('Escape');
  return {passed:['WebGL unavailable shows static poster','Project modal works without WebGL','Clipboard success copies correct fixture and announces feedback'],count:3};
}
