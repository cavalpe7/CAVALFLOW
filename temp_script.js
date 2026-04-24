
window.onerror = function(msg, url, line) {
  document.getElementById('sys-alerts').innerHTML = `<div style="background:rgba(255,77,109,0.9);color:#fff;padding:8px 12px;border-radius:8px;font-size:11px;font-weight:bold;box-shadow:0 4px 12px rgba(0,0,0,0.5)">Error JS L${line}: ${msg}</div>`;
};

/* ── SUPABASE CONF ────────────────────────────────────── */
const supabaseUrl = 'https://dtijsmjwhysgirosffbp.supabase.co';
const supabaseKey = 'sb_publishable_R2mZ6eTx1WuSMhjvvHT5qw_uB6Mw2JC';
const sbClient = window.supabase.createClient(supabaseUrl, supabaseKey);

/* ── CONSTANTS ────────────────────────────────────────── */
const ISDESK = () => window.innerWidth >= 768;
const PALETTE = ['#f59e0b','#f97316','#ef4444','#ff4d6d','#ec4899','#a855f7','#7c3aed',
                 '#3b82f6','#06c5e0','#00d4aa','#10b981','#84cc16','#94a3b8','#e2e8f0'];

const BANK_PRESETS = [
  {key:'bcp',     name:'BCP',        icon:'🔴',color:'#ef4444',wallets:['Yape'],         currency:'PEN'},
  {key:'bcp-usd', name:'BCP Dólares',icon:'🔴',color:'#fbbf24',wallets:[],               currency:'USD'},
  {key:'bbva',    name:'BBVA',       icon:'🔵',color:'#3b82f6',wallets:['Plin'],         currency:'PEN'},
  {key:'scotia',  name:'Scotiabank', icon:'🌹',color:'#ff4d6d',wallets:[],               currency:'PEN'},
  {key:'inter',   name:'Interbank',  icon:'🟢',color:'#00d4aa',wallets:[],               currency:'PEN'},
  {key:'banbif',  name:'Banbif',     icon:'🟣',color:'#8b5cf6',wallets:[],               currency:'PEN'},
  {key:'yape',    name:'Yape',       icon:'💜',color:'#7c3aed',wallets:[],               currency:'PEN'},
  {key:'plin',    name:'Plin',       icon:'🟩',color:'#10b981',wallets:[],               currency:'PEN'},
  {key:'binance', name:'Binance',    icon:'🟡',color:'#f59e0b',wallets:[],               currency:'USD'},
  {key:'lemon',   name:'Lemon Cash', icon:'🍋',color:'#84cc16',wallets:[],               currency:'USD'},
  {key:'rappi',   name:'Rappi Pay',  icon:'🟠',color:'#f97316',wallets:[],               currency:'PEN'},
  {key:'efectivo',name:'Efectivo',   icon:'💵',color:'#94a3b8',wallets:[],               currency:'PEN'},
];

const DEFAULT_CATS = [
  {id:'food',         name:'Comida',       icon:'🍽️',color:'#f59e0b',type:'expense',budget:300},
  {id:'transport',    name:'Transporte',   icon:'🚌',color:'#3b82f6',type:'expense',budget:150},
  {id:'housing',      name:'Vivienda',     icon:'🏠',color:'#8b5cf6',type:'expense',budget:600},
  {id:'health',       name:'Salud',        icon:'💊',color:'#00d4aa',type:'expense',budget:100},
  {id:'education',    name:'Educación',    icon:'📚',color:'#06c5e0',type:'expense',budget:0},
  {id:'entertainment',name:'Entretenim.',  icon:'🎭',color:'#ff4d6d',type:'expense',budget:100},
  {id:'supermarket',  name:'Supermercado', icon:'🛒',color:'#84cc16',type:'expense',budget:300},
  {id:'clothing',     name:'Ropa',         icon:'👔',color:'#ec4899',type:'expense',budget:0},
  {id:'business',     name:'Negocio',      icon:'💼',color:'#f97316',type:'expense',budget:0},
  {id:'salary',       name:'Sueldo',       icon:'💰',color:'#00d4aa',type:'income', budget:0},
  {id:'freelance',    name:'Freelance',    icon:'💻',color:'#38bdf8',type:'income', budget:0},
  {id:'investment',   name:'Inversiones',  icon:'📈',color:'#a78bfa',type:'income', budget:0},
  {id:'savings',      name:'Ahorros',      icon:'🏦',color:'#fbbf24',type:'income', budget:0},
  {id:'other',        name:'Otros',        icon:'💸',color:'#94a3b8',type:'both',   budget:0},
];

const DEFAULT_BANKS = [
  {id:'bcp',     name:'BCP',       icon:'🔴',color:'#ef4444',type:'bank',  currency:'PEN',wallets:['Yape'],balance:0},
  {id:'bbva',    name:'BBVA',      icon:'🔵',color:'#3b82f6',type:'bank',  currency:'PEN',wallets:['Plin'],balance:0},
  {id:'yape',    name:'Yape',      icon:'💜',color:'#7c3aed',type:'wallet',currency:'PEN',wallets:[],      balance:0},
  {id:'efectivo',name:'Efectivo',  icon:'💵',color:'#94a3b8',type:'cash',  currency:'PEN',wallets:[],      balance:0},
];

const WALLETS_OPTS=['Yape','Plin','Binance','Lemon Cash','Rappi Pay','Tunki','Bim'];
const BANK_TYPE_LABELS={bank:'Banco',wallet:'Billetera Digital',cash:'Efectivo',investment:'Inversión'};

const WA_EXPENSE=['gast','pagu','pag ','compré','cobró','transf','debit'];
const WA_INCOME =['ingres','cobré','recibí','deposit','abonó'];
const CAT_MAP=[
  {r:/almuerzo|comida|cena|desayuno|pizza|restauran|cafe|menú/i,id:'food'},
  {r:/taxi|uber|bus|combi|gasolina|peaje|metro/i,             id:'transport'},
  {r:/alquiler|luz|agua|internet|servicios|renta/i,           id:'housing'},
  {r:/farmacia|botica|médico|doctor|clínica|salud/i,         id:'health'},
  {r:/colegio|universidad|curso|libro|clase/i,               id:'education'},
  {r:/netflix|spotify|cine|juego|serie/i,                   id:'entertainment'},
  {r:/supermercado|tottus|plaza vea|metro|vivanda|wong/i,   id:'supermarket'},
  {r:/ropa|zapato|polo|jean|camisa/i,                       id:'clothing'},
  {r:/negocio|proveedor|factura/i,                          id:'business'},
  {r:/sueldo|salario|quincena|remuner/i,                    id:'salary'},
  {r:/freelance|proyecto|diseño|client|honorario/i,         id:'freelance'},
  {r:/ahorro|guard/i,                                       id:'savings'},
];
const BANK_MAP=[
  {r:/bcp|banco de crédito/i,id:'bcp'},
  {r:/bbva/i,               id:'bbva'},
  {r:/yape/i,               id:'yape'},
  {r:/plin/i,               id:'plin'},
  {r:/scotiabank|scotia/i,  id:'scotia'},
  {r:/interbank|inter\b/i,  id:'inter'},
  {r:/binance/i,            id:'binance'},
  {r:/lemon/i,              id:'lemon'},
  {r:/efectivo|cash/i,      id:'efectivo'},
];

/* ── STATE ────────────────────────────────────────────── */
let S={
  movs:[],cats:[],banks:[],tab:'dashboard',mon:nowYM(),
  fType:'all',fCat:'all',fBank:'all',fCur:'all',fSrch:'',
  eId:null,ctxId:null,
  mType:'expense',mCat:null,mBank:null,mCurrency:'PEN',
  catEditId:null,catColor:'#f59e0b',catType:'expense',
  bankEditId:null,bankColor:'#ef4444',bankWallets:[],bankCurrency:'PEN',bankType:'bank',
  charts:{m:null,c:null,mb:null,cb:null,bk:null},
  waPending:null,sbCollapsed:false,
};

/* ── AUTHENTICATION ───────────────────────────────────── */
async function checkAuth(){
  try{
    const { data, error } = await sbClient.auth.getSession();
    if(error) throw error;
    handleSession(data.session);

    sbClient.auth.onAuthStateChange((event, session) => {
      handleSession(session);
    });
  }catch(e){
    alert('Error al verificar sesión inicial: ' + e.message);
  }
}

function handleSession(session) {
  const isAuth = !!session;
  if(isAuth) {
    document.body.classList.remove('unauth');
    if(S.movs.length === 0) load();
  } else {
    document.body.classList.add('unauth');
    S.movs=[]; S.cats=[]; S.banks=[]; S.tab='dashboard';
  }
}

async function handleLogin(){
  try{
    const email = document.getElementById('authEmail').value.trim();
    const password = document.getElementById('authPass').value;
    if(!email || !password) {
      alert('Debes ingresar tu correo y contraseña.');
      return toast('Ingresa tu correo y contraseña.', 'err');
    }
    
    toggleLoader(true);
    const result = await sbClient.auth.signInWithPassword({ email, password });
    toggleLoader(false);
    
    if(result.error) {
      alert('Fallo de Login en Supabase: ' + result.error.message);
      toast(result.error.message, 'err');
    } else {
      toast('¡Bienvenido de vuelta!', 'ok'); 
      document.getElementById('authPass').value=''; 
    }
  }catch(e){
    alert('Ocurrió un error inesperado al intentar iniciar sesión: ' + e.message);
  }
}

async function handleSignup(){
  try{
    const email = document.getElementById('authEmail').value.trim();
    const password = document.getElementById('authPass').value;
    if(!email || !password) {
      alert('Debes ingresar tu correo y contraseña.');
      return toast('Ingresa tu correo y contraseña.', 'err');
    }
    
    toggleLoader(true);
    const result = await sbClient.auth.signUp({ email, password });
    toggleLoader(false);
    
    if(result.error) {
      alert('Fallo de Registro en Supabase: ' + result.error.message);
      toast(result.error.message, 'err');
    } else {
      alert('Cuenta creada exitosamente en Supabase. Si Supabase requiere confirmación por correo, revisa tu bandeja de entrada.');
      toast('✅ ¡Cuenta creada con éxito!', 'ok');
      document.getElementById('authPass').value='';
    }
  }catch(e){
    alert('Ocurrió un error inesperado al intentar registrarse: ' + e.message);
  }
}

async function handleLogout(){
  if(!confirm('¿Seguro que deseas cerrar sesión?')) return;
  toggleLoader(true);
  await sbClient.auth.signOut();
  toggleLoader(false);
  toast('Sesión cerrada.', 'ok');
}

/* ── SUPABASE / DATA FETCH ───────────────────────────── */
function toggleLoader(show) {
  document.getElementById('globalLoader').classList.toggle('active', show);
}

function mapMovToJS(row){
  return { ...row, amount: parseFloat(row.amount || 0), categoryId: row.category_id, bankId: row.bank_id, createdAt: row.created_at };
}
function mapMovToDB(jsm){
  return { ...jsm, category_id: jsm.categoryId, bank_id: jsm.bankId, created_at: jsm.createdAt || Date.now() };
}

async function runLocalStorageMigration() {
  try {
    const localStr = localStorage.getItem('cavalflow_v1');
    if(!localStr) return;
    const localData = JSON.parse(localStr);
    if(localData && !localData.migrated_supabase) {
        toast('Migrando data antigua a la nube...', 'ok');
        
        if(localData.cats && localData.cats.length) {
            const dbCats = localData.cats.map(c=>({...c, budget: c.budget||0, created_at: c.createdAt || Date.now()}));
            await sbClient.from('categorias').upsert(dbCats);
        }
        if(localData.banks && localData.banks.length) {
            const dbBanks = localData.banks.map(b=>({
                ...b, balance: b.balance||0, 
                wallets: Array.isArray(b.wallets) ? b.wallets : [],
                created_at: b.createdAt || Date.now()
            }));
            await sbClient.from('bancos').upsert(dbBanks);
        }
        if(localData.movs && localData.movs.length) {
            const dbMovs = localData.movs.map(mapMovToDB);
            await sbClient.from('movimientos').upsert(dbMovs);
        }
        localData.migrated_supabase = true;
        localStorage.setItem('cavalflow_v1', JSON.stringify(localData));
        toast('¡Migración exitosa!', 'ok');
    }
  }catch(err){
    console.error('Migration error', err);
  }
}

async function load(){
  try{
    toggleLoader(true);
    
    // First run migration if needed
    await runLocalStorageMigration();

    const [movsRes, catsRes, banksRes] = await Promise.all([
      sbClient.from('movimientos').select('*'),
      sbClient.from('categorias').select('*'),
      sbClient.from('bancos').select('*')
    ]);
    
    if(movsRes.error) throw movsRes.error;
    if(catsRes.error) throw catsRes.error;
    if(banksRes.error) throw banksRes.error;

    S.movs = (movsRes.data || []).map(mapMovToJS);
    S.cats = (catsRes.data || []).map(c => ({...c, budget: parseFloat(c.budget || 0)}));
    S.banks = (banksRes.data || []).map(b => {
       let pw = [];
       if (Array.isArray(b.wallets)) pw = b.wallets;
       else if (typeof b.wallets === 'string') try { pw = JSON.parse(b.wallets); }catch(e){}
       return {...b, balance: parseFloat(b.balance || 0), wallets: pw};
    });

    // Fallback if DB perfectly empty and we didn't just migrate
    if(S.cats.length === 0) {
      S.cats = DEFAULT_CATS.map(c=>({...c, created_at: Date.now()}));
      await sbClient.from('categorias').insert(S.cats);
    }
    if(S.banks.length === 0) {
      S.banks = DEFAULT_BANKS.map(b=>({...b, created_at: Date.now()}));
      await sbClient.from('bancos').insert(S.banks);
    }
  }catch(e){
    console.error('Supabase load error:', e);
    toast('Error vinculando bases de datos.', 'err');
  }finally{
    toggleLoader(false);
    updateMlbl(); updateDeskHdr(); 
    try { renderDash(); } catch(e) { console.error("Error RenderDash:", e); }
  }
}

/* ── SIDEBAR ──────────────────────────────────────────── */
function toggleSidebar(){
  S.sbCollapsed=!S.sbCollapsed;
  document.body.classList.toggle('sb-collapsed',S.sbCollapsed);
  document.getElementById('sbCollapseBtn').textContent=S.sbCollapsed?'▶':'◀';
}

/* ── NAVIGATION ───────────────────────────────────────── */
function switchTab(t){
  try{
    document.querySelectorAll('.tab').forEach(el=>el.classList.remove('active'));
    document.querySelectorAll('.nbtn').forEach(el=>el.classList.remove('active'));
    document.querySelectorAll('.sb-item').forEach(el=>el.classList.remove('active'));
    
    const tabEl=document.getElementById(`tab-${t}`);if(tabEl)tabEl.classList.add('active');
    const navEl=document.getElementById(`nav-${t}`);if(navEl)navEl.classList.add('active');
    const sbEl=document.getElementById(`sb-${t}`);if(sbEl)sbEl.classList.add('active');
    
    S.tab=t;render();
  }catch(e){
    console.error("switchTab crash", e);
  }
}

function render(){
  try{
    updateDeskHdr();
    if(S.tab==='dashboard') renderDash();
    if(S.tab==='history')   renderHist();
    if(S.tab==='banks')     renderBanks();
    if(S.tab==='categories')renderCats();
    if(S.tab==='whatsapp')  renderWA();
  }catch(e){
     console.error(`Error renderizando ${S.tab}`, e);
  }
}
const TAB_TITLES={
  dashboard: ['Dashboard','Resumen financiero del período'],
  history:   ['Historial','Todos tus movimientos'],
  banks:     ['Bancos y Billeteras','Cuentas en soles y dólares'],
  categories:['Categorías','Presupuestos y límites mensuales'],
  whatsapp:  ['WhatsApp Bot','Registro por mensaje de texto'],
};
function updateDeskHdr(){
  if(!ISDESK())return;
  const[title,sub]=TAB_TITLES[S.tab]||['',''];
  const waBtn=S.tab!=='whatsapp'?`<button class="desk-wa-btn" onclick="switchTab('whatsapp')">💬 WhatsApp Bot</button>`:'';
  const dh=document.getElementById('deskHdr');
  if(dh) dh.innerHTML=`
    <div><div class="desk-page-title">${title}</div><div class="desk-page-sub">${sub}</div></div>
    <div class="desk-hdr-right">${waBtn}<button class="desk-add-btn" onclick="openModal()">＋ Nuevo Movimiento</button></div>`;
}

/* ── MONTH ────────────────────────────────────────────── */
function changeMonth(d){
  const[y,m]=S.mon.split('-').map(Number);
  const nd=new Date(y,m-1+d,1);
  if(nd>new Date(new Date().getFullYear(),new Date().getMonth(),1))return;
  S.mon=`${nd.getFullYear()}-${String(nd.getMonth()+1).padStart(2,'0')}`;
  updateMlbl();render();
}
function updateMlbl(){
  const[y,m]=S.mon.split('-').map(Number);
  const lbl=new Date(y,m-1,1).toLocaleDateString('es-PE',{month:'short',year:'numeric'});
  document.getElementById('mlbl-mob').textContent=lbl;
  document.getElementById('mlbl-desk').textContent=lbl;
}

/* ── DASHBOARD ────────────────────────────────────────── */
function renderDash(){
  const sumPEN=summary(S.mon,'PEN'); const sumUSD=summary(S.mon,'USD');
  const balPEN=sumPEN.inc-sumPEN.exp;

  const hb=document.getElementById('hBal');
  if(hb){
    hb.textContent=fmt(balPEN,'PEN');
    hb.className='hero-bal'+(balPEN<0?' neg':'');
  }
  const[y,m]=S.mon.split('-').map(Number);
  const hm=document.getElementById('hSub'); if(hm)hm.textContent=cap(new Date(y,m-1,1).toLocaleDateString('es-PE',{month:'long',year:'numeric'}));
  const hi=document.getElementById('hInc'); if(hi)hi.textContent=fmt(sumPEN.inc,'PEN');
  const he=document.getElementById('hExp'); if(he)he.textContent=fmt(sumPEN.exp,'PEN');
  const hw=document.getElementById('heroWrap'); if(hw)hw.style.display=ISDESK()?'none':'block';

  const ki=document.getElementById('kInc'); if(ki)ki.textContent=fmt(sumPEN.inc,'PEN');
  const kis=document.getElementById('kIncSub'); if(kis)kis.textContent=sumUSD.inc>0?`+ ${fmt(sumUSD.inc,'USD')}`:'';
  
  const ke=document.getElementById('kExp'); if(ke)ke.textContent=fmt(sumPEN.exp,'PEN');
  const kes=document.getElementById('kExpSub'); if(kes)kes.textContent=sumUSD.exp>0?`+ ${fmt(sumUSD.exp,'USD')}`:'';
  
  const sav=sumPEN.inc>0?Math.round((balPEN/sumPEN.inc)*100):0;
  const ks=document.getElementById('kSav'); if(ks)ks.textContent=sav+'%';
  const kss=document.getElementById('kSavSub'); if(kss)kss.textContent=sav>20?'¡Vas muy bien! 🎉':sav>0?'Puedes mejorar':'Gastas más de lo que ganas';

  const bStats=bankStats(S.mon,'expense');
  const topBk=bStats.length?bankById(bStats[0].id):null;
  const kb=document.getElementById('kBank'); if(kb)kb.textContent=topBk?topBk.icon+' '+topBk.name:'—';

  renderAlerts(sumPEN,sumUSD);
  renderCharts();

  const recent=monthMovs(S.mon).slice(0,8);
  if(ISDESK()){
    const rc=document.getElementById('recCards'); if(rc)rc.innerHTML='';
    const rt=document.getElementById('recTable'); if(rt)rt.innerHTML=tableHTML(recent);
  }else{
    const rc=document.getElementById('recCards'); if(rc)rc.innerHTML=recent.length?recent.map(movCardHTML).join(''):emptyHTML('📭','Sin movimientos','Toca + para agregar el primero');
    const rt=document.getElementById('recTable'); if(rt)rt.innerHTML='';
  }
}

function renderAlerts(sumPEN){
  const items=[];
  if(sumPEN.exp>sumPEN.inc*.9&&sumPEN.inc>0)
    items.push(`<div class="alert-banner">⚠️ <span>Has gastado el <strong>${Math.round(sumPEN.exp/sumPEN.inc*100)}%</strong> de tus ingresos en soles este mes.</span></div>`);
  catStats(S.mon,'expense').forEach(cs=>{
    const cat=catById(cs.id);
    if(!cat?.budget||cat.budget<=0)return;
    const pct=Math.round(cs.amount/cat.budget*100);
    if(pct>=100) items.push(`<div class="alert-banner">${cat.icon} <span><strong>${cat.name}:</strong> Superaste el presupuesto (${fmt(cs.amount,'PEN')} / ${fmt(cat.budget,'PEN')}).</span></div>`);
    else if(pct>=80) items.push(`<div class="alert-banner warn">${cat.icon} <span><strong>${cat.name}:</strong> ${pct}% del presupuesto (${fmt(cs.amount,'PEN')} / ${fmt(cat.budget,'PEN')}).</span></div>`);
  });
  const al=document.getElementById('alerts'); if(al)al.innerHTML=items.join('');
}

/* ── CHARTS ───────────────────────────────────────────── */
function renderCharts(){
  const months=last6();
  const labels=months.map(mo=>{const[y,m]=mo.split('-').map(Number);return new Date(y,m-1,1).toLocaleDateString('es-PE',{month:'short'});});
  const incData=months.map(mo=>summary(mo,'PEN').inc);
  const expData=months.map(mo=>summary(mo,'PEN').exp);
  const cs=catStats(S.mon,'expense').slice(0,7);

  const barCfg=(id,key)=>{
    const cvs=document.getElementById(id);if(!cvs)return;
    if(S.charts[key])S.charts[key].destroy();
    S.charts[key]=new Chart(cvs.getContext('2d'),{
      type:'bar',data:{labels,datasets:[
        {label:'Ingresos',data:incData,backgroundColor:'rgba(0,212,170,.72)',borderRadius:7,borderSkipped:false},
        {label:'Gastos',  data:expData,backgroundColor:'rgba(255,77,109,.72)',borderRadius:7,borderSkipped:false},
      ]},
      options:{responsive:true,maintainAspectRatio:false,
        plugins:{legend:{labels:{color:'#b0b0d0',font:{family:'Space Grotesk',size:11},boxWidth:12}},
          tooltip:{backgroundColor:'#131325',borderColor:'rgba(255,255,255,.07)',borderWidth:1,titleColor:'#f2f2ff',bodyColor:'#9898b8',callbacks:{label:c=>` S/ ${fmtNum(c.parsed.y)}`}}},
        scales:{x:{ticks:{color:'#60607a',font:{family:'Space Grotesk',size:11}},grid:{display:false}},
                y:{ticks:{color:'#60607a',font:{family:'Space Grotesk',size:11},callback:v=>`S/ ${fmtNum(v)}`},grid:{color:'rgba(255,255,255,.04)'}}}}
    });
  };
  const donutCfg=(id,key)=>{
    const cvs=document.getElementById(id);if(!cvs||!cs.length)return;
    if(S.charts[key])S.charts[key].destroy();
    S.charts[key]=new Chart(cvs.getContext('2d'),{
      type:'doughnut',
      data:{labels:cs.map(s=>catById(s.id)?.name||s.id),datasets:[{data:cs.map(s=>s.amount),backgroundColor:cs.map(s=>catById(s.id)?.color||'#94a3b8'),borderWidth:2,borderColor:'#131325',hoverOffset:7}]},
      options:{responsive:true,maintainAspectRatio:false,cutout:'62%',
        plugins:{legend:{position:'right',labels:{color:'#b0b0d0',font:{family:'Space Grotesk',size:11},boxWidth:11,padding:9}},
          tooltip:{backgroundColor:'#131325',borderColor:'rgba(255,255,255,.07)',borderWidth:1,titleColor:'#f2f2ff',bodyColor:'#9898b8',callbacks:{label:c=>` S/ ${fmtNum(c.parsed)} (${cs[c.dataIndex]?.pct}%)`}}}}
    });
  };

  const csSplit=document.querySelector('.charts-split');
  if(ISDESK()){
    if(csSplit)csSplit.style.display='grid';
    document.querySelectorAll('.chart-single').forEach(el=>el.style.display='none');
    barCfg('cMonth','m');donutCfg('cCat','c');
  }else{
    if(csSplit)csSplit.style.display='none';
    document.querySelectorAll('.chart-single').forEach(el=>el.style.display='block');
    barCfg('cMonthMob','mb');donutCfg('cCatMob','cb');
  }
}

/* ── HISTORY ──────────────────────────────────────────── */
function renderHist(){
  const csel=document.getElementById('cFlt');
  if(csel){
    const cc=csel.value;
    csel.innerHTML='<option value="all">Todas las categorías</option>';
    (S.cats||[]).forEach(c=>{csel.innerHTML+=`<option value="${c.id}">${c.icon} ${c.name}</option>`;});
    csel.value=cc;
  }
  const bsel=document.getElementById('bFlt');
  if(bsel){
    const bc=bsel.value;
    bsel.innerHTML='<option value="all">Todos los bancos</option>';
    (S.banks||[]).forEach(b=>{bsel.innerHTML+=`<option value="${b.id}">${b.icon} ${b.name} (${b.currency||'PEN'})</option>`;});
    bsel.value=bc;
  }
  applyF();
}
function setType(btn,t){
  document.querySelectorAll('.chip').forEach(c=>c.classList.remove('on'));
  btn.classList.add('on');S.fType=t;applyF();
}
function applyF(){
  S.fSrch=(document.getElementById('srch')?.value||'').toLowerCase();
  S.fCat=document.getElementById('cFlt')?.value||'all';
  S.fBank=document.getElementById('bFlt')?.value||'all';
  S.fCur=document.getElementById('curFlt')?.value||'all';
  
  let movs=[...(S.movs||[])].filter(m=>m.date&&m.date.startsWith(S.mon));
  if(S.fType!=='all') movs=movs.filter(m=>m.type===S.fType);
  if(S.fCat !=='all') movs=movs.filter(m=>m.categoryId===S.fCat);
  if(S.fBank!=='all') movs=movs.filter(m=>m.bankId===S.fBank);
  if(S.fCur !=='all') movs=movs.filter(m=>(m.currency||'PEN')===S.fCur);
  if(S.fSrch) movs=movs.filter(m=>
    (m.description||'').toLowerCase().includes(S.fSrch)||
    (catById(m.categoryId)?.name||'').toLowerCase().includes(S.fSrch)||
    (bankById(m.bankId)?.name||'').toLowerCase().includes(S.fSrch)
  );
  
  movs.sort((a,b)=>new Date(b.date)-new Date(a.date));

  const stat=document.getElementById('hStat');
  if(stat){
    if(movs.length){
      const penMovs=movs.filter(m=>(m.currency||'PEN')==='PEN');
      const usdMovs=movs.filter(m=>m.currency==='USD');
      const netPEN=penMovs.reduce((s,m)=>s+(m.type==='income'?m.amount:-m.amount),0);
      let statTxt=`${movs.length} registros`;
      if(penMovs.length) statTxt+=` · S/ ${netPEN>=0?'+':''}${fmtNum(netPEN)}`;
      if(usdMovs.length){const netUSD=usdMovs.reduce((s,m)=>s+(m.type==='income'?m.amount:-m.amount),0);statTxt+=` · US$ ${netUSD>=0?'+':''}${fmtNum(netUSD)}`;}
      stat.textContent=statTxt; stat.style.display='block';
    }else stat.style.display='none';
  }

  const hc=document.getElementById('histCards');
  const ht=document.getElementById('histTable');
  if(ISDESK()){
    if(hc)hc.innerHTML='';
    if(ht)ht.innerHTML=movs.length?tableHTML(movs):emptyHTML('🔍','Sin resultados','Prueba con otros filtros');
  }else{
    if(ht)ht.innerHTML='';
    if(hc)hc.innerHTML=movs.length?movs.map(movCardHTML).join(''):emptyHTML('🔍','Sin resultados','Prueba con otros filtros');
  }
}

/* ── BANKS ────────────────────────────────────────────── */
function renderBanks(){
  const bGrid=document.getElementById('bankGrid');
  if(bGrid){
    bGrid.innerHTML=(S.banks||[]).map(b=>{
      const cur=b.currency||'PEN';
      const spent=bankStats(S.mon,'expense',cur).find(s=>s.id===b.id)?.amount||0;
      const wArray = Array.isArray(b.wallets)?b.wallets:[];
      const walletTags=wArray.length?`<div class="wallet-chips">${wArray.map(w=>`<span class="wallet-chip">📱 ${w}</span>`).join('')}</div>`:'';
      return`<div class="bank-card" style="border-color:${b.color}33">
        <div style="position:absolute;top:0;left:0;right:0;height:3px;background:${b.color};border-radius:var(--r) var(--r) 0 0"></div>
        <div class="bank-card-head">
          <div class="bank-logo" style="background:${b.color}22;color:${b.color}">${b.icon}</div>
          <div>
            <div class="bank-name">${b.name}</div>
            <div class="bank-type">${BANK_TYPE_LABELS[b.type]||b.type} · <span class="cur-badge ${cur.toLowerCase()}">${cur}</span></div>
          </div>
        </div>
        ${walletTags}
        <div style="display:flex;justify-content:space-between;align-items:flex-end;margin-top:10px">
          <div><div class="bank-bal-lbl">Gasto este mes</div><div class="bank-bal" style="color:${b.color}">${fmt(spent,cur)}</div></div>
          ${(b.balance||0)>0?`<div style="text-align:right"><div class="bank-bal-lbl">Saldo</div><div style="font-size:14px;font-weight:600;color:var(--t1)">${fmt(b.balance,cur)}</div></div>`:''}
        </div>
        <div class="bank-actions">
          <button class="bank-btn" onclick="openBankModal('${b.id}')">✏️ Editar</button>
          <button class="bank-btn danger" onclick="deleteBank('${b.id}')">🗑️ Borrar</button>
        </div>
      </div>`;
    }).join('');
    if(!S.banks.length) bGrid.innerHTML=emptyHTML('🏦','Sin bancos','Agrega tu primer banco o billetera');
  }

  // Bank chart (PEN only)
  const bStats=bankStats(S.mon,'expense','PEN');
  const cvs=document.getElementById('cBank');
  if(cvs&&bStats.length){
    if(S.charts.bk)S.charts.bk.destroy();
    S.charts.bk=new Chart(cvs.getContext('2d'),{
      type:'bar',
      data:{labels:bStats.map(s=>bankById(s.id)?.name||s.id),datasets:[{data:bStats.map(s=>s.amount),backgroundColor:bStats.map(s=>bankById(s.id)?.color||'#94a3b8'),borderRadius:8,borderSkipped:false}]},
      options:{responsive:true,maintainAspectRatio:false,
        plugins:{legend:{display:false},tooltip:{backgroundColor:'#131325',borderColor:'rgba(255,255,255,.07)',borderWidth:1,titleColor:'#f2f2ff',bodyColor:'#9898b8',callbacks:{label:c=>` S/ ${fmtNum(c.parsed.y)}`}}},
        scales:{x:{ticks:{color:'#60607a',font:{family:'Space Grotesk',size:11}},grid:{display:false}},
                y:{ticks:{color:'#60607a',font:{family:'Space Grotesk',size:11},callback:v=>`S/ ${fmtNum(v)}`},grid:{color:'rgba(255,255,255,.04)'}}}}
    });
  }
}

/* ── CATEGORIES ───────────────────────────────────────── */
function renderCats(){
  const[y,m]=S.mon.split('-').map(Number);
  const cl=document.getElementById('catLbl'); if(cl)cl.textContent=new Date(y,m-1,1).toLocaleDateString('es-PE',{month:'long',year:'numeric'});
  
  const renderG=(id,type)=>{
    const el = document.getElementById(id);
    if(!el) return;
    const cs=catStats(S.mon,type);
    const cats=(S.cats||[]).filter(c=>c.type===type||c.type==='both');
    const spendMap={};cs.forEach(s=>spendMap[s.id]=s.amount);
    
    el.innerHTML=cats.length
      ?cats.map(c=>{
          const spent=spendMap[c.id]||0;const budget=c.budget||0;
          let barClass='ok',pctBar=0,budgetLabel='';
          if(budget>0){pctBar=Math.min(Math.round(spent/budget*100),100);barClass=pctBar>=100?'over':pctBar>=75?'mid':'ok';budgetLabel=`${fmt(spent,'PEN')} / ${fmt(budget,'PEN')}`;}
          else{budgetLabel=fmt(spent,'PEN');}
          return`<div class="catcard">
            <div class="catcard-top">
              <div class="cat-ico-box" style="background:${c.color}22">${c.icon}</div>
              <div style="flex:1;min-width:0"><div class="cat-nm">${c.name}</div><div class="cat-amt" style="color:${type==='income'?'var(--greenL)':'var(--t1)'}">${budgetLabel}</div></div>
            </div>
            ${budget>0?`<div class="bbar-wrap"><div class="bbar-labels"><span style="color:${barClass==='over'?'var(--redL)':barClass==='mid'?'var(--yellow)':'var(--greenL)'}">${pctBar}%</span><span>Limit: ${fmt(budget,'PEN')}</span></div><div class="bbar"><div class="bbar-f ${barClass}" style="width:${pctBar}%"></div></div></div>`:''}
            <div class="catcard-actions">
              <button class="cat-btn" onclick="openCatModal('${c.id}')">✏️ Editar</button>
              <button class="cat-btn danger" onclick="deleteCat('${c.id}')">🗑️ Borrar</button>
            </div>
          </div>`;
        }).join('')
      :`<p style="color:var(--t2);font-size:12px;padding:10px 0;grid-column:1/-1">Sin categorías. Agrega una abajo.</p>`;
  };
  renderG('expCats','expense');renderG('incCats','income');
}

/* ── WHATSAPP BOT ─────────────────────────────────────── */
function renderWA(){
  const chat=document.getElementById('waChat');
  if(!chat) return;
  if(!chat.children.length){
    addWaBubble('recv','👋 ¡Hola! Soy tu asistente de *Caval Flow*.\n\nPuedes escribirme:\n• "Gasté 45 en almuerzo con Yape"\n• "Ingreso 3500 sueldo BCP"\n• "Resumen" · "Hoy" · "Bancos"');
  }
  const hl=document.getElementById('waCmdsHelp');
  if(hl) hl.innerHTML=`<div style="display:flex;flex-direction:column;gap:6px">${
    [['📝 Registrar gasto','Gasté 45 en almuerzo Yape'],
     ['💰 Registrar ingreso','Ingreso 3500 sueldo BCP'],
     ['📊 Ver resumen','Resumen'],
     ['📅 Hoy','Hoy'],
     ['🏦 Bancos','Bancos'],
     ['📋 Últimos','Últimos']
    ].map(([desc,ex])=>`<div style="display:flex;align-items:center;gap:10px;padding:8px 10px;background:var(--bg3);border-radius:var(--rs)"><span style="font-size:12px;font-weight:600;color:var(--t0);flex:1">${desc}</span><span class="wa-cmd" onclick="insertWaCmd('${ex}')">${ex}</span></div>`).join('')
  }</div>`;
}

function addWaBubble(type,text){
  const chat=document.getElementById('waChat'); if(!chat) return;
  const div=document.createElement('div');div.className=`wa-bubble ${type}`;
  const time=new Date().toLocaleTimeString('es-PE',{hour:'2-digit',minute:'2-digit'});
  div.innerHTML=text.replace(/\n/g,'<br>').replace(/\*([^*]+)\*/g,'<strong>$1</strong>')+`<div class="wb-time">${time}</div>`;
  chat.appendChild(div);chat.scrollTop=chat.scrollHeight;
}
function insertWaCmd(cmd){
  const i=document.getElementById('waInput');
  if(i){ i.value=cmd; i.focus(); }
}
function sendWaMsg(){
  const inp=document.getElementById('waInput'); if(!inp) return;
  const text=inp.value.trim();if(!text)return;
  addWaBubble('sent',text);inp.value='';
  setTimeout(()=>processWaMessage(text),600);
}
async function processWaMessage(text){
  const lower=text.toLowerCase();
  if(/ayuda|help/i.test(lower)){addWaBubble('recv','📖 *Comandos:*\n\n• "Gasté 45 en almuerzo" → gasto\n• "Ingreso 3500 sueldo" → ingreso\n• "Resumen" → balance del mes\n• "Hoy" → movimientos de hoy\n• "Bancos" → gastos por banco\n• "Últimos" → últimos 5 registros\n• Escribe *SI* para confirmar');return;}
  if(/resumen|balance/i.test(lower)){
    const sumP=summary(S.mon,'PEN');const sumU=summary(S.mon,'USD');
    const bal=sumP.inc-sumP.exp;
    const[y,m]=S.mon.split('-').map(Number);
    addWaBubble('recv',`📊 *Resumen ${cap(new Date(y,m-1,1).toLocaleDateString('es-PE',{month:'long'}))}*\n\n💰 Ingresos: ${fmt(sumP.inc,'PEN')}${sumU.inc>0?' · '+fmt(sumU.inc,'USD'):''}\n💸 Gastos: ${fmt(sumP.exp,'PEN')}${sumU.exp>0?' · '+fmt(sumU.exp,'USD'):''}\n📈 Balance S/: ${bal>=0?'+':''}${fmt(bal,'PEN')}\n\n${bal>=0?'✅ ¡Vas bien este mes! 🎉':'⚠️ Gastos superan ingresos'}`);return;
  }
  if(/hoy|today/i.test(lower)){
    const today=todayStr();const movs=(S.movs||[]).filter(m=>m.date===today);
    if(!movs.length){addWaBubble('recv','📅 Sin movimientos hoy.');return;}
    const lines=movs.map(m=>{const c=catById(m.categoryId);const b=bankById(m.bankId);const cur=m.currency||'PEN';return`${c.icon} ${m.description||c.name}: ${m.type==='income'?'+':'-'}${fmt(m.amount,cur)} (${b?.name||'—'})`;}).join('\n');
    addWaBubble('recv',`📅 *Hoy:*\n\n${lines}`);return;
  }
  if(/banco|saldo/i.test(lower)){
    if(!S.banks.length){addWaBubble('recv','🏦 No tienes bancos. Agrega uno en la pestaña Bancos.');return;}
    const lines=S.banks.map(b=>{const cur=b.currency||'PEN';const spent=bankStats(S.mon,'expense',cur).find(s=>s.id===b.id)?.amount||0;return`${b.icon} ${b.name} (${cur}): -${fmt(spent,cur)} este mes`;}).join('\n');
    addWaBubble('recv',`🏦 *Tus bancos:*\n\n${lines}`);return;
  }
  if(/último|ultimos|reciente/i.test(lower)){
    const movs=monthMovs(S.mon).slice(0,5);
    if(!movs.length){addWaBubble('recv','📋 Sin movimientos este mes.');return;}
    const lines=movs.map(m=>{const c=catById(m.categoryId);const b=bankById(m.bankId);const cur=m.currency||'PEN';return`${c.icon} ${m.description||c.name}: ${m.type==='income'?'+':'-'}${fmt(m.amount,cur)} · ${b?.name||'—'} · ${fmtDate(m.date)}`;}).join('\n');
    addWaBubble('recv',`📋 *Últimos 5:*\n\n${lines}`);return;
  }
  if(S.waPending&&/^(si|sí|1|ok|yes)$/i.test(lower)){
    const p=S.waPending;S.waPending=null;
    
    // Save to Supabase
    toggleLoader(true);
    const newMov = {id:uid(),...p,createdAt:Date.now()};
    const {error} = await sbClient.from('movimientos').insert([mapMovToDB(newMov)]);
    toggleLoader(false);
    
    if(error){ toast('Error registrando por Bot','err'); return; }
    
    S.movs.push(newMov);
    const c=catById(p.categoryId);const b=bankById(p.bankId);const cur=p.currency||'PEN';
    addWaBubble('recv',`✅ *¡Guardado!*\n\nMonto: ${p.type==='income'?'+':'-'}${fmt(p.amount,cur)}\nCateg.: ${c.icon} ${c.name}\nBanco: ${b?b.icon+' '+b.name:'—'}\nMoneda: ${cur}`);
    toast('✅ Registrado desde bot','wa');
    render(); return;
  }
  if(S.waPending&&/^(no|2|cancelar)$/i.test(lower)){S.waPending=null;addWaBubble('recv','❌ Cancelado.');return;}

  const isIncome=WA_INCOME.some(k=>lower.includes(k));
  const type=isIncome?'income':'expense';
  const amtM=text.match(/(\d+(?:[.,]\d{1,2})?)/);
  const amount=amtM?parseFloat(amtM[1].replace(',','.')):null;
  if(!amount){addWaBubble('recv','🤔 No encontré el monto. Ej: "Gasté 45 en almuerzo"');return;}

  let catId='other';
  for(const cm of CAT_MAP){if(cm.r.test(lower)){catId=cm.id;break;}}
  if(!S.cats.find(c=>c.id===catId))catId=S.cats[0]?.id||'other';

  let bankId=null;
  for(const bm of BANK_MAP){if(bm.r.test(lower)&&S.banks.find(b=>b.id===bm.id)){bankId=bm.id;break;}}

  // Detect currency
  const cur=/dólares?|dolares?|usd|\$/i.test(text)?'USD':'PEN';
  const bank=bankById(bankId);
  const currencyFinal=bank?.currency||cur;

  const desc=text.replace(/\d+(?:[.,]\d{1,2})?/g,'').replace(/gasté|gasto|pagué|ingreso|ingresé|cobré|con|en|de|la|el|por|s\/|usd|\$|soles?|dólares?/gi,'').replace(/\s+/g,' ').trim().slice(0,40)||'';

  S.waPending={type,amount,categoryId:catId,bankId,description:desc,date:todayStr(),currency:currencyFinal};
  const cat=catById(catId);
  addWaBubble('recv',`${type==='income'?'💰':'💸'} *¿Confirmas?*\n\nMonto: ${type==='income'?'+':'-'}${fmt(amount,currencyFinal)}\nCateg.: ${cat.icon} ${cat.name}\nBanco: ${bank?bank.icon+' '+bank.name:'No detectado'}\nDesc.: ${desc||'—'}\n\nEscribe *SI* para guardar, *NO* para cancelar`);
}

/* ── MOVEMENT HTML ────────────────────────────────────── */
function movCardHTML(mov){
  const c=catById(mov.categoryId);const b=bankById(mov.bankId);const cur=mov.currency||'PEN';
  const sgn=mov.type==='income'?'+':'-';
  return`<div class="mov ${mov.type}" onclick="openCtx(event,'${mov.id}')">
    <div class="mov-ico" style="background:${c.color}22">${c.icon}</div>
    <div class="mov-info">
      <div class="mov-desc">${mov.description||c.name}</div>
      <div class="mov-meta">
        <span>${c.name}</span><span class="dot"></span>
        ${b?`<span class="mov-bank-tag" style="color:${b.color}">${b.icon} ${b.name}</span><span class="dot"></span>`:''}
        <span class="cur-badge ${cur.toLowerCase()}">${cur}</span>
        <span class="dot"></span><span>${fmtDate(mov.date)}</span>
      </div>
    </div>
    <div class="mov-amt ${mov.type}">${sgn}${fmt(mov.amount,cur)}</div>
  </div>`;
}
function tableHTML(movs){
  if(!movs.length)return emptyHTML('📭','Sin movimientos','Agrega tu primer movimiento con el botón +');
  return`<table class="dtbl"><thead><tr><th>Fecha</th><th>Descripción</th><th>Banco</th><th>Tipo</th><th style="text-align:right">Monto</th></tr></thead><tbody>${
    movs.map(mov=>{
      const c=catById(mov.categoryId);const b=bankById(mov.bankId);const cur=mov.currency||'PEN';
      const sgn=mov.type==='income'?'+':'-';const color=mov.type==='income'?'var(--greenL)':'var(--redL)';
      return`<tr onclick="openCtx(event,'${mov.id}')">
        <td><span style="color:var(--t2);font-size:12px">${fmtDate(mov.date)}</span></td>
        <td><div style="display:flex;align-items:center;gap:8px"><div class="tcat-ico" style="background:${c.color}22">${c.icon}</div><div><div style="font-weight:600;font-size:13px">${mov.description||c.name}</div><div style="font-size:11px;color:var(--t2)">${c.name}</div></div></div></td>
        <td>${b?`<span class="tpay" style="color:${b.color}">${b.icon} ${b.name} <span class="cur-badge ${cur.toLowerCase()}" style="margin-left:4px">${cur}</span></span>`:'<span style="color:var(--t2);font-size:11px">—</span>'}</td>
        <td><span class="tbadge ${mov.type}">${mov.type==='income'?'Ingreso':'Gasto'}</span></td>
        <td style="color:${color}">${sgn}${fmt(mov.amount,cur)}</td>
      </tr>`;
    }).join('')
  }</tbody></table>`;
}

/* ── MODAL Movimiento ─────────────────────────────────── */
function openModal(id=null){
  S.eId=id;S.mType='expense';S.mCat=null;S.mBank=null;S.mCurrency='PEN';
  document.getElementById('amtInp').value='';
  document.getElementById('descInp').value='';
  document.getElementById('dateInp').value=todayStr();
  document.getElementById('tExp').className='tbtn on exp';
  document.getElementById('tInc').className='tbtn inc';
  selCurrency('PEN');
  if(id){
    const mov=S.movs.find(m=>m.id===id);
    if(mov){
      document.getElementById('mtitle').textContent='✏️ Editar Movimiento';
      document.getElementById('amtInp').value=mov.amount;
      document.getElementById('descInp').value=mov.description||'';
      document.getElementById('dateInp').value=mov.date;
      S.mType=mov.type;S.mCat=mov.categoryId;S.mBank=mov.bankId;S.mCurrency=mov.currency||'PEN';
      setMType(mov.type);selCurrency(S.mCurrency);
    }
  }else{document.getElementById('mtitle').textContent='➕ Nuevo Movimiento';}
  buildCpick();buildBankPicker();
  document.getElementById('overlay').classList.add('open');
  setTimeout(()=>document.getElementById('amtInp').focus(),340);
}
function closeModal(){document.getElementById('overlay').classList.remove('open');S.eId=null;}
function overlayClick(e){if(e.target.id==='overlay')closeModal();}
function setMType(t){
  S.mType=t;
  document.getElementById('tExp').className='tbtn exp'+(t==='expense'?' on':'');
  document.getElementById('tInc').className='tbtn inc'+(t==='income'?' on':'');
  buildCpick();
}
function selCurrency(cur){
  S.mCurrency=cur;
  document.getElementById('amtCurLbl').textContent=cur==='USD'?'US$':'S/';
  document.getElementById('curPEN').className='cur-opt'+(cur==='PEN'?' sel pen':'');
  document.getElementById('curUSD').className='cur-opt'+(cur==='USD'?' sel usd':' usd');
}
function buildCpick(){
  const cats=(S.cats||[]).filter(c=>c.type===S.mType||c.type==='both');
  document.getElementById('cpick').innerHTML=cats.map(c=>
    `<div class="copt${S.mCat===c.id?' sel':''}" onclick="selCat('${c.id}')"><span class="ce">${c.icon}</span><span>${c.name}</span></div>`
  ).join('');
}
function selCat(id){S.mCat=id;buildCpick();}
function buildBankPicker(){
  document.getElementById('bankPicker').innerHTML=(S.banks||[]).map(b=>{
    const cur=b.currency||'PEN';
    return`<div class="bank-opt${S.mBank===b.id?' sel':''}" onclick="selBankMov('${b.id}','${cur}')">
      <div class="bank-opt-logo" style="background:${b.color}22;color:${b.color}">${b.icon}</div>
      <span>${b.name}</span>
      <span class="cur-badge ${cur.toLowerCase()}" style="margin-top:2px">${cur}</span>
    </div>`;
  }).join('');
}
function selBankMov(id,cur){
  S.mBank=id;
  selCurrency(cur||'PEN');
  buildBankPicker();
}
async function handleSave(){
  const amount=parseFloat(document.getElementById('amtInp').value);
  const desc=document.getElementById('descInp').value.trim();
  const date=document.getElementById('dateInp').value;
  if(!amount||amount<=0){toast('Ingresa un monto válido','err');return;}
  if(!date){toast('Selecciona una fecha','err');return;}
  
  const isNew = !S.eId;
  const id = S.eId || uid();
  const data={id, type:S.mType, amount, categoryId:S.mCat, bankId:S.mBank, currency:S.mCurrency, description:desc, date, createdAt:Date.now()};
  
  toggleLoader(true);
  const {error} = await sbClient.from('movimientos').upsert([mapMovToDB(data)]);
  toggleLoader(false);

  if(error) { toast('Error de conexión a DB','err'); console.error(error); return;}

  if(isNew){
    S.movs.push(data);
  }else{
    const i=S.movs.findIndex(m=>m.id===S.eId);
    if(i>=0)S.movs[i]={...S.movs[i],...data};
  }
  toast(isNew?'✅ Guardado correctamente':'✅ Movimiento actualizado','ok');
  closeModal();render();
}

/* ── MODAL Banco ──────────────────────────────────────── */
function clearBankIcon(){document.getElementById('bankIconInp').value='';}

function openBankModal(id=null){
  S.bankEditId=id;S.bankColor='#ef4444';S.bankWallets=[];S.bankCurrency='PEN';S.bankType='bank';
  const bank=id?(S.banks||[]).find(b=>b.id===id):null;
  document.getElementById('bankMtitle').textContent=bank?`✏️ Editar: ${bank.name}`:'🏦 Nuevo Banco / Billetera';
  document.getElementById('bankNameInp').value=bank?.name||'';
  document.getElementById('bankIconInp').value=bank?.icon||'';
  document.getElementById('bankBalanceInp').value=(bank?.balance||0)>0?bank.balance:'';
  if(bank){
     S.bankColor=bank.color;
     S.bankWallets=Array.isArray(bank.wallets) ? [...bank.wallets] : [];
     S.bankCurrency=bank.currency||'PEN';
     S.bankType=bank.type||'bank';
  }
  selBankCurrency(S.bankCurrency);
  selBankTypeUI(S.bankType);
  buildBankColorRow();buildWalletSelector();buildBankPresets();
  document.getElementById('bankOverlay').classList.add('open');
}
function closeBankModal(){document.getElementById('bankOverlay').classList.remove('open');S.bankEditId=null;}
function bankOverlayClick(e){if(e.target.id==='bankOverlay')closeBankModal();}
function selBankCurrency(cur){
  S.bankCurrency=cur;
  document.getElementById('bankCurPEN').className='cur-opt'+(cur==='PEN'?' sel pen':'')+' '+(cur!=='PEN'?'':'');
  document.getElementById('bankCurUSD').className='cur-opt usd'+(cur==='USD'?' sel':'');
}
function selBankType(btn,t){S.bankType=t;selBankTypeUI(t);}
function selBankTypeUI(t){document.querySelectorAll('.bank-type-btn').forEach(b=>b.classList.toggle('sel',b.dataset.t===t));}
function buildBankPresets(){
  document.getElementById('bankPresets').innerHTML=BANK_PRESETS.map(p=>
    `<button style="padding:7px 4px;background:var(--bg3);border:1px solid var(--br);border-radius:var(--rs);font-size:12px;display:flex;flex-direction:column;align-items:center;gap:2px;transition:all .2s;cursor:pointer"
      onmouseover="this.style.borderColor='${p.color}';this.style.color='${p.color}'"
      onmouseout="this.style.borderColor='';this.style.color=''"
      onclick="applyBankPreset(${JSON.stringify(p).replace(/"/g,'&quot;')})"
    >${p.icon}<span style="font-size:9px;font-weight:700;color:inherit">${p.name}</span><span style="font-size:8px;color:#60607a">${p.currency}</span></button>`
  ).join('');
}
function applyBankPreset(p){
  document.getElementById('bankNameInp').value=p.name||'';
  document.getElementById('bankIconInp').value=p.icon||'';
  S.bankColor=p.color;S.bankWallets=Array.isArray(p.wallets) ? [...p.wallets] : []; S.bankCurrency=p.currency||'PEN';
  selBankCurrency(S.bankCurrency);buildBankColorRow();buildWalletSelector();
}
function buildBankColorRow(){
  document.getElementById('bankColorRow').innerHTML=PALETTE.map(col=>
    `<div class="color-dot${S.bankColor===col?' sel':''}" style="background:${col}" onclick="S.bankColor='${col}';buildBankColorRow()"></div>`
  ).join('');
}
function buildWalletSelector(){
  document.getElementById('walletSelector').innerHTML=WALLETS_OPTS.map(w=>{
    const on=S.bankWallets.includes(w);
    return`<span style="padding:5px 10px;border-radius:var(--rf);font-size:11px;font-weight:600;border:2px solid ${on?'var(--violetL)':'var(--br)'};background:${on?'var(--violetG)':'var(--bg3)'};color:${on?'var(--violetL)':'var(--t2)'};cursor:pointer;transition:all .2s" onclick="toggleWallet('${w}')">${w}</span>`;
  }).join('');
}
function toggleWallet(w){
  S.bankWallets.includes(w)?S.bankWallets=S.bankWallets.filter(x=>x!==w):S.bankWallets.push(w);
  buildWalletSelector();
}
async function handleBankSave(){
  const name=document.getElementById('bankNameInp').value.trim();
  const icon=document.getElementById('bankIconInp').value.trim()||'🏦';
  const balance=parseFloat(document.getElementById('bankBalanceInp').value)||0;
  if(!name){toast('Escribe el nombre del banco','err');return;}
  
  const isNew = !S.bankEditId;
  const id=S.bankEditId||uid();
  const data={id, name,icon,color:S.bankColor,type:S.bankType,currency:S.bankCurrency,wallets:S.bankWallets,balance,created_at:Date.now()};
  
  toggleLoader(true);
  const {error} = await sbClient.from('bancos').upsert([data]);
  toggleLoader(false);

  if(error) {toast('Error al guardar en DB. ¿RLS configurado bien?','err'); console.error(error); return;}

  if(isNew){
    S.banks.push(data);
  }else{
    const i=S.banks.findIndex(b=>b.id===S.bankEditId);
    if(i>=0)S.banks[i]={...S.banks[i],...data};
  }
  toast(isNew?'✅ Banco agregado':'✅ Banco actualizado','ok');
  closeBankModal();render();
}
async function deleteBank(id){
  const b=S.banks.find(b=>b.id===id);
  if(!confirm(`¿Eliminar "${b?.name}"?`))return;
  
  toggleLoader(true);
  const {error} = await sbClient.from('bancos').delete().eq('id', id);
  toggleLoader(false);
  
  if(error) {toast('Error al eliminar','err'); return;}
  
  S.banks=S.banks.filter(b=>b.id!==id);
  render();toast('🗑️ Banco eliminado','ok');
}

/* ── MODAL Categoría ──────────────────────────────────── */
function openCatModal(id,defaultType='expense'){
  S.catEditId=id;S.catColor=PALETTE[0];S.catType=defaultType;
  const cat=id?(S.cats||[]).find(c=>c.id===id):null;
  document.getElementById('catMtitle').textContent=cat?`✏️ Editar: ${cat.name}`:'🏷️ Nueva Categoría';
  document.getElementById('catIconInp').value=cat?.icon||'';
  document.getElementById('catNameInp').value=cat?.name||'';
  document.getElementById('catBudgetInp').value=(cat?.budget||0)>0?cat.budget:'';
  if(cat){S.catColor=cat.color;S.catType=cat.type;}
  updateIconPreview();buildColorRow();buildTypeRow();
  document.getElementById('catOverlay').classList.add('open');
}
function closeCatModal(){document.getElementById('catOverlay').classList.remove('open');S.catEditId=null;}
function catOverlayClick(e){if(e.target.id==='catOverlay')closeCatModal();}
function updateIconPreview(){
  const v=document.getElementById('catIconInp').value.trim()||'❓';
  const p=document.getElementById('iconPreview');p.textContent=v;p.style.background=S.catColor+'22';
}
function buildColorRow(){
  document.getElementById('colorRow').innerHTML=PALETTE.map(col=>
    `<div class="color-dot${S.catColor===col?' sel':''}" style="background:${col}" onclick="S.catColor='${col}';buildColorRow();updateIconPreview()"></div>`
  ).join('');
}
function buildTypeRow(){document.querySelectorAll('.type-btn-cat').forEach(b=>b.classList.toggle('sel',b.dataset.t===S.catType));}
function selCatType(el,t){S.catType=t;document.querySelectorAll('.type-btn-cat').forEach(b=>b.classList.remove('sel'));el.classList.add('sel');}
async function handleCatSave(){
  const icon=document.getElementById('catIconInp').value.trim();
  const name=document.getElementById('catNameInp').value.trim();
  const budget=parseFloat(document.getElementById('catBudgetInp').value)||0;
  if(!icon){toast('Agrega un emoji','err');return;}
  if(!name){toast('Escribe un nombre','err');return;}
  
  const isNew = !S.catEditId;
  const id=S.catEditId||uid();
  const data={id,icon,name,color:S.catColor,type:S.catType,budget,created_at:Date.now()};
  
  toggleLoader(true);
  const {error} = await sbClient.from('categorias').upsert([data]);
  toggleLoader(false);
  
  if(error) {toast('Error al guardar. ¿RLS configurado bien?','err'); return;}

  if(isNew){
    S.cats.push(data);
  }else{
    const i=S.cats.findIndex(c=>c.id===S.catEditId);
    if(i>=0)S.cats[i]={...S.cats[i], ...data};
  }
  toast(isNew?'✅ Categoría creada':'✅ Categoría actualizada','ok');
  closeCatModal();render();
}
async function deleteCat(id){
  const c=S.cats.find(c=>c.id===id);
  if(!confirm(`¿Eliminar "${c?.name}"?`))return;
  
  toggleLoader(true);
  const {error} = await sbClient.from('categorias').delete().eq('id', id);
  toggleLoader(false);
  if(error){toast('Error al eliminar','err'); return;}
  
  S.cats=S.cats.filter(c=>c.id!==id);
  render();toast('🗑️ Eliminada','ok');
}

/* ── CTX MENU ───────────────────────────────────────── */
function openCtx(e,id){
  e.stopPropagation();S.ctxId=id;
  const menu=document.getElementById('ctx');
  menu.style.top=`${Math.min(e.clientY+window.scrollY,document.body.scrollHeight-110)}px`;
  menu.style.right='14px';menu.classList.add('open');
  setTimeout(()=>document.addEventListener('click',closeCtx,{once:true}),10);
}
function closeCtx(){document.getElementById('ctx').classList.remove('open');}
function ctxEdit(){closeCtx();openModal(S.ctxId);}
async function ctxDelete(){
  closeCtx();
  if(confirm('¿Eliminar este movimiento?')){
    toggleLoader(true);
    const {error} = await sbClient.from('movimientos').delete().eq('id', S.ctxId);
    toggleLoader(false);
    if(error){ toast('Error al eliminar','err'); return; }
    
    S.movs=S.movs.filter(m=>m.id!==S.ctxId); render();toast('🗑️ Eliminado','ok');
  }
}

/* ── EXPORT ───────────────────────────────────────────── */
function exportCSV(){
  const rows=[['Fecha','Tipo','Moneda','Categoría','Banco','Descripción','Monto']];
  [...(S.movs||[])].filter(m=>m.date&&m.date.startsWith(S.mon)).sort((a,b)=>new Date(a.date)-new Date(b.date))
    .forEach(m=>rows.push([m.date,m.type==='income'?'Ingreso':'Gasto',m.currency||'PEN',catById(m.categoryId).name,bankById(m.bankId)?.name||'',m.description||'',m.amount.toFixed(2)]));
  const csv=rows.map(r=>r.map(v=>`"${v}"`).join(',')).join('\n');
  const a=document.createElement('a');
  a.href='data:text/csv;charset=utf-8,\uFEFF'+encodeURIComponent(csv);
  a.download=`CavalFlow_${S.mon}.csv`;a.click();
  toast('📤 CSV exportado','ok');
}

/* ── TOAST ────────────────────────────────────────────── */
function toast(msg,type='ok'){
  const t=document.createElement('div');t.className=`toast-item ${type}`;t.textContent=msg;
  document.getElementById('toasts').prepend(t);setTimeout(()=>t.remove(),2900);
}

/* ── DATA HELPERS ─────────────────────────────────────── */
function monthMovs(mon){return (S.movs||[]).filter(m=>m.date&&m.date.startsWith(mon)).sort((a,b)=>new Date(b.date)-new Date(a.date));}
function summary(mon,cur='PEN'){
  const ms=monthMovs(mon).filter(m=>(m.currency||'PEN')===cur);
  return{inc:ms.filter(m=>m.type==='income').reduce((s,m)=>s+(parseFloat(m.amount)||0),0),
         exp:ms.filter(m=>m.type==='expense').reduce((s,m)=>s+(parseFloat(m.amount)||0),0)};
}
function catStats(mon,type){
  const ms=monthMovs(mon).filter(m=>m.type===type);
  const tot={};ms.forEach(m=>{tot[m.categoryId]=(tot[m.categoryId]||0)+(parseFloat(m.amount)||0);});
  const total=Object.values(tot).reduce((s,v)=>s+v,0);
  return Object.entries(tot).map(([id,amount])=>({id,amount,pct:total>0?Math.round(amount/total*100):0})).sort((a,b)=>b.amount-a.amount);
}
function bankStats(mon,type,cur=null){
  const ms=monthMovs(mon).filter(m=>m.type===type&&m.bankId&&(cur===null||(m.currency||'PEN')===cur));
  const tot={};ms.forEach(m=>{tot[m.bankId]=(tot[m.bankId]||0)+(parseFloat(m.amount)||0);});
  const total=Object.values(tot).reduce((s,v)=>s+v,0);
  return Object.entries(tot).map(([id,amount])=>({id,amount,pct:total>0?Math.round(amount/total*100):0})).sort((a,b)=>b.amount-a.amount);
}
function last6(){
  const[y,m]=S.mon.split('-').map(Number);
  return Array.from({length:6},(_,i)=>{const d=new Date(y,m-1-5+i,1);return`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;});
}
function catById(id){return (S.cats||[]).find(c=>c.id===id)||{icon:'💸',name:'Sin cat.',color:'#94a3b8'};}
function bankById(id){return (S.banks||[]).find(b=>b.id===id)||null;}

/* ── FORMAT ───────────────────────────────────────────── */
function fmtNum(n){
  return Math.abs(n||0).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});
}
function fmt(n,cur='PEN'){
  const sym=cur==='USD'?'US$':'S/';
  return`${sym} ${fmtNum(n)}`;
}
function fmtDate(s){if(!s)return'';const[y,m,d]=s.split('-').map(Number);return new Date(y,m-1,d).toLocaleDateString('es-PE',{day:'numeric',month:'short'});}
function cap(s){return s?s[0].toUpperCase()+s.slice(1):s;}
function uid(){return Date.now().toString(36)+Math.random().toString(36).slice(2);}
function nowYM(){return new Date().toISOString().slice(0,7);}
function todayStr(){return new Date().toISOString().split('T')[0];}
function emptyHTML(i,t,s){return`<div class="empty"><span class="ei">${i}</span><p class="et">${t}</p><p class="es">${s}</p></div>`;}

/* ── RESIZE ───────────────────────────────────────────── */
let rTimer;
window.addEventListener('resize',()=>{clearTimeout(rTimer);rTimer=setTimeout(()=>{Object.values(S.charts).forEach(c=>c?.destroy());S.charts={m:null,c:null,mb:null,cb:null,bk:null};render();},220);});

/* ── INIT ─────────────────────────────────────────────── */
checkAuth(); 
document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeModal();closeBankModal();closeCatModal();}});
