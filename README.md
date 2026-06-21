# CEC Calculator

Application PWA de calcul pour la **Circulation Extracorporelle (CEC)** — conçue pour les perfusionnistes et anesthésistes en bloc opératoire cardiovasculaire.

## Fonctionnalités

### 📋 Accueil — Profil Patient
- Identité : nom, sexe, poids, taille, âge
- Biologie : Hb, Hct
- Calculs automatiques : SC DuBois/Mosteller, BSA, IMC, débit idéal, VST
- Propagation du profil à toutes les sections

### 🫀 Hémodynamique
- **Surface Corporelle** — DuBois & Mosteller
- **Débit de Pompe** — Q = IPC × SC (slider IPC 1.8–3.0)
- **DO₂I** — Indice de transport d'oxygène
- **RVS** — Résistances Vasculaires Systémiques
- **PPC** — Perfusion Cérébrale (PAM − PVC)
- **Réchauffement** — Vitesse ΔT/min + gradient artério-nasopharyngé

### 💉 Amorçage & Hémodilution
- **Volume d'amorçage** — segments dynamiques (oxygénateur, réservoir, tubulures...)
- **Hématocrite prédit** — hémodilution prédite
- **Volume CGR** — Concentré Globulaire à transfuser
- **Osmolarité** — Na, glucose, urée
- **Dose Héparine** — Standard (300 UI/kg) ou Hépariné (400 UI/kg)
- **Protamine** — Neutralisation (ratio 1mg/100UI)

### ❤️ Cardioplégie
- **Classique 4:1** — antegrade/rétrograde/combinée
- **Del Nido** — ratio 1:4 sang:cristalloïde + composition détaillée
- **Température** — froide/tiède/chaude (slider 4–37°C)
- **Pédiatrique** — < 15 kg, pression antegrade max

### 🌬️ O₂ & Gaz du Sang
- **FGF** — Débit gaz frais (L/min, L/min/m², mL/kg/min)
- **CO₂ / pH-Stat** — mode α-stat vs pH-stat (slider température)
- **VO₂ & EO₂** — Consommation oxygenique + CMRO₂
- **Débit critique** — Seuil d'hypoperfusion

## Fonctionnalités techniques

- **PWA** — installable, fonctionne hors ligne (Service Worker)
- **Validation** — 40+ règles de validation avec feedback visuel (bordure rouge, toast)
- **Navigation** — bottom nav 5 sections + FAB accès rapide
- **Persistance** — profil patient sauvé en sessionStorage
- **Historique** — 50 dernières calculs enregistrés
- **Mobile-first** — optimisé pour iPhone (safe-area-inset) et Android

## Stack technique

| Composant | Technologie |
|-----------|-------------|
| Structure | HTML5 sémantique |
| Style | Tailwind CSS (CDN) + CSS custom |
| JS | Vanilla JavaScript (zero framework) |
| Icônes | Tabler Icons (CDN) |
| Fonts | Barlow + Barlow Condensed (Google Fonts) |
| PWA | Service Worker natif |
| Offline | Cache-first strategy |

## Installation

### Utiliser l'application
1. Ouvrir `index.html` dans un navigateur
2. Ou servir via un serveur local :
```bash
python3 -m http.server 8000
# → http://localhost:8000
```

### Installer comme PWA
1. Ouvrir dans Chrome/Safari
2. Menu → "Ajouter à l'écran d'accueil"
3. L'app fonctionne maintenant hors ligne

## Structure du projet

```
ceccalculator/
├── index.html          # HTML principal (5 sections + nav + modal)
├── css/
│   └── style.css       # CSS custom (nav, alerts, slider, selects)
├── js/
│   ├── app.js          # État, navigation, validation, helpers
│   ├── formulas.js     # Formules pures (SC, EBV, Hct, DO₂I...)
│   ├── hemo.js         # Section 2: Hémodynamique
│   ├── amor.js         # Section 3: Amorçage
│   ├── cardio.js       # Section 4: Cardioplégie
│   └── oxy.js          # Section 5: O₂ & Gaz
└── sw.js               # Service Worker (cache offline)
```

## Références cliniques

- SC DuBois: `0.007184 × P^0.425 × T^0.725`
- SC Mosteller: `√(P × T / 3600)`
- EBV: `P × 70` (H) / `P × 65` (F)
- DO₂I: `CI × Hb × 1.34 × SaO₂ × 10`
- RVS: `(PAM − POD) / Q × 80`
- Osmolarité: `2×Na + Glucose/18 + Urée/2.8`
- Del Nido: `20 mL/kg` (max 1000 mL), ratio 1:4

## Auteur

**Zoubaier Bensaid** — Perfusionniste / Anesthésiste, Monastir, Tunisie

## Licence

Usage médical — responsable et supervisé uniquement.
