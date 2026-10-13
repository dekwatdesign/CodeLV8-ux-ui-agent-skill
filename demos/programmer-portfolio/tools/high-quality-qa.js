async(page)=>{
  const checks=[];
  const assert=(name,condition)=>{if(!condition)throw new Error(name);checks.push(name)};
  const base='http://127.0.0.1:8768/demos/programmer-portfolio/';
  for(const width of [390,320]){
    await page.setViewportSize({width,height:1000});await page.goto(base);
    await page.waitForFunction(()=>document.querySelector('#scene').dataset.state==='ready');
    assert('Mobile quality selected at '+width,await page.locator('#scene').getAttribute('data-quality')==='mobile');
    assert('Mobile file requested at '+width,await page.evaluate(()=>performance.getEntriesByType('resource').some(r=>r.name.endsWith('/studio-mobile.glb'))));
    assert('Mobile model has animation at '+width,Number(await page.locator('#scene').getAttribute('data-clips'))>0);
    assert('No mobile overflow at '+width,await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
    const start=Number(await page.locator('#scene').getAttribute('data-frame'));
    await page.waitForFunction(t=>Number(document.querySelector('#scene').dataset.frame)>t+.1,start);
    assert('Mobile animation advances at '+width,true);
    await page.screenshot({path:'output/playwright/portfolio-high-mobile-'+width+'.png',fullPage:true});
  }
  await page.route('**/studio-mobile.glb',route=>route.abort());await page.goto(base);
  await page.waitForFunction(()=>document.querySelector('#scene').dataset.state==='fallback');
  assert('Mobile GLB error falls back to poster',await page.locator('#scene-poster').isVisible());
  await page.unroute('**/studio-mobile.glb');
  await page.setViewportSize({width:1440,height:1000});await page.goto(base);
  await page.waitForFunction(()=>document.querySelector('#scene').dataset.state==='ready');
  assert('Desktop loads high polygon model',await page.locator('#scene').getAttribute('data-quality')==='high'&&await page.evaluate(()=>performance.getEntriesByType('resource').some(r=>r.name.endsWith('/studio.glb'))));
  return {count:checks.length,passed:checks};
}
