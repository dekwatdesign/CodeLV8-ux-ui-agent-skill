// UI stays usable when the independent 3D module fails.
const projects={
  orbit:{title:'Orbit — จัดการงานให้เป็นระบบ',description:'แนวคิดเว็บแอปสำหรับทีมขนาดเล็ก รวมโปรเจค งาน และสถานะไว้ในพื้นที่เดียว ให้ทีมเห็นสิ่งที่ต้องทำต่อได้ทันที',role:'ตัวอย่างบทบาท Full-stack Developer: วิเคราะห์ user flow ออกแบบ component และ API พร้อมวาง schema สำหรับงานและสมาชิก',features:['Dashboard ที่แสดงสถานะและงานเร่งด่วน','เพิ่มและแก้ไขงานผ่าน modal โดยรักษา filter เดิม','ออกแบบสิทธิ์เข้าถึงตามทีม และทดสอบเส้นทางสำคัญ']},
  mellow:{title:'Mellow — ประสบการณ์ร้านค้าออนไลน์',description:'แนวคิดร้านค้าของแต่งบ้านที่เน้นการค้นพบสินค้า ภาพที่ชัดเจน และข้อมูลที่ช่วยตัดสินใจ',role:'ตัวอย่างบทบาท Frontend Developer: วาง responsive layout ออกแบบหน้ารายละเอียดสินค้า และลดขั้นตอนการเลือกซื้อ',features:['ค้นหาและกรองสินค้าได้ทั้งมือถือและ desktop','รองรับ loading, empty และ error states','ให้ความสำคัญกับ keyboard navigation และการโหลดรูปภาพ']}
};
function openDialog(dialog){dialog.showModal()}
document.querySelectorAll('dialog').forEach(dialog=>{
  dialog.querySelectorAll('.close,.close-action').forEach(button=>button.addEventListener('click',()=>dialog.close()));
  dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close()}});
});
document.querySelectorAll('[data-project]').forEach(button=>button.addEventListener('click',()=>{
  const project=projects[button.dataset.project];
  document.querySelector('#dialog-title').textContent=project.title;
  document.querySelector('#dialog-description').textContent=project.description;
  document.querySelector('#dialog-role').textContent=project.role;
  document.querySelector('#dialog-features').replaceChildren(...project.features.map(text=>{const li=document.createElement('li');li.textContent=text;return li}));
  openDialog(document.querySelector('#project-dialog'));
}));
document.querySelector('#contact-open').addEventListener('click',()=>openDialog(document.querySelector('#contact-dialog')));
document.querySelector('#copy-email').addEventListener('click',async()=>{
  const status=document.querySelector('#copy-status');
  try{await navigator.clipboard.writeText('phakin@example.com');status.textContent='คัดลอกอีเมลตัวอย่างแล้ว — เปลี่ยนเป็นอีเมลจริงก่อนใช้งาน'}
  catch{status.textContent='คัดลอกอัตโนมัติไม่ได้ กรุณาเลือกและคัดลอก phakin@example.com'}
});
import('./studio.js').catch(error=>{
  document.querySelector('#scene-status').textContent='เปิด 3D ไม่สำเร็จ แสดงภาพห้องทำงานแทน';
  document.querySelector('#scene').dataset.state='fallback';
  console.warn('Portfolio 3D module unavailable:',error.message);
});
