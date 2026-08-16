
/* nav shadow */
const nav=document.getElementById('nav');
if(nav)addEventListener('scroll',()=>nav.classList.toggle('scrolled',scrollY>10),{passive:true});

/* reveal on scroll */
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('on');io.unobserve(e.target)}}),{threshold:.12});
document.querySelectorAll('.rv').forEach(el=>io.observe(el));

/* animated counters */
const cio=new IntersectionObserver(es=>es.forEach(e=>{
  if(!e.isIntersecting)return;cio.unobserve(e.target);
  const el=e.target,t=parseFloat(el.dataset.target),d=parseInt(el.dataset.decimals||0),
  pre=el.dataset.prefix||'',suf=el.dataset.suffix||'';
  const t0=performance.now();
  (function step(now){const p=Math.min((now-t0)/1400,1),v=(t*(1-Math.pow(1-p,3))).toFixed(d);
  el.textContent=pre+v+suf;if(p<1)requestAnimationFrame(step)})(t0);
}),{threshold:.6});
document.querySelectorAll('.stat .num').forEach(el=>cio.observe(el));

/* hero 3D card mouse-follow */
const c3=document.getElementById('card3d');
if(matchMedia('(pointer:fine)').matches&&c3){
  const scene=c3.parentElement;
  scene.addEventListener('mousemove',ev=>{
    const r=scene.getBoundingClientRect(),
    x=(ev.clientX-r.left)/r.width-.5,y=(ev.clientY-r.top)/r.height-.5;
    c3.style.transform=`rotateY(${x*22}deg) rotateX(${-y*18}deg)`;
  });
  scene.addEventListener('mouseleave',()=>c3.style.transform='rotateY(-8deg) rotateX(6deg)');
  c3.style.transform='rotateY(-8deg) rotateX(6deg)';
}

/* tilt cards */
document.querySelectorAll('.tilt').forEach(card=>{
  if(!matchMedia('(pointer:fine)').matches)return;
  card.addEventListener('mousemove',ev=>{
    const r=card.getBoundingClientRect(),
    x=(ev.clientX-r.left)/r.width-.5,y=(ev.clientY-r.top)/r.height-.5;
    card.style.transform=`perspective(900px) rotateY(${x*10}deg) rotateX(${-y*8}deg) translateY(-4px)`;
  });
  card.addEventListener('mouseleave',()=>card.style.transform='');
});

/* comparison tabs */
document.querySelectorAll('.tab').forEach(t=>t.addEventListener('click',()=>{
  document.querySelectorAll('.tab').forEach(x=>x.classList.remove('active'));
  document.querySelectorAll('.pane').forEach(x=>x.classList.remove('show'));
  t.classList.add('active');
  document.getElementById(t.dataset.pane).classList.add('show');
  document.querySelectorAll('#'+t.dataset.pane+' .rv').forEach(el=>el.classList.add('on'));
}));

/* marquee duplicate for seamless loop */
const mq=document.getElementById('mqtrack');
if(mq)mq.innerHTML+=mq.innerHTML;

/* subtle particle grid */
const cv=document.getElementById('grid-canvas');
if(!cv)return;
const ctx=cv.getContext('2d');
let W,H,pts=[];
function resize(){W=cv.width=innerWidth;H=cv.height=innerHeight;
  pts=Array.from({length:Math.min(70,W/22)},()=>({
    x:Math.random()*W,y:Math.random()*H,
    vx:(Math.random()-.5)*.35,vy:(Math.random()-.5)*.35,r:Math.random()*1.6+.4}))}
resize();addEventListener('resize',resize);
(function loop(){
  if(!cv.isConnected)return;
  ctx.clearRect(0,0,W,H);
  for(const p of pts){
    p.x+=p.vx;p.y+=p.vy;
    if(p.x<0||p.x>W)p.vx*=-1;if(p.y<0||p.y>H)p.vy*=-1;
    ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,7);ctx.fillStyle='rgba(250,196,35,.35)';ctx.fill();
  }
  for(let i=0;i<pts.length;i++)for(let j=i+1;j<pts.length;j++){
    const a=pts[i],b=pts[j],dx=a.x-b.x,dy=a.y-b.y,d=dx*dx+dy*dy;
    if(d<130*130){ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);
    ctx.strokeStyle=`rgba(221,129,39,${.14*(1-d/16900)})`;ctx.lineWidth=.6;ctx.stroke()}
  }
  requestAnimationFrame(loop);
})();

/* FAQ accordion */
document.querySelectorAll('.faq-q').forEach(function(q){
  q.addEventListener('click',function(){
    var item=q.parentElement,ans=item.querySelector('.faq-a'),open=item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(function(o){
      o.classList.remove('open');o.querySelector('.faq-a').style.maxHeight='';
      o.querySelector('.faq-q').setAttribute('aria-expanded','false');
    });
    if(!open){item.classList.add('open');ans.style.maxHeight=ans.scrollHeight+'px';q.setAttribute('aria-expanded','true');}
  });
});

/* billing cycle toggle */
(function(){
  var wrap=document.getElementById('bill-toggle');
  if(!wrap)return;
  function apply(cycle){
    document.querySelectorAll('.bt').forEach(function(b){b.classList.toggle('active',b.dataset.cycle===cycle)});
    document.querySelectorAll('.price[data-monthly]').forEach(function(el){
      var note=el.dataset[cycle==='annual'?'noteAnnual':'noteMonthly']||'';
      el.innerHTML=(el.dataset[cycle]||'')+(note?' <small>'+note+'</small>':'');
    });
    document.querySelectorAll('.price-sub[data-monthly],.cyc[data-monthly]').forEach(function(el){
      el.textContent=el.dataset[cycle]||el.textContent;
    });
  }
  wrap.querySelectorAll('.bt').forEach(function(b){
    b.addEventListener('click',function(){apply(b.dataset.cycle)});
  });
})();

/* ============ DATA-DRIVEN RENDER (source: src/pricing/pricing-data.ts) ============ */
(function(){
  var D=window.NOQOODY_PRICING;
  if(!D)return;
  var PLANS=D.PLANS,ROWS=D.COMPARE_ROWS,E=D.ESTIMATOR;

  /* ---- analytics ---- */
  function track(event,params){
    var payload=Object.assign({page:'pricing'},params||{});
    try{if(typeof window.gtag==='function')window.gtag('event',event,payload);}catch(e){}
    try{(window.dataLayer=window.dataLayer||[]).push(Object.assign({event:event},payload));}catch(e){}
    try{if(window.posthog&&window.posthog.capture)window.posthog.capture(event,payload);}catch(e){}
    try{(window.NOQOODY_EVENTS=window.NOQOODY_EVENTS||[]).push({event:event,params:payload,ts:Date.now()});}catch(e){}
    if(window.NOQOODY_DEBUG_ANALYTICS)console.log('[analytics]',event,payload);
  }
  window.noqoodyTrack=track;
  document.addEventListener('click',function(ev){
    var el=ev.target&&ev.target.closest?ev.target.closest('[data-track]'):null;
    if(!el)return;
    track('cta_click',{cta:el.getAttribute('data-track'),location:el.getAttribute('data-loc')||'',plan:el.getAttribute('data-plan')||'',label:(el.textContent||'').trim().slice(0,60),href:el.getAttribute('href')||''});
  },true);

  /* ---- plan cards ---- */
  var cards=document.getElementById('plan-cards');
  if(cards){
    cards.innerHTML=PLANS.map(function(p){
      return '<div class="pcard tilt rv on">'+
        '<span class="tag '+p.tagClass+'">'+p.tag+'</span>'+
        '<div class="icon">'+p.icon+'</div>'+
        '<h3>'+p.name+'</h3>'+
        '<p class="desc">'+p.desc+'</p>'+
        '<div class="price'+(p.feeMonthly===0&&p.priceMonthly==='QR 0'?' free':'')+'" data-monthly="'+p.priceMonthly+'" data-annual="'+p.priceAnnual+'" data-note-monthly="'+p.noteMonthly+'" data-note-annual="'+p.noteAnnual+'">'+p.priceMonthly+' <small>'+p.noteMonthly+'</small></div>'+
        '<div class="price-sub" data-monthly="'+p.subMonthly+'" data-annual="'+p.subAnnual+'">'+p.subMonthly+'</div>'+
        '<ul>'+p.features.map(function(f){return '<li>'+f+'</li>'}).join('')+'</ul>'+
        '<a class="btn '+p.ctaStyle+' card-cta" href="'+p.ctaHref+'"'+(/^https?:/.test(p.ctaHref)?' target="_blank" rel="noopener"':'')+' data-track="plan_cta" data-loc="plan-card" data-plan="'+p.id+'">'+p.ctaLabel+'</a></div>';
    }).join('');
  }

  /* ---- comparison table ---- */
  var head=document.getElementById('plan-cmp-head'),body=document.getElementById('plan-cmp-body');
  if(head&&body){
    head.innerHTML='<th>Feature</th>'+PLANS.map(function(p,i){
      return '<th'+(i===1?' class="col-nq"':'')+'>'+p.name+'<br><small style="'+(i===1?'':'color:var(--muted);')+'font-weight:400">'+p.priceMonthly+' '+p.noteMonthly+'</small></th>';
    }).join('');
    body.innerHTML=ROWS.map(function(r){
      var c=r.cls||{},cy=r.cycle||{};
      function cell(key,val,isNq){
        var cls=[isNq?'col-nq':'',c[key]||'',cy[key+'Annual']?'cyc':''].filter(Boolean).join(' ');
        var attrs=cy[key+'Annual']?' data-monthly="'+val+'" data-annual="'+cy[key+'Annual']+'"':'';
        return '<td'+(cls?' class="'+cls+'"':'')+attrs+'>'+val+'</td>';
      }
      return '<tr data-group="'+(r.group||'features')+'"><td>'+r.label+'</td>'+cell('starter',r.starter,false)+cell('business',r.business,true)+cell('enterprise',r.enterprise,false)+'</tr>';
    }).join('');
  }

  /* ---- currency / VAT footnote ---- */
  if(D.PRICING_NOTE){
    ['pricing-note-estimator','pricing-note-compare','pricing-note-plans'].forEach(function(id){
      var n=document.getElementById(id);if(n)n.textContent=D.PRICING_NOTE;
    });
  }

  /* ---- estimator ---- */
  var A=D.ADDONS||{softPos:{monthly:50,annualPerMonth:45}};
  var vol=document.getElementById('est-volume'),tik=document.getElementById('est-ticket'),
      ch=document.getElementById('est-channel'),ter=document.getElementById('est-terminals'),
      sp=document.getElementById('est-softpos'),
      cr=document.getElementById('est-credit'),crv=document.getElementById('est-credit-val'),
      out=document.getElementById('est-result');
  function qr(n){return 'QR '+n.toLocaleString('en-US',{maximumFractionDigits:0,minimumFractionDigits:0})}
  function cycle(){var b=document.querySelector('#bill-toggle .bt.active');return b&&b.dataset.cycle==='annual'?'annual':'monthly'}
  function planById(id){for(var i=0;i<PLANS.length;i++)if(PLANS[i].id===id)return PLANS[i];return PLANS[0]}
  function estimate(){
    if(!out)return;
    var volume=Math.max(0,parseFloat(vol.value)||0),
        ticket=Math.max(1,parseFloat(tik.value)||1),
        channel=ch.value,
        terminals=channel==='online'?0:Math.max(0,parseInt(ter.value,10)||0),
        softpos=channel==='online'?0:Math.max(0,parseInt(sp&&sp.value,10)||0),
        creditShare=(parseInt(cr.value,10)||0)/100;
    if(crv)crv.textContent=(creditShare*100).toFixed(0)+'%';
    var annual=cycle()==='annual';
    var txns=Math.round(volume/ticket);
    var id=volume>=E.enterpriseVolume?'enterprise':(terminals>0||channel!=='online')?'business':'starter';
    if(channel==='online'&&volume<E.enterpriseVolume)id='starter';
    var plan=planById(id);
    var blended=plan.rates.debit*(1-creditShare)+plan.rates.credit*creditShare;
    var mdr=volume*blended+txns*plan.rates.fixed;
    var planRate=annual?plan.feeAnnualPerMonth:plan.feeMonthly;
    var fee=planRate*(plan.posIncluded?Math.max(terminals,plan.id==='business'?1:0):0);
    var spRate=annual?A.softPos.annualPerMonth:A.softPos.monthly;
    var spFee=softpos*spRate;
    var total=mdr+fee+spFee;
    var why=id==='enterprise'?'Your volume is above '+qr(E.enterpriseVolume)+' per month, so a negotiated Enterprise rate card will beat the published rates.'
      :id==='business'?'You need in-store acceptance, so Business gives you Smart POS terminals with flat POS rates and daily settlement.'
      :'You collect online only at moderate volume — Starter has no monthly fee, so you only pay per transaction.';
    var cta=plan.ctaHref;
    out.innerHTML='<div class="est-kicker">Recommended plan</div>'+
      '<div class="est-plan">'+plan.name+'</div>'+
      '<div style="color:var(--muted);font-size:14px">'+plan.desc+'</div>'+
      '<ul>'+
        '<li><span>Billing cycle</span><b>'+(annual?'Annual':'Monthly')+'</b></li>'+
        '<li><span>Estimated transactions / month</span><b>'+txns.toLocaleString('en-US')+'</b></li>'+
        '<li><span>Blended processing rate</span><b>'+(blended*100).toFixed(2)+'%'+(plan.rates.fixed?' + QR '+plan.rates.fixed:'')+'</b></li>'+
        '<li><span>Processing fees</span><b>'+qr(mdr)+'</b></li>'+
        '<li><span>Plan fee'+(fee?' ('+Math.max(terminals,1)+' POS)':'')+'</span><b>'+(id==='enterprise'?'Custom':qr(fee))+'</b></li>'+
        (softpos?'<li><span>Soft POS ('+softpos+' licence'+(softpos>1?'s':'')+' × '+qr(spRate)+')</span><b>'+qr(spFee)+'</b></li>':'')+
        '<li class="est-total"><span>Estimated monthly cost</span><b>'+(id==='enterprise'?'Custom quote':qr(total))+'</b></li>'+
      '</ul>'+
      '<p class="est-why">'+why+(terminals>0&&plan.posIncluded?' One-time terminal setup: '+qr(E.posSetupFee*Math.max(terminals,1))+'.':'')+'</p>'+
      '<a class="btn btn-grad" href="'+cta+'"'+(/^https?:/.test(cta)?' target="_blank" rel="noopener"':'')+' data-track="estimator_cta" data-loc="estimator" data-plan="'+plan.id+'">Continue with '+plan.name+'</a>';
  }
  [vol,tik,ch,ter,sp,cr].forEach(function(el){if(el){el.addEventListener('input',estimate);el.addEventListener('change',estimate)}});
  var bt=document.getElementById('bill-toggle');
  if(bt)bt.addEventListener('click',function(){setTimeout(estimate,0)});
  var estimateTracked=false;
  [vol,tik,ch,ter,sp,cr].forEach(function(el){if(el)el.addEventListener('change',function(){if(!estimateTracked){estimateTracked=true;track('estimator_used',{});}})});
  estimate();


  /* ---- PDF download ---- */
  var pdfBtn=document.getElementById('pdf-btn');
  if(pdfBtn)pdfBtn.addEventListener('click',function(){
    if(typeof window.NOQOODY_DOWNLOAD_PDF==='function')window.NOQOODY_DOWNLOAD_PDF();
  });
})();

/* ================= theme toggle (site-wide, persisted) ================= */
(function(){
  var KEY='noqoody-theme';
  var root=document.documentElement;
  function apply(theme){
    root.setAttribute('data-theme',theme);
    root.classList.toggle('dark',theme==='dark');
    var b=document.getElementById('theme-toggle');
    if(b){
      var dark=theme==='dark';
      b.setAttribute('aria-pressed',dark?'true':'false');
      b.setAttribute('aria-label',dark?'Switch to light theme':'Switch to dark theme');
      var ic=b.querySelector('.theme-ic'),lb=b.querySelector('.theme-lbl');
      if(ic)ic.innerHTML=dark
        ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4"/></svg>'
        : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>';
      if(lb)lb.textContent=dark?'Light':'Dark';
    }
  }
  var saved=null;
  try{saved=localStorage.getItem(KEY)}catch(e){}
  apply(saved==='dark'?'dark':'light');
  var btn=document.getElementById('theme-toggle');
  if(btn)btn.addEventListener('click',function(){
    var next=root.getAttribute('data-theme')==='dark'?'light':'dark';
    apply(next);
    try{localStorage.setItem(KEY,next)}catch(e){}
  });
})();

/* ============ contact links: prefilled WhatsApp + email ============ */
(function(){
  var C=(window.NOQOODY_PRICING&&window.NOQOODY_PRICING.CONTACT)||{};
  if(C.whatsapp)document.querySelectorAll('a[data-track="whatsapp"]').forEach(function(a){
    a.setAttribute('href',waHref(C.whatsappNumber||'97433393001',C.whatsappMessage||'',a.getAttribute('data-loc')||'page'));
  });

  if(C.email)document.querySelectorAll('a[data-track="email"]').forEach(function(a){a.setAttribute('href',C.email)});

  var form=document.getElementById('mail-form');
  if(!form)return;
  var input=document.getElementById('contact-email');
  var hint=document.getElementById('mail-hint');
  form.addEventListener('submit',function(ev){
    ev.preventDefault();
    var val=(input&&input.value||'').trim();
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)){
      if(hint){hint.textContent='Please enter a valid email address so we can reply.';hint.classList.add('mail-err')}
      if(input)input.focus();
      return;
    }
    if(hint){hint.classList.remove('mail-err');hint.textContent='Opening your email app — we reply from '+(C.emailAddress||'sales@noqoody.com')+'.'}
    var body=(C.emailBody||'')+'\n\nReply to: '+val;
    var href='mailto:'+(C.emailAddress||'sales@noqoody.com')+'?subject='+encodeURIComponent(C.emailSubject||'Pricing enquiry')+'&body='+encodeURIComponent(body);
    window.location.href=href;
  });
})();

/* ============ WhatsApp: UTM-tagged links + department chooser ============ */
function waHref(number,message,content,source){
  var src=source||'pricing_page';
  var tag='['+src+' · pricing'+(content?' · '+content:'')+']';
  var text=(message||'')+'\n\n'+tag;
  var utm='utm_source='+encodeURIComponent(src)+'&utm_medium=whatsapp&utm_campaign=pricing'+(content?'&utm_content='+encodeURIComponent(content):'');
  return 'https://wa.me/'+number+'?text='+encodeURIComponent(text)+'&'+utm;
}

(function(){
  var C=(window.NOQOODY_PRICING&&window.NOQOODY_PRICING.CONTACT)||{};
  var deps=C.whatsappDepartments||[
    {id:'sales',label:'Sales',desc:'Pricing, quotes and new accounts',number:'97433393001',display:'+974 3339 3001',message:C.whatsappMessage||''},
    {id:'technical',label:'Technical support',desc:'Integrations, terminals and account issues',number:'97433363001',display:'+974 3336 3001',message:''}
  ];
  var open=null;

  function items(){
    return open?Array.prototype.slice.call(open.menu.querySelectorAll('.wa-menu-item,.wa-menu-tel')):[];
  }
  function focusAt(i){
    var list=items();if(!list.length)return;
    var n=(i+list.length)%list.length;
    list[n].focus();
  }
  function close(returnFocus){
    if(!open)return;
    var btn=open.btn;
    if(open.menu&&open.menu.parentNode)open.menu.parentNode.removeChild(open.menu);
    if(btn)btn.setAttribute('aria-expanded','false');
    open=null;
    if(returnFocus&&btn)btn.focus();
  }

  function addQr(box,url,label){
    var fn=window.NOQOODY_QR;
    if(typeof fn!=='function')return;
    fn(url).then(function(src){
      var img=document.createElement('img');
      img.className='wa-qr-img';
      img.src=src;
      img.alt='QR code to open the WhatsApp chat with '+label;
      img.width=84;img.height=84;
      box.appendChild(img);
    }).catch(function(){});
  }

  function build(btn){
    var loc=btn.getAttribute('data-loc')||'page';
    var menu=document.createElement('div');
    menu.className='wa-menu';
    menu.setAttribute('role','menu');
    menu.setAttribute('aria-label','Choose a WhatsApp department');
    menu.innerHTML='<p class="wa-menu-head">Chat with the right team</p>';
    deps.forEach(function(d){
      var row=document.createElement('div');
      row.className='wa-menu-row';
      var a=document.createElement('a');
      a.className='wa-menu-item';
      a.setAttribute('role','menuitem');
      a.target='_blank';a.rel='noopener';
      var href=waHref(d.number,d.message||'',loc+'_'+d.id);
      a.href=href;
      a.setAttribute('data-track','whatsapp');
      a.setAttribute('data-loc',loc+'-'+d.id);
      a.setAttribute('data-plan',d.id);
      a.innerHTML='<span class="wa-menu-label">'+d.label+'</span><span class="wa-menu-desc">'+d.desc+'</span><span class="wa-menu-num">'+(d.display||('+'+d.number))+'</span>';
      var qr=document.createElement('div');
      qr.className='wa-qr';
      qr.setAttribute('aria-hidden','false');
      var cap=document.createElement('span');
      cap.className='wa-qr-cap';
      cap.textContent='Scan';
      qr.appendChild(cap);
      addQr(qr,waHref(d.number,d.message||'',loc+'_'+d.id+'_qr'),d.label);
      row.appendChild(a);
      row.appendChild(qr);
      menu.appendChild(row);
    });
    var tel=document.createElement('a');
    tel.className='wa-menu-tel';
    tel.href='tel:+'+(deps[0]&&deps[0].number||'97433393001');
    tel.textContent='WhatsApp not opening? Call us instead';
    menu.appendChild(tel);
    menu.addEventListener('keydown',function(ev){
      var list=items();var idx=list.indexOf(document.activeElement);
      if(ev.key==='ArrowDown'){ev.preventDefault();focusAt(idx+1)}
      else if(ev.key==='ArrowUp'){ev.preventDefault();focusAt(idx-1)}
      else if(ev.key==='Home'){ev.preventDefault();focusAt(0)}
      else if(ev.key==='End'){ev.preventDefault();focusAt(list.length-1)}
      else if(ev.key==='Tab'){close(false)}
    });
    return menu;
  }

  function openMenu(btn,focusFirst){
    close(false);
    var menu=build(btn);
    var wrap=document.createElement('div');
    wrap.className='wa-menu-wrap';
    wrap.appendChild(menu);
    btn.parentNode.insertBefore(wrap,btn.nextSibling);
    btn.setAttribute('aria-expanded','true');
    open={btn:btn,menu:wrap};
    if(focusFirst)focusAt(0);
  }

  document.querySelectorAll('a[data-wa-menu]').forEach(function(btn){
    btn.addEventListener('click',function(ev){
      ev.preventDefault();
      if(open&&open.btn===btn){close(false);return}
      openMenu(btn,false);
    });
    btn.addEventListener('keydown',function(ev){
      if(ev.key==='ArrowDown'||ev.key==='Enter'||ev.key===' '){
        ev.preventDefault();
        if(open&&open.btn===btn){focusAt(0)}else{openMenu(btn,true)}
      }
    });
  });

  document.addEventListener('click',function(ev){
    if(!open)return;
    if(open.menu.contains(ev.target)||open.btn===ev.target||open.btn.contains(ev.target))return;
    close(false);
  });
  document.addEventListener('keydown',function(ev){if(ev.key==='Escape')close(true)});
})();

/* ============ comparison table: row-detail filter + column toggle ============ */
(function(){
  var table=document.getElementById('plan-cmp');
  if(!table)return;
  var ctl=document.querySelector('.cmp-controls');
  if(!ctl)return;

  function applyRows(f){
    table.querySelectorAll('tbody tr').forEach(function(tr){
      tr.hidden = f!=='all' && tr.getAttribute('data-group')!==f;
    });
  }
  function applyCols(){
    var hidden=[];
    ctl.querySelectorAll('[data-coltoggle]').forEach(function(b){
      if(b.getAttribute('aria-pressed')!=='true')hidden.push(parseInt(b.getAttribute('data-coltoggle'),10));
    });
    table.querySelectorAll('tr').forEach(function(tr){
      Array.prototype.slice.call(tr.children).forEach(function(cell,i){
        cell.hidden = hidden.indexOf(i)>-1;
      });
    });
  }

  ctl.addEventListener('click',function(ev){
    var b=ev.target.closest('button');
    if(!b||!ctl.contains(b))return;
    if(b.hasAttribute('data-rowfilter')){
      ctl.querySelectorAll('[data-rowfilter]').forEach(function(o){
        var on=o===b;o.classList.toggle('active',on);o.setAttribute('aria-pressed',on?'true':'false');
      });
      applyRows(b.getAttribute('data-rowfilter'));
    }else if(b.hasAttribute('data-coltoggle')){
      var pressed=b.getAttribute('aria-pressed')==='true';
      var on=ctl.querySelectorAll('[data-coltoggle][aria-pressed="true"]').length;
      if(pressed&&on<=1)return; /* keep at least one plan column visible */
      b.setAttribute('aria-pressed',pressed?'false':'true');
      b.classList.toggle('active',!pressed);
      applyCols();
    }
  });

  /* re-apply after the table is (re)rendered by the data layer */
  applyRows('all');applyCols();
  new MutationObserver(function(){
    var f=ctl.querySelector('[data-rowfilter].active');
    applyRows(f?f.getAttribute('data-rowfilter'):'all');applyCols();
  }).observe(table.querySelector('tbody'),{childList:true});
})();

/* ============ sticky mobile WhatsApp actions ============ */
(function(){
  var bar=document.getElementById('wa-sticky');
  if(!bar)return;
  var C=(window.NOQOODY_PRICING&&window.NOQOODY_PRICING.CONTACT)||{};
  var deps={};
  (C.whatsappDepartments||[]).forEach(function(d){deps[d.id]=d});
  bar.querySelectorAll('[data-wa-dep]').forEach(function(a){
    var d=deps[a.getAttribute('data-wa-dep')];
    if(!d)return;
    a.setAttribute('href',waHref(d.number,d.message,a.getAttribute('data-loc')));
    a.setAttribute('aria-label',d.label+' on WhatsApp '+d.display);
  });

  var mq=window.matchMedia('(max-width: 820px)');
  var nearContact=false;
  function sync(){
    var show=mq.matches&&!nearContact;
    bar.hidden=!show;
    document.body.classList.toggle('has-wa-sticky',show);
  }
  (mq.addEventListener?mq.addEventListener('change',sync):mq.addListener(sync));

  var contact=document.getElementById('contact');
  if(contact&&'IntersectionObserver' in window){
    new IntersectionObserver(function(es){
      nearContact=es[0].isIntersecting;sync();
    },{threshold:0.15}).observe(contact);
  }
  sync();
})();

/* brand logo: analytics + hover/focus prefetch of the homepage */
(function(){
  var DEST='/';
  var prefetched=false;
  function prefetch(){
    if(prefetched)return;prefetched=true;
    var l=document.createElement('link');l.rel='prefetch';l.href=DEST;l.as='document';
    document.head.appendChild(l);
    try{fetch(DEST,{credentials:'same-origin'})}catch(e){}
  }
  document.querySelectorAll('.brand-logo').forEach(function(a){
    a.addEventListener('mouseenter',prefetch,{passive:true});
    a.addEventListener('focus',prefetch);
    a.addEventListener('touchstart',prefetch,{passive:true});
    a.addEventListener('click',function(){
      window.dataLayer=window.dataLayer||[];
      window.dataLayer.push(['event','logo_click',{
        source_route:location.pathname,
        destination:DEST,
        destination_name:'homepage',
        placement:a.dataset.logoPlacement||'header',
        link_url:location.origin+DEST
      }]);
    });
  });
})();
