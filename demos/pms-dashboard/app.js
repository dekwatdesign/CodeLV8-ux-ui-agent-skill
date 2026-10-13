'use strict';
// Fictional fixtures only. There are no API calls, real employee records or persistent writes.
const seed = [
  {id:1,name:'ภัทรา วัฒนกุล',role:'Product Designer',dept:'ผลิตภัณฑ์',score:89,status:'reviewed'},
  {id:2,name:'ธนกร อรุณรัตน์',role:'Product Manager',dept:'ผลิตภัณฑ์',score:84,status:'pending'},
  {id:3,name:'มินตรา พงศ์พิพัฒน์',role:'UX Researcher',dept:'ผลิตภัณฑ์',score:92,status:'reviewed'},
  {id:4,name:'กฤติน สุขสวัสดิ์',role:'Operations Lead',dept:'ปฏิบัติการ',score:76,status:'pending'},
  {id:5,name:'ศิริพร จันทร์แก้ว',role:'Operations Specialist',dept:'ปฏิบัติการ',score:82,status:'reviewed'},
  {id:6,name:'ณัฐพล วิริยะ',role:'Process Analyst',dept:'ปฏิบัติการ',score:null,status:'self'},
  {id:7,name:'ปาริฉัตร แสงทอง',role:'Account Executive',dept:'การขาย',score:87,status:'reviewed'},
  {id:8,name:'ชยพล รุ่งเรือง',role:'Sales Specialist',dept:'การขาย',score:71,status:'pending'},
  {id:9,name:'อรพรรณ พิทักษ์',role:'Customer Success',dept:'การขาย',score:85,status:'reviewed'},
  {id:10,name:'ณิชา รัตนาวลี',role:'People Partner',dept:'บุคคล',score:90,status:'pending'},
  {id:11,name:'พีรวิชญ์ เมธากุล',role:'Talent Acquisition',dept:'บุคคล',score:88,status:'reviewed'},
  {id:12,name:'สลิลทิพย์ นาคประเสริฐ',role:'People Operations',dept:'บุคคล',score:null,status:'draft'}
];
const baseGoals = [
  {id:1,owner:2,title:'ส่งมอบแผนพัฒนาผลิตภัณฑ์ตามรอบ',progress:46},
  {id:2,owner:4,title:'ลดระยะเวลาการส่งต่องานระหว่างทีม',progress:38},
  {id:3,owner:8,title:'เพิ่มโอกาสขายจากลูกค้ากลุ่มใหม่',progress:42},
  {id:4,owner:10,title:'จัดทำแผนพัฒนาทักษะรายบุคคล',progress:48},
  {id:5,owner:1,title:'ปรับปรุงประสบการณ์ใช้งานหน้าบริการหลัก',progress:94},
  {id:6,owner:3,title:'สรุปผลวิจัยผู้ใช้เพื่อพัฒนาบริการ',progress:100},
  {id:7,owner:5,title:'ยกระดับคุณภาพการให้บริการ',progress:86},
  {id:8,owner:6,title:'จัดทำคู่มือกระบวนการปฏิบัติงาน',progress:64},
  {id:9,owner:7,title:'ติดตามแผนการดูแลลูกค้ารายสำคัญ',progress:95},
  {id:10,owner:9,title:'เพิ่มความพึงพอใจในการใช้บริการ',progress:89},
  {id:11,owner:11,title:'ปรับปรุงขั้นตอนการสรรหาบุคลากร',progress:90},
  {id:12,owner:12,title:'จัดระบบเอกสารและข้อมูลบุคลากร',progress:58}
];
const rounds = {
  q3:{title:'ไตรมาส 3 / 2569',dates:'1 ก.ค. – 30 ก.ย. 2569',deadline:'20 ต.ค. 2569',people:seed.map(p=>({...p,comment:''})),goals:baseGoals.map(g=>({...g}))},
  q2:{title:'ไตรมาส 2 / 2569',dates:'1 เม.ย. – 30 มิ.ย. 2569',deadline:'20 ก.ค. 2569',people:seed.map(p=>({...p,score:(p.score??78)-4,status:'reviewed',comment:'ตรวจทานผลของรอบก่อนแล้ว'})),goals:baseGoals.map(g=>({...g,progress:Math.min(100,g.progress+18)}))}
};
const state={cycle:'q3',dept:'all',status:'all',query:'',page:1,pageSize:6,selected:null,origin:null,busy:false,formInitial:null,goalsExpanded:false};
const $=(s,root=document)=>root.querySelector(s);
const $$=(s,root=document)=>[...root.querySelectorAll(s)];
const escapeHTML=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const labels={reviewed:'ประเมินแล้ว',pending:'รอตรวจทาน',self:'กำลังประเมินตนเอง',draft:'ยังไม่เริ่ม'};
const colors={'ผลิตภัณฑ์':'','ปฏิบัติการ':'lilac','การขาย':'peach','บุคคล':'blue'};
const barColors={'ผลิตภัณฑ์':'','ปฏิบัติการ':'purple','การขาย':'amber','บุคคล':'blue'};
const round=()=>rounds[state.cycle];
const people=()=>round().people.filter(p=>state.dept==='all'||p.dept===state.dept);
const filteredPeople=()=>people().filter(p=>(state.status==='all'||(state.status==='incomplete'?['self','draft'].includes(p.status):p.status===state.status))&&(p.name+' '+p.role).toLocaleLowerCase('th').includes(state.query.trim().toLocaleLowerCase('th')));
const scopedGoals=()=>round().goals.filter(g=>people().some(p=>p.id===g.owner));
const average=list=>{const scored=list.filter(p=>p.score!==null);return scored.length?scored.reduce((s,p)=>s+p.score,0)/scored.length:null};
const format=n=>n===null?'—':n.toFixed(1);
const badge=p=>`<span class="badge ${p.status}">${labels[p.status]}</span>`;
const avatar=p=>`<span class="avatar ${colors[p.dept]}" aria-hidden="true">${escapeHTML(p.name[0])}</span>`;
let toastTimer;
function notify(message){clearTimeout(toastTimer);const toast=$('#toast');toast.textContent=message;toast.hidden=false;toastTimer=setTimeout(()=>toast.hidden=true,5000)}
function renderSummary(){
  const list=people(),completed=list.filter(p=>p.status==='reviewed').length,pending=list.filter(p=>p.status==='pending').length,scored=list.filter(p=>p.score!==null).length,risk=scopedGoals().filter(g=>g.progress<50).length,percent=list.length?Math.round(completed/list.length*100):0;
  $('#metrics').innerHTML=`<article class="metric leading"><p class="metric-label">คะแนนเบื้องต้นเฉลี่ย <span class="metric-index">0–100</span></p><p class="metric-value"><strong>${format(average(list))}</strong><span>คะแนน</span></p><small>จากผู้มีคะแนน ${scored} คน รวมผลรอตรวจทาน</small></article><article class="metric"><p class="metric-label">ประเมินแล้ว</p><p class="metric-value"><strong>${completed}</strong><span>/ ${list.length} คน</span></p><small class="emphasis">ดำเนินการแล้ว ${percent}% ของรอบ</small></article><article class="metric"><p class="metric-label">รอตรวจทาน</p><p class="metric-value"><strong>${pending}</strong><span>คน</span></p><small>รอหัวหน้าตรวจทานผลการประเมิน</small></article><article class="metric"><p class="metric-label">เป้าหมายที่ควรติดตาม</p><p class="metric-value"><strong>${risk}</strong><span>เป้าหมาย</span></p><small>ความคืบหน้าน้อยกว่า 50%</small></article>`;
  $('#sidebar-cycle-heading').textContent=round().title;$('#sidebar-completed').textContent=`${completed} จาก ${list.length} คน`;$('#sidebar-percent').textContent=percent+'%';$('#sidebar-progress').max=list.length||1;$('#sidebar-progress').value=completed;$('#sidebar-deadline').textContent='ปิดรอบวันที่ '+round().deadline;
  $('#trend-value').innerHTML=`${percent}<span>%</span>`;$('#trend-caption').textContent=`${completed} จาก ${list.length} คนในรอบที่เลือก`;
  $('#round-state').textContent=state.cycle==='q2'?'ปิดรอบแล้ว':'กำลังประเมิน';
  for(const id of ['add-goal','add-goal-secondary']){$('#'+id).disabled=state.cycle==='q2';$('#'+id).title=state.cycle==='q2'?'รอบนี้ปิดแล้ว เพิ่มเป้าหมายได้ในรอบปัจจุบัน':''}
  $('#pending-count').textContent=pending;$('#action-description').textContent=pending?'ปิดผลการประเมินภายใน '+round().deadline:'ไม่มีผลรอตรวจทานในฝ่ายและรอบที่เลือก';
  const pendingList=list.filter(p=>p.status==='pending').slice(0,3);
  $('#review-queue').innerHTML=pendingList.length?pendingList.map(p=>`<li>${avatar(p)}<div class="review-person"><strong>${p.name}</strong><small>${p.dept} · ${p.role}</small></div><button type="button" class="review-button" data-person="${p.id}" data-tab="review" aria-label="ตรวจทาน ${p.name}">ตรวจทาน</button></li>`).join(''):'<li class="queue-empty">ตรวจทานครบแล้ว พร้อมติดตามเป้าหมายต่อ</li>';
  $('#show-pending').disabled=!pending;
  const dates=state.cycle==='q3'?['3 ต.ค.','6 ต.ค.','9 ต.ค.','13 ต.ค.']:['3 ก.ค.','6 ก.ค.','9 ก.ค.','20 ก.ค.'];
  const counts=[Math.floor(completed*.25),Math.floor(completed*.5),Math.floor(completed*.75),completed];
  const x=[42,225,408,592],top=15,bottom=135,points=counts.map((n,i)=>`${x[i]},${bottom-(n/Math.max(list.length,1))*(bottom-top)}`);
  $('#trend-chart').innerHTML=`<title id="chart-title">จำนวนผู้ประเมินเสร็จสะสม</title><desc id="chart-description">${dates.map((d,i)=>d+' '+counts[i]+' คน').join(', ')} เป็นข้อมูลตัวอย่างจำลอง</desc><defs><linearGradient id="area-gradient" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#87ab94" stop-opacity=".28"/><stop offset="100%" stop-color="#87ab94" stop-opacity=".015"/></linearGradient></defs>${[0,.5,1].map(n=>`<line x1="42" y1="${bottom-n*120}" x2="592" y2="${bottom-n*120}" stroke="#e6ede8" stroke-dasharray="4 5"/><text x="20" y="${bottom-n*120+4}" fill="#536565" font-size="10" text-anchor="end">${Math.round(list.length*n)}</text>`).join('')}<path d="M ${x[0]},${bottom} L ${points.join(' L ')} L ${x[3]},${bottom} Z" fill="url(#area-gradient)"/><polyline points="${points.join(' ')}" fill="none" stroke="#567d65" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>${counts.map((n,i)=>`<circle cx="${x[i]}" cy="${bottom-n/Math.max(list.length,1)*120}" r="4" fill="#fff" stroke="#567d65" stroke-width="2"/><text x="${x[i]}" y="162" fill="#536565" font-size="10" text-anchor="middle">${dates[i]}</text>`).join('')}`;
  $('#chart-data').innerHTML=dates.map((date,i)=>`<tr><th scope="row">${date}</th><td>${counts[i]}</td></tr>`).join('');
  $('#department-bars').innerHTML=[...new Set(list.map(p=>p.dept))].map(dept=>{const avg=average(list.filter(p=>p.dept===dept));return `<li><p class="bar-label"><span>${dept}</span><strong>${format(avg)}</strong></p><div class="bar-track" aria-hidden="true"><div class="bar-fill ${barColors[dept]}" style="width:${avg??0}%"></div></div></li>`}).join('');
}
function renderPeople(){
  const list=filteredPeople(),pages=Math.max(1,Math.ceil(list.length/state.pageSize));state.page=Math.min(state.page,pages);
  $('#people-count').textContent=list.length;
  $$('.status-filters button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.status===state.status)));
  const visible=list.slice((state.page-1)*state.pageSize,state.page*state.pageSize);
  $('#people-list').innerHTML=visible.map(p=>`<li><div class="person-main">${avatar(p)}<div><strong>${p.name}</strong><small>${p.role}</small></div></div><span class="person-department">${p.dept}</span><span class="person-score${p.score===null?' no-score':''}" aria-label="${p.score===null?'ยังไม่มีคะแนน':'คะแนนเบื้องต้น '+p.score+' จาก 100'}">${p.score??'—'}<small>คะแนนเบื้องต้น</small></span><span class="person-status">${badge(p)}</span><span class="person-action"><button type="button" data-person="${p.id}" aria-label="ดูรายละเอียด ${p.name}">ดูรายละเอียด</button></span></li>`).join('');
  $('#people-empty').hidden=Boolean(list.length);$('#previous').disabled=state.page===1;$('#next').disabled=state.page>=pages;$('#page-number').textContent=`${state.page} / ${pages}`;
  $('#page-description').textContent=list.length?`แสดง ${(state.page-1)*state.pageSize+1}–${Math.min(state.page*state.pageSize,list.length)} จาก ${list.length} คน`:'ไม่พบผลลัพธ์';
}
function renderGoals(){
  const all=scopedGoals().filter(g=>g.progress<50).sort((a,b)=>a.progress-b.progress),goals=state.goalsExpanded?all:all.slice(0,3);
  $('#goals-description').textContent=`ความคืบหน้าต่ำกว่า 50% · แสดง ${goals.length} จาก ${all.length} เป้าหมายในรอบที่เลือก`;
  $('#show-all-goals').hidden=all.length<=3;$('#show-all-goals').textContent=state.goalsExpanded?'แสดง 3 รายการแรก':`ดูทั้งหมด (${all.length})`;
  $('#goal-cards').innerHTML=goals.length?goals.map(g=>{const owner=round().people.find(p=>p.id===g.owner);return `<li class="goal-card"><div class="goal-card-top"><span>${owner.dept}</span><span class="badge pending">ควรติดตาม</span></div><h3>${escapeHTML(g.title)}</h3><p class="goal-owner">ผู้รับผิดชอบ · ${owner.name}</p><div class="goal-bottom"><p class="goal-progress-label"><span>ความคืบหน้า</span><strong>${g.progress}%</strong></p><div class="bar-track" aria-hidden="true"><div class="bar-fill amber" style="width:${g.progress}%"></div></div><button type="button" class="goal-detail-button" data-person="${owner.id}" data-tab="goals">ดูเป้าหมายของ ${owner.name.split(' ')[0]}</button></div></li>`}).join(''):'<li class="goal-card"><h3>ไม่มีเป้าหมายต่ำกว่า 50%</h3><p class="goal-owner">ในฝ่ายและรอบที่เลือก</p></li>';
}
function renderAll(){renderSummary();renderPeople();renderGoals()}
const dialog=$('#detail-dialog');
function rememberForm(){const form=$('form',dialog);state.formInitial=form?JSON.stringify([...new FormData(form)]):null}
function dirty(){const form=$('form',dialog);return form&&state.formInitial!==null&&JSON.stringify([...new FormData(form)])!==state.formInitial}
function requestClose(){if(state.busy){notify('กำลังบันทึก กรุณารอสักครู่');return}if(dirty()&&!window.confirm('ข้อมูลที่แก้ไขยังไม่ได้บันทึก ต้องการปิดหน้าต่างหรือไม่?'))return;dialog.close()}
function showDialog(title,eyebrow,body,origin){state.origin=origin;$('#dialog-title').textContent=title;$('#dialog-eyebrow').textContent=eyebrow;$('#dialog-body').innerHTML=body;rememberForm();dialog.showModal()}
function activateTab(name,focus=false){
  $$('.detail-tabs button',dialog).forEach(b=>{const active=b.dataset.tab===name;b.setAttribute('aria-selected',String(active));b.tabIndex=active?0:-1;if(active&&focus)b.focus()});
  $$('[role="tabpanel"]',dialog).forEach(panel=>panel.hidden=panel.id!=='panel-'+name);
}
function openPerson(id,tab='summary',origin=null){
  const p=round().people.find(p=>p.id===Number(id));if(!p)return;state.selected=p.id;
  const goals=round().goals.filter(g=>g.owner===p.id),avg=goals.length?Math.round(goals.reduce((s,g)=>s+g.progress,0)/goals.length):0;
  showDialog(p.name,'ผลงานรายบุคคล',`<div class="detail-meta">${avatar(p)}<span>${p.role} · ${p.dept}</span>${badge(p)}</div><div class="detail-tabs" role="tablist" aria-label="ข้อมูลบุคลากร">${[['summary','ภาพรวม'],['goals','เป้าหมาย'],['review','การประเมิน']].map(([key,label])=>`<button type="button" role="tab" id="tab-${key}" data-tab="${key}" aria-controls="panel-${key}" aria-selected="${key===tab}" tabindex="${key===tab?0:-1}">${label}</button>`).join('')}</div><section role="tabpanel" id="panel-summary" aria-labelledby="tab-summary" ${tab!=='summary'?'hidden':''}><div class="detail-summary"><div><small>คะแนนเบื้องต้น / 100</small><strong>${p.score??'—'}</strong></div><div><small>ความคืบหน้าเป้าหมายเฉลี่ย</small><strong>${avg}%</strong></div></div><p class="detail-note">รอบ ${round().title} · ${round().dates}<br>คะแนนของผู้ที่ยังรอตรวจทานเป็นคะแนนเบื้องต้น สำหรับติดตามผลก่อนปิดรอบ</p></section><section role="tabpanel" id="panel-goals" aria-labelledby="tab-goals" ${tab!=='goals'?'hidden':''}><ul class="detail-goals">${goals.map(g=>`<li><h3>${escapeHTML(g.title)}</h3><p>ความคืบหน้า ${g.progress}% · ${g.progress<50?'ควรพูดคุยเพื่อติดตามอุปสรรค':'ดำเนินการตามแผน'}</p><progress max="100" value="${g.progress}" aria-label="ความคืบหน้า ${escapeHTML(g.title)}"></progress></li>`).join('')||'<li>ยังไม่มีเป้าหมายในรอบนี้</li>'}</ul></section><section role="tabpanel" id="panel-review" aria-labelledby="tab-review" ${tab!=='review'?'hidden':''}><form id="review-form" class="dialog-form" novalidate><label class="form-row">คะแนนการประเมิน (0–100)<input type="number" name="score" id="review-score" min="0" max="100" step="1" value="${p.score??''}" aria-describedby="review-score-help review-error" required><span class="form-help" id="review-score-help">ระบุคะแนนเต็มจำนวนหลังตรวจทานผลในรอบนี้</span></label><label class="form-row">ข้อเสนอแนะเพื่อพัฒนา<textarea name="comment" maxlength="600" placeholder="จุดเด่นและสิ่งที่ควรพัฒนาต่อ…">${escapeHTML(p.comment)}</textarea></label><p class="form-error" id="review-error" role="alert"></p><p class="form-help">ต้นแบบ: บันทึกผลเฉพาะหน้านี้ ข้อมูลเริ่มใหม่เมื่อโหลดซ้ำ</p><div class="form-actions"><button type="button" class="button secondary" data-close>ยกเลิก</button><button type="submit" class="button primary" id="save-review">บันทึกผลการประเมิน</button></div></form></section>`,origin);
  $('#review-form').addEventListener('submit',saveReview);
  if(state.cycle==='q2'){$$('#review-form input, #review-form textarea').forEach(input=>input.disabled=true);$('#save-review').disabled=true;$('#save-review').textContent='รอบนี้ปิดแล้ว';$('#review-score-help').textContent='รอบนี้ปิดแล้ว สามารถดูผลย้อนหลังได้';rememberForm()}
  $$('.detail-tabs button',dialog).forEach(button=>{
    button.addEventListener('click',()=>activateTab(button.dataset.tab));
    button.addEventListener('keydown',event=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;event.preventDefault();const tabs=$$('.detail-tabs button',dialog),i=tabs.indexOf(button);const next=event.key==='Home'?0:event.key==='End'?tabs.length-1:(i+(event.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length;activateTab(tabs[next].dataset.tab,true)})
  });
}
async function saveReview(event){
  event.preventDefault();if(state.busy||state.cycle==='q2')return;const input=$('#review-score'),raw=input.value.trim(),score=Number(raw);
  if(raw===''||!Number.isFinite(score)||score<0||score>100||!Number.isInteger(score)){input.setAttribute('aria-invalid','true');$('#review-error').textContent='กรุณาระบุคะแนนเป็นจำนวนเต็มตั้งแต่ 0 ถึง 100';input.focus();return}
  input.removeAttribute('aria-invalid');$('#review-error').textContent='';state.busy=true;const button=$('#save-review');button.disabled=true;button.textContent='กำลังบันทึก…';$('#review-form').setAttribute('aria-busy','true');
  const id=state.selected,cycle=state.cycle,comment=$('[name="comment"]').value.trim();await new Promise(resolve=>setTimeout(resolve,450));
  const p=rounds[cycle].people.find(p=>p.id===id);p.score=score;p.comment=comment;p.status='reviewed';state.busy=false;state.formInitial=null;renderAll();dialog.close();notify('บันทึกผลการประเมินในต้นแบบแล้ว');
}
function openGoal(origin){
  if(state.cycle==='q2'){notify('รอบนี้ปิดแล้ว กรุณาเลือกรอบปัจจุบัน');return}
  state.selected=null;
  showDialog('เพิ่มเป้าหมาย','เป้าหมายและตัวชี้วัด',`<form id="goal-form" class="dialog-form" novalidate><label class="form-row">ชื่อเป้าหมาย<input name="title" id="goal-title" maxlength="160" aria-describedby="goal-error" required placeholder="เช่น ลดระยะเวลาการตอบกลับลูกค้า"></label><label class="form-row">ผู้รับผิดชอบ<select name="owner">${people().map(p=>`<option value="${p.id}">${p.name} · ${p.dept}</option>`).join('')}</select></label><label class="form-row">ความคืบหน้าเริ่มต้น (%)<input name="progress" id="goal-progress" type="number" min="0" max="100" step="1" value="0" required aria-describedby="goal-error"></label><p class="form-help">เพิ่มในรอบ ${round().title} · ต้นแบบบันทึกเฉพาะหน้านี้</p><p class="form-error" id="goal-error" role="alert"></p><div class="form-actions"><button type="button" class="button secondary" data-close>ยกเลิก</button><button type="submit" class="button primary" id="save-goal">เพิ่มเป้าหมาย</button></div></form>`,origin);
  $('#goal-title').focus();$('#goal-form').addEventListener('submit',saveGoal);
}
async function saveGoal(event){
  event.preventDefault();if(state.busy||state.cycle==='q2')return;const form=event.currentTarget,title=form.elements.title.value.trim(),raw=form.elements.progress.value.trim(),progress=Number(raw);
  $$('#goal-form [aria-invalid]').forEach(el=>el.removeAttribute('aria-invalid'));
  if(!title||title.length>160){$('#goal-error').textContent='กรุณาระบุชื่อเป้าหมายไม่เกิน 160 ตัวอักษร';form.elements.title.setAttribute('aria-invalid','true');form.elements.title.focus();return}
  if(raw===''||!Number.isInteger(progress)||progress<0||progress>100){$('#goal-error').textContent='กรุณาระบุความคืบหน้าเป็นจำนวนเต็มตั้งแต่ 0 ถึง 100';form.elements.progress.setAttribute('aria-invalid','true');form.elements.progress.focus();return}
  const owner=Number(form.elements.owner.value);if(!people().some(p=>p.id===owner)){ $('#goal-error').textContent='กรุณาเลือกผู้รับผิดชอบในฝ่ายที่เลือก';return }
  state.busy=true;$('#save-goal').disabled=true;$('#save-goal').textContent='กำลังบันทึก…';form.setAttribute('aria-busy','true');const selectedRound=round();await new Promise(resolve=>setTimeout(resolve,350));
  selectedRound.goals.push({id:Math.max(...selectedRound.goals.map(g=>g.id))+1,owner,title,progress});state.busy=false;state.formInitial=null;state.goalsExpanded=true;renderAll();dialog.close();notify('เพิ่มเป้าหมายในต้นแบบแล้ว');
}
function cycleInfo(origin){state.selected=null;const list=people();showDialog('รอบการประเมิน','ข้อมูลรอบที่เลือก',`<dl class="round-facts"><div><dt>รอบ</dt><dd>${round().title}</dd></div><div><dt>ช่วงผลงาน</dt><dd>${round().dates}</dd></div><div><dt>กำหนดปิดรอบ</dt><dd>${round().deadline}</dd></div><div><dt>ฝ่าย</dt><dd>${state.dept==='all'?'ทุกฝ่าย':state.dept}</dd></div><div><dt>ประเมินแล้ว</dt><dd>${list.filter(p=>p.status==='reviewed').length} / ${list.length} คน</dd></div></dl><p class="detail-note">ข้อมูลทั้งหมดเป็นตัวอย่างสำหรับทดลอง Dashboard ไม่ใช่ผลการประเมินจริงของบุคลากร</p>`,origin)}
dialog.addEventListener('cancel',event=>{event.preventDefault();requestClose()});
dialog.addEventListener('click',event=>{if(event.target.closest('[data-close]'))requestClose()});
dialog.addEventListener('keydown',event=>{
  if(event.key!=='Tab')return;
  const nodes=$$('button:not(:disabled),input:not(:disabled),select:not(:disabled),textarea:not(:disabled),a[href],[tabindex="0"]',dialog).filter(el=>el.getClientRects().length),first=nodes[0],last=nodes.at(-1);
  if(event.shiftKey&&document.activeElement===first){event.preventDefault();last?.focus()}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first?.focus()}
});
dialog.addEventListener('close',()=>{
  const origin=state.origin;
  if(origin?.isConnected)origin.focus();else if(state.selected){const fallback=$(`#people-list [data-person="${state.selected}"]`);(fallback||$('#search')).focus()}else $('#add-goal').focus();state.formInitial=null;
});
document.addEventListener('click',event=>{const trigger=event.target.closest('[data-person]');if(trigger&&!dialog.contains(trigger))openPerson(trigger.dataset.person,trigger.dataset.tab||'summary',trigger)});
$('#cycle').addEventListener('change',event=>{state.cycle=event.target.value;state.page=1;renderAll()});
$('#department').addEventListener('change',event=>{state.dept=event.target.value;state.page=1;renderAll()});
$('#search').addEventListener('input',event=>{state.query=event.target.value;state.page=1;renderPeople()});
$$('.status-filters button').forEach(button=>button.addEventListener('click',()=>{state.status=button.dataset.status;state.page=1;renderPeople()}));
$('#previous').addEventListener('click',()=>{if(state.page>1){state.page--;renderPeople()}});$('#next').addEventListener('click',()=>{state.page++;renderPeople()});
$('#clear-search').addEventListener('click',()=>{state.query='';state.status='all';state.page=1;$('#search').value='';renderPeople();$('#search').focus()});
$('#show-pending').addEventListener('click',()=>{state.status='pending';state.query='';state.page=1;$('#search').value='';renderPeople();$('#employees').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});$('.status-filters [data-status="pending"]').focus({preventScroll:true})});
$('#add-goal').addEventListener('click',event=>openGoal(event.currentTarget));$('#add-goal-secondary').addEventListener('click',event=>openGoal(event.currentTarget));$('#cycle-info').addEventListener('click',event=>cycleInfo(event.currentTarget));
$('#show-all-goals').addEventListener('click',()=>{state.goalsExpanded=!state.goalsExpanded;renderGoals()});
$('#menu-toggle').addEventListener('click',()=>{const open=$('#sidebar').classList.toggle('open');$('#menu-toggle').setAttribute('aria-expanded',String(open))});
$$('.main-nav a').forEach(link=>link.addEventListener('click',()=>{$$('.main-nav a').forEach(a=>a.removeAttribute('aria-current'));link.setAttribute('aria-current','location');$('#sidebar').classList.remove('open');$('#menu-toggle').setAttribute('aria-expanded','false');const target=$(link.getAttribute('href'));target.setAttribute('tabindex','-1');target.focus({preventScroll:true})}));
$('#export').addEventListener('click',()=>{
  const rows=[['รอบการประเมิน','ชื่อ','ตำแหน่ง','ฝ่าย','คะแนนเบื้องต้น','สถานะ'],...filteredPeople().map(p=>[round().title,p.name,p.role,p.dept,p.score??'',labels[p.status]])];
  const cell=value=>{let s=String(value);if(/^[=+\-@\t\r]/.test(s))s="'"+s;return '"'+s.replace(/"/g,'""')+'"'};
  const blob=new Blob(['\ufeff'+rows.map(row=>row.map(cell).join(',')).join('\r\n')],{type:'text/csv;charset=utf-8'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=`pulse-pms-${state.cycle}-sample.csv`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);notify(`ส่งออกรายงานข้อมูลตัวอย่าง ${rows.length-1} คนแล้ว`);
});
renderAll();
