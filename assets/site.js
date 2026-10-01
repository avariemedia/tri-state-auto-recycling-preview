(()=>{"use strict";
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
document.documentElement.classList.remove('no-js');
const M=window.TS_MATS||{};
/* ---------- persistent pickup ---------- */
const KEY='tsar-pickup-v2';
const store={get(){try{return JSON.parse(localStorage.getItem(KEY))||{mats:[]}}catch(e){return this._m||{mats:[]}}},set(v){this._m=v;try{localStorage.setItem(KEY,JSON.stringify(v))}catch(e){}}};
const P=()=>store.get();
function toggleMat(k,force){const s=P();const has=s.mats.includes(k);const on=force===undefined?!has:force;s.mats=on?[...new Set([...s.mats,k])]:s.mats.filter(x=>x!==k);store.set(s);sync()}
function sync(){const s=P(),n=s.mats.length;
 $$('[data-tray-count]').forEach(e=>e.textContent=n);
 $$('.tray-btn').forEach(e=>e.classList.toggle('has',n>0));
 $$('.add[data-mat]').forEach(b=>{const on=s.mats.includes(b.dataset.mat);b.setAttribute('aria-pressed',on);const l=b.querySelector('.t');if(l)l.textContent=on?'In my pickup':'Add to my pickup'});
 $$('input[name=materials]').forEach(i=>{if(!i.dataset.touched)i.checked=s.mats.includes(i.value)});
 $$('[data-tray-list]').forEach(e=>e.innerHTML=n?s.mats.map(k=>`<span>${(M[k]||{}).n||k}</span>`).join(''):'<em class="mute">Nothing added yet.</em>');
}
document.addEventListener('click',e=>{const b=e.target.closest('.add[data-mat]');if(b){e.preventDefault();toggleMat(b.dataset.mat)}});
/* ---------- header + menu ---------- */
const hdr=$('.hdr'),burger=$('.burger'),menu=$('#mmenu');
if(hdr&&hdr.classList.contains('on-dark')){const f=()=>hdr.classList.toggle('s',scrollY>30);addEventListener('scroll',f,{passive:true});f()}
function setMenu(open){document.body.classList.toggle('menu-open',open);document.body.classList.toggle('lock',open);burger.setAttribute('aria-expanded',open);burger.setAttribute('aria-label',open?'Close menu':'Open menu');menu.setAttribute('aria-hidden',!open);if(open){menu.removeAttribute('inert');setTimeout(()=>menu.querySelector('a').focus(),50)}else{menu.setAttribute('inert','');}}
if(burger&&menu){menu.setAttribute('inert','');burger.addEventListener('click',()=>setMenu(!document.body.classList.contains('menu-open')));
 addEventListener('keydown',e=>{if(e.key==='Escape'&&document.body.classList.contains('menu-open')){setMenu(false);burger.focus()}});
 menu.addEventListener('click',e=>{if(e.target.closest('a'))setMenu(false)});
 matchMedia('(min-width:1081px)').addEventListener('change',m=>{if(m.matches)setMenu(false)})}
/* ---------- reveal ---------- */
const io='IntersectionObserver' in window?new IntersectionObserver(es=>es.forEach(x=>{if(x.isIntersecting){x.target.classList.add('on');io.unobserve(x.target)}}),{threshold:.15}):null;
$$('.rv,.map').forEach(el=>io?io.observe(el):el.classList.add('on'));
/* hero video: only play when motion allowed */
const rm=matchMedia('(prefers-reduced-motion:reduce)').matches;
/* ---------- material explorer (v3) ---------- */
const E=window.TS_EXP||{};const panel=$('.mpanel');let lastT=null;
function show(k,opts={}){const m=E[k];if(!m||!panel)return;panel.dataset.k=k;
 $$('.hot,.mtabs [role=tab]').forEach(b=>{const on=b.dataset.k===k;b.classList.toggle('on',on);b.setAttribute(b.getAttribute('role')==='tab'?'aria-selected':'aria-expanded',on)});
 $('.mp-empty',panel).hidden=true;const bd=$('.mp-body',panel);bd.hidden=false;
 $('h3',bd).textContent=m.n;['what','handle','next'].forEach(f=>$(`[data-f=${f}]`,bd).textContent=m[f]);
 const a=$('.add',bd);a.dataset.mat=m.mat;const l=$('a.tl',bd);l.href=m.url;l.textContent=m.n+' guide';sync();
 if(opts.focus&&matchMedia('(max-width:1080px)').matches){panel.scrollIntoView({block:'nearest',behavior:rm?'auto':'smooth'})}}
function hide(){if(!panel)return;$('.mp-body',panel).hidden=true;$('.mp-empty',panel).hidden=false;delete panel.dataset.k;
 $$('.hot,.mtabs [role=tab]').forEach(b=>{b.classList.remove('on');b.setAttribute(b.getAttribute('role')==='tab'?'aria-selected':'aria-expanded',false)});if(lastT)lastT.focus()}
if(panel){$$('.hot,.mtabs [role=tab]').forEach(b=>{b.addEventListener('click',()=>{lastT=b;show(b.dataset.k,{focus:true})});
  if(b.classList.contains('hot'))b.addEventListener('mouseenter',()=>{if(matchMedia('(hover:hover) and (pointer:fine)').matches)show(b.dataset.k)})});
 $('.mp-close',panel).addEventListener('click',hide);
 panel.addEventListener('keydown',e=>{if(e.key==='Escape'){e.stopPropagation();hide()}});
 show('catalytic-converters')}
/* ---------- prefill business type from ?type= ---------- */
{const qt=new URLSearchParams(location.search).get('type');if(qt){$$('select[name=biz_type]').forEach(s=>{const o=[...s.options].find(o=>o.value===qt);if(o)s.value=qt})}}
/* ---------- library search ---------- */
const ls=$('#libq');if(ls){ls.addEventListener('input',()=>{const q=ls.value.trim().toLowerCase();let n=0;$$('.lib li').forEach(li=>{const hit=!q||li.dataset.s.includes(q);li.hidden=!hit;if(hit)n++});$('#libn').textContent=n+' materials'})}
/* ---------- map ---------- */
$$('.map .pt').forEach(p=>{const f=()=>{$('#mapInfo').innerHTML=`<b>${p.dataset.n}</b><br>${p.dataset.d}`};p.addEventListener('click',f);p.addEventListener('focus',f);p.addEventListener('keydown',e=>{if(e.key==='Enter'){f()}})});
/* ---------- scorecard ---------- */
const sc=$('#scorecard');if(sc){const f=()=>{const t=$$('input',sc).length,c=$$('input:checked',sc).length;$('#scoreN').textContent=c+' / '+t;$('#scoreT').textContent=c>=t-1?'Solid vendor. Keep them.':c>=t/2?'Workable, with gaps worth raising.':'Time to talk to someone else.'};sc.addEventListener('change',f);f()}
$$('[data-print]').forEach(b=>b.addEventListener('click',()=>print()));
/* ---------- multi-step flows ---------- */
$$('form.flow').forEach(form=>{
 const steps=$$('.step',form),prog=$('.prog',form),cnt=$('.stepcount',form),next=$('.next',form),back=$('.back',form);let i=0;
 const real=steps.filter(s=>!s.hasAttribute('data-final')).length;
 if(prog)prog.innerHTML=steps.filter(s=>!s.hasAttribute('data-final')).map(()=>'<i></i>').join('');
 $$('input[name=materials]',form).forEach(x=>x.addEventListener('change',()=>{x.dataset.touched=1;toggleMat(x.value,x.checked)}));
 $$('input[type=file]',form).forEach(inp=>inp.addEventListener('change',()=>{const t=inp.closest('.drop').nextElementSibling;t.innerHTML='';[...inp.files].slice(0,8).forEach(f=>{const im=new Image();im.alt='Selected photo '+f.name;im.src=URL.createObjectURL(f);t.appendChild(im)});const b=inp.closest('.drop').querySelector('b');if(inp.files.length)b.textContent=inp.files.length+' photo'+(inp.files.length>1?'s':'')+' added'}));
 function valid(s){let ok=true;
  $$('[data-req-group]',s).forEach(g=>{const any=$$('input:checked',g).length>0;g.classList.toggle('bad',!any);const e=$('.gerr',g);if(e)e.hidden=any;if(!any)ok=false});
  $$('input[required],select[required]',s).forEach(x=>{const f=x.closest('.fld');const good=x.checkValidity();if(f)f.classList.toggle('bad',!good);if(!good)ok=false});
  if(!ok){const bad=$('.bad input,.bad select',s)||$('.bad',s);bad&&bad.focus&&bad.focus()}
  return ok}
 function go(n){i=n;steps.forEach((s,j)=>s.classList.toggle('on',j===i));const s=steps[i];
  if(prog)$$('i',prog).forEach((x,j)=>x.classList.toggle('on',j<=i));
  if(cnt)cnt.textContent=s.hasAttribute('data-final')?'Done':`Step ${Math.min(i+1,real)} of ${real}`;
  back.hidden=i===0||s.hasAttribute('data-final');
  const last=s.hasAttribute('data-submit');next.textContent=last?(form.dataset.submitLabel||'Send request'):(s.dataset.next||'Continue');
  $('.fnav',form).hidden=s.hasAttribute('data-final');
  if(s.dataset.build==='vol')buildVol(form,s);
  {const sm=$('[data-summary]',s);if(sm)summary(form,sm);}
  if(s.hasAttribute('data-result'))auditResult(form,s);
  const h=$('legend,.q',s);if(h&&n>0){h.setAttribute('tabindex','-1');h.focus({preventScroll:true})}
  if(n>0)form.scrollIntoView({behavior:rm?'auto':'smooth',block:'start'})}
 next.addEventListener('click',async()=>{const s=steps[i];if(!valid(s))return;
  if(s.hasAttribute('data-submit')){next.disabled=true;const lbl=next.textContent;next.textContent='Sending…';await submit(form);next.disabled=false;next.textContent=lbl;go(steps.findIndex(x=>x.hasAttribute('data-final')));return}
  go(i+1)});
 back.addEventListener('click',()=>go(Math.max(0,i-1)));
 form.addEventListener('submit',e=>{e.preventDefault();next.click()});
 form.addEventListener('keydown',e=>{if(e.key==='Enter'&&e.target.tagName==='INPUT'&&e.target.type!=='submit'){e.preventDefault();next.click()}});
 sync();go(0)});
function fd(form){const o={};new FormData(form).forEach((v,k)=>{if(v instanceof File){if(v.size){(o[k]=o[k]||[]).push(v.name)}return}if(o[k]!==undefined){o[k]=[].concat(o[k],v)}else o[k]=v});return o}
/* ---------- lead delivery ---------- */
const T0=Date.now();
try{const q=new URLSearchParams(location.search),u=JSON.parse(sessionStorage.getItem('ts-utm')||'{}');let ch=false;['utm_source','utm_medium','utm_campaign'].forEach(k=>{if(q.get(k)){u[k]=q.get(k);ch=true}});if(ch)sessionStorage.setItem('ts-utm',JSON.stringify(u));if(!sessionStorage.getItem('ts-ref'))sessionStorage.setItem('ts-ref',document.referrer&&!document.referrer.includes(location.host)?document.referrer:'(direct)')}catch(e){}
function shrink(file){return new Promise(res=>{if(!/^image\//.test(file.type)){res(null);return}const img=new Image(),url=URL.createObjectURL(file);
 img.onload=()=>{const k=Math.min(1,1600/Math.max(img.width,img.height)),c=document.createElement('canvas');c.width=Math.round(img.width*k);c.height=Math.round(img.height*k);c.getContext('2d').drawImage(img,0,0,c.width,c.height);URL.revokeObjectURL(url);res({name:file.name.replace(/\.[^.]+$/,'')+'.jpg',data:c.toDataURL('image/jpeg',.75)})};
 img.onerror=()=>{URL.revokeObjectURL(url);res(null)};img.src=url})}
function payload(form,d){const mats=[].concat(d.materials||[]);
 const p={form:form.dataset.form,page:location.pathname,referrer:sessionStorage.getItem('ts-ref')||'',elapsed_ms:Date.now()-T0,hp:d.hp||'',
  name:d.name,business:d.business,phone:d.phone,email:d.email,contact_pref:d.contact_pref,zip:d.zip,biz_type:d.biz_type,timing:d.timing,description:d.description,
  units:d.units,conv_type:d.conv_type,serial:[].concat(d.serial||[]).filter(Boolean).join(', '),
  materials_summary:mats.map(k=>((M[k]||{}).n||k)+(d['vol_'+k]?' — '+d['vol_'+k]:'')).join('\n'),
  shop_profile:[['Bays',d.bays],['Locations',d.locations],['Handling now',d.handling],['Pickup frequency',d.frequency],['Biggest frustration',d.frustration]].filter(x=>x[1]).map(x=>x[0]+': '+[].concat(x[1]).join(', ')).join('\n'),
  photo_count:(d.photos||[]).length};
 try{Object.assign(p,JSON.parse(sessionStorage.getItem('ts-utm')||'{}'))}catch(e){}
 return p}
async function submit(form){const d=fd(form);const ep=form.dataset.endpoint;let state='preview',id='';
 if(ep){const p=payload(form,d);
  const files=$$('input[type=file]',form).flatMap(i=>[...i.files]).slice(0,8);
  p.photos=(await Promise.all(files.map(shrink))).filter(Boolean);
  try{const ctl=new AbortController(),to=setTimeout(()=>ctl.abort(),25000);
   const r=await fetch(ep,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify(p),signal:ctl.signal});clearTimeout(to);
   const j=await r.json().catch(()=>({}));state=j.ok?'ok':'fail';id=j.id||''}catch(e){state='fail'}
  if(window.gtag&&state==='ok')gtag('event','generate_lead',{form_name:form.dataset.form})}
 else{window.TS_LAST_SUBMISSION=d}
 $$('.sent-ok,.sent-fail,.sent-preview',form).forEach(x=>x.hidden=!x.classList.contains('sent-'+state));
 const t=$('[data-ticket-id]',form);if(t)t.textContent=id||('TS-'+Date.now().toString(36).toUpperCase().slice(-6))}
const VOL=['A few pieces','A bin or pallet','Pickup-truck load','Several loads'];
function buildVol(form,s){const box=$('.vol',s);const mats=$$('input[name=materials]:checked',form).map(x=>x.value);const prev=fd(form);
 box.innerHTML=mats.length?mats.map(k=>`<div class="vrow" data-req-group><b>${(M[k]||{}).n||k}</b><div class="opts">${VOL.map(v=>`<label class="opt"><input type="radio" name="vol_${k}" value="${v}" ${prev['vol_'+k]===v?'checked':''}><span>${v}</span></label>`).join('')}</div></div>`).join(''):'<p class="mute">Go back and choose at least one material.</p>'}
function summary(form,s){const d=fd(form);const mats=[].concat(d.materials||[]);
 const rows=[['Materials',mats.map(k=>`${(M[k]||{}).n||k}${d['vol_'+k]?' — '+d['vol_'+k]:''}`).join('<br>')||'—'],['Photos',(d.photos||[]).length?(d.photos.length+' attached'):'None'],['Business',[d.business,d.biz_type].filter(Boolean).join(' · ')||'—'],['ZIP',d.zip||'—'],['Timing',d.timing||'—']];
 $('dl',s).innerHTML=rows.map(r=>`<dt>${r[0]}</dt><dd>${r[1]}</dd>`).join('')}
/* ---------- audit result (no dollar figures) ---------- */
function auditResult(form,s){const d=fd(form);const mats=[].concat(d.materials||[]);const bays=d.bays||'4–6',locs=d.locations||'1',hand=d.handling||'',freq=d.frequency||'',pain=d.frustration||'',biz=d.biz_type||'';
 const all=['catalytic-converters','brake-rotors','aluminum-wheels','starters','alternators','ac-compressors','automotive-cores','batteries'];
 const typical={'Dealership':all,'Dealer group':all,'Independent repair shop':['catalytic-converters','brake-rotors','aluminum-wheels','starters','alternators','ac-compressors','automotive-cores'],'Tire / exhaust shop':['catalytic-converters','brake-rotors','aluminum-wheels'],'Other automotive business':all}[biz]||all;
 const missing=typical.filter(k=>!mats.includes(k));
 const big=['11–20','20+'].includes(bays),small=['1–3','4–6'].includes(bays),multi=locs!=='1';
 const cad=big?'Weekly or set-day pickups are a realistic starting point.':small?'Most shops this size start with on-call pickups and move to a set schedule once volume is clear.':'Every two to four weeks is a common starting point to discuss.';
 const stage=small?'One marked corner: converters on a shelf or in a tote (not loose), rotors on one pallet, cores in a bin. Nothing more complicated.':'Separate staging by stream — converters secured and tagged, rotors and drums palletized, wheels racked, cores binned — so a pickup is a load-out, not a sort.';
 const cons=(hand.includes('More than one')||hand.includes('Whoever'))?'You are splitting material across buyers. One scheduled pickup with itemized converters is easier to reconcile.':hand.includes('dumpster')?'Material is going out with general trash or mixed metal. Separating converters, wheels and cores is the first, easiest step.':'Your handling is already structured. The question is reliability and documentation.';
 const nextS=multi?'Talk through a multi-location schedule: one contact, pickups coordinated by store.':pain.includes('space')?'Book a first pickup to clear the backlog, then set a cadence.':'Send photos of what is sitting there now. We will tell you what is worth separating.';
 const rows=[['Worth evaluating',missing.length?`<ul>${missing.map(k=>`<li><a href="${M[k].url}">${M[k].n}</a> — ${M[k].short}</li>`).join('')}</ul>`:'You are already setting aside the main streams for your type of business.'],
  ['Consolidation',cons],['Staging',stage],['Likely cadence',cad],['Multi-location',multi?`With ${locs} locations, a single coordinated program avoids each store negotiating its own buyer.`:'Single location — keep it simple.'],['Next step',nextS]];
 $('.res-out',s).innerHTML=rows.map(r=>`<section><h3>${r[0]}</h3><div>${r[1]}</div></section>`).join('');
 const sc=$('[data-audit-score]',s);if(sc)sc.textContent=missing.length?missing.length+' stream'+(missing.length>1?'s':'')+' worth a closer look':'Well organized'}
sync();
})();
