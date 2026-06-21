// ===== SECTION 4: CARDIOPLEGIE =====
function calcCardioClas() {
  if (!validateFields(['c-poids-clas','c-duree-clas','c-interval'])) { showToast('Vérifie les champs en rouge', true); return; }
  const poids = n('c-poids-clas'), duree = n('c-duree-clas'), interv = n('c-interval') || 20;
  const induc = 20 * poids;
  const entret = 10 * poids;
  const nbDoses = Math.ceil(duree / interv) - 1;
  const volTotal = induc + Math.max(0, nbDoses) * entret;
  showResult('r-indu-clas', induc, 0);
  showResult('r-entret', entret, 0);
  showResult('r-nb-dose', Math.max(0, nbDoses), 0);
  showResult('r-vol-tot-clas', volTotal, 0);
  $('r-debit-cardio').textContent = '150–300';
  saveHistory({section:'Cardio class.', detail:`Ind: ${induc}mL | Tot: ${volTotal}mL`});
  showToast('Cardioplégie calculée');
}

function calcDelNido() {
  if (!validateFields(['c-poids-dn','c-duree-dn'])) { showToast('Vérifie les champs en rouge', true); return; }
  const poids = n('c-poids-dn'), duree = n('c-duree-dn');
  let vol = 20 * poids;
  if (vol > 1000) vol = 1000;
  if (duree > 120) {
    vol += 10 * poids;
    showAlert('alert-dn', 'warn', 'Durée > 120 min — redose 10 mL/kg ajoutée');
  } else {
    showAlert('alert-dn', 'ok', '');
  }
  showResult('r-vol-dn', vol, 0);

  const ratio = 4;
  const sang = vol / (ratio + 1);
  const cristalloide = vol - sang;
  const nacl = cristalloide * 0.820;
  const mannitol = cristalloide * 0.032;
  const mgso4 = cristalloide * 0.004;
  const nahco3 = cristalloide * 0.013;
  const kcl = cristalloide * 0.013;
  const lido = cristalloide * 0.013;

  $('dn-composition').innerHTML = `
    <table class="table is-fullwidth is-size-7 mt-1">
      <tbody>
        <tr class="has-background-primary-light"><td class="has-text-weight-semibold">Sang oxygéné</td><td class="has-text-right has-text-weight-bold">${sang.toFixed(0)} mL</td></tr>
        <tr><td>NaCl 0.9%</td><td class="has-text-right">${nacl.toFixed(0)} mL</td></tr>
        <tr><td>Mannitol 20%</td><td class="has-text-right">${mannitol.toFixed(0)} mL</td></tr>
        <tr><td>MgSO₄ 50%</td><td class="has-text-right">${mgso4.toFixed(1)} mL</td></tr>
        <tr><td>NaHCO₃ 8.4%</td><td class="has-text-right">${nahco3.toFixed(1)} mL</td></tr>
        <tr><td>KCl 15%</td><td class="has-text-right">${kcl.toFixed(1)} mL</td></tr>
        <tr><td>Lidocaïne 1%</td><td class="has-text-right">${lido.toFixed(1)} mL</td></tr>
      </tbody>
    </table>`;
  saveHistory({section:'Del Nido', detail:`${vol} mL`});
  showToast('Del Nido calculé');
}

function calcTempCP() {
  const el = $('c-temp-cp');
  if (!el) return;
  const t = n('c-temp-cp');
  if (t <= 10) {
    $('r-temp-cp-val').textContent = 'Froide';
    $('r-temp-cp-rec').textContent = '4–10°C : Cardioplégie froide classique';
  } else if (t <= 28) {
    $('r-temp-cp-val').textContent = 'Tiède';
    $('r-temp-cp-rec').textContent = '11–28°C : Cardioplégie tiède';
  } else {
    $('r-temp-cp-val').textContent = 'Chaude';
    $('r-temp-cp-rec').textContent = '29–37°C : Cardioplégie chaude continue';
  }
}

function calcCardioPed() {
  if (!validateFields(['c-poids-ped','c-duree-ped'])) { showToast('Vérifie les champs en rouge', true); return; }
  const poids = n('c-poids-ped'), duree = n('c-duree-ped') || 45;
  const induc = 30 * poids;
  const entret = 15 * poids;
  const nbDoses = Math.ceil(duree / 20) - 1;
  const volTotal = induc + Math.max(0, nbDoses) * entret;
  showResult('r-indu-ped', induc, 0);
  showResult('r-entret-ped', entret, 0);
  $('r-p-max-ped').textContent = '50';
  showResult('r-vol-tot-ped', volTotal, 0);
  saveHistory({section:'Cardio péd.', detail:`${poids}kg — ${volTotal}mL`});
  showToast('Cardio pédiatrique calculée');
}
