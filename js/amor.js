// ===== SECTION 3: AMORCAGE =====
function addSegment() {
  const row = document.createElement('div');
  row.className = 'segment-row flex gap-1.5 items-end mb-1.5';
  row.innerHTML = `
    <div class="flex-[1.5] min-w-0">
      <label class="text-[0.65rem] text-medical-text2 uppercase tracking-wider font-medium">Type</label>
      <select class="seg-type w-full border border-medical-inputBd rounded px-2 py-1.5 text-[0.85rem] font-condensed font-medium outline-none min-h-[36px]" style="-webkit-appearance:none;appearance:none;background-color:#F8FAFC;background-image:url(&quot;data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%2394A3B8' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E&quot;);background-repeat:no-repeat;background-position:right 8px center;background-size:14px;padding-right:30px;cursor:pointer">
        <option>Oxygénateur</option><option>Réservoir veineux</option><option>Tubulures artérielles</option><option>Tubulures veineuses</option><option>Filtre artériel</option><option>Cardiotomie</option><option>Autre</option>
      </select>
    </div>
    <div class="flex-1 min-w-0">
      <label class="text-[0.65rem] text-medical-text2 uppercase tracking-wider font-medium">Vol <span class="font-normal text-medical-inputBd">mL</span></label>
      <input type="number" class="seg-vol w-full bg-medical-input border border-medical-inputBd rounded px-2 py-1.5 text-[0.85rem] font-condensed font-medium outline-none min-h-[36px]" value="0">
    </div>
    <button onclick="removeSegment(this)" title="Supprimer" class="seg-del">×</button>
  `;
  $('segments-list').appendChild(row);
}

function removeSegment(btn) {
  const rows = document.querySelectorAll('.segment-row');
  if (rows.length > 1) btn.closest('.segment-row').remove();
}

function calcAmorcTotal() {
  let total = 0;
  let valid = true;
  document.querySelectorAll('.seg-vol').forEach(el => {
    const val = parseFloat(el.value);
    if (isNaN(val) || val < 0) { markInvalid(el, 'Volume invalide'); valid = false; }
    else { clearInvalid(el); total += val; }
  });
  if (!valid) { showToast('Vérifie les volumes', true); return; }
  showResult('r-vamor', total, 0);
  saveHistory({section:'Amorçage', detail:`${total} mL`});
  showToast('Total calculé');
}

function calcHctPredit() {
  if (!validateFields(['a-hct-pat','a-poids-hct','a-vamor'])) { showToast('Vérifie les champs en rouge', true); return; }
  const hct = n('a-hct-pat'), poids = n('a-poids-hct'), vamor = n('a-vamor'), sexe = v('a-sexe-hct');
  const ebv = F.ebv(poids, sexe, n('p-age') || 65);
  const hp = F.hctPredit(hct, ebv, vamor);
  showResult('r-ebv-hct', ebv, 0);
  showResult('r-hct-pred', hp, 1);
  if (hp < 18) showAlert('alert-hct', 'danger', 'Hct < 18% — Transfusion ou ultrafiltration !');
  else if (hp < 21) showAlert('alert-hct', 'warn', 'Hct < 21% — Seuil bas');
  else showAlert('alert-hct', 'ok', '');
  saveHistory({section:'Hct prédit', detail:`${hp.toFixed(1)}%`});
}

function calcCGR() {
  if (!validateFields(['a-hct-cible','a-hct-act','a-vst','a-hct-cgr'])) { showToast('Vérifie les champs en rouge', true); return; }
  const hc = n('a-hct-cible'), ha = n('a-hct-act'), vst = n('a-vst'), hcg = n('a-hct-cgr');
  const v = F.cgr(hc, ha, vst, hcg / 100);
  showResult('r-cgr', v > 0 ? v : 0, 0);
  saveHistory({section:'CGR', detail:`${v > 0 ? v.toFixed(0) : 0} mL`});
}

function calcOsm() {
  if (!validateFields(['a-na','a-glucose','a-uree'])) { showToast('Vérifie les champs en rouge', true); return; }
  const na = n('a-na'), glu = n('a-glucose'), uree = n('a-uree');
  const o = F.osm(na, glu, uree);
  showResult('r-osm', o, 0);
  if (o < 280) showAlert('alert-osm', 'warn', 'Osmolarité basse — risque œdème cellulaire');
  else if (o > 310) showAlert('alert-osm', 'warn', 'Osmolarité élevée — déshydratation');
  else showAlert('alert-osm', 'ok', '');
  saveHistory({section:'Osmolarité', detail:`${o.toFixed(0)} mOsm/L`});
}

function calcHep() {
  if (!validateFields(['a-poids-hep'])) { showToast('Vérifie les champs en rouge', true); return; }
  const poids = n('a-poids-hep'), dose = n('a-protocole');
  const dMin = 300 * poids, dMax = 400 * poids;
  showResult('r-hep-min', dMin, 0);
  showResult('r-hep-max', dMax, 0);
  $('r-act').textContent = dose === '400' ? '> 400s' : '> 480s';
  saveHistory({section:'Héparine', detail:`${dMin}–${dMax} UI`});
}

function calcProt() {
  if (!validateFields(['a-dose-hep'])) { showToast('Vérifie les champs en rouge', true); return; }
  const hep = n('a-dose-hep');
  const prot = hep / 100;
  showResult('r-prot', prot, 0);
  saveHistory({section:'Protamine', detail:`${prot.toFixed(0)} mg`});
}
