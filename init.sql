-- ValueBot — PostgreSQL schema
-- Exécuté automatiquement au premier lancement du container

-- Enums
CREATE TYPE sport_type AS ENUM ('football', 'tennis');
CREATE TYPE match_status AS ENUM ('scheduled', 'live', 'finished', 'cancelled');
CREATE TYPE tip_status AS ENUM ('pending', 'won', 'lost', 'void', 'cancelled');
CREATE TYPE ledger_type AS ENUM ('init', 'bet_settled', 'adjustment');

-- Matchs / événements suivis
CREATE TABLE matches (
  id SERIAL PRIMARY KEY,
  sport sport_type NOT NULL,
  competition VARCHAR(255) NOT NULL,
  country VARCHAR(100),
  home_or_player1 VARCHAR(255) NOT NULL,
  away_or_player2 VARCHAR(255) NOT NULL,
  start_time TIMESTAMPTZ NOT NULL,
  status match_status NOT NULL DEFAULT 'scheduled',
  result_json JSONB,
  data_quality SMALLINT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Versions du modèle IA
CREATE TABLE model_versions (
  id SERIAL PRIMARY KEY,
  label VARCHAR(100) NOT NULL,
  params_json JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  notes TEXT
);

-- Cotes relevées (horodatées, opérateur ANJ)
CREATE TABLE odds_snapshots (
  id SERIAL PRIMARY KEY,
  match_id INTEGER REFERENCES matches(id),
  market VARCHAR(100) NOT NULL,
  selection VARCHAR(255) NOT NULL,
  odd NUMERIC(6,3) NOT NULL,
  bookmaker VARCHAR(100) NOT NULL,
  captured_at TIMESTAMPTZ NOT NULL
);

-- Conseils / paris virtuels publiés
CREATE TABLE tips (
  id SERIAL PRIMARY KEY,
  match_id INTEGER REFERENCES matches(id),
  sport sport_type NOT NULL,
  market VARCHAR(100) NOT NULL,
  selection VARCHAR(255) NOT NULL,
  estimated_probability NUMERIC(5,4),
  fair_odd NUMERIC(6,3),
  taken_odd NUMERIC(6,3) NOT NULL,
  bookmaker VARCHAR(100) NOT NULL,
  odd_captured_at TIMESTAMPTZ NOT NULL,
  expected_value NUMERIC(6,4),
  confidence SMALLINT NOT NULL CHECK (confidence BETWEEN 1 AND 5),
  stake_units NUMERIC(5,2) NOT NULL,
  rationale TEXT,
  status tip_status NOT NULL DEFAULT 'pending',
  pnl_units NUMERIC(7,2),
  model_version_id INTEGER REFERENCES model_versions(id),
  published_at TIMESTAMPTZ DEFAULT NOW(),
  settled_at TIMESTAMPTZ
);

-- Bankroll : journal de transactions (append-only, source de vérité)
CREATE TABLE bankroll_ledger (
  id SERIAL PRIMARY KEY,
  tip_id INTEGER REFERENCES tips(id),
  type ledger_type NOT NULL,
  delta_units NUMERIC(8,2) NOT NULL,
  balance_after_units NUMERIC(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Journal d'apprentissage quotidien
CREATE TABLE learnings (
  id SERIAL PRIMARY KEY,
  date DATE NOT NULL,
  period_metrics_json JSONB,
  observations TEXT,
  adjustments_json JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Traçabilité des sources de données
CREATE TABLE sources (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  url TEXT,
  fetched_at TIMESTAMPTZ,
  http_status SMALLINT,
  cache_key VARCHAR(255),
  notes TEXT
);

-- Enums utilisateurs
CREATE TYPE auth_provider_type AS ENUM ('email', 'google');
CREATE TYPE subscription_plan AS ENUM ('decouverte', 'pro', 'expert');
CREATE TYPE billing_cycle_type AS ENUM ('monthly', 'annual');
CREATE TYPE subscription_status AS ENUM ('active', 'cancelled', 'past_due', 'trialing');
CREATE TYPE invoice_status AS ENUM ('paid', 'open', 'void', 'uncollectible');

-- Utilisateurs (comptes)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT,
  first_name TEXT,
  last_name TEXT,
  auth_provider auth_provider_type NOT NULL DEFAULT 'email',
  google_id TEXT UNIQUE,
  sports_followed TEXT[] DEFAULT '{"football","tennis"}',
  is_email_verified BOOLEAN DEFAULT false,
  two_factor_enabled BOOLEAN DEFAULT false,
  two_factor_secret TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Contrainte : password obligatoire si auth email
ALTER TABLE users ADD CONSTRAINT chk_password_email
  CHECK (auth_provider = 'google' OR password_hash IS NOT NULL);

-- Abonnements (lien Stripe)
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  plan subscription_plan NOT NULL DEFAULT 'decouverte',
  billing_cycle billing_cycle_type NOT NULL DEFAULT 'monthly',
  status subscription_status NOT NULL DEFAULT 'active',
  stripe_subscription_id TEXT,
  stripe_customer_id TEXT,
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Une seule subscription active par user
CREATE UNIQUE INDEX idx_one_active_sub_per_user
  ON subscriptions(user_id) WHERE status = 'active';

-- Factures (synchronisées depuis Stripe)
CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES subscriptions(id) ON DELETE SET NULL,
  stripe_invoice_id TEXT,
  amount_cents INTEGER NOT NULL,
  currency TEXT DEFAULT 'eur',
  status invoice_status NOT NULL DEFAULT 'open',
  pdf_url TEXT,
  period_start TIMESTAMPTZ,
  period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Préférences de notifications
CREATE TABLE notification_preferences (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  daily_tips BOOLEAN DEFAULT true,
  value_alerts BOOLEAN DEFAULT true,
  weekly_summary BOOLEAN DEFAULT true,
  product_news BOOLEAN DEFAULT false
);

-- Index utiles
CREATE INDEX idx_tips_sport ON tips(sport);
CREATE INDEX idx_tips_status ON tips(status);
CREATE INDEX idx_tips_published ON tips(published_at DESC);
CREATE INDEX idx_matches_start ON matches(start_time);
CREATE INDEX idx_odds_match ON odds_snapshots(match_id);
CREATE INDEX idx_ledger_created ON bankroll_ledger(created_at);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_google_id ON users(google_id) WHERE google_id IS NOT NULL;
CREATE INDEX idx_subscriptions_user ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_invoices_user ON invoices(user_id);

-- =============================================
-- Données de seed (mock)
-- =============================================

-- Model version
INSERT INTO model_versions (label, params_json, notes) VALUES
('v1.0-launch', '{"ev_min": 0.03, "kelly_fraction": 0.25, "stake_max": 3}', 'Version initiale du modèle');

-- Bankroll init
INSERT INTO bankroll_ledger (tip_id, type, delta_units, balance_after_units) VALUES
(NULL, 'init', 100.00, 100.00);

-- Matchs
INSERT INTO matches (id, sport, competition, home_or_player1, away_or_player2, start_time, status) VALUES
(1, 'tennis', 'ATP Masters 1000 — Rome', 'Alcaraz', 'Sinner', NOW() + INTERVAL '2 hours', 'scheduled'),
(2, 'football', 'Ligue 1 — J34', 'OM', 'OL', NOW() + INTERVAL '4 hours', 'scheduled'),
(3, 'football', 'Serie A — J37', 'Inter', 'Milan', NOW() + INTERVAL '1 day', 'scheduled'),
(4, 'tennis', 'WTA 1000 — Rome', 'Świątek', 'Gauff', NOW() - INTERVAL '1 day', 'finished'),
(5, 'football', 'Ligue des Champions — 1/2', 'Real Madrid', 'Man City', NOW() - INTERVAL '2 days', 'finished'),
(6, 'football', 'Ligue 1 — J33', 'Monaco', 'Lens', NOW() - INTERVAL '4 days', 'finished'),
(7, 'football', 'Ligue 1 — J32', 'PSG', 'Brest', NOW() - INTERVAL '7 days', 'finished'),
(8, 'tennis', 'WTA 1000 — Rome', 'Sabalenka', 'Rybakina', NOW() - INTERVAL '5 days', 'cancelled'),
(9, 'tennis', 'ATP 500 — Halle', 'Medvedev', 'Zverev', NOW() - INTERVAL '9 days', 'finished');

-- Tips
INSERT INTO tips (id, match_id, sport, market, selection, estimated_probability, taken_odd, bookmaker, odd_captured_at, expected_value, confidence, stake_units, rationale, status, pnl_units, model_version_id) VALUES
(1, 1, 'tennis', '1X2', 'Victoire Alcaraz', 0.6200, 1.850, 'Winamax', NOW(), 0.1470, 4, 2.00, 'Alcaraz domine le secteur retour sur terre battue.', 'pending', NULL, 1),
(2, 2, 'football', 'Over/Under', '+2,5 buts', 0.6400, 1.720, 'Betclic', NOW(), 0.1008, 3, 1.50, 'Les deux attaques dans le top 4 des xG.', 'pending', NULL, 1),
(3, 3, 'football', 'Over/Under', 'Moins de 3,5 buts', 0.6400, 1.660, 'Unibet', NOW(), 0.0624, 3, 1.50, 'Les derbys milanais à enjeu sont historiquement fermés.', 'pending', NULL, 1),
(4, 4, 'tennis', '1X2', 'Victoire Świątek', 0.6800, 1.550, 'Unibet', NOW() - INTERVAL '2 days', 0.0540, 5, 3.00, 'Świątek 11-1 face à Gauff sur terre.', 'won', 1.65, 1),
(5, 5, 'football', '1X2', 'Victoire Real Madrid', 0.5200, 2.100, 'Winamax', NOW() - INTERVAL '3 days', 0.0920, 4, 2.00, 'Avantage à domicile et historique européen.', 'lost', -2.00, 1),
(6, 6, 'football', 'BTTS', 'Les deux équipes marquent', 0.5800, 1.800, 'PMU', NOW() - INTERVAL '5 days', 0.0440, 3, 1.50, 'BTTS validé dans 64% des matchs combinés.', 'won', 1.20, 1),
(7, 7, 'football', 'Handicap', 'PSG −1,5', 0.5500, 1.950, 'Winamax', NOW() - INTERVAL '8 days', 0.0725, 4, 2.00, 'Écart de niveau majeur, dynamique offensive PSG.', 'won', 1.90, 1),
(8, 8, 'tennis', '1X2', 'Victoire Sabalenka', 0.6000, 1.700, 'Betclic', NOW() - INTERVAL '6 days', 0.0200, 3, 1.50, 'Forfait Rybakina. Mise remboursée.', 'void', 0.00, 1),
(9, 9, 'tennis', '1X2', 'Victoire Medvedev', 0.4800, 2.250, 'Betclic', NOW() - INTERVAL '10 days', 0.0800, 2, 1.00, 'Pari de value sur gazon.', 'lost', -1.00, 1);

-- Bankroll ledger entries pour les paris réglés
INSERT INTO bankroll_ledger (tip_id, type, delta_units, balance_after_units) VALUES
(9, 'bet_settled', -1.00, 99.00),
(7, 'bet_settled', 1.90, 100.90),
(8, 'bet_settled', 0.00, 100.90),
(6, 'bet_settled', 1.20, 102.10),
(5, 'bet_settled', -2.00, 100.10),
(4, 'bet_settled', 1.65, 101.75);

-- Utilisateur de test (alex.martin@email.com / password123)
-- Hash bcrypt de "password123"
INSERT INTO users (id, email, password_hash, first_name, last_name, auth_provider, is_email_verified)
VALUES (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'alex.martin@email.com',
  '$2b$12$49EnCEZZVWwwl6wI1KKlfOl0KrS2E/NG4SfXM4CUfsg3TOXlovEDu',
  'Alex', 'Martin', 'email', true
);

INSERT INTO subscriptions (user_id, plan, billing_cycle, status, current_period_start, current_period_end)
VALUES (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'pro', 'annual', 'active', NOW() - INTERVAL '14 days', NOW() + INTERVAL '351 days'
);

INSERT INTO notification_preferences (user_id, daily_tips, value_alerts, weekly_summary, product_news)
VALUES ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', true, true, true, false);

-- Reset sequences after seed data with explicit IDs
SELECT setval('matches_id_seq', (SELECT MAX(id) FROM matches));
SELECT setval('tips_id_seq', (SELECT MAX(id) FROM tips));
SELECT setval('model_versions_id_seq', (SELECT MAX(id) FROM model_versions));
SELECT setval('bankroll_ledger_id_seq', (SELECT MAX(id) FROM bankroll_ledger));
SELECT setval('odds_snapshots_id_seq', COALESCE((SELECT MAX(id) FROM odds_snapshots), 1), false);
SELECT setval('learnings_id_seq', COALESCE((SELECT MAX(id) FROM learnings), 1), false);
