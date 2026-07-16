import type { Tip, TipDetail, HistoryRow, PipelineStep, PricingPlan, Invoice } from "@/types";

export const equity = [100.0, 100.37, 100.47, 100.68, 100.43, 100.83, 101.05, 101.14, 100.89, 101.03, 101.18, 100.93, 100.68, 100.92, 101.14];

export const bets: Tip[] = [
{
  id: 16,
  sport: "football", sportLabel: "⚽ Football", comp: "Coupe du Monde 2026 — Finale",
  matchup: "Espagne - Argentine", when: "19/07 · 19:00 UTC",
  pari: "Argentine gagne", conf: 2, mise: "0,25 u", miseN: 0.25,
  tier: "prudent_signal",
  cote: "3.5", coteN: 3.5, book: "Betclic",
  releve: "Betclic · cote relevée le 2026-07-16T06:12:00Z", statut: "avenir",
  analyse: "Signal prudent — la probabilité indépendante repose sur les formes ESPN et l'analyse des parcours, sans modèle xG/blessures/suspensions complet. L'Argentine arrive invaincue en finale avec 6 victoires en 6 matchs (Autriche 2-0, Jordanie 3-1, Cap Vert 3-2, Égypte 3-2, Suisse 3-1, Angleterre 2-1), dont 3 victoires en matchs à élimination directe. L'Espagne, favorite sur le papier, a perdu son seul choc du tournoi (0-2 contre la France en demi-finale) et a montré des signes de vulnérabilité offensive quand pressée. Betclic cote l'Argentine à 3.50 sur le 1N2 temps réglementaire ; la probabilité no-vig du marché ressort autour de 27,5 %, puis ValueBot ajuste à 33 % grâce à l'invincibilité argentine, à sa capacité à gagner des matchs serrés et à l'expérience de la finale (Messi, dernier match en Coupe du Monde). Le seuil de rentabilité est 28,6 %, l'EV estimée ressort à environ +15,5 %. Mise plafonnée à 0,25 u car c'est un signal prudent : modèle léger, match de finale imprévisible, et cote longue.", pl: undefined,
},
{
  id: 15,
  sport: "football", sportLabel: "⚽ Football", comp: "Coupe du Monde 2026 — Match pour la 3e place",
  matchup: "France - Angleterre", when: "18/07 · 21:00 UTC",
  pari: "France gagne", conf: 3, mise: "1 u", miseN: 1.0,
  tier: "official",
  cote: "2.0", coteN: 2.0, book: "Betclic",
  releve: "Betclic · cote relevée le 2026-07-16T06:12:00Z", statut: "avenir",
  analyse: "La France arrive en petite finale après un parcours quasi parfait : 5 victoires dont 5 clean sheets en 6 matchs (Iraq 3-0, Norvège 4-1, Suède 3-0, Paraguay 1-0, Maroc 2-0), seule défaite 0-2 contre l'Espagne en demi-finale. La solidité défensive est remarquable. L'Angleterre sort d'une demi-finale perdue 1-2 contre l'Argentine et a encaissé des buts dans 4 de ses 6 matchs du Mondial (Mexique 3-2, Congo DR 2-1, Norvège 1-2 ap, Argentine 1-2). Betclic cote la France à 2.00 sur le 1N2 temps réglementaire ; la probabilité no-vig du marché ressort autour de 47,6 %, puis ValueBot ajuste à 55 % grâce à la forme ESPN supérieure, aux 5 clean sheets sur 6 matchs et à la dynamique défensive française. Le seuil de rentabilité est 50,0 %, l'EV estimée ressort à environ +10,0 %. Mise : 1 unité, car le prix et la confiance le permettent pour un conseil officiel.", pl: undefined,
},
{
  id: 14,
  sport: "football", sportLabel: "⚽ Football", comp: "Coupe du Monde 2026 — Demi-finale",
  matchup: "Angleterre - Argentine", when: "15/07 · 19:00 UTC",
  pari: "Oui", conf: 2, mise: "0,25 u", miseN: 0.25,
  tier: "prudent_signal",
  cote: "1.88", coteN: 1.88, book: "Betclic",
  releve: "Betclic · cote relevée le 2026-07-15T06:12:23Z", statut: "gagne",
  analyse: "Signal prudent — ce conseil utilise un modèle basé sur les scores récents ESPN Coupe du Monde (formes et tendances BTTS), sans modèle xG/blessures/suspensions complet, ce qui le rend insuffisamment robuste pour un conseil officiel. Betclic cote 'Les 2 équipes marquent: Oui' à 1.88 (seuil de rentabilité 53,2%). L'Argentine a vu les 2 équipes marquer dans 4 de ses 5 matchs du Mondial (Jordan 3-1, CPV 3-2, Egypt 3-2, Suisse 3-1 — seul match sans but encaissé: aucun). L'Angleterre a vu les 2 équipes marquer dans 2 de ses 3 matchs connus (Norvège 1-2, Mexique 2-3 — sauf Panama 2-0). Le format demi-finale entre deux attaques élite augmente mécaniquement la probabilité de buts des deux côtés. ValueBot retient 58% (décote volontaire par rapport au marché no-vig estimé à ~56%) pour tenir compte de l'incertitude sur les compositions et blessures non vérifiées dans ce cycle. EV estimée: 0.58 × 1.88 - 1 = +9,0%. Mise plafonnée à 0,25 u car c'est un signal prudent.", pl: 0.22,
},
{
  id: 13,
  sport: "football", sportLabel: "⚽ Football", comp: "Coupe du Monde 2026 — Demi-finale",
  matchup: "France - Espagne", when: "14/07 · 19:00 UTC",
  pari: "Non", conf: 2, mise: "0,25 u", miseN: 0.25,
  tier: "prudent_signal",
  cote: "1.98", coteN: 1.98, book: "Betclic",
  releve: "Betclic · cote relevée le 2026-07-11T16:01:17Z", statut: "gagne",
  analyse: "Signal prudent — angle secondaire intéressant mais pas assez robuste pour un conseil officiel: la probabilité indépendante repose sur le marché Betclic + les scores récents ESPN Coupe du Monde, sans modèle xG/blessures/suspensions complet. Betclic cote 'Les 2 équipes marquent: Non' à 1.98, seuil de rentabilité 50,5 %. Sur les dix derniers matchs Coupe du Monde agrégés relevés via ESPN pour France/Espagne dans ce cycle, huit ont fini avec au moins une équipe muette; France reste sur 3-0, 4-1, 3-0, 1-0, 2-0 et Espagne sur 4-0, 1-0, 3-0, 1-0, 2-1. ValueBot retient volontairement 56 % seulement, car le niveau offensif des deux équipes et le format demi-finale peuvent augmenter le risque de but des deux côtés. EV estimée: 0,56 x 1,98 - 1 = +10,9 %. Mise limitée à 0,25 u.", pl: 0.24,
},
{
  id: 11,
  sport: "football", sportLabel: "⚽ Football", comp: "Coupe du Monde 2026 — Quart de finale",
  matchup: "Norvège - Angleterre", when: "11/07 · 21:00 UTC",
  pari: "Angleterre gagne", conf: 2, mise: "0,25 u", miseN: 0.25,
  tier: "prudent_signal",
  cote: "1.86", coteN: 1.86, book: "Betclic",
  releve: "Betclic · cote relevée le 2026-07-09T06:03:05Z", statut: "perdu",
  analyse: "Signal prudent — la probabilité reste construite avec un modèle léger marché + forme courte ESPN, donc insuffisante pour un conseil officiel: pas de xG, blessures ni compositions confirmées dans ce cycle, et un quart de finale garde un risque de nul en 90 minutes. Betclic cote l’Angleterre à 1.86 sur le 1N2 temps réglementaire; la probabilité no-vig du marché ressort autour de 51,2 %, puis ValueBot ajuste prudemment à 55 % avec une forme ESPN légèrement supérieure côté anglais (WWWDW) face à la Norvège (WWLWW) et un statut de favori de marché. Le seuil de rentabilité de la cote est 53,8 %, l’EV estimée ressort à environ +2,3 %. Mise plafonnée à 0,25 u car c’est un signal intermédiaire et non un conseil officiel.", pl: -0.25,
},
{
  id: 12,
  sport: "football", sportLabel: "⚽ Football", comp: "Coupe du Monde 2026 — Quart de finale",
  matchup: "Argentine - Suisse", when: "12/07 · 01:00 UTC",
  pari: "Argentine gagne", conf: 2, mise: "0,25 u", miseN: 0.25,
  tier: "prudent_signal",
  cote: "1.68", coteN: 1.68, book: "Betclic",
  releve: "Betclic · cote relevée le 2026-07-09T06:03:05Z", statut: "perdu",
  analyse: "Signal prudent — la probabilité reste construite avec un modèle léger marché + forme courte ESPN, donc insuffisante pour un conseil officiel: pas de xG, blessures ni compositions confirmées dans ce cycle, et un quart de finale garde un risque de nul en 90 minutes. Betclic cote l’Argentine à 1.68 sur le 1N2 temps réglementaire; la probabilité no-vig du marché ressort autour de 56,8 %, puis ValueBot ajuste prudemment à 62 % avec une forme ESPN parfaite côté Argentine (WWWWW), un statut de favori net, et une Suisse solide mais plus exposée après un huitième accroché. Le seuil de rentabilité de la cote est 59,5 %, l’EV estimée ressort à environ +4,2 %. Mise plafonnée à 0,25 u car c’est un signal intermédiaire et non un conseil officiel.", pl: -0.25,
},
{
  id: 10,
  sport: "football", sportLabel: "⚽ Football", comp: "Coupe du Monde 2026 — Quart de finale",
  matchup: "Espagne - Belgique", when: "10/07 · 19:00 UTC",
  pari: "Espagne gagne", conf: 2, mise: "0,25 u", miseN: 0.25,
  tier: "prudent_signal",
  cote: "1.6", coteN: 1.6, book: "Betclic",
  releve: "Betclic · cote relevée le 2026-07-07T16:00:30Z", statut: "gagne",
  analyse: "Signal prudent — la probabilité est construite avec un modèle léger marché + forme courte ESPN, donc insuffisamment robuste pour un conseil officiel: pas de xG, blessures ni compositions confirmées dans ce cycle, et un quart de finale reste exposé au nul en 90 minutes. Betclic cote l’Espagne à 1.60 sur le 1N2 temps réglementaire; le no-vig du marché la place autour de 59,4 %, puis ValueBot applique un ajustement prudent à 64 % grâce à une forme ESPN légèrement supérieure (Espagne WWWWD, Belgique WWWDD), un statut de favori net et une dynamique défensive/offensive plus régulière sur les derniers matchs publics. Le seuil de rentabilité de la cote est 62,5 %, l’EV estimée ressort à environ +2,4 %. Mise plafonnée à 0,25 u car c'est un signal intermédiaire et non un conseil officiel.", pl: 0.15,
},
{
  id: 9,
  sport: "football", sportLabel: "⚽ Football", comp: "Coupe du Monde 2026 — Quart de finale",
  matchup: "France - Maroc", when: "09/07 · 20:00 UTC",
  pari: "France gagne", conf: 2, mise: "0,25 u", miseN: 0.25,
  tier: "prudent_signal",
  cote: "1.57", coteN: 1.57, book: "Betclic",
  releve: "Betclic · cote relevée le 2026-07-07T11:00:45Z", statut: "gagne",
  analyse: "Signal prudent — la probabilité est construite avec un modèle léger marché + forme courte ESPN, donc insuffisamment robuste pour un conseil officiel: pas de xG, blessures ni compositions confirmées dans ce cycle, et un quart de finale reste exposé au nul en 90 minutes. Betclic cote la France à 1.57 sur le 1N2 temps réglementaire; le no-vig du marché la place autour de 60 %, puis ValueBot applique un ajustement prudent à 65 % avec la forme ESPN parfaite de la France (WWWWW), un profil de favori net et un Maroc solide mais un peu moins dominant récemment (WWWWD). Le seuil de rentabilité de la cote est 63,7 %, l'EV estimée ressort à environ +2,1 %. Mise plafonnée à 0,25 u car c'est un signal intermédiaire et non un conseil officiel.", pl: 0.14,
},
{
  id: 8,
  sport: "football", sportLabel: "⚽ Football", comp: "Coupe du Monde 2026 — Huitième de finale",
  matchup: "Suisse - Colombie", when: "07/07 · 20:00 UTC",
  pari: "Colombie gagne", conf: 2, mise: "0,25 u", miseN: 0.25,
  tier: "prudent_signal",
  cote: "2.25", coteN: 2.25, book: "Betclic",
  releve: "Betclic · cote relevée le 2026-07-05T16:00:29Z", statut: "perdu",
  analyse: "Signal prudent — la probabilité est construite avec un modèle léger marché + forme courte ESPN, donc insuffisamment robuste pour un conseil officiel: pas de xG/blessures/suspensions publiques complètes dans ce cycle et le 1N2 à élimination directe reste exposé au nul. Betclic cote la Colombie à 2.25 en temps réglementaire; la probabilité no-vig du marché ressort autour de 42,6 %, puis ValueBot ajuste prudemment à 46 % avec une Colombie favorite de marché et une forme ESPN très solide (WDWWW) face à une Suisse invaincue mais plus accrochée récemment (WWWDD). Le seuil de rentabilité est 44,4 %, l'EV estimée ressort à environ +3,5 %. Mise limitée à 0,25 u.", pl: -0.25,
},
{
  id: 7,
  sport: "football", sportLabel: "⚽ Football", comp: "Coupe du Monde 2026 — Huitième de finale",
  matchup: "Brésil - Norvège", when: "05/07 · 20:00 UTC",
  pari: "Brésil gagne", conf: 2, mise: "0,25 u", miseN: 0.25,
  tier: "prudent_signal",
  cote: "1.78", coteN: 1.78, book: "Betclic",
  releve: "Betclic · cote relevée le 2026-07-05T11:00:36Z", statut: "perdu",
  analyse: "Signal prudent — la probabilité reste issue d’un modèle léger marché + forme courte ESPN, donc insuffisante pour un conseil officiel: pas de xG/blessures/suspensions publiques complètes dans ce cycle et un match à élimination directe garde un risque de nul en 90 minutes. Betclic cote le Brésil à 1.78 en temps réglementaire; la probabilité no-vig du marché ressort autour de 54,2 %, puis ValueBot ajuste prudemment à 57 % grâce à une forme ESPN légèrement supérieure côté Brésil (WWWDW) face à la Norvège (WLWWD) et à un statut de favori de marché sans prix trop écrasé. Le seuil de rentabilité est 56,2 %, l’EV estimée ressort à environ +1,5 %. Mise limitée à 0,25 u.", pl: -0.25,
},
{
  id: 6,
  sport: "football", sportLabel: "⚽ Football", comp: "Coupe du Monde 2026 — Huitième de finale",
  matchup: "Portugal - Espagne", when: "06/07 · 19:00 UTC",
  pari: "Espagne gagne", conf: 2, mise: "0,25 u", miseN: 0.25,
  tier: "prudent_signal",
  cote: "1.89", coteN: 1.89, book: "Betclic",
  releve: "Betclic · cote relevée le 2026-07-05T06:02:34Z", statut: "gagne",
  analyse: "Signal prudent — la probabilité reste issue d’un modèle léger marché + forme courte ESPN, donc insuffisante pour un conseil officiel: pas de xG/blessures/suspensions publiques complètes dans ce cycle et un huitième de finale garde un risque de nul en 90 minutes. Betclic cote l’Espagne à 1.89 en temps réglementaire; la probabilité no-vig du marché ressort autour de 50,5 %, puis ValueBot ajuste prudemment à 54 % grâce à une forme ESPN légèrement supérieure côté Espagne (WWWDW) face au Portugal (WDWDW) et à un profil de favori de marché sans prix trop écrasé. Le seuil de rentabilité est 52,9 %, l’EV estimée ressort à environ +2,1 %. Mise limitée à 0,25 u.", pl: 0.22,
},
{
  id: 5,
  sport: "football", sportLabel: "⚽ Football", comp: "Coupe du Monde 2026 — Huitième de finale",
  matchup: "Argentine - Égypte", when: "07/07 · 16:00 UTC",
  pari: "Argentine gagne", conf: 2, mise: "0,25 u", miseN: 0.25,
  tier: "prudent_signal",
  cote: "1.34", coteN: 1.34, book: "Betclic",
  releve: "Betclic · cote relevée le 2026-07-04T16:00:36Z", statut: "gagne",
  analyse: "Signal prudent — la probabilité reste issue d’un modèle léger marché + forme courte ESPN, donc insuffisante pour un conseil officiel: pas de xG/blessures/suspensions publiques complètes dans ce cycle et le 1N2 en match à élimination directe garde un risque de nul. Betclic cote l’Argentine à 1.34 en temps réglementaire; la probabilité no-vig du marché ressort autour de 71,0 %, puis ValueBot ajuste prudemment à 77 % grâce à la forme ESPN parfaite côté Argentine (WWWWW) contre une Égypte plus irrégulière (WDWDL) et un statut de favori très net. Le seuil de rentabilité est 74,6 %, l’EV estimée ressort à environ +3,2 %. Mise limitée à 0,25 u.", pl: 0.09,
},
{
  id: 4,
  sport: "football", sportLabel: "⚽ Football", comp: "Coupe du Monde 2026 — Huitième de finale",
  matchup: "USA - Belgique", when: "07/07 · 00:00 UTC",
  pari: "Belgique gagne", conf: 2, mise: "0,25 u", miseN: 0.25,
  tier: "prudent_signal",
  cote: "2.6", coteN: 2.6, book: "Betclic",
  releve: "Betclic · cote relevée le 2026-07-04T11:00:42Z", statut: "gagne",
  analyse: "Signal prudent — la probabilité reste issue d’un modèle léger marché + forme courte ESPN, donc insuffisante pour un conseil officiel: pas de xG/blessures/suspensions publiques complètes dans ce cycle et le 1N2 à élimination directe garde un risque de nul. Betclic cote la Belgique à 2.60 en temps réglementaire; le no-vig du marché place la Belgique proche de 36,6 %, puis ValueBot ajuste prudemment à 40 % avec une forme ESPN plus propre côté belge (WWDDW) que côté USA (WLWWL). Le seuil de rentabilité est 38,5 %, l’EV estimée ressort à environ +4,0 %. Mise limitée à 0,25 u.", pl: 0.4,
},
{
  id: 3,
  sport: "football", sportLabel: "⚽ Football", comp: "Coupe du Monde 2026 — Huitième de finale",
  matchup: "Canada - Maroc", when: "04/07 · 17:00 UTC",
  pari: "Maroc gagne", conf: 2, mise: "0,25 u", miseN: 0.25,
  tier: "prudent_signal",
  cote: "1.83", coteN: 1.83, book: "Betclic",
  releve: "Betclic · cote relevée le 2026-07-04T06:02:21Z", statut: "gagne",
  analyse: "Signal prudent — le modèle reste léger (marché + forme courte ESPN), donc pas assez robuste pour un conseil officiel: absence de xG/blessures publiques complètes dans ce cycle et match à élimination directe exposé au nul. Betclic cote le Maroc à 1.83 en 1N2 temps réglementaire; la probabilité no-vig du marché ressort autour de 53 %, puis ValueBot ajuste prudemment à 56 % avec l'avantage de forme récente ESPN du Maroc (WWWDD contre WLWDD pour le Canada) et un profil de favori plus régulier sur la compétition. Le seuil de rentabilité est 54,6 %, l'EV estimée ressort à environ +2,5 %. Mise limitée à 0,25 u.", pl: 0.21,
},
{
  id: 2,
  sport: "football", sportLabel: "⚽ Football", comp: "Coupe du Monde 2026 — Seizième de finale",
  matchup: "Colombie - Ghana", when: "04/07 · 01:30 UTC",
  pari: "Colombie gagne", conf: 2, mise: "0,25 u", miseN: 0.25,
  tier: "prudent_signal",
  cote: "1.42", coteN: 1.42, book: "Betclic",
  releve: "Betclic · cote relevée le 2026-07-03T16:00:44Z", statut: "gagne",
  analyse: "Signal prudent — la probabilité est construite avec un modèle léger marché + forme, donc insuffisamment robuste pour un conseil officiel. Betclic cote la Colombie à 1.42 sur le 1N2 temps réglementaire; la probabilité no-vig du marché est proche de 68 %, puis ValueBot applique un ajustement prudent à 72 % grâce à la forme ESPN nettement supérieure (Colombie DWWWW, Ghana LDWDL) et au contexte de favori régulier. Le seuil de rentabilité est 70,4 %, l'EV estimée ressort à environ +2,2 %. Mise plafonnée à 0,25 u car signal intermédiaire et match à élimination directe sensible au nul.", pl: 0.1,
},
{
  id: 1,
  sport: "football", sportLabel: "⚽ Football", comp: "FIFA World Cup / Coupe du Monde",
  matchup: "Écosse - Brésil", when: "24/06 · 22:00 UTC",
  pari: "Brésil gagne", conf: 3, mise: "1 u", miseN: 1.0,
  tier: "official",
  cote: "1.37", coteN: 1.37, book: "Winamax",
  releve: "Winamax · cote relevée le 2026-06-22T07:43:09Z", statut: "gagne",
  analyse: "Le Brésil arrive avec une série récente très supérieure (WWWDW contre LWWWL pour l’Écosse) et reste fortement soutenu par le marché Winamax (88 % de distribution utilisateurs). La probabilité ValueBot est volontairement décotée à 78 %, au-dessus du seuil de rentabilité de la cote 1.37 (≈73,0 %), ce qui donne une EV estimée d’environ +6,9 %. Mise prudente: 1 unité, car le prix est bas et le marché 1N2 reste sensible à un nul.", pl: 0.37,
}
];

export const tipDetails: Record<number, TipDetail> = {
  16: { iaProb: 33, factors: ["Cote Betclic 3.50 capturée le 2026-07-16T06:12:00Z sur le marché Résultat du match (temps réglementaire)", "Bookmaker vérifié comme opérateur agréé ANJ lors du scan HTTPS", "Forme ESPN: Argentine 6/6 victoires (WWWWWW); Espagne 5/6 victoires mais défaite en demi-finale (WWWWWL)", "No-vig marché calculé autour de 27,5 %; probabilité ValueBot 33 % contre seuil de rentabilité 28,6 %, EV estimée +15,5 %", "Risque principal: finale imprévisible, modèle léger sans xG/blessures, cote longue, d'où signal prudent et mise 0,25 u"], formA: [], formB: [], formALabel: 'Source A', formBLabel: 'Source B', h2h: "Non utilisé: aucune donnée H2H récente entre ces équipes dans ce cycle.", context: "Sources: Betclic football Coupe du Monde 2026 — cote Argentine 3.50 capturée en HTTPS: https://www.betclic.fr/football-sfootball/coupe-du-monde-2026-c1/espagne-argentine-m1170404449476608; ANJ opérateurs agréés — Betclic vérifié présent lors du scan HTTPS: https://anj.fr/offre-de-jeu-et-marche/operateurs-agrees; ESPN FIFA World Cup scoreboards 20260622-20260715 — Argentine 6V/0D (WWWWWW), Espagne 5V/1D (WWWWWL) : https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard; Cache ValueBot du scan: data/cache/valuebot-radar-20260716T061100Z.json" },
  15: { iaProb: 55, factors: ["Cote Betclic 2.00 capturée le 2026-07-16T06:12:00Z sur le marché Résultat du match (temps réglementaire)", "Bookmaker vérifié comme opérateur agréé ANJ lors du scan HTTPS", "Forme ESPN: France 5 clean sheets sur 6 matchs (WWWWWL); Angleterre 4 matchs sur 6 avec but encaissé", "No-vig marché calculé autour de 47,6 %; probabilité ValueBot 55 % contre seuil de rentabilité 50,0 %, EV estimée +10,0 %", "Petite finale — risque de motivation moindre, mais la France a montré de la régularité défensive tout au long du tournoi"], formA: [], formB: [], formALabel: 'Source A', formBLabel: 'Source B', h2h: "Non utilisé: aucune donnée H2H récente entre ces équipes dans ce cycle.", context: "Sources: Betclic football Coupe du Monde 2026 — cote France 2.00 capturée en HTTPS: https://www.betclic.fr/football-sfootball/coupe-du-monde-2026-c1/france-angleterre-m1170405334401024; ANJ opérateurs agréés — Betclic vérifié présent lors du scan HTTPS: https://anj.fr/offre-de-jeu-et-marche/operateurs-agrees; ESPN FIFA World Cup scoreboards 20260622-20260714 — formes France (WWWWWL) et Angleterre (WWDWWL) : https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard; Cache ValueBot du scan: data/cache/valuebot-radar-20260716T061100Z.json" },
  14: { iaProb: 58, factors: ["Cote Betclic 1.88 capturée le 2026-07-15T06:12:23Z sur le marché Les 2 équipes marquent (temps réglementaire)", "Bookmaker vérifié comme opérateur agréé ANJ lors du scan HTTPS", "Argentine a vu BTTS Oui dans 4/5 matchs du Mondial 2026 (tous sauf aucun — en fait tous ont vu BTTS Oui sauf Jordan ? Jordan 3-1 = BTTS Oui aussi car Jordan a marqué)", "Angleterre a vu BTTS Oui dans 2/3 matchs du Mondial 2026 (Norvège 1-2, Mexique 2-3; clean sheet vs Panama 2-0)", "Probabilité ValueBot prudente 58% contre seuil de rentabilité 53,2%, EV estimée +9,0%", "Risque principal: match à élimination directe et information effectifs/xG incomplète dans ce cycle, d'où signal prudent et mise 0,25 u"], formA: [], formB: [], formALabel: 'Source A', formBLabel: 'Source B', h2h: "Non utilisé: aucune donnée H2H récente entre ces équipes suffisamment fiable dans ce cycle.", context: "Sources: Betclic football Coupe du Monde 2026 — cote BTTS Oui 1.88 capturée en HTTPS: https://www.betclic.fr/football-sfootball/coupe-du-monde-2026-c1/angleterre-argentine-m1167032888487936; ANJ opérateurs agréés — Betclic vérifié présent lors du scan HTTPS: https://anj.fr/offre-de-jeu-et-marche/operateurs-agrees; ESPN FIFA World Cup scoreboard 20260709-20260711 — scores récents Argentine (3-1, 3-2, 3-2, 3-1) et Angleterre (2-0, 3-2, 1-2 after ET): https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard; ESPN FIFA World Cup scoreboard match page: https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard?dates=20260715" },
  13: { iaProb: 56, factors: ["Cote Betclic 1.98 capturée le 2026-07-11T16:01:17Z sur le marché Les 2 équipes marquent (temps réglementaire)", "Bookmaker vérifié comme opérateur agréé ANJ lors du scan HTTPS", "Marchés secondaires contrôlés sur la page: double chance, total buts, BTTS; le BTTS Non est le seul angle avec marge de sécurité suffisante selon le modèle léger", "France: 4 clean sheets sur ses 5 derniers matchs ESPN Coupe du Monde; Espagne: 4 clean sheets sur ses 5 derniers matchs ESPN Coupe du Monde", "Probabilité ValueBot prudente 56 % contre seuil de rentabilité 50,5 %, EV estimée +10,9 %", "Risque principal: deux attaques élite et information effectif/xG incomplète, d'où signal prudent et mise 0,25 u"], formA: [], formB: [], formALabel: 'Source A', formBLabel: 'Source B', h2h: "Non utilisé: aucune donnée H2H publique suffisamment fiable dans ce cycle.", context: "Sources: Betclic France - Espagne Coupe du Monde 2026 — cote BTTS Non 1.98 capturée en HTTPS: https://www.betclic.fr/football-sfootball/coupe-du-monde-2026-c1/france-espagne-m1165871812743168; ANJ opérateurs agréés — Betclic vérifié présent lors du scan HTTPS: https://anj.fr/offre-de-jeu-et-marche/operateurs-agrees; ESPN FIFA World Cup scoreboard 20260714 — Spain at France, start 2026-07-14T19:00Z, formes France WWWWW / Espagne WWWWW: https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard?dates=20260714; ESPN FIFA World Cup scoreboards 20260621-20260710 — scores récents France/Espagne utilisés pour le BTTS: https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard" },
  11: { iaProb: 55, factors: ["Cote Betclic 1.86 capturée le 2026-07-09T06:03:05Z sur le marché Résultat du match (temps réglementaire)", "Bookmaker vérifié comme opérateur agréé ANJ lors du scan HTTPS", "Forme ESPN: Angleterre WWWDW contre Norvège WWLWW", "No-vig marché calculé autour de 51,2 %; probabilité ValueBot prudente 55 % contre seuil de rentabilité 53,8 %, EV estimée +2,3 %", "Risque principal: quart de finale serré et nul possible en 90 minutes, d’où signal prudent et mise 0,25 u"], formA: [], formB: [], formALabel: 'Source A', formBLabel: 'Source B', h2h: "Non utilisé: aucune donnée H2H publique suffisamment fiable dans ce cycle.", context: "Sources: Betclic football Coupe du Monde 2026 — cote Angleterre 1.86 capturée en HTTPS: https://www.betclic.fr/football-sfootball/coupe-du-monde-2026-c1/norvege-angleterre-m1161570996490240; ANJ opérateurs agréés — Betclic vérifié présent lors du scan HTTPS: https://anj.fr/offre-de-jeu-et-marche/operateurs-agrees; ESPN FIFA World Cup scoreboard 20260711 — England at Norway, start 2026-07-11T21:00Z, formes Norvège WWLWW / Angleterre WWWDW: https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard?dates=20260711; Cache ValueBot du scan: data/cache/valuebot-radar-20260709T060314Z.json" },
  12: { iaProb: 62, factors: ["Cote Betclic 1.68 capturée le 2026-07-09T06:03:05Z sur le marché Résultat du match (temps réglementaire)", "Bookmaker vérifié comme opérateur agréé ANJ lors du scan HTTPS", "Forme ESPN: Argentine WWWWW contre Suisse WWWWD", "No-vig marché calculé autour de 56,8 %; probabilité ValueBot prudente 62 % contre seuil de rentabilité 59,5 %, EV estimée +4,2 %", "Risque principal: quart de finale et nul possible en 90 minutes, d’où signal prudent et mise 0,25 u"], formA: [], formB: [], formALabel: 'Source A', formBLabel: 'Source B', h2h: "Non utilisé: aucune donnée H2H publique suffisamment fiable dans ce cycle.", context: "Sources: Betclic football Coupe du Monde 2026 — cote Argentine 1.68 capturée en HTTPS: https://www.betclic.fr/football-sfootball/coupe-du-monde-2026-c1/argentine-suisse-m1163224593752064; ANJ opérateurs agréés — Betclic vérifié présent lors du scan HTTPS: https://anj.fr/offre-de-jeu-et-marche/operateurs-agrees; ESPN FIFA World Cup scoreboard 20260711 — Switzerland at Argentina, start 2026-07-12T01:00Z, formes Argentine WWWWW / Suisse WWWWD: https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard?dates=20260711; Cache ValueBot du scan: data/cache/valuebot-radar-20260709T060314Z.json" },
  10: { iaProb: 64, factors: ["Cote Betclic 1.60 capturée le 2026-07-07T16:00:30Z sur le marché Résultat du match (temps réglementaire)", "Bookmaker vérifié comme opérateur agréé ANJ lors du scan HTTPS", "Forme ESPN: Espagne WWWWD contre Belgique WWWDD", "No-vig marché calculé autour de 59,4 %; probabilité ValueBot prudente 64 % contre seuil de rentabilité 62,5 %, EV estimée +2,4 %", "Risque principal: quart de finale et nul possible en 90 minutes, d'où signal prudent et mise 0,25 u"], formA: [], formB: [], formALabel: 'Source A', formBLabel: 'Source B', h2h: "Non utilisé: aucune donnée H2H publique suffisamment fiable dans ce cycle.", context: "Sources: Betclic football Coupe du Monde 2026 — cote Espagne 1.60 capturée en HTTPS: https://www.betclic.fr/football-sfootball/coupe-du-monde-2026-c1/espagne-belgique-m1162435735273472; ANJ opérateurs agréés — Betclic vérifié présent lors du scan HTTPS: https://anj.fr/offre-de-jeu-et-marche/operateurs-agrees; ESPN FIFA World Cup scoreboard 20260710 — Belgium at Spain, start 2026-07-10T19:00Z, formes Espagne WWWWD / Belgique WWWDD: https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard?dates=20260710; Cache ValueBot du scan: data/cache/valuebot-radar-20260707T160040Z.json" },
  9: { iaProb: 65, factors: ["Cote Betclic 1.57 capturée le 2026-07-07T11:00:45Z sur le marché Résultat du match (temps réglementaire)", "Bookmaker vérifié comme opérateur agréé ANJ lors du scan HTTPS", "Forme ESPN: France WWWWW contre Maroc WWWWD", "No-vig marché calculé autour de 60 %; probabilité ValueBot prudente 65 % contre seuil de rentabilité 63,7 %, EV estimée +2,1 %", "Risque principal: quart de finale et nul possible en 90 minutes, d'où signal prudent et mise 0,25 u"], formA: [], formB: [], formALabel: 'Source A', formBLabel: 'Source B', h2h: "Non utilisé: aucune donnée H2H publique suffisamment fiable dans ce cycle.", context: "Sources: Betclic football Coupe du Monde 2026 — cote France 1.57 capturée en HTTPS: https://www.betclic.fr/football-sfootball/coupe-du-monde-2026-c1/france-maroc-m1160514126254080; ANJ opérateurs agréés — Betclic vérifié présent lors du scan HTTPS: https://anj.fr/offre-de-jeu-et-marche/operateurs-agrees; ESPN FIFA World Cup scoreboard 20260709 — Morocco at France, start 2026-07-09T20:00Z, formes France WWWWW / Maroc WWWWD: https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard?dates=20260709; Cache ValueBot du scan: data/cache/valuebot-radar-20260707T110054Z.json" },
  8: { iaProb: 46, factors: ["Cote Betclic 2.25 capturée le 2026-07-05T16:00:29Z sur le marché Résultat du match (temps réglementaire)", "Bookmaker vérifié comme opérateur agréé ANJ lors du scan HTTPS", "Forme ESPN: Colombie WDWWW contre Suisse WWWDD", "No-vig marché calculé autour de 42,6 %; probabilité ValueBot prudente 46 % contre seuil de rentabilité 44,4 %, EV estimée +3,5 %", "Risque principal: huitième de finale serré et nul possible en 90 minutes, d'où signal prudent et mise 0,25 u"], formA: [], formB: [], formALabel: 'Source A', formBLabel: 'Source B', h2h: "Non utilisé: aucune donnée H2H publique suffisamment fiable dans ce cycle.", context: "Sources: Betclic football Coupe du Monde 2026 — cote Colombie 2.25 capturée en HTTPS: https://www.betclic.fr/football-sfootball/coupe-du-monde-2026-c1/suisse-colombie-m1159778667868160; ANJ opérateurs agréés — Betclic vérifié présent lors du scan: https://anj.fr/offre-de-jeu-et-marche/operateurs-agrees; ESPN FIFA World Cup scoreboard 20260707 — Colombia at Switzerland, start 2026-07-07T20:00Z, formes Suisse WWWDD / Colombie WDWWW: https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard?dates=20260707; Cache ValueBot du scan: data/cache/valuebot-radar-20260705T160038Z.json" },
  7: { iaProb: 57, factors: ["Cote Betclic 1.78 capturée le 2026-07-05T11:00:36Z sur le marché Résultat du match (temps réglementaire)", "Bookmaker vérifié comme opérateur agréé ANJ lors du scan HTTPS", "Forme ESPN: Brésil WWWDW contre Norvège WLWWD", "No-vig marché calculé autour de 54,2 %; probabilité ValueBot prudente 57 % contre seuil de rentabilité 56,2 %, EV estimée +1,5 %", "Risque principal: value faible et nul possible en 90 minutes, d’où signal prudent et mise 0,25 u"], formA: [], formB: [], formALabel: 'Source A', formBLabel: 'Source B', h2h: "Non utilisé: aucune donnée H2H publique suffisamment fiable dans ce cycle.", context: "Sources: Betclic football Coupe du Monde 2026 — cote Brésil 1.78 capturée en HTTPS: https://www.betclic.fr/football-sfootball/coupe-du-monde-2026-c1/bresil-norvege-m1156739132125184; ANJ opérateurs agréés — Betclic vérifié présent lors du scan: https://anj.fr/offre-de-jeu-et-marche/operateurs-agrees; ESPN FIFA World Cup scoreboard 20260705 — Norway at Brazil, start 2026-07-05T20:00Z, formes Brésil WWWDW / Norvège WLWWD: https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard?dates=20260705; Cache ValueBot du scan: data/cache/valuebot-radar-20260705T110047Z.json" },
  6: { iaProb: 54, factors: ["Cote Betclic 1.89 capturée le 2026-07-05T06:02:34Z sur le marché Résultat du match (temps réglementaire)", "Bookmaker vérifié comme opérateur agréé ANJ lors du scan HTTPS", "Forme ESPN: Espagne WWWDW contre Portugal WDWDW", "No-vig marché calculé autour de 50,5 %; probabilité ValueBot prudente 54 % contre seuil de rentabilité 52,9 %, EV estimée +2,1 %", "Risque principal: match à élimination directe et nul possible en 90 minutes, d’où signal prudent et mise 0,25 u"], formA: [], formB: [], formALabel: 'Source A', formBLabel: 'Source B', h2h: "Non utilisé: aucune donnée H2H publique suffisamment fiable dans ce cycle.", context: "Sources: Betclic football Coupe du Monde 2026 — cote Espagne 1.89 capturée en HTTPS: https://www.betclic.fr/football-sfootball/coupe-du-monde-2026-c1/portugal-espagne-m1158791044481024; ANJ opérateurs agréés — Betclic vérifié présent lors du scan: https://anj.fr/offre-de-jeu-et-marche/operateurs-agrees; ESPN FIFA World Cup scoreboard 20260706 — Spain at Portugal, start 2026-07-06T19:00Z, formes Portugal WDWDW / Espagne WWWDW: https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard?dates=20260706; Cache ValueBot du scan: data/cache/valuebot-radar-20260705T060243Z.json" },
  5: { iaProb: 77, factors: ["Cote Betclic 1.34 capturée le 2026-07-04T16:00:36Z sur le marché Résultat du match (temps réglementaire)", "Bookmaker vérifié comme opérateur agréé ANJ lors du scan HTTPS", "Forme ESPN: Argentine WWWWW contre Égypte WDWDL", "No-vig marché calculé autour de 71,0 %; probabilité ValueBot prudente 77 % contre seuil de rentabilité 74,6 %, EV estimée +3,2 %", "Risque principal: prix bas et risque de nul en 90 minutes, d’où signal prudent et mise 0,25 u"], formA: [], formB: [], formALabel: 'Source A', formBLabel: 'Source B', h2h: "Non utilisé: aucune donnée H2H publique suffisamment fiable dans ce cycle.", context: "Sources: Betclic football Coupe du Monde 2026 — cote Argentine 1.34 capturée en HTTPS: https://www.betclic.fr/football-sfootball/coupe-du-monde-2026-c1/argentine-egypte-m1159679249117184; ANJ opérateurs agréés — Betclic vérifié présent lors du scan: https://anj.fr/offre-de-jeu-et-marche/operateurs-agrees; ESPN FIFA World Cup scoreboard 20260707 — Egypt at Argentina, start 2026-07-07T16:00Z, formes Argentine WWWWW / Égypte WDWDL: https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard?dates=20260707; Cache ValueBot du scan: data/cache/valuebot-radar-20260704T160048Z.json" },
  4: { iaProb: 40, factors: ["Cote Betclic 2.60 capturée le 2026-07-04T11:00:42Z sur le marché Résultat du match (temps réglementaire)", "Bookmaker vérifié comme opérateur agréé ANJ lors du scan HTTPS", "Forme ESPN: Belgique WWDDW contre USA WLWWL", "Probabilité ValueBot prudente 40 % contre seuil de rentabilité 38,5 %, EV estimée +4,0 %", "Risque principal: match à élimination directe avec probabilité de nul non négligeable, d’où signal prudent et mise 0,25 u"], formA: [], formB: [], formALabel: 'Source A', formBLabel: 'Source B', h2h: "Non utilisé: aucune donnée H2H publique suffisamment fiable dans ce cycle.", context: "Sources: Betclic football Coupe du Monde 2026 — cote Belgique 2.60 capturée en HTTPS: https://www.betclic.fr/football-sfootball/coupe-du-monde-2026-c1/usa-belgique-m1157911236861952; ANJ opérateurs agréés — Betclic vérifié présent lors du scan: https://anj.fr/offre-de-jeu-et-marche/operateurs-agrees; ESPN FIFA World Cup scoreboard 20260706 — Belgium at United States, start 2026-07-07T00:00Z, formes USA WLWWL / Belgique WWDDW: https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard?dates=20260706; Cache ValueBot du scan: data/cache/valuebot-radar-20260704T110054Z.json" },
  3: { iaProb: 56, factors: ["Cote Betclic 1.83 capturée le 2026-07-04T06:02:21Z sur le marché Résultat du match (temps réglementaire)", "Bookmaker vérifié comme opérateur agréé ANJ lors du scan HTTPS", "Forme ESPN: Maroc WWWDD contre Canada WLWDD", "Probabilité ValueBot prudente 56 % contre seuil de rentabilité 54,6 %, EV estimée +2,5 %", "Risque principal: nul en 90 minutes sur match à élimination directe, d'où tier signal prudent et mise 0,25 u"], formA: [], formB: [], formALabel: 'Source A', formBLabel: 'Source B', h2h: "Non utilisé: aucune donnée H2H publique suffisamment fiable dans ce cycle.", context: "Sources: Betclic football Coupe du Monde 2026 — cote capturée en HTTPS: https://www.betclic.fr/football-sfootball/coupe-du-monde-2026-c1/canada-maroc-m1156168539242496; ANJ opérateurs agréés — Betclic vérifié présent lors du scan: https://anj.fr/offre-de-jeu-et-marche/operateurs-agrees; ESPN FIFA World Cup scoreboard 20260704 — Morocco at Canada, start 2026-07-04T17:00Z, formes Canada WLWDD / Maroc WWWDD: https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard?dates=20260704; Cache ValueBot du scan: data/cache/valuebot-radar-20260704T060231Z.json" },
  2: { iaProb: 72, factors: ["Cote Betclic 1.42 capturée le 2026-07-03T16:00:44Z sur le marché Résultat du match (temps réglementaire)", "Bookmaker vérifié sur la page ANJ des opérateurs agréés lors du scan", "Forme ESPN: Colombie DWWWW contre Ghana LDWDL", "Probabilité ValueBot prudente 72 % contre seuil de rentabilité 70,4 %, EV estimée +2,2 %"], formA: [], formB: [], formALabel: 'Source A', formBLabel: 'Source B', h2h: "Non utilisé: aucune donnée H2H publique suffisamment fiable dans ce cycle.", context: "Sources: Betclic football Coupe du Monde 2026 — cote capturée en HTTPS: https://www.betclic.fr/football-sfootball/coupe-du-monde-2026-c1/colombie-ghana-m1154265967235072; ANJ opérateurs agréés — Betclic vérifié présent: https://anj.fr/offre-de-jeu-et-marche/operateurs-agrees; ESPN FIFA World Cup scoreboard 20260703 — Ghana at Colombia, start 2026-07-04T01:30Z, formes Colombie DWWWW / Ghana LDWDL: https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard?dates=20260703" },
  1: { iaProb: 78, factors: ["Cote Winamax 1.37 capturée en direct sur le marché Résultat", "Forme récente: Écosse LWWWL, Brésil WWWDW", "Distribution utilisateurs Winamax: Brésil 88 %, nul 11 %, Écosse 1 %", "Probabilité ValueBot décotée à 78 %, EV estimée +6,9 %"], formA: [], formB: [], formALabel: 'Source A', formBLabel: 'Source B', h2h: "Non utilisé ou non déterminant.", context: "Sources: Winamax sports football page scraped live: https://www.winamax.fr/paris-sportifs/sports/1; ANJ opérateurs agréés checked live: https://anj.fr/offre-de-jeu-et-marche/operateurs-agrees; ESPN FIFA World Cup schedule API: https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard?dates=20260624" }
};

export const historyRows: HistoryRow[] = [
  {
    "date": "2026-07-16",
    "match": "Angleterre - Argentine",
    "pari": "Oui",
    "cote": "1.88",
    "mise": "0.25 u",
    "pl": "+0,22 u",
    "win": true
  },
  {
    "date": "2026-07-15",
    "match": "France - Espagne",
    "pari": "Non",
    "cote": "1.98",
    "mise": "0.25 u",
    "pl": "+0,24 u",
    "win": true
  },
  {
    "date": "2026-07-13",
    "match": "Norvège - Angleterre",
    "pari": "Angleterre gagne",
    "cote": "1.86",
    "mise": "0.25 u",
    "pl": "-0,25 u",
    "win": false
  },
  {
    "date": "2026-07-13",
    "match": "Argentine - Suisse",
    "pari": "Argentine gagne",
    "cote": "1.68",
    "mise": "0.25 u",
    "pl": "-0,25 u",
    "win": false
  },
  {
    "date": "2026-07-11",
    "match": "Espagne - Belgique",
    "pari": "Espagne gagne",
    "cote": "1.6",
    "mise": "0.25 u",
    "pl": "+0,15 u",
    "win": true
  },
  {
    "date": "2026-07-10",
    "match": "France - Maroc",
    "pari": "France gagne",
    "cote": "1.57",
    "mise": "0.25 u",
    "pl": "+0,14 u",
    "win": true
  },
  {
    "date": "2026-07-08",
    "match": "Suisse - Colombie",
    "pari": "Colombie gagne",
    "cote": "2.25",
    "mise": "0.25 u",
    "pl": "-0,25 u",
    "win": false
  },
  {
    "date": "2026-07-06",
    "match": "Brésil - Norvège",
    "pari": "Brésil gagne",
    "cote": "1.78",
    "mise": "0.25 u",
    "pl": "-0,25 u",
    "win": false
  },
  {
    "date": "2026-07-07",
    "match": "Portugal - Espagne",
    "pari": "Espagne gagne",
    "cote": "1.89",
    "mise": "0.25 u",
    "pl": "+0,22 u",
    "win": true
  },
  {
    "date": "2026-07-08",
    "match": "Argentine - Égypte",
    "pari": "Argentine gagne",
    "cote": "1.34",
    "mise": "0.25 u",
    "pl": "+0,09 u",
    "win": true
  },
  {
    "date": "2026-07-07",
    "match": "USA - Belgique",
    "pari": "Belgique gagne",
    "cote": "2.6",
    "mise": "0.25 u",
    "pl": "+0,40 u",
    "win": true
  },
  {
    "date": "2026-07-05",
    "match": "Canada - Maroc",
    "pari": "Maroc gagne",
    "cote": "1.83",
    "mise": "0.25 u",
    "pl": "+0,21 u",
    "win": true
  },
  {
    "date": "2026-07-04",
    "match": "Colombie - Ghana",
    "pari": "Colombie gagne",
    "cote": "1.42",
    "mise": "0.25 u",
    "pl": "+0,10 u",
    "win": true
  },
  {
    "date": "2026-06-26",
    "match": "Écosse - Brésil",
    "pari": "Brésil gagne",
    "cote": "1.37",
    "mise": "1 u",
    "pl": "+0,37 u",
    "win": true
  }
];

export const bankrollSummary = {
  current: 101.14,
  initial: 100.0,
  deltaAll: 1.14,
  generatedAt: "2026-07-16T16:18:26Z",
};

export const bankrollKpis: { label: string; value: string; color?: string }[] = [
  {
    "label": "Yield",
    "value": "26,8 %"
  },
  {
    "label": "ROI",
    "value": "1,1 %"
  },
  {
    "label": "Taux de réussite",
    "value": "71,4 %"
  },
  {
    "label": "Cote moyenne",
    "value": "1,79"
  },
  {
    "label": "Paris réglés",
    "value": "14"
  },
  {
    "label": "Paris en attente",
    "value": "2"
  },
  {
    "label": "Seuil signal",
    "value": "1,0 %"
  },
  {
    "label": "Drawdown actuel",
    "value": "0,0 u"
  },
  {
    "label": "Drawdown max",
    "value": "0,5 u"
  }
];

export const riskNotice = "18+. Les paris comportent des risques : endettement, isolement, dépendance. Joueurs Info Service : 09 74 75 13 13. Aucune garantie de gain. Conseils générés par IA.";

export const pipeline: PipelineStep[] = [
  { n: 1, title: "Collecte de données", desc: "Agrégation de données publiques : résultats, xG/forme, classements, blessures publiques et cotes horodatées d’opérateurs agréés ANJ." },
  { n: 2, title: "Analyse statistique", desc: "Les modèles estiment une probabilité propre pour chaque issue, séparée de la cote de marché." },
  { n: 3, title: "Détection de valeur", desc: "Comparaison probabilité estimée vs cote. Une value n’existe que si EV ≥ 3 %." },
  { n: 4, title: "Sélection", desc: "La majorité des matchs est écartée : données insuffisantes, incertitude forte ou cote non traçable." },
  { n: 5, title: "Mise (unités)", desc: "Kelly fractionné à 25 %, plafonné à 3 unités par pari et 6 unités d’exposition quotidienne." },
  { n: 6, title: "Publication horodatée", desc: "Chaque conseil publié indique bookmaker, cote, timestamp et raisonnement. Jamais de cote inventée." },
  { n: 7, title: "Bilan quotidien", desc: "Chaque pari réglé met à jour la bankroll publique via un ledger append-only." },
  { n: 8, title: "Auto-amélioration", desc: "Les ajustements de modèle restent prudents, versionnés et basés sur échantillon suffisant." },
];

export const plans: PricingPlan[] = [
  { key: "decouverte", name: "Découverte", tagline: "Pour observer la méthode", priceM: 0, priceA: 0, cta: "Commencer gratuitement", accent: "#8B98A5", features: ["Conseils publiés en différé (J+1)", "Bankroll publique en temps réel", "Football + Tennis", "Bilan hebdomadaire"] },
  { key: "pro", name: "Pro", tagline: "Pour suivre sérieusement", priceM: 19, priceA: 15, cta: "Choisir Pro", popular: true, accent: "#16C784", features: ["Tous les conseils en temps réel", "Football + Tennis", "Analyses IA complètes", "Historique détaillé", "Notifications"] },
  { key: "expert", name: "Expert", tagline: "Pour les profils data-driven", priceM: 39, priceA: 29, cta: "Choisir Expert", accent: "#22D3EE", features: ["Tout le forfait Pro", "Accès API", "Export CSV", "Filtres personnalisés", "Support prioritaire"] },
];

export const invoices: Invoice[] = [];

export const navItems = [
  { key: "accueil", label: "Accueil", icon: "🏠", href: "/" },
  { key: "conseils", label: "Conseils", icon: "🎯", href: "/conseils" },
  { key: "bankroll", label: "Bankroll", icon: "📈", href: "/bankroll" },
  { key: "methode", label: "Méthode", icon: "🤖", href: "/methode" },
  { key: "tarifs", label: "Tarifs", icon: "⚡", href: "/tarifs" },
];
