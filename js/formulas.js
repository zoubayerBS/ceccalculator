const F = {
  scDuBois: (p, t) => 0.007184 * Math.pow(p, 0.425) * Math.pow(t, 0.725),
  scMosteller: (p, t) => Math.sqrt(p * t / 3600),
  ebv: (poids, sexe, age) => {
    if (age < 10) return poids * 85;
    if (age < 15) return poids * 80;
    return sexe === 'F' ? poids * 65 : poids * 70;
  },
  hctPredit: (hct, ebv, vamor) => (ebv * hct) / (ebv + vamor),
  do2i: (ci, hb, sao2) => ci * hb * 1.34 * (sao2 / 100) * 10,
  rvs: (pam, pod, dc) => dc > 0 ? ((pam - pod) / dc) * 80 : 0,
  ppc: (pam, pvc) => pam - pvc,
  cgr: (hctCible, hctAct, vst, hctCGR) => vst > 0 ? ((hctCible - hctAct) * vst) / hctCGR : 0,
  osm: (na, glucose, uree) => 2 * na + glucose / 18 + uree / 2.8
};
