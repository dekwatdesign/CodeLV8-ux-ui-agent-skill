async(page)=>{
  const results=[];
  const audit=async target=>{
    await page.addScriptTag({path:'output/playwright/vendor/package/axe.min.js'});
    const result=await page.evaluate(()=>axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}}));
    results.push({target,violations:result.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))}))});
  };
  await page.goto('http://127.0.0.1:8768/demos/programmer-portfolio/');await page.waitForFunction(()=>document.querySelector('#scene').dataset.state==='ready');
  for(const width of [1440,768,390,320]){await page.setViewportSize({width,height:1000});await audit('Portfolio '+width)}
  await page.locator('[data-project=orbit]').click();await audit('Project modal 320');await page.keyboard.press('Escape');
  await page.locator('#contact-open').click();await audit('Contact modal 320');await page.keyboard.press('Escape');
  return results;
}
