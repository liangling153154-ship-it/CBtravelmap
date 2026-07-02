// itinerary-v2-app.js — UI logic for v2 mobile-first planner

// ── STATE ─────────────────────────────────────────────────
let days = [[]];
let activeItinId = null;
let filter = 'all';
let editMode = false;
let catEditMode = false;
let catOverrides = {};
let dragItem = null;
let sheetTarget = null;  // {kind:'add', spotId} | {kind:'manage', dayIdx, stopIdx}

// ── ROUTE CHAIN HELPERS ───────────────────────────────────
// Day N starts from where Day N-1 ended (overnight), not always from home.

function planDayStart(plan, di){
  if(di === 0) return 'home';
  const prev = plan[di - 1];
  if(!prev || prev.length === 0) return 'home';
  return prev[prev.length - 1];
}
function planDayKm(plan, di){
  const day = plan[di];
  if(!day || day.length === 0) return 0;
  let total = getKm(planDayStart(plan, di), day[0]);
  for(let i = 0; i < day.length - 1; i++){
    total += getKm(day[i], day[i + 1]);
  }
  return total;
}
function planTotalKm(plan){
  let total = 0;
  for(let di = 0; di < plan.length; di++) total += planDayKm(plan, di);
  return total;
}
// Convenience wrappers bound to the current `days` state
function dayStartId(di){ return planDayStart(days, di); }
function chainedDayKm(di){ return planDayKm(days, di); }

// Stays-nearby lookup for a given day's last stop
function stayInfoForDay(day){
  if(!day || day.length === 0) return null;
  const lastId = day[day.length - 1];
  if(lastId === 'home') return null;
  const lastSp = spotById(lastId);
  if(!lastSp) return null;
  const list = (typeof SPOT_STAYS !== 'undefined') ? SPOT_STAYS[lastId] : null;
  if(!list || !list.length) return null;
  return {spot: lastSp, list};
}

// ── INIT ──────────────────────────────────────────────────
function init(){
  // Inject roads SVG
  document.getElementById('roads-slot').outerHTML = ROADS_SVG;

  // Try loading the map image silently — no console error if missing
  const mapImg = new Image();
  mapImg.onload = () => {
    const NS = 'http://www.w3.org/2000/svg';
    const img = document.createElementNS(NS, 'image');
    img.setAttribute('href', 'images/caobang_map.jpg');
    img.setAttribute('x', '0'); img.setAttribute('y', '0');
    img.setAttribute('width', '900'); img.setAttribute('height', '600');
    img.setAttribute('preserveAspectRatio', 'none');
    const slot = document.getElementById('map-img-slot');
    if(slot) slot.appendChild(img);
  };
  mapImg.src = 'images/caobang_map.jpg';
  applyCatOverrides();
  buildItinPicker();
  buildFilter();
  // Default: load first suggested itinerary
  loadItinerary(ITINERARIES[0]);
  setupMapInteractions();
  setupSheet();
  setupFsMap();
  render();
}

// ── SUGGESTED ITINERARIES ─────────────────────────────────
function buildItinPicker(){
  const rail = document.getElementById('itin-rail');
  rail.innerHTML = '';
  ITINERARIES.forEach(it=>{
    const stops = it.plan.flat().length;
    const km = planTotalKm(it.plan);
    const card = document.createElement('div');
    card.className = 'itin-card';
    card.dataset.id = it.id;
    card.innerHTML = `
      <div class="itin-cover" data-ph="${it.cover}">
        <img loading="lazy" src="${it.cover}" alt="${it.title}" onerror="this.setAttribute('data-broken','1')">
        <span class="itin-badge">${it.pace}</span>
        <div class="itin-cover-foot">
          <div class="days-big">${it.days}<small>${it.days===1?'day':'days'}</small></div>
          <div class="vibe">${it.vibe}</div>
        </div>
      </div>
      <div class="itin-body">
        <h3>${it.title.split('·')[1]?.trim() || it.title}</h3>
        <p>${it.subtitle}</p>
        <div class="itin-meta">
          <span>${stops} stops</span>
          <span>~${Math.round(km)} km</span>
        </div>
      </div>`;
    card.onclick = ()=> loadItinerary(it);
    rail.appendChild(card);
  });
}

function loadItinerary(it){
  days = it.plan.map(d=>d.slice());
  activeItinId = it.id;
  document.getElementById('banner-title').textContent = it.title;
  document.getElementById('banner-sub').textContent = it.subtitle;
  // Scroll the planner into view smoothly
  const planner = document.getElementById('planner');
  if(planner) planner.scrollIntoView({behavior:'smooth', block:'start'});
  render();
}

// ── CATEGORY EDITOR ───────────────────────────────────────
function applyCatOverrides(){
  catOverrides = JSON.parse(localStorage.getItem('catOverrides') || '{}');
  LIBRARY.forEach(s=>{ if(catOverrides[s.id]) s.cat = catOverrides[s.id]; });
}
function toggleCatEdit(){
  catEditMode = !catEditMode;
  const btn = document.getElementById('cat-edit-btn');
  if(btn) btn.classList.toggle('active', catEditMode);
  buildLibrary();
}
function setCatOverride(id, catId){
  catOverrides[id] = catId;
  localStorage.setItem('catOverrides', JSON.stringify(catOverrides));
  const sp = LIBRARY.find(l=>l.id===id);
  if(sp) sp.cat = catId;
  buildLibrary();
}

// ── FILTER ────────────────────────────────────────────────
function buildFilter(){
  const el = document.getElementById('lib-filter');
  el.innerHTML = '';
  CATS.forEach(c=>{
    const btn = document.createElement('button');
    btn.className = 'chip' + (c.id==='all'?' on':'');
    btn.dataset.cat = c.id;
    btn.style.setProperty('--chip-bg', c.bg);
    btn.style.setProperty('--chip-txt', c.txt);
    btn.innerHTML = `<span class="chip-ico">${c.emoji}</span><span class="chip-lbl">${c.label}</span>`;
    btn.onclick = ()=>{
      filter = c.id;
      el.querySelectorAll('.chip').forEach(b=>b.classList.remove('on'));
      btn.classList.add('on');
      buildLibrary();
    };
    el.appendChild(btn);
  });
}

function buildLibrary(){
  const el = document.getElementById('lib-grid');
  el.innerHTML = '';
  const shown = LIBRARY.filter(s=>{
    if(filter==='stay') return s.cat==='stay' || s.overnight===true;
    if(filter==='east' || filter==='west') return s.region===filter;
    if(filter==='all') return true;
    return s.id!=='home' && (s.cat===filter || s.secondaryCat===filter);
  });
  shown.sort((a,b)=> (b.iconic?1:0) - (a.iconic?1:0));
  shown.forEach(s=>{
    const isHome = s.id==='home';
    const added = days.some(d=>d.includes(s.id));
    const card = document.createElement('div');
    card.className = 'lib-card' + (added?' added':'');
    card.draggable = true;
    const iconicBadge = s.iconic ? `<span class="lib-card-iconic">★ Iconic</span>` : '';
    const tagBadge = !s.iconic && s.tag ? `<span class="lib-card-tag">${s.tag}</span>` : '';
    const badgeHtml = iconicBadge || tagBadge;
    const overnightHtml = s.overnight && s.cat!=='stay' ? `<span class="lib-card-stay">🛖 Stay</span>` : '';
    const catObj = CATS.find(c=>c.id===s.cat);
    const regObj = s.region ? REGIONS[s.region] : null;
    if(regObj) card.style.borderLeft = `3px solid ${regObj.border}`;
    card.innerHTML = `
      <div class="lib-card-img" data-ph="${s.img}">
        <img loading="lazy" src="${s.img}" alt="${s.name}" onerror="this.setAttribute('data-broken','1')">
        ${badgeHtml}
        ${regObj ? `<span class="lib-card-region-img ${s.region}">${regObj.label}</span>` : ''}
        <button class="lib-card-add" aria-label="Add">${added?'✓':'+'}</button>
      </div>
      <div class="lib-card-body">
        <div class="lib-card-name">${s.name}</div>
        <div class="lib-card-meta">
          ${s.km?`${s.km}km · `:''}
          <span class="lib-cat-pill" style="--cpbg:${catObj?catObj.bg:'#eee'};--cptxt:${catObj?catObj.txt:'#333'}">${catObj?catObj.emoji+' '+catObj.label:s.cat}</span>
          ${s.overnight && s.cat!=='stay' ? `<span class="lib-card-stay">🌙 Stay</span>` : ''}
        </div>
      </div>`;
    card.onclick = ()=> openAddSheet(s.id);
    card.ondragstart = e=>{
      dragItem = {id:s.id};
      card.style.opacity = '0.4';
      e.dataTransfer.effectAllowed='copy';
    };
    card.ondragend = ()=>{ card.style.opacity=''; dragItem=null; };
    el.appendChild(card);
  });
}
function capCat(c){
  const cat = CATS.find(x=>x.id===c);
  return cat ? cat.emoji+' '+cat.label : c.charAt(0).toUpperCase()+c.slice(1);
}


// ── BOTTOM SHEET ──────────────────────────────────────────
function setupSheet(){
  document.getElementById('sheet-overlay').onclick = closeSheet;
}
function openAddSheet(spotId){
  const sp = spotById(spotId);
  if(!sp) return;
  sheetTarget = {kind:'add', spotId};
  const inDays = []; days.forEach((d,i)=>{ if(d.includes(spotId)) inDays.push(i); });
  const isAdded = inDays.length > 0;

  document.getElementById('sheet-head-title').textContent = isAdded ? 'In your plan' : 'Add to your trip';
  document.getElementById('sheet-head-sub').textContent  = isAdded ? 'Move it, add to another day, or remove.' : 'Pick a day to add this stop.';

  const body = document.getElementById('sheet-body');
  body.innerHTML = `
    <div class="sheet-detail">
      <img src="${sp.img}" alt="${sp.name}" onerror="this.style.display='none'">
      <div class="sheet-detail-text">
        <h4>${sp.name}</h4>
        <div class="km">${sp.km}km from homestay</div>
        <div class="cat">${capCat(sp.cat)}${sp.iconic?' · <strong style="color:#E8A000">★ Iconic</strong>':sp.tag?` · ${sp.tag}`:''}</div>
        ${sp.maps?`<a class="ml" href="${sp.maps}" target="_blank" rel="noopener">📍 Open in Google Maps</a>`:''}
      </div>
    </div>
    <div class="sheet-section-lab">${isAdded ? 'Currently on' : 'Add to'}</div>
    <div id="sheet-day-list"></div>
    <button class="sheet-add-new" onclick="addToNewDay()">+ Add to a new day</button>
    ${isAdded?`<button class="sheet-remove" onclick="removeFromAll()">Remove from itinerary</button>`:''}
  `;
  const list = document.getElementById('sheet-day-list');
  days.forEach((d,i)=>{
    const isIn = d.includes(spotId);
    const color = DAY_COLORS[i % DAY_COLORS.length];
    const btn = document.createElement('button');
    btn.className = 'sheet-day-btn' + (isIn?' in':'');
    btn.innerHTML = `
      <div class="sw" style="background:${color}">${i+1}</div>
      <div class="info">
        <div class="t">Day ${i+1}</div>
        <div class="s">${d.length} stop${d.length!==1?'s':''}${isIn?' · already here':''}</div>
      </div>
      <span class="ck">✓</span>`;
    btn.onclick = ()=> addToDay(i);
    list.appendChild(btn);
  });
  openSheet();
}
function openSheet(){
  document.getElementById('sheet-overlay').classList.add('open');
  document.getElementById('sheet').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeSheet(){
  document.getElementById('sheet-overlay').classList.remove('open');
  document.getElementById('sheet').classList.remove('open');
  document.body.style.overflow = '';
  sheetTarget = null;
}
function addToDay(di){
  if(!sheetTarget || sheetTarget.kind!=='add') return;
  const id = sheetTarget.spotId;
  // remove from elsewhere first (single occurrence except home)
  if(id !== 'home') days = days.map(d=>d.filter(s=>s!==id));
  days[di].push(id);
  closeSheet();
  toast(`Added to Day ${di+1}`);
  render();
}
function addToNewDay(){
  if(!sheetTarget || sheetTarget.kind!=='add') return;
  const id = sheetTarget.spotId;
  if(id !== 'home') days = days.map(d=>d.filter(s=>s!==id));
  days.push([id]);
  closeSheet();
  toast(`Added to new Day ${days.length}`);
  render();
}
function removeFromAll(){
  if(!sheetTarget || sheetTarget.kind!=='add') return;
  const id = sheetTarget.spotId;
  days = days.map(d=>d.filter(s=>s!==id));
  closeSheet();
  toast('Removed from itinerary');
  render();
}

// ── DAY ACTIONS ───────────────────────────────────────────
function toggleEdit(btn){
  editMode = !editMode;
  document.querySelectorAll('.mode-toggle button').forEach(b=>b.classList.remove('on'));
  btn.classList.add('on');
  renderDays();
}
function toggleDayCollapse(di){
  const block = document.getElementById('day-block-'+di);
  if(block) block.classList.toggle('closed');
}
function addDay(){
  days.push([]);
  toast(`Day ${days.length} added`);
  render();
}
function removeDay(di, ev){
  ev?.stopPropagation();
  if(days.length<=1){ days[0]=[]; render(); return; }
  if(!confirm('Remove this day and all its stops?')) return;
  days.splice(di,1);
  render();
}
function removeStop(di,si,ev){
  ev?.stopPropagation();
  days[di].splice(si,1);
  render();
}
function moveStop(di,si,dir,ev){
  ev?.stopPropagation();
  const ni = si+dir;
  if(ni<0||ni>=days[di].length) return;
  [days[di][si],days[di][ni]]=[days[di][ni],days[di][si]];
  render();
}

// ── DRAG (desktop) ────────────────────────────────────────
function setupDayDrop(el, di){
  el.ondragover = e=>{ e.preventDefault(); el.classList.add('drag-over'); };
  el.ondragleave = ()=>el.classList.remove('drag-over');
  el.ondrop = e=>{
    e.preventDefault();
    el.classList.remove('drag-over');
    if(!dragItem) return;
    if(dragItem.id !== 'home') days = days.map(d=>d.filter(s=>s!==dragItem.id));
    days[di].push(dragItem.id);
    dragItem = null;
    render();
  };
}

// ── RENDER ────────────────────────────────────────────────
function render(){
  renderItinPickerActive();
  renderDays();
  buildLibrary();
  renderMap();
  updateSummary();
  updateWA();
}
function renderItinPickerActive(){
  document.querySelectorAll('.itin-card').forEach(c=>{
    c.classList.toggle('active', c.dataset.id === activeItinId);
  });
}

function renderDays(){
  const wrap = document.getElementById('days-wrap');
  wrap.innerHTML = '';
  days.forEach((day, di)=>{
    const color = DAY_COLORS[di % DAY_COLORS.length];
    const dayKm = chainedDayKm(di);

    const block = document.createElement('div');
    block.className = 'day-block';
    block.id = 'day-block-'+di;
    block.innerHTML = `
      <div class="day-hd" style="background:${color}" onclick="toggleDayCollapse(${di})">
        <div class="dl">
          <span class="dn">Day ${di+1}</span>
          <span class="ds">${day.length} stop${day.length!==1?'s':''} · ~${Math.round(dayKm)}km</span>
        </div>
        <div class="ac">
          ${editMode?`<button class="day-rm" onclick="removeDay(${di}, event)" title="Remove day">✕</button>`:''}
          <span class="day-chev">▾</span>
        </div>
      </div>
      <div class="day-body" id="day-body-${di}"></div>`;
    wrap.appendChild(block);

    const body = block.querySelector('.day-body');
    setupDayDrop(body, di);

    if(day.length===0){
      body.innerHTML = '<div class="empty-day">Tap a destination below to add it</div>';
    } else {
      day.forEach((id,si)=>{
        const sp = spotById(id);
        if(!sp) return;
        const row = document.createElement('div');
        row.className = 'stop-row' + (editMode?' edit-on':'');
        const isLast = si === day.length - 1;
        const isReturnHome = id === 'home' && isLast;
        const isOvernight  = isLast && !isReturnHome;
        if(isOvernight) row.classList.add('overnight');

        const prevId = si === 0 ? dayStartId(di) : day[si - 1];
        const legKm  = Math.round(getKm(prevId, id));
        let legLabel;
        if(si === 0){
          if(prevId === 'home'){
            legLabel = `${legKm}km from homestay`;
          } else {
            const prevSp = spotById(prevId);
            legLabel = `${legKm}km from ${prevSp ? prevSp.name : 'overnight'}`;
          }
        } else {
          legLabel = `${legKm}km from stop ${si}`;
        }

        const metaText = isReturnHome
          ? '↩ Return to homestay'
          : legLabel;
        const overnightBadge = isOvernight
          ? '<span class="overnight-badge">☾ stay</span>'
          : '';

        row.innerHTML = `
          <div class="stop-num" style="background:${isOvernight?'#6B4FB8':color}">${si+1}</div>
          <img loading="lazy" class="stop-thumb" src="${sp.img}" alt="${sp.name}" onerror="this.style.display='none'">
          <div class="stop-text">
            <div class="stop-name">${sp.name}${overnightBadge}</div>
            <div class="stop-meta">${metaText} ${sp.maps?`· <a href="${sp.maps}" target="_blank" rel="noopener" onclick="event.stopPropagation()">📍 Maps</a>`:''}</div>
          </div>
          <div class="stop-acts">
            <button onclick="moveStop(${di},${si},-1,event)" ${si===0?'disabled':''} aria-label="Move up">↑</button>
            <button onclick="moveStop(${di},${si},1,event)" ${si===day.length-1?'disabled':''} aria-label="Move down">↓</button>
            <button onclick="removeStop(${di},${si},event)" aria-label="Remove">✕</button>
          </div>`;
        row.onclick = (e)=>{ if(!e.target.closest('.stop-acts') && !e.target.closest('a')) openAddSheet(id); };
        body.appendChild(row);
      });

      // ── Stays nearby ──
      const stayInfo = stayInfoForDay(day);
      if(stayInfo){
        const stays = document.createElement('div');
        stays.className = 'day-stays';
        stays.innerHTML = `
          <div class="day-stays-hd">☾ Stay nearby · ${stayInfo.spot.name} area</div>
          <ul class="day-stays-list">
            ${stayInfo.list.map(s => `
              <li>
                <span class="s-name">${s.name}</span>
                <span class="s-area">${s.area}</span>
              </li>`).join('')}
          </ul>`;
        body.appendChild(stays);
      }
    }
  });
}

// ── MAP ───────────────────────────────────────────────────
function renderMap(){
  const ghostDots = document.getElementById('ghost-dots');
  const stopPins  = document.getElementById('stop-pins');
  const routePaths= document.getElementById('route-paths');
  const legend    = document.getElementById('map-legend');
  routePaths.innerHTML = '';
  ghostDots.innerHTML = '';
  stopPins.innerHTML  = '';
  legend.innerHTML    = '';

  const NS = 'http://www.w3.org/2000/svg';
  const allSelected = new Set(days.flat());

  // Ghost dots for unselected
  LIBRARY.filter(s=>s.id!=='home' && !allSelected.has(s.id)).forEach(s=>{
    const c = document.createElementNS(NS,'circle');
    c.setAttribute('cx',s.sx); c.setAttribute('cy',s.sy);
    c.setAttribute('r','5'); c.setAttribute('fill','rgba(255,255,255,0.65)');
    c.setAttribute('stroke','rgba(180,180,180,0.7)'); c.setAttribute('stroke-width','1.5');
    ghostDots.appendChild(c);
  });

  // Route polylines removed — pins alone communicate the day grouping clearly enough

  // Numbered pins per day
  days.forEach((day,di)=>{
    const color = DAY_COLORS[di % DAY_COLORS.length];
    day.forEach((id,si)=>{
      const sp = spotById(id);
      if(!sp || sp.id==='home') return;
      const g = document.createElementNS(NS,'g');
      g.style.cursor='pointer';
      const c = document.createElementNS(NS,'circle');
      c.setAttribute('cx',sp.sx); c.setAttribute('cy',sp.sy);
      c.setAttribute('r','12'); c.setAttribute('fill',color);
      c.setAttribute('stroke','white'); c.setAttribute('stroke-width','2.5');
      c.setAttribute('filter','drop-shadow(0 2px 4px rgba(0,0,0,0.3))');
      const t = document.createElementNS(NS,'text');
      t.setAttribute('x',sp.sx); t.setAttribute('y',sp.sy);
      t.setAttribute('text-anchor','middle'); t.setAttribute('dominant-baseline','middle');
      t.setAttribute('font-size','11'); t.setAttribute('fill','white');
      t.setAttribute('font-family','DM Sans'); t.setAttribute('font-weight','800');
      t.setAttribute('pointer-events','none');
      t.textContent = si+1;
      g.appendChild(c); g.appendChild(t);
      g.onclick = ()=> openAddSheet(sp.id);
      stopPins.appendChild(g);
    });
    if(day.length>0){
      const pill = document.createElement('div');
      pill.className = 'day-pill';
      pill.innerHTML = `<div class="sw" style="background:${color}"></div>Day ${di+1} · ${day.length} stop${day.length!==1?'s':''}`;
      legend.appendChild(pill);
    }
  });
}

// ── MAP ZOOM / PAN ────────────────────────────────────────
let vb = {x:0, y:0, w:900, h:600};
const MIN_W = 180, MAX_W = 900;
let mapSvg = null;

function autoZoom(){
  if(window.innerWidth <= 600){
    vb = {x:380, y:80, w:540, h:360};
  } else if(window.innerWidth <= 900){
    vb = {x:380, y:90, w:520, h:347};
  } else {
    vb = {x:300, y:80, w:600, h:400};
  }
  setVB();
}
function setVB(){ if(mapSvg) mapSvg.setAttribute('viewBox',`${vb.x} ${vb.y} ${vb.w} ${vb.h}`); }
function zoom(f, cx, cy){
  cx = cx ?? vb.x + vb.w/2;
  cy = cy ?? vb.y + vb.h/2;
  const nw = Math.max(MIN_W, Math.min(MAX_W, vb.w * f));
  const nh = nw * (600/900);
  vb.x = Math.max(0, Math.min(900-nw, cx - (cx-vb.x)*(nw/vb.w)));
  vb.y = Math.max(0, Math.min(600-nh, cy - (cy-vb.y)*(nh/vb.h)));
  vb.w = nw; vb.h = nh;
  setVB();
}

function setupMapInteractions(){
  mapSvg = document.getElementById('map-svg');
  document.getElementById('mzi').onclick = ()=> zoom(0.6);
  document.getElementById('mzo').onclick = ()=> zoom(1/0.6);
  document.getElementById('mzr').onclick = ()=> autoZoom();

  mapSvg.addEventListener('wheel', e=>{
    e.preventDefault();
    const sr = mapSvg.getBoundingClientRect();
    const mx = (e.clientX-sr.left)/sr.width * vb.w + vb.x;
    const my = (e.clientY-sr.top)/sr.height * vb.h + vb.y;
    zoom(e.deltaY > 0 ? 1.25 : 0.8, mx, my);
  },{passive:false});

  let drag = null;
  mapSvg.addEventListener('mousedown', e=>{ drag={x:e.clientX,y:e.clientY,vbx:vb.x,vby:vb.y}; });
  window.addEventListener('mousemove', e=>{
    if(!drag) return;
    const sr=mapSvg.getBoundingClientRect();
    vb.x=Math.max(0,Math.min(900-vb.w, drag.vbx+(drag.x-e.clientX)/sr.width*vb.w));
    vb.y=Math.max(0,Math.min(600-vb.h, drag.vby+(drag.y-e.clientY)/sr.height*vb.h));
    setVB();
  });
  window.addEventListener('mouseup', ()=>drag=null);

  // Touch — single finger pan + two-finger pinch
  let touch=null, pinch=null;
  mapSvg.addEventListener('touchstart',e=>{
    if(e.touches.length===1){
      const t=e.touches[0];
      touch={x:t.clientX,y:t.clientY,vbx:vb.x,vby:vb.y};
      pinch=null;
    } else if(e.touches.length===2){
      const t1=e.touches[0], t2=e.touches[1];
      const dx=t2.clientX-t1.clientX, dy=t2.clientY-t1.clientY;
      pinch={d:Math.hypot(dx,dy), vbw:vb.w};
      touch=null;
    }
  },{passive:true});
  mapSvg.addEventListener('touchmove',e=>{
    if(touch && e.touches.length===1){
      e.preventDefault();
      const t=e.touches[0],sr=mapSvg.getBoundingClientRect();
      vb.x=Math.max(0,Math.min(900-vb.w,touch.vbx+(touch.x-t.clientX)/sr.width*vb.w));
      vb.y=Math.max(0,Math.min(600-vb.h,touch.vby+(touch.y-t.clientY)/sr.height*vb.h));
      setVB();
    } else if(pinch && e.touches.length===2){
      e.preventDefault();
      const t1=e.touches[0], t2=e.touches[1];
      const dx=t2.clientX-t1.clientX, dy=t2.clientY-t1.clientY;
      const d = Math.hypot(dx,dy);
      const ratio = pinch.d / d;
      const target = Math.max(MIN_W, Math.min(MAX_W, pinch.vbw * ratio));
      zoom(target / vb.w);
    }
  },{passive:false});
  mapSvg.addEventListener('touchend',()=>{ touch=null; pinch=null; },{passive:true});

  autoZoom();
  let resizeT;
  window.addEventListener('resize',()=>{ clearTimeout(resizeT); resizeT=setTimeout(autoZoom,200); });
}

// ── FULLSCREEN MAP ────────────────────────────────────────
function setupFsMap(){
  document.getElementById('mfs').onclick = ()=>{
    document.querySelector('.map-box').classList.add('fs');
    document.body.style.overflow = 'hidden';
    autoZoom();
  };
  document.getElementById('fs-close').onclick = ()=>{
    document.querySelector('.map-box').classList.remove('fs');
    document.body.style.overflow = '';
    autoZoom();
  };
}

// ── SUMMARY ───────────────────────────────────────────────
function updateSummary(){
  const allStops = days.flat();
  const km = planTotalKm(days);
  document.getElementById('s-days').textContent = days.length;
  document.getElementById('s-stops').textContent = allStops.length;
  document.getElementById('s-km').textContent = Math.round(km);
  // Banner stats
  document.getElementById('b-days').textContent = days.length;
  document.getElementById('b-stops').textContent = allStops.length;
  document.getElementById('b-km').textContent = Math.round(km);
}

// ── WHATSAPP ──────────────────────────────────────────────
function updateWA(){
  const km = planTotalKm(days);
  let msg = `Hi Sen! Here's my Cao Bang itinerary draft (${days.length} day${days.length!==1?'s':''}, ~${Math.round(km)}km total):\n\n`;
  days.forEach((day,di)=>{
    msg += `Day ${di+1}:\n`;
    if(day.length===0){ msg += `  (rest day)\n`; }
    day.forEach((id,si)=>{
      const sp = spotById(id);
      msg += `  ${si+1}. ${sp?sp.name:id}\n`;
    });
    msg += '\n';
  });
  msg += `Could you give me a quote? Thanks!`;
  const url = `https://wa.me/84822946888?text=${encodeURIComponent(msg)}`;
  document.getElementById('cta-wa').href = url;
}

// ── TOAST ─────────────────────────────────────────────────
let toastT;
function toast(txt){
  const el = document.getElementById('toast');
  el.textContent = txt;
  el.classList.add('show');
  clearTimeout(toastT);
  toastT = setTimeout(()=>el.classList.remove('show'), 1700);
}

// ── EXPORT AS IMAGE (Canvas API) ─────────────────────────
async function exportItineraryImage(){
  const W = 1080;
  const PAD = 60;
  const ACCENT_W = 10;
  const R = 18;
  const GAP = 14;
  const DAY_HEAD_H = 68;
  const THUMB = 62;
  const STOP_H = 92;
  const HEADER_H = 360;
  const FOOTER_H = 120;
  const BODY_TOP = 44;

  const COLORS = ['#E76F51','#52B788','#F4B860','#84a9d4','#885AB7'];
  const C_BG = '#F8F4E9';
  const C_GREEN = '#2D6A4F';
  const C_ORANGE = '#E76F51';
  const C_TX = '#1a1a1a';
  const C_TM = '#777';
  const C_LINE = 'rgba(45,106,79,0.12)';
  const C_NIGHT = '#6B4FB8';

  // Stays section sizing
  const STAY_HEADER_H = 42;
  const STAY_ROW_H = 30;
  const STAY_PAD_BOTTOM = 14;

  // ── Pre-load stop images ──
  const allIds = [...new Set(days.flat())];
  const imgCache = {};
  await Promise.all(allIds.map(id => {
    const sp = spotById(id);
    if(!sp || !sp.img) return Promise.resolve();
    return new Promise(resolve => {
      const img = new Image();
      img.onload = () => { imgCache[id] = img; resolve(); };
      img.onerror = () => resolve();
      img.src = sp.img;
    });
  }));

  const totalStops = days.reduce((t,d)=>t+d.length, 0);
  const totalKm = Math.round(days.reduce((t,_d,i)=>t+chainedDayKm(i), 0));

  function cardH(day, di){
    let h = DAY_HEAD_H + Math.max(1, day.length)*STOP_H + 20;
    const si = stayInfoForDay(day);
    if(si) h += STAY_HEADER_H + si.list.length*STAY_ROW_H + STAY_PAD_BOTTOM;
    return h;
  }
  const bodyH = days.reduce((t,d,i)=>t+cardH(d,i)+GAP, 0);
  const H = HEADER_H + BODY_TOP + bodyH + FOOTER_H;

  const canvas = document.createElement('canvas');
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext('2d');

  // ── helpers ──
  function rr(x,y,w,h,r,fill,stroke){
    ctx.beginPath(); ctx.roundRect(x,y,w,h,r);
    if(fill){ctx.fillStyle=fill; ctx.fill();}
    if(stroke){ctx.strokeStyle=stroke; ctx.lineWidth=1.5; ctx.stroke();}
  }
  function t(str,x,y,font,color,align='left',maxW){
    ctx.save(); ctx.font=font; ctx.fillStyle=color;
    ctx.textAlign=align; ctx.textBaseline='middle';
    maxW!==undefined ? ctx.fillText(str,x,y,maxW) : ctx.fillText(str,x,y);
    ctx.restore();
  }
  function drawThumb(imgEl, x, y, size){
    ctx.save();
    ctx.beginPath(); ctx.roundRect(x, y, size, size, 10); ctx.clip();
    const ar = imgEl.naturalWidth / imgEl.naturalHeight;
    let sw, sh, ox, oy;
    if(ar > 1){ sh = size; sw = size*ar; ox = x-(sw-size)/2; oy = y; }
    else       { sw = size; sh = size/ar; ox = x; oy = y-(sh-size)/2; }
    ctx.drawImage(imgEl, ox, oy, sw, sh);
    ctx.restore();
  }

  // ── Background ──
  ctx.fillStyle = C_BG;
  ctx.fillRect(0, 0, W, H);

  // ── Header gradient ──
  const hg = ctx.createLinearGradient(0,0,0,HEADER_H);
  hg.addColorStop(0,'#0c1f12'); hg.addColorStop(1,C_GREEN);
  ctx.fillStyle = hg; ctx.fillRect(0,0,W,HEADER_H);

  // Subtle grid dots top-right
  ctx.fillStyle='rgba(255,255,255,0.06)';
  for(let dr=0;dr<5;dr++) for(let dc=0;dc<8;dc++){
    ctx.beginPath(); ctx.arc(W-40-dc*30, 40+dr*30, 5, 0, Math.PI*2); ctx.fill();
  }

  // Brand pill
  const pillTxt = "SEN'S HOMESTAY  ·  CAO BANG, VIETNAM";
  ctx.save();
  ctx.font = '500 19px "DM Sans", system-ui, sans-serif';
  const pillTxtW = ctx.measureText(pillTxt).width;
  ctx.restore();
  const pillPad = 24, pillH2 = 36;
  const pillX = W/2 - (pillTxtW+pillPad*2)/2;
  rr(pillX, 44, pillTxtW+pillPad*2, pillH2, pillH2/2, 'rgba(255,255,255,0.1)', null);
  t(pillTxt, W/2, 44+pillH2/2, '500 19px "DM Sans", system-ui, sans-serif', 'rgba(255,255,255,0.7)', 'center');

  // ── Dynamic title from active itinerary ──
  const activeIt = ITINERARIES.find(it => it.id === activeItinId);
  const rawTitle = activeIt ? activeIt.title : null;
  const titleParts = rawTitle ? rawTitle.split('·') : [];
  const line1 = titleParts.length > 1 ? titleParts[0].trim() : 'My Cao Bang';
  const line2 = titleParts.length > 1 ? titleParts[1].trim() : 'Itinerary';

  t(line1, W/2, 136, 'italic 700 64px "Cormorant Garamond", Georgia, serif', 'white', 'center');
  t(line2, W/2, 204, 'italic 600 64px "Cormorant Garamond", Georgia, serif', '#FFD166', 'center');

  // ── Stats row — improved size & contrast ──
  const statItems = [
    {v: String(days.length), l: 'DAYS'},
    {v: String(totalStops), l: 'STOPS'},
    {v: `~${totalKm}km`, l: 'TOTAL'},
  ];
  const sW=192, sH=60, sGap=18;
  const sStartX = W/2 - (sW*3+sGap*2)/2;
  const sY = HEADER_H - 86;
  statItems.forEach((s,i)=>{
    const sx = sStartX + i*(sW+sGap);
    rr(sx, sY, sW, sH, sH/2, 'rgba(255,255,255,0.16)', null);
    t(s.v, sx+sW/2, sY+21, '700 30px "DM Sans", system-ui, sans-serif', '#FFD166', 'center');
    t(s.l, sx+sW/2, sY+47, '600 15px "DM Sans", system-ui, sans-serif', 'rgba(255,255,255,0.65)', 'center');
  });

  // ── Day cards ──
  let cy = HEADER_H + BODY_TOP;
  days.forEach((day,di)=>{
    const color = COLORS[di % COLORS.length];
    const stops = day.length;
    const cH = cardH(day, di);
    const cX = PAD, cW = W - PAD*2;

    // Card shadow
    ctx.save();
    ctx.shadowColor='rgba(0,0,0,0.08)'; ctx.shadowBlur=20; ctx.shadowOffsetY=5;
    rr(cX, cy, cW, cH, R, 'white', null);
    ctx.restore();

    // Left accent bar
    ctx.save();
    ctx.beginPath(); ctx.roundRect(cX, cy, ACCENT_W, cH, [R,0,0,R]);
    ctx.fillStyle=color; ctx.fill();
    ctx.restore();

    // Day header
    const dhMid = cy + DAY_HEAD_H/2;
    const textX = cX + ACCENT_W + 28;
    t(`Day ${di+1}`, textX, dhMid, `italic 700 38px "Cormorant Garamond", Georgia, serif`, color);
    const dayKm = Math.round(chainedDayKm(di));
    t(`${stops} stop${stops!==1?'s':''}  ·  ~${dayKm}km`, cX+cW-28, dhMid, `400 20px "DM Sans", system-ui, sans-serif`, C_TM, 'right');

    // Divider under day header
    ctx.beginPath();
    ctx.moveTo(cX+ACCENT_W+24, cy+DAY_HEAD_H);
    ctx.lineTo(cX+cW-24, cy+DAY_HEAD_H);
    ctx.strokeStyle=C_LINE; ctx.lineWidth=1; ctx.stroke();

    // Stops
    if(stops===0){
      t('No stops added — browse destinations below', W/2, cy+DAY_HEAD_H+STOP_H/2,
        `italic 21px "DM Sans", system-ui, sans-serif`, '#ccc', 'center');
    } else {
      day.forEach((id,si)=>{
        const sp = spotById(id);
        if(!sp) return;

        const isLastStop  = si === stops - 1;
        const isReturnHome = id === 'home' && isLastStop;
        const isOvernight  = isLastStop && !isReturnHome;
        const circColor = isReturnHome ? C_GREEN : (isOvernight ? C_NIGHT : color);

        const sy = cy + DAY_HEAD_H + si*STOP_H;
        const midY = sy + STOP_H/2;
        const circX = cX + ACCENT_W + 36;
        const thumbX = cX + ACCENT_W + 66;
        const nameX = thumbX + THUMB + 16;

        // Badge on right side (overnight only)
        const badgeW = isOvernight ? 178 : 0;
        const nameMaxW = cW - ACCENT_W - 66 - THUMB - 44 - badgeW;

        // Circle
        ctx.beginPath(); ctx.arc(circX, midY, 19, 0, Math.PI*2);
        ctx.fillStyle = circColor; ctx.fill();
        t(String(si+1), circX, midY, `700 19px "DM Sans", system-ui, sans-serif`, 'white', 'center');

        // Thumbnail
        if(imgCache[id]){
          drawThumb(imgCache[id], thumbX, sy+(STOP_H-THUMB)/2, THUMB);
        } else {
          rr(thumbX, sy+(STOP_H-THUMB)/2, THUMB, THUMB, 10, '#e8e4d9', null);
        }

        // Determine the actual previous location (chains across days)
        const prevId = si === 0 ? dayStartId(di) : day[si - 1];
        const legKm  = Math.round(getKm(prevId, id));

        // Name & sub-label
        if(isReturnHome){
          t('↩ Return to Sen\'s Homestay', nameX, midY-12,
            `600 26px "DM Sans", system-ui, sans-serif`, C_GREEN, 'left', nameMaxW);
          t(`~${legKm}km back to base`, nameX, midY+15,
            `400 19px "DM Sans", system-ui, sans-serif`, C_TM, 'left', nameMaxW);
        } else {
          t(sp.name, nameX, midY-12,
            `600 26px "DM Sans", system-ui, sans-serif`, C_TX, 'left', nameMaxW);
          let legLabel;
          if(si === 0){
            if(prevId === 'home'){
              legLabel = `${legKm}km from homestay`;
            } else {
              const prevSp = spotById(prevId);
              const prevName = prevSp ? prevSp.name : 'overnight stop';
              legLabel = `${legKm}km from ${prevName}`;
            }
          } else {
            legLabel = `${legKm}km from previous stop`;
          }
          t(legLabel, nameX, midY+15,
            `400 19px "DM Sans", system-ui, sans-serif`, C_TM, 'left', nameMaxW);
        }

        // Overnight badge (right side)
        if(isOvernight){
          const bW = 168, bH = 34;
          const bx = cX + cW - 24 - bW;
          const by = midY - bH/2;
          rr(bx, by, bW, bH, bH/2, 'rgba(107,79,184,0.12)', null);
          t('☾  Stay overnight', bx + bW/2, by + bH/2 + 1,
            '600 15px "DM Sans", system-ui, sans-serif', C_NIGHT, 'center');
        }

        // Dashed divider
        if(si<stops-1){
          ctx.save();
          ctx.beginPath();
          ctx.moveTo(thumbX, sy+STOP_H);
          ctx.lineTo(cX+cW-28, sy+STOP_H);
          ctx.strokeStyle=C_LINE; ctx.lineWidth=1;
          ctx.setLineDash([4,7]); ctx.stroke();
          ctx.restore();
        }
      });
    }

    // ── Stays section (under overnight stop) ──
    const stayInfo = stayInfoForDay(day);
    if(stayInfo){
      const stopsBottomY = cy + DAY_HEAD_H + stops*STOP_H;

      // Top divider
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(cX+ACCENT_W+24, stopsBottomY);
      ctx.lineTo(cX+cW-24, stopsBottomY);
      ctx.strokeStyle = C_LINE; ctx.lineWidth = 1; ctx.stroke();
      ctx.restore();

      // Soft tinted background behind stays
      rr(cX+ACCENT_W, stopsBottomY, cW-ACCENT_W, STAY_HEADER_H + stayInfo.list.length*STAY_ROW_H + STAY_PAD_BOTTOM,
        0, 'rgba(107,79,184,0.04)', null);

      // Header line
      const headerY = stopsBottomY + STAY_HEADER_H/2 + 2;
      t(`☾  Stay nearby · ${stayInfo.spot.name} area`, cX+ACCENT_W+28, headerY,
        '700 16px "DM Sans", system-ui, sans-serif', C_NIGHT, 'left');

      // Stay rows
      stayInfo.list.forEach((s, idx) => {
        const ry = stopsBottomY + STAY_HEADER_H + idx*STAY_ROW_H + STAY_ROW_H/2;
        // Bullet dot
        ctx.beginPath(); ctx.arc(cX+ACCENT_W+44, ry, 3, 0, Math.PI*2);
        ctx.fillStyle = C_NIGHT; ctx.fill();
        // Name
        t(s.name, cX+ACCENT_W+58, ry,
          '500 17px "DM Sans", system-ui, sans-serif', C_TX, 'left');
        // Area (right)
        t(s.area, cX+cW-28, ry,
          '400 15px "DM Sans", system-ui, sans-serif', C_TM, 'right');
      });
    }

    cy += cH + GAP;
  });

  // ── Footer ──
  const fy = cy + 24;
  ctx.beginPath(); ctx.moveTo(PAD,fy); ctx.lineTo(W-PAD,fy);
  ctx.strokeStyle='rgba(45,106,79,0.18)'; ctx.lineWidth=1; ctx.stroke();

  t('Send this plan to Sen for a quote', W/2, fy+36, `400 22px "DM Sans", system-ui, sans-serif`, C_TM, 'center');
  t('wa.me/84822946888', W/2, fy+70, `700 32px "DM Sans", system-ui, sans-serif`, C_ORANGE, 'center');
  t("Sen's Homestay · Cao Bang, Vietnam", W/2, fy+100, `400 18px "DM Sans", system-ui, sans-serif`, '#bbb', 'center');

  // ── Download ──
  const link = document.createElement('a');
  link.download = `caobang-itinerary-${days.length}day${days.length!==1?'s':''}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
  toast('Image saved!');
}

if(document.readyState === 'loading'){
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
