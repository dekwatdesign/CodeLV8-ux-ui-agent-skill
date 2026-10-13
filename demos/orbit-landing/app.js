'use strict';
const dialog = document.querySelector('#start-dialog');
const form = document.querySelector('#start-form');
let opener;
document.querySelectorAll('[data-start]').forEach(button => button.addEventListener('click', () => {
  opener = button;
  dialog.showModal();
  document.querySelector('#team-name').focus();
}));
document.querySelector('.close-button').addEventListener('click', () => dialog.close());
dialog.addEventListener('close', () => {
  form.reset();
  form.querySelectorAll('input').forEach(input => input.removeAttribute('aria-invalid'));
  form.querySelectorAll('.error').forEach(error => { error.textContent = ''; });
  document.querySelector('#form-result').textContent = '';
  opener?.focus();
});
form.addEventListener('submit', event => {
  event.preventDefault();
  const team = form.elements.team;
  const email = form.elements.email;
  const errors = [
    [team, '#team-error', team.value.trim() ? '' : 'ระบุชื่อทีมเพื่อทดลองสร้าง workspace'],
    [email, '#email-error', email.validity.valid ? '' : 'ระบุอีเมลในรูปแบบ team@example.com']
  ];
  errors.forEach(([input, selector, message]) => {
    document.querySelector(selector).textContent = message;
    input.setAttribute('aria-invalid', String(Boolean(message)));
  });
  const invalid = errors.find(([, , message]) => message);
  document.querySelector('#form-result').textContent = '';
  if (invalid) { invalid[0].focus(); return; }
  document.querySelector('#form-result').textContent = `ตัวอย่าง workspace “${team.value.trim()}” พร้อมแล้ว\nนี่เป็นการสาธิตเท่านั้น ไม่มีการสร้างบัญชีหรือบันทึกข้อมูล`;
});
document.querySelectorAll('[data-billing]').forEach(button => button.addEventListener('click', () => {
  const yearly = button.dataset.billing === 'yearly';
  document.querySelectorAll('[data-billing]').forEach(item => {
    const selected = item === button;
    item.classList.toggle('active', selected);
    item.setAttribute('aria-pressed', String(selected));
  });
  document.querySelector('#team-price').textContent = yearly ? '฿152' : '฿190';
  document.querySelector('#billing-note').textContent = yearly ? 'ชำระ ฿1,824 / คน / ปี · ราคาสาธิต' : 'ชำระรายเดือน · ราคาสาธิต';
}));
document.querySelectorAll('[data-view]').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('[data-view]').forEach(item => {
    const selected = item === button;
    item.classList.toggle('active', selected);
    item.setAttribute('aria-pressed', String(selected));
  });
  document.querySelector('#workspace-items').className = `workspace-items ${button.dataset.view}-view`;
}));
