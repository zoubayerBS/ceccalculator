// ===== SECTION 5: OXYGENATION =====

function calcFGF() {
  if (!validateFields(['o-debit','o-poids-fgf','o-hb-fgf','o-hct-fgf','o-pao2','o-fio2'])) { showToast('Vérifie les champs en rouge', true); return; }
  const debit = n('o-debit'), hb = n('o-hb-fgf'), hct = n('o-hct-fgf');
  const pao2 = n('o-pao2'), fio2 = n('o-fio2'), poids = n('o-poids-fgf');
  const bsa = F.scMosteller(poids, 170);
  const fgf = debit;
  const fgfL = bsa > 0 ? fgf / bsa : 0;
  const fgfMl = poids > 0 ? (fgf * 1000) / poids : 0;
  showResult('r-fgf', fgf, 1);
  showResult('r-fgf-l', fgfL, 1);
  showResult('r-fgf-ml', fgfMl, 1);
  if (fgf < 1.5) showAlert('alert-fgf', 'danger', 'FGF très bas — risque d\'hypoxie');
  else if (fgf < 2.0) showAlert('alert-fgf', 'warn', 'FGF bas — vérifier oxygénation');
  else showAlert('alert-fgf', 'ok', '');
  saveHistory({section:'FGF', detail:`${fgf.toFixed(1)} L/min`});
}

function calcC02() {
  const t = n('o-temp-oxy');
  if (t >= 30) {
    $('r-stat-mode').textContent = 'α-stat';
    showAlert('alert-stat', 'ok', 'α-stat : PaCO₂ cible 35–40 mmHg à 37°C');
  } else {
    $('r-stat-mode').textContent = 'pH-stat';
    showAlert('alert-stat', 'info', 'pH-stat : Ajout de CO₂ — Pédiatrie / hypothermie profonde');
  }
  saveHistory({section:'CO₂ mode', detail:`${t >= 30 ? 'α-stat' : 'pH-stat'} à ${t}°C`});
}

function calcVO2() {
  if (!validateFields(['o-debit-vo2','o-poids-vo2','o-hb-vo2','o-pao2-vo2','o-svo2'])) { showToast('Vérifie les champs en rouge', true); return; }
  const debit = n('o-debit-vo2'), hb = n('o-hb-vo2'), poids = n('o-poids-vo2');
  const pao2 = n('o-pao2-vo2'), svo2 = n('o-svo2');
  const bsa = F.scMosteller(poids, 170);
  const sao2 = 98;
  const cao2 = 1.34 * hb * (sao2 / 100) + 0.0031 * pao2;
  const cvo2 = 1.34 * hb * (svo2 / 100) + 0.0031 * 40;
  const vo2 = debit * (cao2 - cvo2) * 10;
  const vo2L = bsa > 0 ? vo2 / bsa : 0;
  const eo2 = cao2 > 0 ? ((cao2 - cvo2) / cao2) * 100 : 0;
  const cmro2 = vo2 * 0.01;
  showResult('r-vo2', vo2, 0);
  showResult('r-vo2-l', vo2L, 0);
  showResult('r-eo2', eo2, 1);
  showResult('r-cmro2', cmro2, 1);
  if (eo2 > 50) showAlert('alert-vo2', 'danger', 'EO₂ > 50% — Danger ! Augmenter débit ou Hct');
  else if (eo2 > 40) showAlert('alert-vo2', 'warn', 'EO₂ > 40% — Consommation O₂ élevée');
  else showAlert('alert-vo2', 'ok', '');
  saveHistory({section:'VO₂', detail:`${vo2.toFixed(0)} mL/min | EO₂ ${eo2.toFixed(1)}%`});
}

function calcQHypo() {
  if (!validateFields(['o-poids-qh','o-bsa-qh'])) { showToast('Vérifie les champs en rouge', true); return; }
  const poids = n('o-poids-qh');
  const ebv = F.ebv(poids, 'M', 40);
  const qh = ebv / 60;
  const qhMl = poids > 0 ? qh * 1000 / poids : 0;
  showResult('r-qh-l', qh, 1);
  showResult('r-qh-ml', qhMl, 1);
  if (qh < 1.5) showAlert('alert-qh', 'danger', 'Débit critique — risque d\'ischémie');
  else showAlert('alert-qh', 'ok', '');
  saveHistory({section:'Q hypo', detail:`${qh.toFixed(1)} L/min`});
}

function calcCMRO2() {
  const el = $('o-temp-oxy');
  if (!el) return;
  const t = n('o-temp-oxy') || 37;
  const q10 = 2.3;
  const cmro2 = Math.pow(q10, (t - 37) / 10) * 100;
  showResult('r-cmro2', cmro2, 0);
}
