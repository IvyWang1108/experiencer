(() => {
  const scene = document.querySelector('.universe');
  if (!scene) return;
  const canvas = scene.querySelector('.starfield');
  const ctx = canvas.getContext('2d');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let width = 0, height = 0, frame, visible = true;
  let stars = [], dust = [];
  const pointer = {x:-1000, y:-1000};
  function resize() {
    width = scene.clientWidth; height = scene.clientHeight;
    const ratio = Math.min(devicePixelRatio || 1, 2);
    canvas.width = width * ratio; canvas.height = height * ratio;
    ctx.setTransform(ratio,0,0,ratio,0,0);
    stars = Array.from({length:220}, () => ({x:Math.random()*width,y:Math.random()*height,r:.3+Math.random()*.9,a:.15+Math.random()*.5,phase:Math.random()*6.28}));
    dust = Array.from({length:170}, () => ({x:(Math.random()+Math.random()-1)*340,y:(Math.random()+Math.random()-1)*240,phase:Math.random()*6.28,size:.3+Math.random()*.8}));
    draw(0);
  }
  function draw(time) {
    ctx.clearRect(0,0,width,height);
    for (const s of stars) {
      const distance = Math.hypot(pointer.x-s.x,pointer.y-s.y);
      const glow = Math.max(0,1-distance/110);
      ctx.globalAlpha = Math.min(1,s.a + glow*.6 + (reduced.matches ? 0 : Math.sin(time*.00065+s.phase)*.1));
      ctx.fillStyle = glow > .3 ? '#fff0d9' : '#c8c2df';
      ctx.beginPath();ctx.arc(s.x,s.y,s.r+glow*.9,0,Math.PI*2);ctx.fill();
    }
    const mobile=width<=700, scale=mobile?.64:1;
    for (const d of dust) {
      const phase=d.phase+(reduced.matches?0:time*.0003);
      const drift=reduced.matches?0:Math.sin(phase)*3;
      ctx.globalAlpha=.26+Math.sin(phase)*.12;ctx.fillStyle='#dec6ed';
      ctx.beginPath();ctx.arc(width*.5+d.x*scale+drift,height*(mobile?.52:.54)+d.y*scale,d.size,0,Math.PI*2);ctx.fill();
    }
    ctx.globalAlpha=1;
  }
  function animate(time){draw(time);if(visible&&!reduced.matches)frame=requestAnimationFrame(animate);}
  function restart(){cancelAnimationFrame(frame);if(visible&&!reduced.matches)frame=requestAnimationFrame(animate);else draw(0);}
  scene.addEventListener('pointermove',e=>{const rect=scene.getBoundingClientRect();pointer.x=e.clientX-rect.left;pointer.y=e.clientY-rect.top;if(reduced.matches)draw(0);});
  scene.addEventListener('pointerleave',()=>{pointer.x=pointer.y=-1000;});
  const facts=[...scene.querySelectorAll('.fact-star')];
  facts.forEach(star=>star.addEventListener('click',()=>{
    const open=!star.classList.contains('is-lit');
    facts.forEach(item=>{item.classList.remove('is-lit');item.setAttribute('aria-expanded','false');});
    star.classList.toggle('is-lit',open);star.setAttribute('aria-expanded',String(open));
  }));
  scene.addEventListener('keydown',e=>{if(e.key==='Escape')facts.forEach(s=>{s.classList.remove('is-lit');s.setAttribute('aria-expanded','false');});});
  new ResizeObserver(resize).observe(scene);
  new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;restart();}).observe(scene);
  reduced.addEventListener('change',restart);
  document.addEventListener('visibilitychange',()=>{visible=!document.hidden;restart();});
  resize();restart();
})();
