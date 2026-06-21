# Spécification technique & fonctionnelle — ValueBot (site tipster IA, Football & Tennis)

**Version** 1.1 · Concept : site de pronostics dont la gestion est assurée à 100% par un agent IA (« Hermès ») hébergé sur VPS. Bankroll publique, transparence totale, sources de données gratuites uniquement. Modèle freemium avec comptes utilisateurs.

> **Changelog**
> - **v1.1** — Ajout du modèle freemium (3 forfaits : Découverte / Pro / Expert), comptes utilisateurs (inscription, connexion, espace compte), intégration Stripe, conformité RGPD renforcée, endpoints API auth & abonnements.
> - **v1.0** — Version initiale.

---

## 1. Vision & objectifs

**ValueBot** démontre publiquement, preuves à l'appui, qu'un agent IA discipliné peut être **rentable à long terme** sur les paris football et tennis, **en ne misant que sur une sélection de matchs à valeur** (pas tous les matchs). Le produit n'est pas un opérateur de paris : c'est un **média d'analyse** qui publie des conseils générés par IA et tient une comptabilité virtuelle transparente.

**Objectifs mesurables (KPIs)**
- Yield positif sur ≥ 500 paris (le yield, pas le ROI brut, est le juge de paix).
- Drawdown maîtrisé (jamais > 30% de la bankroll de référence sans déclenchement de revue).
- Régularité de publication (cycle quotidien sans intervention humaine).
- Calibration : quand l'agent annonce « confiance 70% », la fréquence réelle de gain doit s'en approcher (suivi du Brier score).

**Principe de non-promesse** : le site ne garantit jamais de gains. Il affiche aussi ses séries perdantes. C'est la transparence des pertes qui rend la transparence des gains crédible.

---

## 2. Acteurs & rôles

| Acteur | Rôle |
|---|---|
| **Toi (Admin/Owner)** | Crée et héberge le site, configure le VPS, fixe les paramètres de risque (taille bankroll de départ, % max par pari, garde-fous), supervise. N'intervient **jamais** sur le contenu des conseils. |
| **Hermès (Agent IA)** | Collecte les données, sélectionne les matchs, calcule la valeur, décide des mises, relève les cotes, rédige et publie, règle les paris de la veille, met à jour la bankroll, s'auto-évalue et s'améliore. |
| **Visiteur (non inscrit)** | Consulte les pages publiques (accueil, bankroll, méthodologie, mentions légales). Voit les conseils en **différé (J+1)** uniquement. Ne dépose rien, ne parie pas sur le site. |
| **Utilisateur inscrit** | Crée un compte (email/mot de passe ou Google OAuth). Selon son **forfait** (Découverte / Pro / Expert), accède aux conseils en temps réel, analyses complètes, alertes value, exports CSV, accès API. Gère son profil, abonnement, notifications et sécurité depuis son espace compte. |
| **Stripe (prestataire paiement)** | Gère les transactions de paiement (abonnements, factures, renouvellements). Les données de carte bancaire ne transitent **jamais** par nos serveurs — conformité PCI DSS déléguée à Stripe. |

---

## 3. Conformité légale & jeu responsable (non négociable)

> À traiter en priorité : c'est ce qui distingue un projet sérieux d'un site qui se fait fermer.

- **Régulateur** : France = **ANJ (Autorité Nationale des Jeux)**, qui a remplacé l'ARJEL en juin 2020. Les cotes citées doivent provenir d'**opérateurs agréés ANJ** uniquement (Winamax, Betclic, Unibet, ParionsSport/FDJ, PMU, Genybet, Zebet, Vbet…). Ne jamais citer un opérateur illégal/non agréé.
- **Statut du site** : média éditorial / fournisseur de pronostics. **Il n'organise aucun jeu, n'encaisse aucune mise, ne verse aucun gain.** Pas de bouton « parier », pas de dépôt. Cela le maintient hors du champ de l'agrément opérateur.
- **Affiliation** (si un jour tu mets des liens bookmakers) : encadrée par l'ANJ ; communication non trompeuse, pas de promesse de gain, message d'avertissement obligatoire. À éviter au lancement pour rester neutre et crédible.
- **Mentions obligatoires sur chaque page** :
  - Interdiction aux mineurs (**18+**) + logo.
  - Avertissement risque : « Jouer comporte des risques : endettement, isolement, dépendance. »
  - Numéro **Joueurs Info Service : 09 74 75 13 13** (non surtaxé).
  - Mention « **Conseils générés par intelligence artificielle** » (demande explicite du concept + bonne pratique de transparence).
- **RGPD** (renforcé — comptes utilisateurs et paiement) :
  - **Données collectées** : nom, prénom, email, mot de passe hashé (ou identifiant Google), préférences de sport, historique de connexion. Les données de carte bancaire sont traitées **exclusivement par Stripe** et ne transitent jamais par nos serveurs.
  - **Bases légales** :
    - Exécution du contrat (art. 6.1.b) : données nécessaires à la fourniture du service (compte, abonnement).
    - Consentement (art. 6.1.a) : newsletter, notifications marketing (opt-in explicite).
    - Intérêt légitime (art. 6.1.f) : logs de sécurité, prévention de fraude.
  - **Bannière cookies** obligatoire avec consentement granulaire (cookies essentiels / analytics / marketing).
  - **Pages légales dédiées** : Politique de confidentialité, Conditions Générales d'Utilisation (CGU), Politique de cookies — accessibles depuis le footer de chaque page.
  - **Droits des utilisateurs** (art. 15-21) : accès, rectification, suppression (« droit à l'oubli »), portabilité, opposition. Suppression effective sous 30 jours maximum après demande. Interface de suppression dans l'espace compte (Sécurité).
  - **Sous-traitant paiement** : Stripe (conforme PCI DSS niveau 1). Contrat de sous-traitance (art. 28).
  - **Durée de conservation** : données de compte conservées tant que le compte est actif + 3 ans après suppression pour obligations légales. Factures conservées 10 ans (obligation comptable).
  - **DPO** : à désigner si le volume de données traitées le justifie (à évaluer au-delà de 5 000 utilisateurs).
- **Données & scraping** : ne consommer que des sources publiques et gratuites, en respectant les `robots.txt` et CGU. Privilégier les **API officielles à tier gratuit** et les **jeux de données ouverts** plutôt que le scraping agressif. Mettre en cache pour limiter les requêtes.
- **Propriété intellectuelle** : ne pas republier des contenus protégés (textes, données propriétaires payantes). Citer les sources de cotes avec horodatage.

---

## 4. Architecture technique

### 4.1 Vue d'ensemble (sur un seul VPS au départ)

```
                ┌─────────────────────────────────────────────┐
                │                   VPS                         │
                │                                               │
  Internet ──▶  │  [Reverse proxy: Caddy/Nginx + HTTPS]         │
                │        │                                      │
                │        ├──▶ Frontend (Next.js, SSR/SSG)        │
                │        └──▶ API backend (FastAPI ou Node)      │
                │                  │                            │
                │                  ▼                            │
                │            [PostgreSQL]  ◀── source de vérité │
                │                  ▲                            │
                │   ┌──────────────┴───────────────┐           │
                │   │   HERMÈS — Agent orchestrateur│           │
                │   │  (worker Python, déclenché par│           │
                │   │   cron/scheduler)             │           │
                │   │  ├─ Collecteurs de données    │           │
                │   │  ├─ Moteur d'analyse/valeur    │           │
                │   │  ├─ Moteur de staking/bankroll │           │
                │   │  ├─ Rédacteur (LLM via API)    │           │
                │   │  └─ Settlement + auto-éval     │           │
                │   └───────────────────────────────┘           │
                │            │                                  │
                │            ▼                                  │
                │   [Redis: cache + file de jobs]               │
                └─────────────────────────────────────────────┘
```

### 4.2 Stack recommandée
- **Frontend** : Next.js (React) — SSG pour les pages publiques (SEO), revalidation à chaque cycle de l'agent.
- **Backend/API** : FastAPI (Python) — pratique car l'agent et l'analyse sont aussi en Python ; ou Node/Express si tu préfères tout JS.
- **Base de données** : PostgreSQL (source de vérité : paris, bankroll, transactions).
- **Cache / files** : Redis (cache des données externes, throttling, file de jobs).
- **Agent** : worker Python qui appelle un LLM (API Claude) pour l'analyse rédactionnelle + raisonnement, et du code déterministe pour les calculs (EV, Kelly, bankroll).
- **Ordonnancement** : `cron` système ou un scheduler (APScheduler / Celery beat).
- **Reverse proxy + TLS** : Caddy (HTTPS auto) ou Nginx + certbot.
- **Conteneurisation** : Docker Compose (frontend, api, db, redis, agent) pour reproductibilité.
- **Sauvegardes** : dump PostgreSQL quotidien chiffré + rétention.

---

## 5. Sources de données (gratuites & publiques uniquement)

> Règle d'or : aucune source payante. API gratuites officielles > jeux de données ouverts > scraping respectueux en dernier recours.

**Football**
- **Understat** : xG / xA par équipe et joueur (Premier League, Liga, Bundesliga, Serie A, Ligue 1).
- **FBref** : stats avancées (xG, formes, logs de matchs).
- **football-data.org** : calendrier, résultats, classements (tier gratuit, clé API).
- **API-Football / API-Sports** : fixtures, stats, cotes (plan gratuit limité ~100 req/jour → mise en cache indispensable).

**Tennis**
- **Jeux de données ouverts de Jeff Sackmann** (dépôts GitHub `tennis_atp` / `tennis_wta`) : historique ATP/WTA, classements, résultats, surfaces — open data idéal pour modéliser.
- **Sites officiels ATP / WTA** : calendrier, classements, têtes de série, head-to-head.
- **Tennis Abstract** : stats détaillées et historiques.

**Cotes (toujours d'un opérateur agréé ANJ, horodatées)**
- **The Odds API** (tier gratuit ~500 req/mois) pour récupérer des cotes agrégées, OU relevé public des pages cotes des opérateurs ANJ (Winamax, Betclic…) en respectant leurs CGU.
- La cote stockée doit **toujours** indiquer : valeur, bookmaker, timestamp précis.

**Stratégie d'ingestion**
- Planifier les pulls (matin J pour les matchs du jour/lendemain).
- **Cache Redis** + table `sources` pour traçabilité (quelle donnée vient d'où, quand).
- Respecter quotas et `robots.txt`. Dégradation gracieuse si une source tombe (ne pas publier de pari sans données fiables).

---

## 6. Modèle de données (PostgreSQL — schéma simplifié)

```sql
-- Matchs / événements suivis
matches(
  id, sport ENUM('football','tennis'), competition, country,
  home_or_player1, away_or_player2, start_time TIMESTAMPTZ,
  status ENUM('scheduled','live','finished','cancelled'),
  result_json JSONB,            -- score final, vainqueur…
  data_quality SMALLINT,        -- score de fiabilité des données collectées
  created_at, updated_at
)

-- Cotes relevées (horodatées, opérateur ANJ)
odds_snapshots(
  id, match_id FK, market, selection,
  odd NUMERIC(6,3), bookmaker, captured_at TIMESTAMPTZ
)

-- Conseils / paris virtuels publiés
tips(
  id, match_id FK, sport, market, selection,
  estimated_probability NUMERIC(5,4),   -- proba estimée par l'agent
  fair_odd NUMERIC(6,3),                 -- 1/proba
  taken_odd NUMERIC(6,3),                -- cote retenue
  bookmaker, odd_captured_at TIMESTAMPTZ,
  expected_value NUMERIC(6,4),           -- EV (>0 requis pour publier)
  confidence SMALLINT,                   -- 1..5
  stake_units NUMERIC(5,2),              -- mise en unités
  rationale TEXT,                        -- analyse rédigée par l'IA
  status ENUM('pending','won','lost','void','cancelled'),
  pnl_units NUMERIC(7,2),                -- résultat en unités (réglé après match)
  model_version_id FK,
  published_at TIMESTAMPTZ, settled_at TIMESTAMPTZ
)

-- Bankroll : journal de transactions (source de vérité, jamais d'écrasement)
bankroll_ledger(
  id, tip_id FK NULL, type ENUM('init','bet_settled','adjustment'),
  delta_units NUMERIC(8,2), balance_after_units NUMERIC(10,2),
  created_at TIMESTAMPTZ
)

-- Versions du « cerveau » de l'agent (pour traçer l'auto-amélioration)
model_versions(
  id, label, params_json JSONB,  -- seuils EV, mapping confiance→unités, filtres…
  created_at, notes
)

-- Journal d'apprentissage quotidien (mémoire de l'agent)
learnings(
  id, date, period_metrics_json JSONB,  -- yield, ROI, calibration, drawdown…
  observations TEXT,                     -- ce que l'agent retient
  adjustments_json JSONB,                -- changements de paramètres décidés
  created_at
)

-- Traçabilité des sources de données
sources(id, name, url, fetched_at, http_status, cache_key, notes)

-- Utilisateurs (comptes)
users(
  id UUID PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT,              -- NULL si auth Google uniquement
  first_name TEXT,
  last_name TEXT,
  auth_provider ENUM('email','google'),
  google_id TEXT,                  -- identifiant Google OAuth (unique si non NULL)
  sports_followed TEXT[],          -- ex. {'football','tennis'}
  is_email_verified BOOLEAN DEFAULT false,
  two_factor_enabled BOOLEAN DEFAULT false,
  two_factor_secret TEXT,          -- secret TOTP chiffré (NULL si 2FA désactivé)
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)

-- Abonnements (lien avec Stripe)
subscriptions(
  id UUID PRIMARY KEY,
  user_id FK → users,
  plan ENUM('decouverte','pro','expert'),
  billing_cycle ENUM('monthly','annual'),
  status ENUM('active','cancelled','past_due','trialing'),
  stripe_subscription_id TEXT,     -- ID Stripe de la souscription
  stripe_customer_id TEXT,         -- ID Stripe du client
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ
)

-- Factures (synchronisées depuis Stripe)
invoices(
  id UUID PRIMARY KEY,
  user_id FK → users,
  subscription_id FK → subscriptions,
  stripe_invoice_id TEXT,          -- ID Stripe de la facture
  amount_cents INTEGER,            -- montant en centimes
  currency TEXT DEFAULT 'eur',
  status ENUM('paid','open','void','uncollectible'),
  pdf_url TEXT,                    -- lien vers le PDF Stripe
  period_start TIMESTAMPTZ,
  period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ
)

-- Préférences de notifications
notification_preferences(
  user_id FK → users PRIMARY KEY,
  daily_tips BOOLEAN DEFAULT true,       -- conseils du jour
  value_alerts BOOLEAN DEFAULT true,     -- alertes value en direct
  weekly_summary BOOLEAN DEFAULT true,   -- bilan hebdomadaire
  product_news BOOLEAN DEFAULT false     -- nouveautés produit (opt-in)
)
```

**Invariants**
- La bankroll se reconstruit **toujours** par somme du `bankroll_ledger` (append-only, auditable).
- Un `tip` n'est publiable que si `expected_value > seuil` et `status='pending'`.
- Une cote sans `bookmaker` + `captured_at` est invalide.
- Un `user` a **au plus** un `subscription` active à la fois.
- Les `invoices` sont synchronisées depuis Stripe via webhook — jamais créées manuellement.
- Un `password_hash` est **toujours** NULL si `auth_provider='google'` et **jamais** NULL si `auth_provider='email'`.
- Les données de carte bancaire ne sont **jamais** stockées dans notre base — elles restent chez Stripe.

---

## 7. Moteur de sélection & d'analyse (la méthodologie)

### 7.1 Philosophie : value betting + sélectivité
On ne parie pas pour « avoir raison souvent », mais pour avoir un **avantage (EV positif)**. On publie un conseil **seulement** si la proba estimée par l'agent × la cote disponible > 1 + marge de sécurité.

```
EV = (proba_estimée × cote_retenue) − 1
Publier le tip uniquement si EV ≥ seuil_min  (ex. 0.03 → +3% d'espérance)
```

### 7.2 Estimation de probabilité (déterministe, pas « au feeling »)
- **Football** : modèle de base de type Poisson/Dixon-Coles sur les xG (force d'attaque/défense, avantage domicile), ajusté par la forme récente, absences/compositions si dispo publiquement. Sortie : proba 1X2, Over/Under, BTTS.
- **Tennis** : modèle Elo par surface (données Sackmann) + ajustements (head-to-head, forme, fatigue/calendrier, abandon récent). Sortie : proba vainqueur, et marchés dérivés simples.
- Le LLM (Hermès) **n'invente pas** les probabilités : il orchestre les modèles, arbitre, rédige le raisonnement, et applique les filtres qualitatifs (ex. « match piège », info de dernière minute).

### 7.3 Filtres de sélectivité (raisons de NE PAS parier)
- Données insuffisantes / `data_quality` faible.
- EV trop faible ou marge bookmaker trop élevée (cote « juice »).
- Incertitude forte (compo non connue, météo, doute physique en tennis).
- Marché trop volatil ou cote périmée.
- Objectif : **qualité > quantité**. Zéro pari un jour est un résultat acceptable.

### 7.4 Niveau de confiance (1 à 5)
Dérivé de la combinaison (taille de l'edge EV) × (fiabilité des données) × (stabilité du modèle). Sert à l'affichage **et** au staking.

---

## 8. Gestion de bankroll & staking

- **Unité de référence** : bankroll de départ = **100 unités** (1 unité = 1% de la bankroll initiale ; valeur € fixée par toi, ex. 1u = 10€, mais le site raisonne en unités pour rester comparable).
- **Staking = Kelly fractionné plafonné** (prudent) :
  ```
  kelly_fraction = (proba × (cote − 1) − (1 − proba)) / (cote − 1)
  stake_units = clamp( kelly_fraction × bankroll_units × FRACTION , 0 , STAKE_MAX )
  ```
  - `FRACTION` (ex. 0.25 = quart de Kelly) pour lisser la variance.
  - `STAKE_MAX` = plafond dur (ex. 3 unités) — **garde-fou anti-ruine**.
  - Mapping lisible pour l'affichage : confiance 1→0.5u, 2→1u, 3→1.5u, 4→2u, 5→3u (borné par le calcul Kelly).
- **Garde-fous bankroll** :
  - Mise max par pari : `STAKE_MAX` (jamais dépassée).
  - Exposition max par jour (somme des mises du jour plafonnée).
  - **Stop-loss / revue** : si drawdown > seuil (ex. −30%), l'agent passe en mode conservateur (réduit FRACTION) et déclenche une revue dans `learnings`.
- **Settlement** : après chaque match, l'agent fixe `status` (won/lost/void), calcule `pnl_units` (mise × (cote−1) si gagné, −mise si perdu, 0 si void) et écrit une ligne `bankroll_ledger`.

---

## 9. Boucle d'auto-amélioration (le « s'améliore tous les jours »)

À chaque cycle, l'agent ne fait pas que parier : il **apprend**.

1. **Settlement** des paris échus → mise à jour bankroll.
2. **Mesure** : yield, ROI, taux de réussite, cote moyenne, drawdown, **calibration** (Brier score : la confiance annoncée colle-t-elle aux résultats réels ?).
3. **Diagnostic** : sur quels marchés/sports/types de cote l'agent sur- ou sous-performe ? Les surfaces tennis ? Les overs football ?
4. **Ajustement contrôlé** : modifier les seuils (EV min, FRACTION, filtres) — mais par **petits incréments** et en versionnant (`model_versions`), jamais de revirement brutal sur une mauvaise journée (la variance n'est pas un signal).
5. **Journalisation** : écrire dans `learnings` (métriques + observations + ajustements). C'est la **mémoire persistante** qui survit entre les exécutions.

> Important : l'auto-amélioration est *prudente et traçable*. On évite le sur-apprentissage sur le bruit. Une règle ne change qu'avec un échantillon suffisant.

---

## 10. Frontend — pages & UX

| Page | Contenu |
|---|---|
| **Accueil** | Hero + 3 chiffres live (bankroll, yield, nb paris), courbe de bankroll, conseils du jour, bandeau « 100% IA », footer jeu responsable. |
| **Conseils** | Liste filtrable (sport, statut). Cartes de pari : pari, confiance, unités, cote + bookmaker + horodatage, statut, P/L, analyse IA. Accès **en différé (J+1)** pour les visiteurs non inscrits et forfait Découverte ; **temps réel** pour Pro/Expert. |
| **Détail d'un pari** | Page dédiée par conseil : analyse IA complète, facteurs de valeur identifiés, barre proba IA vs proba implicite, contexte & forme (5 derniers résultats, face-à-face), traçabilité (opérateur ANJ, horodatage, non modifié), disclaimer IA. |
| **Bankroll & Performance** | Dashboard public : courbe (filtrable 7j/30j/tout), KPIs (yield, ROI, win rate, cote moy., drawdown max, plus longues séries gagnante et perdante), répartition par sport, encart « nos pires séries » (transparence des pertes), historique des paris exportable CSV. |
| **Méthodologie** | Pipeline en 8 étapes (collecte → auto-amélioration), explication value betting, sélectivité (~6% des matchs), unités (0,5 → 3 u), identité visuelle (logo dark/light/favicon). |
| **Connexion** | Formulaire email/mot de passe + bouton Google OAuth. Lien « Mot de passe oublié ? ». Lien vers inscription. Disclaimer : « Accès aux analyses IA pédagogiques. Aucun pari, aucun dépôt. » |
| **Inscription** | Formulaire (prénom, email, mot de passe) + bouton Google OAuth. Case à cocher obligatoire : certification 18+ et acceptation CGU. Lien vers connexion. |
| **Tarifs** | 3 forfaits en cartes comparatives, toggle mensuel/annuel. Mention « sans engagement, résiliable en 1 clic ». Disclaimer : aucune somme n'est jouée. |
| **Souscription** | Formulaire de paiement (Stripe Elements), récapitulatif commande (forfait, prix, période, économies annuelles). Paiement chiffré via Stripe. |
| **Compte** | 5 onglets : **Profil** (nom, email, sports suivis), **Abonnement** (forfait actuel, stats usage, changement/annulation), **Facturation** (moyen de paiement, historique factures téléchargeables), **Notifications** (toggles : conseils, alertes value, bilan hebdo, news), **Sécurité** (mot de passe, 2FA TOTP, suppression de compte). |
| **Mentions légales** | Page dédiée : statut éditorial (média d'analyse, pas opérateur), ANJ, 18+, Joueurs Info Service, **CGU**, **Politique de confidentialité** (RGPD), **Politique de cookies**. |

**Forfaits**

| Forfait | Prix mensuel | Prix annuel | Fonctionnalités |
|---|---|---|---|
| **Découverte** | Gratuit | Gratuit | Conseils en différé (J+1), bankroll publique en temps réel, 1 sport au choix, bilan hebdomadaire par email |
| **Pro** | 19 €/mois | 15 €/mois (facturé annuellement) | Tous les conseils en temps réel, Football + Tennis, analyses IA complètes, alertes value en direct, historique détaillé, notifications email & push |
| **Expert** | 39 €/mois | 29 €/mois (facturé annuellement) | Tout le forfait Pro + accès API (cotes & signaux), export CSV illimité, filtres value personnalisés, support prioritaire |

UX : **mobile-first** (bottom tab bar sur mobile, responsive grids, `clamp()` pour les tailles de texte), chiffres tabulaires (`font-variant-numeric: tabular-nums`), code couleur vert (#16C784) / rouge (#EA3943), badge IA omniprésent, horodatage des cotes toujours visible.

---

## 11. Backend — API (exemples d'endpoints)

```
# ── Endpoints publics (lecture seule, cache, revalidés à chaque cycle agent) ──

GET  /api/tips?sport=&status=         → liste des conseils (paginée)
                                        • non authentifié / Découverte : J+1 uniquement
                                        • Pro / Expert : temps réel
GET  /api/tips/:id                    → détail d'un conseil + analyse
GET  /api/bankroll                    → solde courant + série temporelle
GET  /api/performance                 → KPIs agrégés (yield, ROI, calibration…)
GET  /api/methodology                 → contenu statique méthodo

# ── Authentification ──

POST /api/auth/register               → inscription email/mot de passe
POST /api/auth/login                   → connexion, retourne access + refresh JWT
POST /api/auth/google                  → OAuth Google (authorization code flow)
POST /api/auth/forgot-password         → envoi email de réinitialisation
POST /api/auth/reset-password          → réinitialisation mot de passe (token)
POST /api/auth/verify-email            → vérification email (token)
POST /api/auth/refresh                 → renouvellement access token via refresh token

# ── Compte utilisateur (auth requise) ──

GET    /api/account                    → profil utilisateur
PATCH  /api/account                    → mise à jour profil (nom, sports suivis)
DELETE /api/account                    → suppression de compte (RGPD art. 17)
PATCH  /api/account/password           → changement de mot de passe
POST   /api/account/2fa/enable         → activer 2FA (retourne QR code TOTP)
POST   /api/account/2fa/disable        → désactiver 2FA (vérification code requis)
GET    /api/account/notifications      → préférences de notifications
PATCH  /api/account/notifications      → mise à jour des préférences

# ── Abonnements & paiement (auth requise, intégration Stripe) ──

GET    /api/subscription               → abonnement actuel (plan, statut, période)
POST   /api/subscription               → créer abonnement (redirige vers Stripe Checkout)
PATCH  /api/subscription               → changer de forfait (upgrade/downgrade)
DELETE /api/subscription               → annuler abonnement (fin de période)
GET    /api/invoices                    → historique des factures
GET    /api/invoices/:id/pdf           → télécharger facture PDF (lien Stripe)
POST   /api/webhooks/stripe            → webhook Stripe (non authentifié, signature vérifiée)
                                         Événements gérés : invoice.paid, invoice.payment_failed,
                                         customer.subscription.updated, customer.subscription.deleted

# ── Endpoints internes (token, réservés à l'agent Hermès, réseau local) ──

POST  /internal/tips                   → publie un conseil (validé EV>seuil)
PATCH /internal/tips/:id/settle        → règle un pari, écrit le ledger
POST  /internal/learnings              → enregistre le bilan quotidien
```

- Endpoints publics en **lecture seule**, mis en cache (revalidés à chaque cycle agent).
- Endpoints `/api/auth/*` : rate-limités (5 tentatives/min par IP, lockout progressif).
- Endpoints `/api/account/*` et `/api/subscription/*` : requièrent un JWT valide.
- Endpoints `/api/webhooks/stripe` : vérification de signature Stripe (clé secrète webhook), idempotence sur l'ID d'événement.
- Endpoints `/internal/*` protégés par token, accessibles uniquement depuis le worker Hermès (réseau local du VPS).
- **Middleware d'autorisation par forfait** : les endpoints `/api/tips` filtrent le contenu selon le plan de l'utilisateur (Découverte = J+1, Pro/Expert = temps réel).

---

## 12. Orchestration de l'agent (pipeline quotidien)

Déclenché par cron (ex. 2 passages/jour : matin pour préparer, et un passage de settlement) :

```
JOB cycle_quotidien:
  1. fetch_data()            # sources gratuites, cache, data_quality
  2. settle_previous()       # régler paris échus → ledger → bankroll
  3. compute_metrics()       # yield, ROI, calibration, drawdown
  4. select_candidates()     # matchs football+tennis à venir
  5. estimate_probabilities()# modèles (Poisson/Dixon-Coles, Elo surface)
  6. fetch_odds()            # cotes ANJ horodatées
  7. compute_value()         # EV, filtre EV>=seuil, sélectivité
  8. size_stakes()           # Kelly fractionné plafonné + garde-fous
  9. write_rationale()       # LLM rédige l'analyse de chaque tip
 10. publish_tips()          # POST /internal/tips (status=pending)
 11. self_improve()          # diagnostic + ajustements versionnés
 12. journal()               # POST /internal/learnings (mémoire)
```

Idempotence : un même match ne génère pas deux tips. Tout est loggé.

---

## 13. Sécurité & exploitation

**Infrastructure**
- HTTPS partout (Caddy/Nginx + certbot).
- Secrets (clés API, token interne, accès LLM, clés Stripe, secret webhook) dans un gestionnaire de secrets / `.env` hors-repo, jamais en clair côté client.
- Endpoints internes non exposés publiquement (firewall / réseau Docker interne).
- **Sauvegardes** PostgreSQL quotidiennes chiffrées (la bankroll est l'actif le plus précieux : son intégrité = la crédibilité du site).
- Rate limiting sur l'API publique.
- Logs d'exécution de l'agent conservés (audit du « pourquoi ce pari »).

**Authentification & comptes utilisateurs**
- **Mots de passe** : hashage bcrypt ou argon2id (coût élevé), jamais stockés en clair. Politique de mot de passe : 8 caractères minimum.
- **JWT** : access token courte durée (15 min) + refresh token longue durée (7 jours, stocké en cookie `httpOnly`, `Secure`, `SameSite=Strict`). Rotation du refresh token à chaque utilisation.
- **OAuth Google** : flux authorization code (RFC 6749). Le `google_id` est stocké en base, jamais le token Google.
- **2FA** : TOTP (RFC 6238, compatible Google Authenticator / Authy). Secret chiffré en base (AES-256). Codes de récupération à usage unique fournis à l'activation.
- **Rate limiting auth** : 5 tentatives de connexion/min par IP, lockout progressif (1 min, 5 min, 15 min). Protection brute-force sur les endpoints `/api/auth/*`.
- **Sessions** : invalidation globale possible (« se déconnecter de tous les appareils ») via versioning du refresh token.
- **Vérification email** : token à usage unique, expiration 24h. Accès limité tant que l'email n'est pas vérifié.

**Paiement & données financières**
- Les données de carte bancaire ne sont **jamais** stockées ni traitées côté serveur. Le formulaire de paiement utilise **Stripe Elements** (ou Stripe Checkout) — conformité PCI DSS déléguée intégralement à Stripe.
- Les webhooks Stripe sont vérifiés par signature (`stripe-signature` header + clé secrète webhook). Traitement idempotent (dédoublonnage par `event.id`).
- Les clés Stripe (publishable key côté client, secret key côté serveur) sont stockées dans des variables d'environnement, jamais commitées.

**Protection des données personnelles (RGPD)**
- **Suppression de compte** : suppression effective des données personnelles sous 30 jours après demande (interface dans l'espace compte > Sécurité). Les données de facturation sont conservées 10 ans (obligation comptable, anonymisées).
- **Chiffrement au repos** : les champs sensibles (`two_factor_secret`) sont chiffrés en base (AES-256).
- **Minimisation** : ne collecter que les données strictement nécessaires au service.

---

## 14. Observabilité

- Dashboard interne : succès/échec des cycles, sources tombées, quotas API restants.
- Alerte (email/Telegram) si : un cycle échoue, une source critique est indisponible, le drawdown franchit un seuil, une cote semble aberrante.
- Métriques de calibration suivies dans le temps (le site doit *prouver* qu'il s'améliore).
- **Monitoring paiements** : alerte si le taux d'échec de paiement dépasse un seuil (ex. >5% sur 7 jours). Suivi des webhooks Stripe (nombre reçus, traités, échoués, retries). Alerte si un webhook échoue 3 fois de suite.
- **Monitoring auth** : suivi des tentatives de connexion échouées par IP (détection brute-force), taux d'inscription, taux de vérification email.

---

## 15. SEO & contenu

- Pages SSG indexables : chaque conseil = une page (compétition, équipes/joueurs, analyse).
- Schema.org `SportsEvent`, balises OpenGraph (partage des cartes de pari).
- Bilan hebdo/mensuel auto-généré (« Performance de la semaine ») = contenu frais récurrent.

---

## 16. Roadmap par phases

| Phase | Contenu | But |
|---|---|---|
| **0 — Socle** | VPS, Docker, PostgreSQL, frontend statique (Next.js), mentions légales, badge IA, **authentification** (inscription email + Google OAuth, table `users`, JWT), pages Connexion / Inscription | Site « vitrine » conforme avec comptes utilisateurs |
| **1 — Données** | Collecteurs football + tennis, cache Redis, table `sources`, `data_quality` | Données fiables gratuites |
| **2 — Cerveau** | Modèles proba (Poisson/Elo), EV, staking Kelly plafonné, bankroll ledger | Premiers tips internes (paper-trading non publié) |
| **3 — Publication** | Hermès rédige + publie, dashboard bankroll public live, **système d'abonnement** (intégration Stripe, tables `subscriptions` / `invoices`, pages Tarifs / Souscription), **espace compte** (profil, abonnement, facturation, notifications, sécurité), **middleware d'autorisation par forfait** (Découverte J+1 / Pro-Expert temps réel) | Lancement public avec monétisation |
| **4 — Apprentissage** | Boucle `learnings`, calibration, ajustements versionnés, alerting | « S'améliore tous les jours » |
| **5 — Croissance** | SEO, bilans auto, newsletter (RGPD), **page mentions légales / CGU / RGPD complète**, forfait Expert avec **accès API** (cotes & signaux), export CSV illimité | Audience et monétisation avancée |

---

## 17. Critères de succès

- Cycle quotidien **autonome** sans intervention humaine sur le contenu.
- Bankroll publique reconstituable et auditable à 100% via le ledger.
- Sélectivité réelle (jours sans pari acceptés).
- Yield positif et **calibration qui s'améliore** sur ≥ 500 paris.
- Conformité ANJ / jeu responsable irréprochable.

> ⚠️ Avertissement à afficher et à garder en tête : les paris sportifs comportent un risque réel de perte et d'addiction. Ce projet est une démonstration analytique transparente, **sans aucune garantie de gain**. 18+. Joueurs Info Service : 09 74 75 13 13.
