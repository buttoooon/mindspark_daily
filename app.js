// ===== STATE =====
let lang = load('ms_lang', 'uk');
let currentUser = load('ms_user', null);
let users = load('ms_users', []);
let cards = load(`ms_cards_${lang}`, null);
let activeCategory = 'all';
let authMode = 'login';
let isGenerating = false;

if (!cards) cards = getDemoCards(lang);

// ===== TRANSLATIONS =====
const T = {
  uk: {
    eyebrow: 'Щоденна доза натхнення',
    heroTitle: 'Живи цікавіше',
    heroSub: 'Перевірені наукові факти, мудрість і відкриття великих мислителів.',
    generate: 'Згенерувати інсайт',
    generating: 'Генерую…',
    all: 'Усі', saved: 'Збережені', signIn: 'Увійти', signUp: 'Реєстрація', signOut: 'Вийти',
    langSwitch: 'EN',
    savedTitle: 'Збережені',
    savedSub: (n) => `${n} інсайт${n===1?'':'ів'}`,
    noCards: 'Немає карток. Згенеруй першу вище.',
    noSaved: 'Немає збережених. Натисни закладку на будь-якій картці.',
    loginTitle: 'Ласкаво просимо', loginSub: 'Увійдіть у свій акаунт MindSpark',
    registerTitle: 'Створити акаунт', registerSub: 'Приєднуйтесь до MindSpark Daily',
    forgotTitle: 'Відновлення паролю', forgotSub: 'Введіть email для скидання',
    name: "Ім'я", email: 'Електронна пошта', password: 'Пароль', confirm: 'Підтвердіть пароль',
    forgot: 'Забули пароль?', noAccount: 'Немає акаунту?', haveAccount: 'Вже є акаунт?',
    sendReset: 'Надіслати посилання', resetSent: 'Якщо цей email зареєстровано — посилання надіслано.',
    backLogin: '← Повернутись до входу', memberSince: 'Учасник з',
    updateName: "Оновити ім'я", saveName: 'Зберегти',
    tabs: { info: 'Інфо', stats: 'Статистика', settings: 'Налаштування' },
    infoLabels: ["Ім'я", 'Email', 'Учасник з'],
    statsLabels: ['Усього', 'Збережено', 'Вподобано', 'Категорій'],
    sources: 'Джерела', verified: 'Перевірений факт', newBadge: 'Нове',
    readMore: 'Читати далі', showLess: 'Сховати',
    cats: ['Наука', 'Мистецтво', 'Історія', 'Філософія', 'Природа'],
    toastSaved: 'Збережено!', toastUnsaved: 'Вилучено зі збережених',
    toastNeedLogin: 'Увійдіть, щоб зберігати картки',
    toastGenerated: 'Новий інсайт готовий!', toastError: 'Помилка генерації — спробуй ще раз',
    toastNameSaved: "Ім'я оновлено",
    toastWelcomeBack: (n) => `З поверненням, ${n}!`,
    toastWelcome: (n) => `Ласкаво просимо, ${n}!`,
    toastOut: 'Ви вийшли з акаунту',
    errName: "Введіть ім'я", errEmail: 'Введіть дійсний email',
    errPass: 'Пароль — мінімум 6 символів', errMatch: 'Паролі не збігаються',
    errExists: 'Акаунт з таким email вже існує', errLogin: 'Невірний email або пароль',
    placeholder: { name: "Ваше ім'я", email: 'name@email.com', pass: '••••••••' },
    genPrompt: (cat) => `Ти куратор перевірених наукових знань. Знайди реальний, цікавий факт або відкриття з категорії "${cat}". Відповідай ТІЛЬКИ валідним JSON без markdown. Формат: {"title":"...","content":"2-3 речення українською про реальний факт...","author":"реальна людина або організація","year":"рік або період","sources":[{"label":"назва джерела","url":"https://реальне-посилання"}]}`,
  },
  en: {
    eyebrow: 'Daily dose of inspiration',
    heroTitle: 'Feed your curiosity',
    heroSub: 'Verified scientific facts, wisdom and discoveries from history\'s greatest thinkers.',
    generate: 'Generate insight', generating: 'Generating…',
    all: 'All', saved: 'Saved', signIn: 'Sign in', signUp: 'Sign up', signOut: 'Sign out',
    langSwitch: 'УК',
    savedTitle: 'Saved',
    savedSub: (n) => `${n} insight${n===1?'':'s'}`,
    noCards: 'No cards yet. Generate one above.',
    noSaved: 'No saved insights. Tap the bookmark on any card.',
    loginTitle: 'Welcome back', loginSub: 'Sign in to your MindSpark account',
    registerTitle: 'Create account', registerSub: 'Join MindSpark Daily',
    forgotTitle: 'Reset password', forgotSub: 'Enter your email to reset',
    name: 'Name', email: 'Email', password: 'Password', confirm: 'Confirm password',
    forgot: 'Forgot password?', noAccount: "Don't have an account?", haveAccount: 'Already have an account?',
    sendReset: 'Send reset link', resetSent: 'If that email is registered, a reset link has been sent.',
    backLogin: '← Back to sign in', memberSince: 'Member since',
    updateName: 'Update name', saveName: 'Save',
    tabs: { info: 'Info', stats: 'Stats', settings: 'Settings' },
    infoLabels: ['Name', 'Email', 'Member since'],
    statsLabels: ['Total', 'Saved', 'Liked', 'Categories'],
    sources: 'Sources', verified: 'Verified fact', newBadge: 'New',
    readMore: 'Read more', showLess: 'Show less',
    cats: ['Science', 'Art & Culture', 'History', 'Philosophy', 'Nature'],
    toastSaved: 'Saved!', toastUnsaved: 'Removed from saved',
    toastNeedLogin: 'Sign in to save cards',
    toastGenerated: 'New insight ready!', toastError: "Couldn't generate — try again",
    toastNameSaved: 'Name updated',
    toastWelcomeBack: (n) => `Welcome back, ${n}!`,
    toastWelcome: (n) => `Welcome to MindSpark, ${n}!`,
    toastOut: 'Signed out',
    errName: 'Enter your name', errEmail: 'Enter a valid email',
    errPass: 'Password must be at least 6 characters', errMatch: "Passwords don't match",
    errExists: 'An account with this email already exists', errLogin: 'Email or password is incorrect',
    placeholder: { name: 'Your name', email: 'name@email.com', pass: '••••••••' },
    genPrompt: (cat) => `You are a curator of verified scientific knowledge. Find a real, interesting fact or discovery from the category "${cat}". Respond ONLY with valid JSON, no markdown. Format: {"title":"...","content":"2-3 sentences about a real fact...","author":"real person or organization","year":"year or period","sources":[{"label":"source name","url":"https://real-link"}]}`,
  }
};

const CATS = [
  { id: 'science',    icon: 'ti-microscope', cls: 'badge-science' },
  { id: 'art',        icon: 'ti-palette',    cls: 'badge-art' },
  { id: 'history',    icon: 'ti-hourglass',  cls: 'badge-history' },
  { id: 'philosophy', icon: 'ti-brain',      cls: 'badge-philosophy' },
  { id: 'nature',     icon: 'ti-leaf',       cls: 'badge-nature' },
];

function catLabel(id) { return T[lang].cats[CATS.findIndex(c => c.id === id)] ?? id; }
function catMeta(id) { return CATS.find(c => c.id === id) || CATS[0]; }

function getDemoCards(l) {
  return l === 'uk' ? [
    { id:'d1', category:'science', title:'Квантова заплутаність', content:'Коли два квантові частинки стають заплутаними, вимірювання однієї миттєво впливає на стан іншої — незалежно від відстані між ними. Цей ефект підтверджений нобелівськими лауреатами 2022 року (Аспе, Клаузер, Цайлінгер).', author:'Аспе, Клаузер, Цайлінгер', year:'2022', sources:[{label:'Nobel Prize Physics 2022',url:'https://www.nobelprize.org/prizes/physics/2022/summary/'}], saved:false, liked:false },
    { id:'d2', category:'nature', title:'Мікоризні мережі лісів', content:'Дерева у лісі обмінюються вуглецем і поживними речовинами через підземні грибкові мережі — так звану «павутину лісу». Дослідження Сюзанни Сімар (UBC, 1997) показало, що материнські дерева цілеспрямовано передають вуглець молодим саджанцям.', author:'Suzanne Simard', year:'1997', sources:[{label:'Nature 388, 579–582',url:'https://www.nature.com/articles/41557'}], saved:false, liked:false },
    { id:'d3', category:'history', title:'Бібліотека Александрії', content:'У розквіті своєї слави Александрійська бібліотека зберігала від 400 000 до 700 000 сувоїв — найбільшу колекцію знань античного світу. Вчені з усього Середземномор\'я приїжджали сюди для навчання.', author:'Птолемей I', year:'~285 до н.е.', sources:[{label:'Wikipedia — Library of Alexandria',url:'https://en.wikipedia.org/wiki/Library_of_Alexandria'}], saved:false, liked:false },
    { id:'d4', category:'philosophy', title:'«Пізнай себе» — Сократ', content:'Дельфійський принцип «Пізнай себе» став наріжним каменем сократівської філософії. Сократ вважав, що мудрість починається з усвідомлення власного незнання.', author:'Сократ', year:'~470–399 до н.е.', sources:[{label:'Stanford Encyclopedia — Socrates',url:'https://plato.stanford.edu/entries/socrates/'}], saved:false, liked:false },
    { id:'d5', category:'art', title:'Золотий перетин у мистецтві', content:'Леонардо да Вінчі застосував золотий перетин (φ ≈ 1.618) у пропорціях Мони Лізи. Це математичне співвідношення зустрічається в спіралях мушель і архітектурі Парфенону.', author:'Леонардо да Вінчі', year:'1503–1519', sources:[{label:'Wikipedia — Golden ratio',url:'https://en.wikipedia.org/wiki/Golden_ratio'}], saved:false, liked:false },
  ] : [
    { id:'d1', category:'science', title:'Quantum Entanglement', content:'When two quantum particles become entangled, measuring one instantly affects the state of the other — regardless of the distance between them. Confirmed by the 2022 Nobel laureates in Physics.', author:'Aspect, Clauser, Zeilinger', year:'2022', sources:[{label:'Nobel Prize Physics 2022',url:'https://www.nobelprize.org/prizes/physics/2022/summary/'}], saved:false, liked:false },
    { id:'d2', category:'nature', title:'Forest Mycorrhizal Networks', content:'Trees exchange carbon and nutrients through underground fungal networks — the "wood wide web". Suzanne Simard\'s 1997 study showed mother trees deliberately transfer carbon to young seedlings.', author:'Suzanne Simard', year:'1997', sources:[{label:'Nature 388, 579–582',url:'https://www.nature.com/articles/41557'}], saved:false, liked:false },
    { id:'d3', category:'history', title:'The Library of Alexandria', content:'At its peak, the Library of Alexandria held between 400,000 and 700,000 scrolls — the largest collection of ancient knowledge ever assembled.', author:'Ptolemy I', year:'~285 BCE', sources:[{label:'Wikipedia — Library of Alexandria',url:'https://en.wikipedia.org/wiki/Library_of_Alexandria'}], saved:false, liked:false },
    { id:'d4', category:'philosophy', title:'"Know Thyself" — Socrates', content:'The Delphic maxim "Know thyself" became the cornerstone of Socratic philosophy. Socrates believed wisdom begins with recognising one\'s own ignorance.', author:'Socrates', year:'~470–399 BCE', sources:[{label:'Stanford Encyclopedia — Socrates',url:'https://plato.stanford.edu/entries/socrates/'}], saved:false, liked:false },
    { id:'d5', category:'art', title:'The Golden Ratio in Art', content:'Leonardo da Vinci applied the golden ratio (φ ≈ 1.618) in the proportions of the Mona Lisa. This ratio appears in shell spirals and the Parthenon.', author:'Leonardo da Vinci', year:'1503–1519', sources:[{label:'Wikipedia — Golden ratio',url:'https://en.wikipedia.org/wiki/Golden_ratio'}], saved:false, liked:false },
  ];
}

function load(key, fb) { try { const v=localStorage.getItem(key); return v?JSON.parse(v):fb; } catch { return fb; } }
function save(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); } catch {} }
function persist() { save(`ms_cards_${lang}`, cards); }

let toastTimer;
function showToast(msg, type='success') {
  const el=document.getElementById('toast');
  el.textContent=msg; el.className=`toast ${type}`;
  clearTimeout(toastTimer); toastTimer=setTimeout(()=>el.classList.add('hidden'),3500);
}

function showPage(name) {
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  document.getElementById('page'+name.charAt(0).toUpperCase()+name.slice(1)).classList.add('active');
  window.scrollTo(0,0);
  if(name==='home') renderCards();
  if(name==='saved') renderSaved();
  if(name==='profile') renderProfile();
  updateHeader();
}

function toggleLang() {
  lang=lang==='uk'?'en':'uk'; save('ms_lang',lang);
  const stored=load(`ms_cards_${lang}`,null);
  cards=stored||getDemoCards(lang);
  applyLang(); renderCards(); updateHeader();
}

function applyLang() {
  const t=T[lang];
  document.documentElement.lang=lang;
  setText('heroEyebrow',t.eyebrow); setText('heroTitle',t.heroTitle); setText('heroSub',t.heroSub);
  setText('generateLabel',isGenerating?t.generating:t.generate); setText('langLabel',t.langSwitch);
  setText('btnSignIn',t.signIn); setText('btnSignUp',t.signUp); setText('signOutLabel',t.signOut);
  buildCategoryStrip();
}
function setText(id,val){const el=document.getElementById(id);if(el)el.textContent=val;}

function updateHeader() {
  const guest=document.getElementById('navGuest'), user=document.getElementById('navUser');
  const count=cards.filter(c=>c.saved).length;
  const badge=document.getElementById('savedCount');
  if(currentUser){
    guest.classList.add('hidden'); user.classList.remove('hidden');
    document.getElementById('avatarBtn').textContent=currentUser.name.charAt(0).toUpperCase();
    badge.textContent=count; count>0?badge.classList.remove('hidden'):badge.classList.add('hidden');
  } else { guest.classList.remove('hidden'); user.classList.add('hidden'); }
  setText('btnSignIn',T[lang].signIn); setText('btnSignUp',T[lang].signUp); setText('langLabel',T[lang].langSwitch);
}

function buildCategoryStrip() {
  const t=T[lang];
  const strip=document.getElementById('categoryStrip');
  const all=[{id:'all',label:t.all,icon:'ti-layout-grid'},...CATS.map((c,i)=>({id:c.id,label:t.cats[i],icon:c.icon}))];
  strip.innerHTML=all.map(cat=>`<button class="cat-pill${activeCategory===cat.id?' active':''}" onclick="setCategory('${cat.id}')"><i class="ti ${cat.icon}"></i>${cat.label}</button>`).join('');
}
function setCategory(id){activeCategory=id;buildCategoryStrip();renderCards();}

function filteredCards(){
  if(activeCategory==='all') return cards;
  if(activeCategory==='saved') return cards.filter(c=>c.saved);
  return cards.filter(c=>c.category===activeCategory);
}

function renderCards(){
  const list=document.getElementById('cardsList'), t=T[lang], fc=filteredCards();
  if(!fc.length){list.innerHTML=`<div class="empty"><i class="ti ti-mood-empty"></i><p>${t.noCards}</p></div>`;return;}
  list.innerHTML=fc.map(c=>cardHTML(c)).join('');
}
function renderSaved(){
  const t=T[lang], saved=cards.filter(c=>c.saved);
  setText('savedTitle',t.savedTitle); setText('savedSub',t.savedSub(saved.length));
  const list=document.getElementById('savedList');
  if(!saved.length){list.innerHTML=`<div class="empty"><i class="ti ti-bookmark-off"></i><p>${t.noSaved}</p></div>`;return;}
  list.innerHTML=saved.map(c=>cardHTML(c)).join('');
}

function cardHTML(c){
  const t=T[lang], meta=catMeta(c.category);
  const hasSrc=Array.isArray(c.sources)&&c.sources.length>0;
  const srcHTML=hasSrc?c.sources.map(s=>`<a class="source-link" href="${s.url}" target="_blank" rel="noopener"><i class="ti ti-external-link"></i>${escHtml(s.label)}</a>`).join(''):'';
  return `<div class="card${c.fresh?' fresh':''}" id="card-${c.id}">
    <div class="card-top">
      <div class="card-badges">
        <span class="badge-pill ${meta.cls}"><i class="ti ${meta.icon}"></i>${catLabel(c.category)}</span>
        <span class="badge-pill badge-verified"><i class="ti ti-check"></i>${t.verified}</span>
        ${c.fresh?`<span class="badge-pill badge-new">${t.newBadge}</span>`:''}
      </div>
      <div class="card-actions">
        <button class="icon-btn${c.liked?' liked':''}" onclick="toggleLike('${c.id}')"><i class="ti ti-heart"></i></button>
        <button class="icon-btn${c.saved?' saved':''}" onclick="toggleSave('${c.id}')"><i class="ti ti-bookmark"></i></button>
      </div>
    </div>
    <h2 class="card-title">${escHtml(c.title)}</h2>
    <p class="card-content${c.content.length>240?' clamped':''}" id="content-${c.id}">${escHtml(c.content)}</p>
    <div class="card-footer">
      <span class="card-author">— ${escHtml(c.author)}${c.year?`, ${escHtml(c.year)}`:''}</span>
      <div class="card-foot-actions">
        ${hasSrc?`<button class="sources-btn" id="srcBtn-${c.id}" onclick="toggleSources('${c.id}')"><i class="ti ti-link"></i>${t.sources}</button>`:''}
        ${c.content.length>240?`<button class="read-more-btn" id="rmBtn-${c.id}" onclick="toggleExpand('${c.id}')">${t.readMore}</button>`:''}
      </div>
    </div>
    ${hasSrc?`<div class="sources-list hidden" id="sources-${c.id}">${srcHTML}</div>`:''}
  </div>`;
}
function escHtml(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}

function toggleSave(id){
  if(!currentUser){showToast(T[lang].toastNeedLogin,'error');return;}
  const card=cards.find(c=>c.id===id); if(!card)return;
  card.saved=!card.saved; persist();
  showToast(card.saved?T[lang].toastSaved:T[lang].toastUnsaved);
  const activePage=document.querySelector('.page.active').id;
  if(activePage==='pageHome')renderCards(); else if(activePage==='pageSaved')renderSaved();
  updateHeader();
}
function toggleLike(id){
  const card=cards.find(c=>c.id===id); if(!card)return;
  card.liked=!card.liked; persist();
  const activePage=document.querySelector('.page.active').id;
  if(activePage==='pageHome')renderCards(); else if(activePage==='pageSaved')renderSaved();
}
function toggleExpand(id){
  const content=document.getElementById(`content-${id}`), btn=document.getElementById(`rmBtn-${id}`), t=T[lang];
  content.classList.contains('clamped')?(content.classList.remove('clamped'),btn.textContent=t.showLess):(content.classList.add('clamped'),btn.textContent=t.readMore);
}
function toggleSources(id){
  document.getElementById(`sources-${id}`).classList.toggle('hidden');
  document.getElementById(`srcBtn-${id}`).classList.toggle('open');
}

async function generateCard(){
  if(isGenerating)return;
  const t=T[lang];
  const catId=(activeCategory==='all'||activeCategory==='saved')?CATS[Math.floor(Math.random()*CATS.length)].id:activeCategory;
  const catName=T[lang].cats[CATS.findIndex(c=>c.id===catId)];
  isGenerating=true;
  const btn=document.getElementById('btnGenerate'), icon=document.getElementById('generateIcon'), label=document.getElementById('generateLabel');
  btn.disabled=true; icon.className='ti ti-loader-2'; label.textContent=t.generating;
  try {
    const res=await fetch('/api/generate',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({prompt: t.genPrompt(catName)})
    });
    const data=await res.json();
    if(data.error) throw new Error(data.error);
    const text=data.text||'';
    const match=text.match(/\{[\s\S]*\}/);
    if(!match) throw new Error('no json');
    const parsed=JSON.parse(match[0]);
    const newCard={
      id:'c'+Date.now(), category:catId,
      title:parsed.title||'—', content:parsed.content||'—',
      author:parsed.author||'—', year:parsed.year||'',
      sources:Array.isArray(parsed.sources)?parsed.sources.filter(s=>s.label&&s.url):[],
      saved:false, liked:false, fresh:true,
    };
    cards.unshift(newCard); persist(); showToast(t.toastGenerated); renderCards();
  } catch(e){ showToast(t.toastError,'error'); }
  finally {
    isGenerating=false; btn.disabled=false; icon.className='ti ti-sparkles'; label.textContent=T[lang].generate;
  }
}

function openAuth(mode){
  authMode=mode; document.getElementById('modalOverlay').classList.remove('hidden');
  document.getElementById('authError').classList.add('hidden');
  ['inputEmail','inputPassword','inputName','inputConfirm','inputResetEmail'].forEach(id=>document.getElementById(id).value='');
  document.getElementById('resetSentMsg').classList.add('hidden');
  renderAuthModal();
}
function closeAuth(){document.getElementById('modalOverlay').classList.add('hidden');}
function closeAuthIfOutside(e){if(e.target===document.getElementById('modalOverlay'))closeAuth();}

function renderAuthModal(){
  const t=T[lang], isForgot=authMode==='forgot', isLogin=authMode==='login', isReg=authMode==='register';
  setText('modalTitle',isForgot?t.forgotTitle:isLogin?t.loginTitle:t.registerTitle);
  setText('modalSub',isForgot?t.forgotSub:isLogin?t.loginSub:t.registerSub);
  toggle('fieldName',isReg); toggle('fieldPassword',!isForgot); toggle('fieldConfirm',isReg);
  toggle('forgotRow',isLogin); toggle('fieldResetEmail',isForgot);
  setText('labelName',t.name); setText('labelEmail',t.email); setText('labelPassword',t.password);
  setText('labelConfirm',t.confirm); setText('labelResetEmail',t.email); setText('forgotLink',t.forgot);
  setText('resetSentText',t.resetSent);
  document.getElementById('inputName').placeholder=t.placeholder.name;
  document.getElementById('inputEmail').placeholder=t.placeholder.email;
  document.getElementById('inputPassword').placeholder=t.placeholder.pass;
  document.getElementById('inputConfirm').placeholder=t.placeholder.pass;
  document.getElementById('inputResetEmail').placeholder=t.placeholder.email;
  document.getElementById('authSubmitBtn').textContent=isForgot?t.sendReset:isLogin?t.signIn:t.signUp;
  const switchP=document.getElementById('authSwitch');
  if(isForgot){switchP.innerHTML=`<button class="btn-link" onclick="switchAuthMode()">${t.backLogin}</button>`;}
  else{switchP.innerHTML=`${isLogin?t.noAccount:t.haveAccount} <button class="btn-link" onclick="switchAuthMode()">${isLogin?t.signUp:t.signIn}</button>`;}
}
function toggle(id,show){const el=document.getElementById(id);if(!el)return;show?el.classList.remove('hidden'):el.classList.add('hidden');}
function switchAuthMode(){authMode=authMode==='forgot'?'login':authMode==='login'?'register':'login';document.getElementById('authError').classList.add('hidden');document.getElementById('resetSentMsg').classList.add('hidden');renderAuthModal();}
function switchForgot(){authMode='forgot';document.getElementById('authError').classList.add('hidden');renderAuthModal();}
function showAuthError(msg){const el=document.getElementById('authError');el.textContent=msg;el.classList.remove('hidden');}

function submitAuth(){
  const t=T[lang];
  if(authMode==='forgot'){document.getElementById('resetSentMsg').classList.remove('hidden');document.getElementById('authSubmitBtn').disabled=true;return;}
  const email=document.getElementById('inputEmail').value.trim(), password=document.getElementById('inputPassword').value;
  if(authMode==='login'){
    const found=users.find(u=>u.email===email&&u.password===password);
    if(!found){showAuthError(t.errLogin);return;}
    currentUser=found; save('ms_user',currentUser); closeAuth(); updateHeader(); showToast(t.toastWelcomeBack(found.name));
  } else {
    const name=document.getElementById('inputName').value.trim(), confirm=document.getElementById('inputConfirm').value;
    if(!name){showAuthError(t.errName);return;}
    if(!email.includes('@')){showAuthError(t.errEmail);return;}
    if(password.length<6){showAuthError(t.errPass);return;}
    if(password!==confirm){showAuthError(t.errMatch);return;}
    if(users.find(u=>u.email===email)){showAuthError(t.errExists);return;}
    const nu={id:Date.now(),name,email,password,joined:new Date().toLocaleDateString(lang==='uk'?'uk-UA':'en-GB')};
    users.push(nu); save('ms_users',users); currentUser=nu; save('ms_user',currentUser); closeAuth(); updateHeader(); showToast(t.toastWelcome(name));
  }
}

let activeTab='info';
function renderProfile(){
  if(!currentUser){showPage('home');return;}
  const t=T[lang];
  document.getElementById('profileAvatar').textContent=currentUser.name.charAt(0).toUpperCase();
  document.getElementById('profileName').textContent=currentUser.name;
  document.getElementById('profileSince').textContent=`${t.memberSince} ${currentUser.joined}`;
  document.getElementById('editNameInput').value=currentUser.name;
  setText('settingsNameLabel',t.updateName); setText('btnSaveName',t.saveName); setText('signOutLabel',t.signOut);
  ['info','stats','settings'].forEach((tab,i)=>{document.getElementById('tab'+tab.charAt(0).toUpperCase()+tab.slice(1)).textContent=Object.values(t.tabs)[i];});
  renderInfoTab(); renderStatsTab(); switchTab(activeTab);
}
function switchTab(tab){
  activeTab=tab;
  document.querySelectorAll('.tab').forEach(b=>b.classList.remove('active'));
  document.querySelectorAll('.tab-panel').forEach(p=>p.classList.remove('active'));
  document.getElementById('tab'+tab.charAt(0).toUpperCase()+tab.slice(1)).classList.add('active');
  document.getElementById('tabPanel'+tab.charAt(0).toUpperCase()+tab.slice(1)).classList.add('active');
}
function renderInfoTab(){
  const t=T[lang];
  const rows=[{icon:'ti-user',label:t.infoLabels[0],value:currentUser.name},{icon:'ti-mail',label:t.infoLabels[1],value:currentUser.email},{icon:'ti-calendar',label:t.infoLabels[2],value:currentUser.joined}];
  document.getElementById('infoCard').innerHTML=rows.map(r=>`<div class="info-row"><span class="info-label"><i class="ti ${r.icon}"></i>${r.label}</span><span class="info-value">${escHtml(r.value)}</span></div>`).join('');
}
function renderStatsTab(){
  const t=T[lang], saved=cards.filter(c=>c.saved).length, liked=cards.filter(c=>c.liked).length, cats=new Set(cards.map(c=>c.category)).size;
  const stats=[{cls:'stat-blue',icon:'ti-cards',num:cards.length,label:t.statsLabels[0]},{cls:'stat-purple',icon:'ti-bookmark',num:saved,label:t.statsLabels[1]},{cls:'stat-red',icon:'ti-heart',num:liked,label:t.statsLabels[2]},{cls:'stat-green',icon:'ti-category',num:cats,label:t.statsLabels[3]}];
  document.getElementById('statsGrid').innerHTML=stats.map(s=>`<div class="stat-card ${s.cls}"><i class="ti ${s.icon}"></i><div class="stat-num">${s.num}</div><div class="stat-label">${s.label}</div></div>`).join('');
}
function saveName(){
  const val=document.getElementById('editNameInput').value.trim(); if(!val)return;
  currentUser.name=val; save('ms_user',currentUser); users=users.map(u=>u.id===currentUser.id?currentUser:u); save('ms_users',users);
  showToast(T[lang].toastNameSaved); renderProfile(); updateHeader();
}
function logout(){currentUser=null;save('ms_user',null);updateHeader();showPage('home');showToast(T[lang].toastOut);}

function init(){applyLang();updateHeader();renderCards();}
document.addEventListener('DOMContentLoaded',init);
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeAuth();});
