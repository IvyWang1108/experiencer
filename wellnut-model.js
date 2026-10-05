/* A procedural, reference-inspired mesh; no external libraries or network required. */
(()=>{
 const canvas=document.querySelector('#wellnut-model');if(!canvas)return;
 const ctx=canvas.getContext('2d'),faces=[];
 const add=(a,b,c,color)=>faces.push({p:[a,b,c],color});
 function sphere(center,size,color){
  const point=(i,j)=>{const a=i*Math.PI/24,b=j*Math.PI*2/40;return [center[0]+size[0]*Math.sin(a)*Math.cos(b),center[1]+size[1]*Math.cos(a),center[2]+size[2]*Math.sin(a)*Math.sin(b)]};
  for(let i=0;i<24;i++)for(let j=0;j<40;j++){const a=point(i,j),b=point(i+1,j),c=point(i+1,j+1),d=point(i,j+1);add(a,b,c,color);add(a,c,d,color)}
 }
 function panel(x,y,w,h,z,color){add([x,y,z],[x+w,y,z],[x+w,y+h,z],color);add([x,y,z],[x+w,y+h,z],[x,y+h,z],color)}
 sphere([0,0,0],[1,1.04,.85],[153,70,38]);
 for(const side of [-1,1]){
  // Smooth bulb-shaped thrusters with rolled lips and hollow exhaust cavities.
  const ring=(t,r,a)=>[side*(.58+t*.12)+r*Math.cos(a),-.74-t*.28+r*Math.sin(a)*.48,-.18+t*.12+r*Math.sin(a)*.88];
  const profile=[];
  for(let k=0;k<=16;k++){const t=k/16;profile.push([t,.12+.085*Math.sin(t*Math.PI*.8)])}
  // A semicircular rolled lip rounds over into the dark inner nozzle.
  for(let k=1;k<=12;k++){const a=k/12*Math.PI;profile.push([1+.11*Math.sin(a),.14+.03*Math.cos(a)])}
  profile.push([.88,.105],[.72,.09],[.62,0]);
  for(let k=0;k<profile.length-1;k++)for(let j=0;j<48;j++){
   const a=j*Math.PI/24,b=(j+1)*Math.PI/24;
   const p=ring(...profile[k],a),q=ring(...profile[k],b),r=ring(...profile[k+1],b),s=ring(...profile[k+1],a);
   const color=k<16?[108,64,43]:k<24?[158,109,76]:k<28?[60,38,29]:[15,13,16];
   add(p,q,r,color);add(p,r,s,color);
  }
 }
 for(const side of [-1,1])for(let i=0;i<18;i++){
  const leaf=t=>{const x=side*(.04+t*1.24),y=1.06+.03*t+.26*t*t,spread=Math.sin(t*Math.PI)*(side===1?.13:.065);return [[x,y,.08],[x,y+spread,-.04],[x,y-spread,.02]]};
  const a=leaf(i/18),b=leaf((i+1)/18);for(let k=1;k<3;k++){add(a[0],a[k],b[k],[139+k*12,157+k*12,125+k*12]);add(a[0],b[k],b[0],[139+k*12,157+k*12,125+k*12])}
 }
 // The raised shell lip and recessed glass are rendered after the body below.
 const yaw=0,pitch=0;
 const rotate=p=>{const x=p[0]*Math.cos(yaw)+p[2]*Math.sin(yaw),z=-p[0]*Math.sin(yaw)+p[2]*Math.cos(yaw);return [x,p[1]*Math.cos(pitch)-z*Math.sin(pitch),p[1]*Math.sin(pitch)+z*Math.cos(pitch)]};
 function draw(){
  const w=canvas.clientWidth,h=canvas.clientHeight,dpr=Math.min(devicePixelRatio||1,2);canvas.width=w*dpr;canvas.height=h*dpr;ctx.scale(dpr,dpr);ctx.clearRect(0,0,w,h);
  const glow=ctx.createRadialGradient(w/2,h*.48,10,w/2,h*.48,w*.5);glow.addColorStop(0,'#d0b5ef22');glow.addColorStop(1,'#d0b5ef00');ctx.fillStyle=glow;ctx.fillRect(0,0,w,h);
  ctx.fillStyle='#0005';ctx.beginPath();ctx.ellipse(w/2,h*.86,w*.22,12,0,0,7);ctx.fill();
  const scale=Math.min(w/3.3,h/3.4);
  faces.map(f=>({...f,p:f.p.map(rotate)})).sort((a,b)=>a.p.reduce((s,p)=>s+p[2],0)-b.p.reduce((s,p)=>s+p[2],0)).forEach(f=>{
   const [a,b,c]=f.p,u=b.map((v,i)=>v-a[i]),v=c.map((n,i)=>n-a[i]),n=[u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]],len=Math.hypot(...n)||1;
   const light=.15+.85*Math.abs((n[0]*-.35+n[1]*.75+n[2]*.55)/len);ctx.fillStyle=`rgb(${f.color.map(c=>Math.round(c*light)).join(',')})`;
   ctx.beginPath();f.p.forEach((p,i)=>{const x=w/2+p[0]*scale,y=h*.53-p[1]*scale;i?ctx.lineTo(x,y):ctx.moveTo(x,y)});ctx.closePath();ctx.fill();
  });
  ctx.save();ctx.translate(w/2,h*.53);ctx.scale(scale,-scale);
  // Warm specular highlight on the curved walnut shell.
  let sheen=ctx.createRadialGradient(-.24,.73,0,-.24,.73,.65);sheen.addColorStop(0,'#ffe6d17a');sheen.addColorStop(.45,'#edaa7820');sheen.addColorStop(1,'#edaa7800');
  ctx.fillStyle=sheen;ctx.beginPath();ctx.ellipse(0,0,1,1.04,0,0,Math.PI*2);ctx.fill();
  let rim=ctx.createLinearGradient(0,-.4,0,.72);rim.addColorStop(0,'#3e2118');rim.addColorStop(.4,'#854026');rim.addColorStop(.88,'#bc7855');rim.addColorStop(1,'#ebad88');
  ctx.fillStyle=rim;ctx.beginPath();ctx.roundRect(-.65,-.36,1.3,1.06,.08);ctx.fill();
  ctx.fillStyle='#251914';ctx.fillRect(-.58,-.29,1.16,.92);
  let glass=ctx.createLinearGradient(0,-.26,0,.60);glass.addColorStop(0,'#06070b');glass.addColorStop(.55,'#02030b');glass.addColorStop(1,'#10101d');ctx.fillStyle=glass;ctx.fillRect(-.55,-.26,1.10,.86);
  ctx.lineWidth=.009;ctx.strokeStyle='#dda77b66';ctx.strokeRect(-.56,-.27,1.12,.88);
  // Blue pixel-style emoticon from the reference: side glance, flat mouth, ear curl.
  ctx.strokeStyle='#777dff';ctx.fillStyle='#9cbbff';ctx.lineWidth=.016;ctx.lineCap='round';ctx.lineJoin='round';ctx.shadowColor='#4e45ff';ctx.shadowBlur=9;
  for(const x of [-.19,.12]){ctx.beginPath();ctx.arc(x,.27,.078,0,Math.PI*2);ctx.fill();ctx.save();ctx.shadowBlur=0;ctx.fillStyle='#030716';ctx.beginPath();ctx.moveTo(x,.27);ctx.arc(x,.27,.080,Math.PI/2,Math.PI);ctx.closePath();ctx.fill();ctx.restore()}
  ctx.beginPath();ctx.moveTo(-.055,.18);ctx.lineTo(.025,.18);ctx.stroke();
  ctx.beginPath();ctx.moveTo(-.45,.30);ctx.bezierCurveTo(-.22,.39,-.28,.18,-.43,.22);ctx.stroke();
  ctx.beginPath();ctx.moveTo(.34,.29);ctx.bezierCurveTo(.18,.45,.37,.55,.44,.41);ctx.bezierCurveTo(.49,.30,.36,.27,.35,.34);ctx.bezierCurveTo(.46,.37,.34,.47,.32,.40);ctx.stroke();
  ctx.beginPath();ctx.moveTo(.32,.24);ctx.quadraticCurveTo(.42,.17,.47,.26);ctx.moveTo(.35,.21);ctx.quadraticCurveTo(.42,.16,.47,.21);ctx.stroke();
  ctx.shadowBlur=0;ctx.strokeStyle='#8d91ff0d';ctx.lineWidth=.004;for(let y=-.24;y<.59;y+=.027){ctx.beginPath();ctx.moveTo(-.54,y);ctx.lineTo(.54,y);ctx.stroke()}
  ctx.restore();
 }
 new ResizeObserver(draw).observe(canvas);draw();
})();
