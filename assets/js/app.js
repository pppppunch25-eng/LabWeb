const $ = (s, r=document) => r.querySelector(s);
const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));

const revealEls = $$('.reveal');
const onReveal = () => {
  const h = window.innerHeight || 800;
  revealEls.forEach(el => {
    const top = el.getBoundingClientRect().top;
    if (top < h * 0.88) el.classList.add('active');
  });
};
addEventListener('scroll', onReveal, { passive:true });
addEventListener('load', onReveal);

const clamp = (n, a, b) => Math.max(a, Math.min(b, n));

function setTilt(el, cx, cy) {
  const r = el.getBoundingClientRect();
  const x = (cx - (r.left + r.width/2)) / (r.width/2);
  const y = (cy - (r.top + r.height/2)) / (r.height/2);
  const rx = clamp(-y * 6, -8, 8);
  const ry = clamp(x * 7, -10, 10);
  el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-2px)`;
}

function resetTilt(el){
  el.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0px)';
}

$$('.tilt').forEach(el => {
  el.addEventListener('mousemove', (e) => setTilt(el, e.clientX, e.clientY));
  el.addEventListener('mouseleave', () => resetTilt(el));
  el.addEventListener('touchmove', (e) => {
    const t = e.touches[0];
    if(!t) return;
    setTilt(el, t.clientX, t.clientY);
  }, { passive:true });
  el.addEventListener('touchend', () => resetTilt(el));
});

function setActiveNav(){
  const path = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  $$('.navlinks a').forEach(a => {
    const href = (a.getAttribute('href') || '').toLowerCase();
    if(href === path) a.classList.add('active');
  });
}
setActiveNav();

function toast(msg){
  let t = $('#toast');
  if(!t){
    t = document.createElement('div');
    t.id = 'toast';
    t.className = 'toast';
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(window.__toastTimer);
  window.__toastTimer = setTimeout(()=> t.classList.remove('show'), 2600);
}

function applyFilters(){
  const qEl = $('#q');
  const typeEl = $('#type');
  if(!qEl || !typeEl) return;

  const q = (qEl.value || '').trim().toLowerCase();
  const type = (typeEl.value || 'all').toLowerCase();

  $$('.placeItem').forEach(card => {
    const name = (card.dataset.name || '').toLowerCase();
    const cat = (card.dataset.type || '').toLowerCase();
    const okQ = !q || name.includes(q);
    const okT = type === 'all' || cat === type;
    card.style.display = (okQ && okT) ? '' : 'none';
  });
}

addEventListener('input', (e) => {
  if(e.target && (e.target.id === 'q' || e.target.id === 'type')) applyFilters();
});

addEventListener('click', (e) => {
  const btn = e.target.closest('[data-open]');
  if(!btn) return;
  const go = btn.getAttribute('data-open');
  if(go){
    location.href = go;
  }
});

addEventListener('load', () => {
  const hint = $('#quickHint');
  if(hint){
    setTimeout(()=> toast('พิมพ์ค้นหาได้เลย หรือเลือกหมวด เพื่อให้เว็บช่วยแนะนำจุดเที่ยว + ของกิน'), 550);
  }
});
