'use strict';
const packages = {
  glow: {title:'Glow Starter',price:'฿1,990 / 1 ครั้ง',description:'ตัวอย่างแพ็กเกจเริ่มต้น สำหรับผู้ที่อยากทำความเข้าใจกิจวัตรและดูแลความชุ่มชื้น',items:['พูดคุยเรื่องผิวและกิจวัตรเดิม','ดูแลผิวพื้นฐานตามการประเมิน','คำแนะนำสำหรับดูแลต่อที่บ้าน']},
  clear: {title:'Clear & Calm',price:'฿3,490 / 2 ครั้ง',description:'ตัวอย่างเส้นทางพูดคุยเรื่องสิว เพื่อประเมินก่อนเลือกวิธีดูแล ไม่ใช่คำแนะนำรักษาสิวเฉพาะบุคคล',items:['ประเมินความกังวลและประวัติการดูแล','วางแนวทางร่วมกับผู้ประกอบวิชาชีพ','นัดติดตามเพื่อทบทวนแผน']},
  ritual: {title:'Skin Ritual',price:'฿5,900 / 3 ครั้ง',description:'ตัวอย่างแพ็กเกจดูแลต่อเนื่อง สำหรับผู้ที่อยากมี routine และนัดทบทวนการดูแล',items:['ทบทวนกิจวัตรและความต้องการ','ดูแลความชุ่มชื้นตามแผน','ติดตามและปรับแผนแต่ละครั้ง']}
};
const cases = {
  dry:{title:'วันยุ่ง ๆ ก็มีเวลาดูแลตัวเอง',service:'Glow Starter',intro:'สถานการณ์สมมติ: คนทำงานอายุ 30 ปี รู้สึกผิวแห้งหลังอยู่ในห้องปรับอากาศ และต้องการ routine ที่ทำตามได้',items:['เริ่มต้น: พูดคุยกิจวัตรและความกังวล','การประเมิน: ให้ผู้ประกอบวิชาชีพประเมินก่อนเลือกบริการ','แนวทางตัวอย่าง: เริ่มจากการดูแลพื้นฐานและนัดทบทวน'],note:'ไม่มีภาพก่อน–หลัง และไม่มีการรับรองผลลัพธ์'},
  acne:{title:'เข้าใจผิว ก่อนเลือกการดูแล',service:'Clear & Calm',intro:'สถานการณ์สมมติ: ผู้ใหญ่อายุ 25 ปี กังวลเรื่องสิวและเปลี่ยนผลิตภัณฑ์หลายครั้ง ต้องการรู้ว่าควรเริ่มจากจุดใด',items:['เริ่มต้น: รวบรวมกิจวัตรและผลิตภัณฑ์ที่ใช้','การประเมิน: ปรึกษาผู้ประกอบวิชาชีพเรื่องอาการและทางเลือก','แนวทางตัวอย่าง: วางแผนตามการประเมินและนัดติดตาม'],note:'ไม่ใช่การวินิจฉัยหรือคำแนะนำรักษาสิว'},
  routine:{title:'สร้าง routine ที่เข้ากับชีวิต',service:'Skin Ritual',intro:'สถานการณ์สมมติ: คนทำงานอายุ 35 ปี อยากดูแลตัวเองต่อเนื่อง และชอบแผนที่ไม่ซับซ้อน',items:['เริ่มต้น: พูดคุยเรื่องเวลาและเป้าหมายการดูแล','การประเมิน: ทบทวนความเหมาะสมของแผนกับผู้ประกอบวิชาชีพ','แนวทางตัวอย่าง: ทดลองกิจวัตรพื้นฐานและทบทวนในแต่ละนัด'],note:'ตัวอย่างแผน ไม่ใช่ผลลัพธ์ของผู้รับบริการจริง'}
};
const booking = document.querySelector('#booking-dialog');
const detail = document.querySelector('#detail-dialog');
const form = document.querySelector('#booking-form');
const nameField = document.querySelector('#booking-name');
const dateField = document.querySelector('#booking-date');
const result = document.querySelector('#form-result');
let opener;
let detailService = 'ปรึกษาเบื้องต้น';
const today = new Date();
const dateMin = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;
dateField.min = dateMin;
function openBooking(service, trigger) {
  opener = trigger;
  for (const radio of form.elements.service) radio.checked = radio.value === service;
  booking.showModal();
  nameField.focus();
}
document.querySelectorAll('[data-book]').forEach(button=>button.addEventListener('click',()=>openBooking(button.dataset.book,button)));
function addParagraph(text){const p=document.createElement('p');p.textContent=text;document.querySelector('#detail-content').append(p)}
function openDetail(data, isCase, trigger){
  opener=trigger;
  document.querySelector('#detail-kicker').textContent=isCase?'ILLUSTRATIVE CASE · เคสจำลอง':'DEMO PACKAGE · ราคาแสดงตัวอย่าง';
  document.querySelector('#detail-title').textContent=data.title;
  document.querySelector('#detail-content').replaceChildren();
  addParagraph(isCase?data.intro:data.price);
  if(!isCase)addParagraph(data.description);
  const ul=document.createElement('ul');
  data.items.forEach(text=>{const li=document.createElement('li');li.textContent=text;ul.append(li)});
  document.querySelector('#detail-content').append(ul);
  addParagraph(isCase?data.note:'ราคาและบริการเป็นข้อมูลสมมติ ไม่รวมยาและหัตถการ ต้องประเมินก่อนรับบริการจริง');
  detailService=isCase?data.service:data.title;
  detail.showModal();
  detail.querySelector('[data-close]').focus();
}
document.querySelectorAll('[data-package]').forEach(button=>button.addEventListener('click',()=>openDetail(packages[button.dataset.package],false,button)));
document.querySelectorAll('[data-case]').forEach(button=>button.addEventListener('click',()=>openDetail(cases[button.dataset.case],true,button)));
document.querySelector('#detail-book').addEventListener('click',()=>{const original=opener;detail.close();openBooking(detailService,original)});
for(const dialog of [booking,detail]){
  dialog.querySelector('[data-close]').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('keydown',event=>{
    if(event.key!=='Tab')return;
    const targets=Array.from(dialog.querySelectorAll('button:not(:disabled),input:not(:disabled),a[href]')).filter(element=>element.getClientRects().length&&(element.type!=='radio'||element.checked));
    const first=targets[0],last=targets.at(-1);
    if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus()}
    else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus()}
  });
  dialog.addEventListener('close',()=>{
    if(dialog===booking){form.reset();result.textContent='';for(const field of [nameField,dateField])field.removeAttribute('aria-invalid');document.querySelector('#name-error').textContent='';document.querySelector('#date-error').textContent=''}
    if(!booking.open&&!detail.open)opener?.focus();
  });
}
document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{
  document.querySelectorAll('[data-filter]').forEach(item=>item.setAttribute('aria-pressed',String(item===button)));
  let count=0;
  document.querySelectorAll('[data-category]').forEach(card=>{card.hidden=button.dataset.filter!=='all'&&card.dataset.category!==button.dataset.filter;if(!card.hidden)count++});
  document.querySelector('#filter-status').textContent=`แสดง ${count} แพ็กเกจ`;
}));
const menuButton=document.querySelector('.menu-toggle');
const navigation=document.querySelector('#navigation');
function closeMenu(){navigation.classList.remove('open');menuButton.setAttribute('aria-expanded','false')}
menuButton.addEventListener('click',()=>{const open=menuButton.getAttribute('aria-expanded')!=='true';menuButton.setAttribute('aria-expanded',String(open));navigation.classList.toggle('open',open)});
navigation.querySelectorAll('a').forEach(link=>link.addEventListener('click',closeMenu));
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&menuButton.getAttribute('aria-expanded')==='true'){closeMenu();menuButton.focus()}});
function setError(field,message,target){field.setAttribute('aria-invalid',String(Boolean(message)));document.querySelector(target).textContent=message}
form.addEventListener('submit',event=>{
  event.preventDefault();
  result.textContent='';
  const nameError=nameField.value.trim()?'':'กรอกชื่อสมมติเพื่อทดลองนัดหมาย';
  const dateError=!dateField.value?'เลือกวันที่ต้องการ':dateField.value<dateMin?'เลือกวันนี้หรือวันถัดไป':'';
  setError(nameField,nameError,'#name-error');setError(dateField,dateError,'#date-error');
  if(nameError||dateError){(nameError?nameField:dateField).focus();return}
  result.textContent=`ทดลองสำเร็จ: ${nameField.value.trim()} สนใจ ${form.elements.service.value} วันที่ ${dateField.value} · ไม่มีการส่งข้อมูลและยังไม่ใช่การยืนยันนัดหมาย`;
});
