import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
const host=document.querySelector('#scene'),poster=document.querySelector('#scene-poster'),status=document.querySelector('#scene-status');
const motion=document.querySelector('#motion'),rotate=document.querySelector('#rotate'),reset=document.querySelector('#reset');
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
let renderer,mixer,model,paused=reduced.matches,rotating=false,visible=true,last=0,time=0,angle=0;
function fallback(message){host.dataset.state='fallback';status.textContent=message;poster.hidden=false;renderer?.domElement.remove();[motion,rotate,reset].forEach(b=>b.disabled=true)}
try{
  renderer=new THREE.WebGLRenderer({alpha:true,antialias:true});
  renderer.setPixelRatio(Math.min(devicePixelRatio,innerWidth<700?1.25:1.75));
  renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.25;
  host.append(renderer.domElement);renderer.domElement.setAttribute('aria-hidden','true');
  const scene=new THREE.Scene(),camera=new THREE.OrthographicCamera(-3.8,3.8,3.2,-3.2,.1,100);
  const target=new THREE.Vector3(0,1.2,0);
  // glTF converts Blender Z-up coordinates to Y-up: Blender -Y becomes +Z.
  function cameraView(){camera.position.set(7*Math.cos(angle)+9*Math.sin(angle),7,9*Math.cos(angle)-7*Math.sin(angle));camera.lookAt(target)}
  cameraView();
  scene.add(new THREE.HemisphereLight(0xfff9e8,0x52716a,2.4));
  for(const [pos,power,color] of [[[3,6,4],3,0xffe9ce],[[-4,4,2],2,0xd1e9ff],[[0,4,-4],1,0xdaf3e2]]){const l=new THREE.DirectionalLight(color,power);l.position.set(...pos);scene.add(l)}
  const resize=()=>{const w=host.clientWidth,h=host.clientHeight;renderer.setSize(w,h,false);const half=3.7;camera.left=-half*w/h;camera.right=half*w/h;camera.top=half;camera.bottom=-half;camera.updateProjectionMatrix();if(model)renderer.render(scene,camera)};
  new ResizeObserver(resize).observe(host);resize();
  function updateControls(){motion.setAttribute('aria-pressed',String(paused));motion.textContent=paused?'เล่นการเคลื่อนไหว':'หยุดการเคลื่อนไหว';rotate.setAttribute('aria-pressed',String(rotating));rotate.textContent=rotating?'หยุดหมุนห้อง':'หมุนห้อง';host.dataset.paused=String(paused);host.dataset.rotating=String(rotating)}
  motion.addEventListener('click',()=>{paused=!paused;updateControls()});
  rotate.addEventListener('click',()=>{rotating=!rotating;updateControls()});
  reset.addEventListener('click',()=>{angle=0;rotating=false;cameraView();updateControls();renderer.render(scene,camera)});
  reduced.addEventListener('change',()=>{paused=reduced.matches;rotating=false;updateControls()});
  document.addEventListener('visibilitychange',()=>{last=0});
  new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;last=0}).observe(host);
  renderer.domElement.addEventListener('webglcontextlost',event=>{event.preventDefault();fallback('การแสดงผล 3D หยุดทำงาน แสดงภาพห้องทำงานแทน')});
  const loader=new GLTFLoader();
  const mobileQuality=innerWidth<700;
  host.dataset.quality=mobileQuality?'mobile':'high';
  document.querySelector('#scene-hint').textContent=mobileQuality?'ฉาก 3D สำหรับมือถือ':'ฉาก 3D รายละเอียดสูง';
  loader.load(mobileQuality?'./assets/studio-mobile.glb':'./assets/studio.glb',gltf=>{
    model=gltf.scene;scene.add(model);mixer=new THREE.AnimationMixer(model);
    gltf.animations.forEach(clip=>mixer.clipAction(clip).play());
    host.dataset.clips=String(gltf.animations.length);host.dataset.state='ready';host.dataset.frame='0';
    poster.hidden=true;status.textContent='';[motion,rotate,reset].forEach(b=>b.disabled=false);updateControls();
    renderer.render(scene,camera);
  },event=>{if(event.total)status.textContent=`กำลังโหลดห้องทำงาน ${Math.round(event.loaded/event.total*100)}%`},()=>fallback('โหลดโมเดลไม่สำเร็จ แสดงภาพห้องทำงานแทน'));
  renderer.setAnimationLoop(now=>{
    const delta=last?Math.min((now-last)/1000,.05):0;last=now;
    if(!visible||document.hidden||host.dataset.state!=='ready')return;
    let dirty=false;
    if(!paused){mixer?.update(delta);time+=delta;host.dataset.frame=time.toFixed(3);dirty=true}
    if(rotating){angle+=delta*.23;cameraView();dirty=true}
    if(dirty)renderer.render(scene,camera);
  });
}catch(error){fallback('อุปกรณ์นี้เปิด 3D ไม่ได้ แสดงภาพห้องทำงานแทน');console.warn('Portfolio WebGL unavailable:',error.message)}
