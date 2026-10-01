const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const S={biz:null,mats:[]};const save=()=>0;
// nav + mobile bar
const nav=$('.nav'),mb=$('.mbar');addEventListener('scroll',()=>{nav&&nav.classList.toggle('s',scrollY>40);mb&&mb.classList.toggle('on',scrollY>innerHeight*.7)},{passive:true});
// reveals
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('on');io.unobserve(e.target)}}),{threshold:.18});
$$('.rv,.mask,.map').forEach(el=>io.observe(el));
// materials
const M={
 conv:{n:'Catalytic Converters',x:20,y:31,what:'OEM and aftermarket converters removed during exhaust and emissions repairs.',why:'Value depends on the specific unit. Tossed into a mixed bin, it is usually the most under-recovered item in the shop.',how:'Itemized by unit at pickup and documented, so you know what left your building.'},
 rot:{n:'Brake Rotors',x:54,y:30,what:'Worn rotors and drums from routine brake work.',why:'High volume, heavy, and constant. They pile up fast and take floor space.',how:'Staged by pallet or bin and collected on a recurring schedule.'},
 whl:{n:'Aluminum Wheels',x:84,y:28,what:'Damaged, takeoff and replaced alloy wheels.',why:'Clean aluminum is separated from mixed metal instead of being lumped in with it.',how:'Collected separately from ferrous material.'},
 str:{n:'Starters',x:20,y:70,what:'Replaced starter motors.',why:'Cores carry recoverable copper and steel and often go uncounted.',how:'Grouped with cores and collected together.'},
 alt:{n:'Alternators',x:49,y:70,what:'Replaced alternators and charging components.',why:'Small and easy to lose track of, but they add up across a month of repairs.',how:'Collected with your core material.'},
 ac:{n:'AC Compressors',x:81,y:71,what:'Replaced AC compressors from climate repairs.',why:'Heavy units that occupy shelf space long after the job closes.',how:'Picked up with cores on the same visit.'},
 core:{n:'Automotive Cores',x:0,y:0,what:'Non-returnable cores not going back to a supplier.',why:'Cores without a credit path still have recycling value.',how:'Sorted and loaded on scheduled pickups.'},
 mix:{n:'Mixed Automotive Scrap',x:0,y:0,what:'Brackets, exhaust pipe, suspension and general steel.',why:'Clearing it keeps bays and lots clean and safer.',how:'Loaded last, after higher-value items are separated.'}};
const scene=$('.scene'),panel=$('.panel');
function show(k){const m=M[k];if(!panel)return;$$('.hot,.chips button').forEach(b=>b.classList.toggle('on',b.dataset.k===k));$$('.chips button').forEach(b=>b.setAttribute('aria-pressed',b.dataset.k===k));
 panel.dataset.k=k;$('h3',panel).textContent=m.n;$('[data-f=what]',panel).textContent=m.what;$('[data-f=why]',panel).textContent=m.why;$('[data-f=how]',panel).textContent=m.how;syncAdd()}
function syncAdd(){if(!panel)return;const k=panel.dataset.k,b=$('.add',panel),inn=S.mats.includes(k);b.classList.toggle('in',inn);b.firstChild.textContent=inn?'Added to your pickup ':'Add to my pickup ';tray()}
function tray(){const t=$('.tray .list');if(!t)return;t.innerHTML=S.mats.length?S.mats.map(k=>`<span class="pill">${M[k].n}</span>`).join(''):'<span style="color:#8a867d">Nothing selected yet. Tap a material to explore it.</span>'}
if(scene){Object.entries(M).forEach(([k,m])=>{if(m.x){const b=document.createElement('button');b.className='hot';b.dataset.k=k;b.style.left=m.x+'%';b.style.top=m.y+'%';b.setAttribute('aria-label',m.n);b.innerHTML=`<span class="lb">${m.n}</span>`;b.onclick=()=>show(k);scene.appendChild(b)}
 const c=document.createElement('button');c.dataset.k=k;c.textContent=m.n;c.onclick=()=>show(k);$('.chips').appendChild(c)});
 $('.add',panel).onclick=()=>{const k=panel.dataset.k;S.mats=S.mats.includes(k)?S.mats.filter(x=>x!==k):[...S.mats,k];save();syncAdd();syncOpts()};show('conv')}
// business selection
function setBiz(v){S.biz=v;save();$$('[data-biz]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.biz===v))}
$$('[data-biz]').forEach(b=>b.onclick=()=>{setBiz(b.dataset.biz);if(b.closest('.seg'))setTimeout(()=>$('#discover').scrollIntoView({behavior:'smooth'}),350)});
if(S.biz)setBiz(S.biz);
// audit
const qs=$$('.q'),st=$$('.steps i');let qi=0;
function go(i){qi=i;qs.forEach((q,j)=>q.classList.toggle('on',j===i));st.forEach((s,j)=>s.classList.toggle('on',j<=i));$('.nav-q').style.display=i>=qs.length-2?'none':'flex';$('.nav-q .back').style.visibility=i?'visible':'hidden';if(qs[i].dataset.r)result()}
function syncOpts(){$$('[data-mat]').forEach(b=>b.setAttribute('aria-pressed',S.mats.includes(b.dataset.mat)))}
if(qs.length){$$('[data-mat]').forEach(b=>b.onclick=()=>{const k=b.dataset.mat;S.mats=S.mats.includes(k)?S.mats.filter(x=>x!==k):[...S.mats,k];save();syncOpts();syncAdd()});syncOpts();
 const r=$('#bays'),o=$('#baysOut');r.oninput=()=>o.textContent=r.value+(r.value==20?'+':'');
 $$('[data-cur]').forEach(b=>b.onclick=()=>{$$('[data-cur]').forEach(x=>x.setAttribute('aria-pressed',x===b));S.cur=b.dataset.cur;save()});
 $('.nav-q .next').onclick=()=>go(Math.min(qi+1,qs.length-1));$('.nav-q .back').onclick=()=>go(Math.max(qi-1,0));
 $('.upl input').onchange=e=>$('.upl span').textContent=e.target.files.length+' photo(s) attached';
 $('#leadForm').onsubmit=e=>{e.preventDefault();go(qs.length-1)};go(0)}
function result(){const bays=+$('#bays').value,cur=S.cur||'mixed';const all=['conv','rot','whl','str','alt','ac','core','mix'];
 const typical={dealer:all,shop:['conv','rot','whl','str','alt','core','mix'],tire:['conv','rot','whl','mix'],group:all,recycler:all}[S.biz||'shop'];
 let score=Math.min(96,Math.round(28+bays*2.2+(cur==='none'?26:cur==='mixed'?18:cur==='irregular'?10:2)+(typical.length-S.mats.length)*3));
 const c=$('.dial .fg'),L=2*Math.PI*60;c.style.strokeDasharray=L;c.style.strokeDashoffset=L;requestAnimationFrame(()=>setTimeout(()=>c.style.strokeDashoffset=L*(1-score/100),60));
 let n=0;const t=$('.dial text'),iv=setInterval(()=>{n+=2;t.textContent=Math.min(n,score);if(n>=score)clearInterval(iv)},18);
 $('.lk').innerHTML=typical.map(k=>{const on=S.mats.includes(k);return `<li><span>${M[k].n}</span><span class="${on?'':'hi'}">${on?'In your pickup':'Likely overlooked'}</span></li>`}).join('');
 $('#rsum').textContent=score>66?'High opportunity. Your shop likely generates material that is not being separated or collected on a schedule.':score>40?'Moderate opportunity. A few streams are likely leaving without being counted.':'Well managed. A scheduled pickup may still save time and floor space.'}
// map points
$$('.map .pt').forEach(p=>p.onclick=()=>{$('#mapInfo').innerHTML=`<b>${p.dataset.n}</b><br>${p.dataset.d}`});
// cycle pin
const stps=$$('.cycle .stp');if(stps.length){const imgs=$$('.cycle .pin img'),ct=$('.cycle .ct');const o2=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){const i=+e.target.dataset.i;imgs.forEach((im,j)=>im.classList.toggle('on',j===+e.target.dataset.img));ct.textContent='0'+(i+1)}}),{threshold:.55});stps.forEach(s=>o2.observe(s))}
