# Portfolio — Ewann Oumarkatar

Portfolio de projets statique (HTML/CSS/JS), prêt pour **GitHub Pages**.

## Contenu

```
index.html            → page d'accueil (liste des projets)
sante/index.html      → copie interactive : Dashboard Santé & Productivité
sante/style.css       → styles de la démo santé
sante/app.js          → logique de la démo santé (données fictives)
trading/index.html    → copie interactive : Dashboard Gains Trading
_apercu/              → captures d'écran (non nécessaires à la publication)
```

Les deux démos sont **statiques mais interactives** : elles reproduisent la vraie
application (navigation, boutons, formulaires, coachs IA, calendrier, export CSV)
avec des **données fictives en dur**. Aucun backend, aucune donnée personnelle,
aucune requête réseau (les prix et l'IA sont simulés localement).
Chaque démo a un bouton **← Retour au portfolio** vers la page d'accueil.

### Ce qui est reproduit

**Santé** (`sante/`) — shell 5 onglets : Accueil (countdowns, agenda, tâches),
Calendrier (vue semaine/mois), Santé (snapshot, workout, sommeil, nutrition),
Études (Pomodoro fonctionnel, plan de révisions), Réglages. Un panneau
**Majordome** ouvre un chat avec 4 coachs IA (gym, sommeil, nutrition, études)
et route la question vers le bon coach.

**Trading** (`trading/`) — login, 3 onglets : *Solde SOL* (calendrier de saisie
du solde jour par jour, courbe d'évolution, KPI variation/duration/avg win),
*Dépenses* (calendrier cliquable, **sorties d'argent multi-devises** SOL/USDC/EUR/USD,
totaux par devise, import de reçu OCR simulé), *Tableau* (journal mensuel
gain/perte/dépense + **export CSV réel**).

---

*Projets réels : React + Node/Express + SQLite (dashboards privés). Ces pages sont des copies anonymisées avec données fictives.*
