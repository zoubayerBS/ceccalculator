// ===== STATE =====
const S = {
  patient: JSON.parse(sessionStorage.getItem('cec-patient') || '{}'),
  history: JSON.parse(sessionStorage.getItem('cec-history') || '[]'),
  co2Mode: 'alpha'
};

function saveHistory(entry) {
  entry.time = new Date().toLocaleTimeString('fr-FR', {hour:'2-digit',minute:'2-digit'});
  S.history.unshift(entry);
  if (S.history.length > 50) S.history.pop();
  sessionStorage.setItem('cec-history', JSON.stringify(S.history));
}

// ===== HELPERS =====
function v(id) { return document.getElementById(id)?.value || ''; }
function n(id) { return parseFloat(document.getElementById(id)?.value) || 0; }
function $(id) { return document.getElementById(id); }

function showResult(id, val, decimals) {
  const el = $(id);
  if (!el) return;
  el.textContent = (typeof val === 'number' && !isNaN(val)) ? val.toFixed(decimals ?? 2) : val;
}

function showAlert(id, level, msg) {
  const el = $(id);
  if (!el) return;
  el.className = 'alert-box ' + level;
  el.innerHTML = level === 'danger' ? '<i class="ti ti-alert-triangle"></i> ' + msg
    : level === 'warn' ? '<i class="ti ti-alert-circle"></i> ' + msg
    : level === 'info' ? '<i class="ti ti-info-circle"></i> ' + msg : '';
}

// ===== VALIDATION =====
const RULES = {
  'p-poids':  { min: 3,    max: 200, label: 'Poids' },
  'p-taille': { min: 50,   max: 220, label: 'Taille' },
  'p-age':    { min: 0,    max: 120, label: 'Âge' },
  'p-hb':     { min: 3,    max: 20,  label: 'Hb' },
  'p-hct':    { min: 10,   max: 60,  label: 'Hct' },
  'h-poids':  { min: 3,    max: 200, label: 'Poids' },
  'h-taille': { min: 50,   max: 220, label: 'Taille' },
  'h-ci':     { min: 0.5,  max: 8,   label: 'CI' },
  'h-hb-do2': { min: 3,    max: 20,  label: 'Hb' },
  'h-sao2':   { min: 50,   max: 100, label: 'SaO₂' },
  'h-pam':    { min: 10,   max: 150, label: 'PAM' },
  'h-pod':    { min: 0,    max: 80,  label: 'POD' },
  'h-dc':     { min: 0.5,  max: 10,  label: 'Débit' },
  'h-pam2':   { min: 10,   max: 150, label: 'PAM' },
  'h-pvc':    { min: -5,   max: 30,  label: 'PVC' },
  'h-t-act':  { min: 15,   max: 40,  label: 'T actuelle' },
  'h-t-cible':{ min: 20,   max: 40,  label: 'T cible' },
  'h-temps':  { min: 1,    max: 120, label: 'Temps' },
  'h-t-naso': { min: 15,   max: 40,  label: 'T naso' },
  'a-hct-pat':{ min: 10,   max: 60,  label: 'Hct' },
  'a-poids-hct':{ min: 3,  max: 200, label: 'Poids' },
  'a-vamor':  { min: 100,  max: 10000, label: 'Vol. amorçage' },
  'a-hct-cible':{ min: 10, max: 50,  label: 'Hct cible' },
  'a-hct-act':{ min: 10,   max: 50,  label: 'Hct actuel' },
  'a-vst':    { min: 500,  max: 15000, label: 'VST' },
  'a-hct-cgr':{ min: 40,   max: 100, label: 'Hct CGR' },
  'a-na':     { min: 100,  max: 180, label: 'Na' },
  'a-glucose':{ min: 0,    max: 30,  label: 'Glucose' },
  'a-uree':   { min: 0,    max: 50,  label: 'Urée' },
  'a-poids-hep':{ min: 3,  max: 200, label: 'Poids' },
  'a-dose-hep':{ min: 100, max: 100000, label: 'Dose héparine' },
  'c-poids-clas':{ min: 3, max: 200, label: 'Poids' },
  'c-duree-clas':{ min: 1, max: 600, label: 'Durée' },
  'c-interval':{ min: 5,   max: 120, label: 'Intervalle' },
  'c-poids-dn':{ min: 3,   max: 200, label: 'Poids' },
  'c-duree-dn':{ min: 1,   max: 600, label: 'Durée' },
  'c-poids-ped':{ min: 1,  max: 50,  label: 'Poids' },
  'c-duree-ped':{ min: 1,  max: 600, label: 'Durée' },
  'o-debit':  { min: 0.1,  max: 15,  label: 'Débit CPB' },
  'o-poids-fgf':{ min: 3,  max: 200, label: 'Poids' },
  'o-hb-fgf': { min: 3,    max: 20,  label: 'Hb' },
  'o-hct-fgf':{ min: 10,   max: 60,  label: 'Hct' },
  'o-pao2':   { min: 20,   max: 700, label: 'PaO₂' },
  'o-fio2':   { min: 21,   max: 100, label: 'FiO₂' },
  'o-debit-vo2':{ min: 0.1,max: 15,  label: 'Débit' },
  'o-poids-vo2':{ min: 3,  max: 200, label: 'Poids' },
  'o-hb-vo2': { min: 3,    max: 20,  label: 'Hb' },
  'o-hct-vo2':{ min: 10,   max: 60,  label: 'Hct' },
  'o-pao2-vo2':{ min: 20,  max: 700, label: 'PaO₂' },
  'o-svo2':   { min: 20,   max: 100, label: 'SvO₂' },
  'o-poids-qh':{ min: 3,   max: 200, label: 'Poids' },
  'o-bsa-qh': { min: 0.2,  max: 4,   label: 'Surface' },
};

function clearInvalid(el) {
  el.classList.remove('border-red-500', 'bg-red-50');
  el.removeAttribute('title');
}

function markInvalid(el, msg) {
  el.classList.add('border-red-500', 'bg-red-50');
  el.setAttribute('title', msg);
}

function validateFields(ids) {
  let ok = true;
  ids.forEach(id => {
    const el = $(id);
    if (!el) return;
    clearInvalid(el);
    const val = parseFloat(el.value);
    const rule = RULES[id];
    if (isNaN(val) || el.value.trim() === '') {
      markInvalid(el, 'Champ requis');
      ok = false;
    } else if (rule && (val < rule.min || val > rule.max)) {
      markInvalid(el, `${rule.label}: ${rule.min}–${rule.max}`);
      ok = false;
    }
  });
  return ok;
}

// ===== NAVIGATION =====
function switchView(btn) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  const viewId = btn.dataset.view;
  document.getElementById(viewId)?.classList.add('active');
  btn.classList.add('active');
  const idx = Array.from(btn.parentElement.children).indexOf(btn);
  const indicator = document.getElementById('nav-indicator');
  if (indicator) indicator.style.left = (idx * 20) + '%';
  window.scrollTo(0, 0);
}

// ===== QUICK ACCESS MODAL =====
const quickActions = [
  { label: 'SC / Débit', icon: 'ti-ruler-measure', section: 'hemo', fn: 'calcSC()' },
  { label: 'DO₂I', icon: 'ti-lungs', section: 'hemo', fn: 'calcDO2I()' },
  { label: 'Hct Prédit', icon: 'ti-droplet-half', section: 'amor', fn: 'calcHctPredit()' },
  { label: 'CGR', icon: 'ti-blood-bag', section: 'amor', fn: 'calcCGR()' },
  { label: 'Del Nido', icon: 'ti-heart-rate-monitor', section: 'cardio', fn: 'calcDelNido()' },
  { label: 'VO₂', icon: 'ti-lungs', section: 'oxy', fn: 'calcVO2()' },
];

function openQuick() {
  const modal = document.getElementById('quick-modal');
  const content = document.getElementById('modal-content');
  const container = document.getElementById('quick-buttons');
  container.innerHTML = quickActions.map(a =>
    `<button class="w-full flex items-center gap-3 bg-medical-input border border-medical-border rounded-lg p-3 mb-2 min-h-[48px] active:bg-[#e2e8f0] transition-colors" onclick="closeQuick();switchViewBySection('${a.section}');setTimeout(()=>${a.fn},300)">
      <i class="ti ${a.icon} text-medical-accent text-lg"></i>
      <span class="text-[0.85rem] font-semibold text-medical-text">${a.label}</span>
      <i class="ti ti-chevron-right text-medical-text2 text-sm ml-auto"></i>
    </button>`
  ).join('');
  modal.classList.remove('hidden');
  modal.classList.add('flex');
  setTimeout(() => { content.style.transform = 'scale(1)'; content.style.opacity = '1'; }, 10);
}

function closeQuick() {
  const modal = document.getElementById('quick-modal');
  const content = document.getElementById('modal-content');
  content.style.transform = 'scale(0.95)';
  content.style.opacity = '0';
  setTimeout(() => { modal.classList.add('hidden'); modal.classList.remove('flex'); }, 200);
}

function switchViewBySection(section) {
  const btn = document.querySelector(`.nav-btn[data-view="view-${section}"]`);
  if (btn) switchView(btn);
}

// ===== PATIENT =====
function savePatient() {
  if (!validateFields(['p-poids','p-taille','p-age','p-hb','p-hct'])) {
    showToast('Vérifie les champs en rouge');
    return;
  }
  const p = {
    nom: v('p-nom'), poids: n('p-poids'), taille: n('p-taille'),
    age: n('p-age'), sexe: v('p-sexe'), hb: n('p-hb'), hct: n('p-hct')
  };
  S.patient = p;
  sessionStorage.setItem('cec-patient', JSON.stringify(p));
  updateAccueil();
  showToast('Profil patient sauvegardé');
  saveHistory({section:'Profil', detail:`${p.poids}kg ${p.taille}cm ${p.sexe}`});
}

function clearPatient() {
  S.patient = {};
  sessionStorage.removeItem('cec-patient');
  ['p-nom','p-poids','p-taille','p-age','p-hb','p-hct'].forEach(id => {
    const el = document.getElementById(id);
    if (el) { el.value = el.defaultValue; clearInvalid(el); }
  });
  ['r-sc','r-bsa','r-imc','r-debit','r-ebv'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = '--';
  });
  showToast('Profil effacé');
}

function propagatePatient() {
  const p = S.patient;
  if (!p.poids) { showToast('Enregistre d\'abord un profil'); return; }
  const map = {
    'h-poids': p.poids, 'h-taille': p.taille, 'h-hb-do2': p.hb,
    'a-poids-hct': p.poids, 'a-hct-pat': p.hct, 'a-sexe-hct': p.sexe,
    'a-poids-hep': p.poids, 'c-poids-clas': p.poids, 'c-poids-dn': p.poids,
    'c-poids-ped': p.poids, 'o-poids-fgf': p.poids, 'o-hb-fgf': p.hb,
    'o-poids-vo2': p.poids, 'o-hb-vo2': p.hb, 'o-poids-qh': p.poids
  };
  Object.entries(map).forEach(([id, val]) => {
    const el = document.getElementById(id);
    if (el && val) el.value = val;
  });
  updateAccueil();
  showToast('Profil propagé');
}

// ===== ACCUEIL =====
function updateAccueil() {
  const p = S.patient;
  if (!p.poids || !p.taille) return;
  $('p-nom').value = p.nom || '';
  $('p-sexe').value = p.sexe || 'M';
  $('p-poids').value = p.poids;
  $('p-taille').value = p.taille;
  $('p-age').value = p.age || '';
  $('p-hb').value = p.hb || '';
  $('p-hct').value = p.hct || '';
  const sc = F.scDuBois(p.poids, p.taille);
  const bsa = F.scMosteller(p.poids, p.taille);
  const imc = p.poids / Math.pow(p.taille / 100, 2);
  const q = 2.4 * sc;
  const ebv = F.ebv(p.poids, p.sexe, p.age || 65);
  showResult('r-sc', sc, 2);
  showResult('r-bsa', bsa, 2);
  showResult('r-imc', imc, 1);
  showResult('r-debit', q, 1);
  showResult('r-ebv', ebv, 0);
}

// ===== TOAST =====
function showToast(msg, isError) {
  const t = $('toast');
  if (!t) return;
  t.textContent = msg;
  t.className = isError
    ? 'fixed top-16 left-1/2 -translate-x-1/2 z-[90] bg-red-600 text-white px-3 py-2 rounded-lg shadow-lg text-[0.8rem] font-semibold w-[90%] max-w-[360px] text-center'
    : 'fixed top-16 left-1/2 -translate-x-1/2 z-[90] bg-medical-primary text-white px-3 py-2 rounded-lg shadow-lg text-[0.8rem] font-semibold w-[90%] max-w-[360px] text-center';
  t.style.animation = 'toastIn .3s ease';
  clearTimeout(t._timer);
  t._timer = setTimeout(() => { t.style.animation = ''; t.className += ' hidden'; }, 2500);
}

// ===== EXPORT =====
function copySummary() {
  const lines = [];
  const els = {
    'SC DuBois': 'r-sc', 'BSA': 'r-bsa', 'IMC': 'r-imc', 'Débit': 'r-debit',
    'DO₂I': 'r-do2i', 'Hct prédit': 'r-hct-pred', 'VO₂': 'r-vo2', 'EO₂': 'r-eo2'
  };
  Object.entries(els).forEach(([k, id]) => {
    const val = $(id)?.textContent;
    if (val && val !== '--') lines.push(`${k}: ${val}`);
  });
  const txt = '[CEC] ' + (lines.length ? lines.join(' | ') : 'Aucun calcul effectué');
  navigator.clipboard.writeText(txt).then(() => {
    showToast('Résumé copié !');
  }).catch(() => {
    prompt('Copiez ce texte :', txt);
  });
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  if (S.patient.poids) updateAccueil();
  calcCMRO2();
  calcTempCP();
});
