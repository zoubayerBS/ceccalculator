// ===== SECTION 2: HEMODYNAMIQUE =====
function calcSC() {
  if (!validateFields(['h-poids','h-taille'])) { showToast('Vérifie les champs en rouge', true); return; }
  const p = n('h-poids'), t = n('h-taille');
  showResult('r-sc-dub', F.scDuBois(p, t));
  showResult('r-sc-mos', F.scMosteller(p, t));
  saveHistory({section:'SC', detail:`Dubois: ${F.scDuBois(p,t).toFixed(2)} m²`});
  showToast('SC calculée');
}

function calcDebit() {
  if (!validateFields(['h-sc-debit'])) { showToast('Vérifie les champs en rouge', true); return; }
  const ipc = n('h-ipc'), sc = n('h-sc-debit');
  const qc = ipc * sc, qmin = 2.0 * sc, qmax = 2.8 * sc;
  showResult('r-q-cible', qc, 1);
  showResult('r-q-min', qmin, 1);
  showResult('r-q-max', qmax, 1);
  if (qc < 1.8 * sc) showAlert('alert-debit', 'danger', 'Débit insuffisant — risque hypoperfusion');
  else showAlert('alert-debit', 'ok', '');
  saveHistory({section:'Débit', detail:`${qc.toFixed(1)} L/min`});
}

function calcDO2I() {
  if (!validateFields(['h-ci','h-hb-do2','h-sao2'])) { showToast('Vérifie les champs en rouge', true); return; }
  const ci = n('h-ci'), hb = n('h-hb-do2'), sao2 = n('h-sao2');
  const d = F.do2i(ci, hb, sao2);
  showResult('r-do2i', d, 0);
  if (d < 280) showAlert('alert-do2i', 'danger', 'DO₂I critiques — risque d\'hypoxie tissulaire !');
  else if (d < 400) showAlert('alert-do2i', 'warn', 'DO₂I bas — augmenter débit ou hématocrite');
  else showAlert('alert-do2i', 'ok', '');
  saveHistory({section:'DO₂I', detail:`${d.toFixed(0)} mL/min/m²`});
}

function calcRVS() {
  if (!validateFields(['h-pam','h-pod','h-dc'])) { showToast('Vérifie les champs en rouge', true); return; }
  const pam = n('h-pam'), pod = n('h-pod'), dc = n('h-dc');
  const r = F.rvs(pam, pod, dc);
  showResult('r-rvs', r, 0);
  if (r < 800) showAlert('alert-rvs', 'info', 'RVS basses — vasodilatation');
  else if (r > 1400) showAlert('alert-rvs', 'warn', 'RVS élevées — vasoconstriction');
  else showAlert('alert-rvs', 'ok', '');
  saveHistory({section:'RVS', detail:`${r.toFixed(0)} dynes·s/cm⁵`});
}

function calcPPC() {
  if (!validateFields(['h-pam2','h-pvc'])) { showToast('Vérifie les champs en rouge', true); return; }
  const pam = n('h-pam2'), pvc = n('h-pvc');
  const p = F.ppc(pam, pvc);
  showResult('r-ppc', p, 0);
  if (p < 50) showAlert('alert-ppc', 'danger', 'PPC < 50 mmHg — risque d\'ischémie cérébrale !');
  else showAlert('alert-ppc', 'ok', '');
  saveHistory({section:'PPC', detail:`${p} mmHg`});
}

function calcRech() {
  if (!validateFields(['h-t-act','h-t-cible','h-temps','h-t-naso'])) { showToast('Vérifie les champs en rouge', true); return; }
  const tAct = n('h-t-act'), tCible = n('h-t-cible'), temps = n('h-temps'), tNaso = n('h-t-naso');
  const dt = Math.abs(tCible - tAct) / temps;
  showResult('r-dtmin', dt, 2);
  const gradient = Math.abs(tCible - tNaso);
  if (gradient > 10) showAlert('alert-rech', 'danger', `Gradient artério-naso ${gradient.toFixed(1)}°C > 10°C ! Risque neuro`);
  else showAlert('alert-rech', 'ok', '');
  saveHistory({section:'ΔT/min', detail:`${dt.toFixed(2)} °C/min`});
}
