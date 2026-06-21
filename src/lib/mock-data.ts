import type { Tip, TipDetail, HistoryRow, PipelineStep, PricingPlan, Invoice } from "@/types";

export const equity = [
  100, 101.4, 100.6, 102.8, 104.2, 103.1, 105.6, 107.9, 106.4, 108.8,
  111.2, 109.9, 112.4, 114.8, 113.9, 112.4, 115.8, 118.3, 116.7, 119.6,
  122.1, 120.7, 119.2, 122.8, 125.9, 124.6, 128.1, 130.7, 129.1, 127.3,
  131.0, 134.7, 133.1, 136.2, 139.0, 137.4, 140.3, 143.8, 142.2, 145.3,
  148.6,
];

export const bets: Tip[] = [
  {
    id: 1, sport: "tennis", sportLabel: "\ud83c\udfbe Tennis",
    comp: "ATP Masters 1000 \u2014 Rome", matchup: "Alcaraz \u2014 Sinner",
    when: "Aujourd\u2019hui \u00b7 18:30", pari: "Victoire Alcaraz",
    conf: 4, mise: "2 u", miseN: 2, cote: "1,85", coteN: 1.85,
    book: "Winamax", releve: "Cote @1,85 relev\u00e9e chez Winamax le 14/06 \u00e0 18:32",
    statut: "avenir",
    analyse: "Alcaraz domine le secteur retour sur terre battue (1er \u00e0 la conversion de balles de break en 2026) et reste sur 4 victoires cons\u00e9cutives face \u00e0 Sinner sur cette surface. La cote int\u00e8gre mal sa sup\u00e9riorit\u00e9 physique sur 3 sets.",
  },
  {
    id: 2, sport: "football", sportLabel: "\u26bd Football",
    comp: "Ligue 1 \u2014 J34", matchup: "OM \u2014 OL",
    when: "Aujourd\u2019hui \u00b7 21:00", pari: "+2,5 buts",
    conf: 3, mise: "1,5 u", miseN: 1.5, cote: "1,72", coteN: 1.72,
    book: "Betclic", releve: "Cote @1,72 relev\u00e9e chez Betclic le 14/06 \u00e0 11:05",
    statut: "avenir",
    analyse: "Les deux attaques figurent dans le top 4 des xG du championnat, et 7 des 9 derniers OM\u2013OL ont d\u00e9pass\u00e9 2,5 buts. Les d\u00e9fenses align\u00e9es sont diminu\u00e9es par les absences.",
  },
  {
    id: 3, sport: "football", sportLabel: "\u26bd Football",
    comp: "Serie A \u2014 J37", matchup: "Inter \u2014 Milan",
    when: "Demain \u00b7 20:45", pari: "Moins de 3,5 buts",
    conf: 3, mise: "1,5 u", miseN: 1.5, cote: "1,66", coteN: 1.66,
    book: "Unibet", releve: "Cote @1,66 relev\u00e9e chez Unibet le 14/06 \u00e0 09:40",
    statut: "avenir",
    analyse: "Les derbys milanais \u00e0 enjeu sont historiquement ferm\u00e9s : 6 des 8 derniers sous 3,5 buts. Mod\u00e8le d\u2019xG attendu autour de 2,3 buts combin\u00e9s.",
  },
  {
    id: 4, sport: "tennis", sportLabel: "\ud83c\udfbe Tennis",
    comp: "WTA 1000 \u2014 Rome", matchup: "\u015awi\u0105tek \u2014 Gauff",
    when: "13/06 \u00b7 14:00", pari: "Victoire \u015awi\u0105tek",
    conf: 5, mise: "3 u", miseN: 3, cote: "1,55", coteN: 1.55,
    book: "Unibet", releve: "Cote @1,55 relev\u00e9e chez Unibet le 12/06 \u00e0 19:10",
    statut: "gagne", pl: 1.65,
    analyse: "\u015awi\u0105tek pr\u00e9sente un bilan de 11-1 face \u00e0 Gauff sur terre battue. Avantage marqu\u00e9 au service et en fond de court : valeur claire malgr\u00e9 une cote basse.",
  },
  {
    id: 5, sport: "football", sportLabel: "\u26bd Football",
    comp: "Ligue des Champions \u2014 1/2", matchup: "Real Madrid \u2014 Man City",
    when: "12/06 \u00b7 21:00", pari: "Victoire Real Madrid",
    conf: 4, mise: "2 u", miseN: 2, cote: "2,10", coteN: 2.10,
    book: "Winamax", releve: "Cote @2,10 relev\u00e9e chez Winamax le 11/06 \u00e0 22:15",
    statut: "perdu", pl: -2,
    analyse: "Avantage \u00e0 domicile et historique europ\u00e9en favorable au Real. Le mod\u00e8le valorisait l\u2019issue \u00e0 52% contre 48% implicite \u2014 la variance a tranch\u00e9 en d\u00e9faveur.",
  },
  {
    id: 6, sport: "football", sportLabel: "\u26bd Football",
    comp: "Ligue 1 \u2014 J33", matchup: "Monaco \u2014 Lens",
    when: "10/06 \u00b7 17:00", pari: "Les deux \u00e9quipes marquent",
    conf: 3, mise: "1,5 u", miseN: 1.5, cote: "1,80", coteN: 1.80,
    book: "PMU", releve: "Cote @1,80 relev\u00e9e chez PMU le 09/06 \u00e0 12:30",
    statut: "gagne", pl: 1.20,
    analyse: "Deux blocs joueurs et des d\u00e9fenses perm\u00e9ables : BTTS valid\u00e9 dans 64% des matchs combin\u00e9s des deux \u00e9quipes cette saison.",
  },
  {
    id: 7, sport: "football", sportLabel: "\u26bd Football",
    comp: "Ligue 1 \u2014 J32", matchup: "PSG \u2014 Brest",
    when: "07/06 \u00b7 21:00", pari: "PSG \u22121,5 (handicap)",
    conf: 4, mise: "2 u", miseN: 2, cote: "1,95", coteN: 1.95,
    book: "Winamax", releve: "Cote @1,95 relev\u00e9e chez Winamax le 06/06 \u00e0 18:00",
    statut: "gagne", pl: 1.90,
    analyse: "\u00c9cart de niveau majeur et dynamique offensive du PSG (2,8 buts/match \u00e0 domicile). Le handicap \u22121,5 offrait une marge de valeur sur la cote relev\u00e9e.",
  },
  {
    id: 8, sport: "tennis", sportLabel: "\ud83c\udfbe Tennis",
    comp: "WTA 1000 \u2014 Rome", matchup: "Sabalenka \u2014 Rybakina",
    when: "09/06 \u00b7 13:00", pari: "Victoire Sabalenka",
    conf: 3, mise: "1,5 u", miseN: 1.5, cote: "1,70", coteN: 1.70,
    book: "Betclic", releve: "Cote @1,70 relev\u00e9e chez Betclic le 08/06 \u00e0 20:00",
    statut: "annule", pl: 0,
    analyse: "Forfait de Rybakina avant le match (blessure). Mise int\u00e9gralement rembours\u00e9e \u2014 aucun impact sur la bankroll.",
  },
  {
    id: 9, sport: "tennis", sportLabel: "\ud83c\udfbe Tennis",
    comp: "ATP 500 \u2014 Halle", matchup: "Medvedev \u2014 Zverev",
    when: "05/06 \u00b7 15:30", pari: "Victoire Medvedev",
    conf: 2, mise: "1 u", miseN: 1, cote: "2,25", coteN: 2.25,
    book: "Betclic", releve: "Cote @2,25 relev\u00e9e chez Betclic le 04/06 \u00e0 16:45",
    statut: "perdu", pl: -1,
    analyse: "Pari de valeur sur gazon o\u00f9 Medvedev sur-performe historiquement. Confiance volontairement basse (2/5) ; l\u2019issue d\u00e9favorable \u00e9tait dans les sc\u00e9narios attendus.",
  },
];

export const tipDetails: Record<number, TipDetail> = {
  1: {
    iaProb: 62,
    factors: [
      "1er \u00e0 la conversion de balles de break sur terre en 2026",
      "4 victoires de suite face \u00e0 Sinner sur ocre",
      "Endurance sup\u00e9rieure sur un format 3 sets",
    ],
    formA: ["V", "V", "V", "D", "V"],
    formB: ["V", "D", "V", "V", "V"],
    formALabel: "Alcaraz",
    formBLabel: "Sinner",
    h2h: "Alcaraz m\u00e8ne 5\u20133 en confrontations directes, dont 4\u20130 sur terre battue.",
    context: "Demi-finale sur la terre battue du Foro Italico. Conditions s\u00e8ches et rapides annonc\u00e9es, favorables au jeu agressif d\u2019Alcaraz.",
  },
  2: {
    iaProb: 64,
    factors: [
      "Deux attaques dans le top 4 des xG du championnat",
      "7 des 9 derniers OM\u2013OL ont d\u00e9pass\u00e9 2,5 buts",
      "D\u00e9fenses diminu\u00e9es par les absences",
    ],
    formA: ["V", "N", "V", "V", "D"],
    formB: ["V", "V", "N", "V", "V"],
    formALabel: "OM",
    formBLabel: "OL",
    h2h: "Sur les 5 derniers OM\u2013OL, moyenne de 3,4 buts par match.",
    context: "Choc de la 34e journ\u00e9e au V\u00e9lodrome. Enjeu europ\u00e9en pour les deux clubs, ce qui pousse au jeu offensif.",
  },
  3: {
    iaProb: 64,
    factors: [
      "Les derbys milanais \u00e0 enjeu sont historiquement ferm\u00e9s",
      "6 des 8 derniers derbys sous 3,5 buts",
      "Mod\u00e8le d\u2019xG combin\u00e9 attendu ~2,3 buts",
    ],
    formA: ["N", "V", "V", "D", "N"],
    formB: ["V", "N", "V", "V", "D"],
    formALabel: "Inter",
    formBLabel: "Milan",
    h2h: "2,1 buts de moyenne sur les 6 derniers derbys \u00e0 San Siro.",
    context: "Derby della Madonnina d\u00e9cisif pour le titre. Les deux \u00e9quipes privil\u00e9gient la prudence dans ce contexte.",
  },
  4: {
    iaProb: 68,
    factors: [
      "Bilan de 11\u20131 face \u00e0 Gauff sur terre battue",
      "Avantage marqu\u00e9 au service et en fond de court",
      "R\u00e9gularit\u00e9 sup\u00e9rieure sur la dur\u00e9e",
    ],
    formA: ["V", "V", "V", "V", "V"],
    formB: ["V", "D", "V", "V", "D"],
    formALabel: "\u015awi\u0105tek",
    formBLabel: "Gauff",
    h2h: "\u015awi\u0105tek m\u00e8ne largement leurs duels sur ocre.",
    context: "Finale du WTA 1000 de Rome. \u015awi\u0105tek est la r\u00e9f\u00e9rence absolue sur terre battue ces derni\u00e8res saisons.",
  },
  5: {
    iaProb: 52,
    factors: [
      "Avantage du terrain et exp\u00e9rience europ\u00e9enne",
      "Historique favorable en phases finales de C1",
      "Marge de value sur la cote relev\u00e9e",
    ],
    formA: ["V", "V", "N", "V", "V"],
    formB: ["V", "V", "V", "D", "V"],
    formALabel: "Real",
    formBLabel: "Man City",
    h2h: "Demi-finales serr\u00e9es les deux derni\u00e8res saisons, une victoire chacun.",
    context: "Demi-finale aller de Ligue des Champions \u00e0 Bernab\u00e9u. Match tr\u00e8s \u00e9quilibr\u00e9 sur le papier.",
  },
  6: {
    iaProb: 58,
    factors: [
      "Deux blocs joueurs et d\u00e9fenses perm\u00e9ables",
      "BTTS valid\u00e9 dans 64% des matchs combin\u00e9s",
      "Dynamique offensive des deux \u00e9quipes",
    ],
    formA: ["V", "V", "D", "N", "V"],
    formB: ["V", "N", "V", "D", "V"],
    formALabel: "Monaco",
    formBLabel: "Lens",
    h2h: "4 des 5 derniers Monaco\u2013Lens avec but de chaque c\u00f4t\u00e9.",
    context: "Match ouvert de milieu de tableau, sans calcul d\u00e9fensif particulier attendu.",
  },
  7: {
    iaProb: 55,
    factors: [
      "\u00c9cart de niveau majeur entre les deux \u00e9quipes",
      "2,8 buts/match du PSG \u00e0 domicile",
      "Marge de value sur le handicap \u22121,5",
    ],
    formA: ["V", "V", "V", "V", "N"],
    formB: ["D", "N", "V", "D", "D"],
    formALabel: "PSG",
    formBLabel: "Brest",
    h2h: "Le PSG s\u2019est impos\u00e9 par 2+ buts d\u2019\u00e9cart lors des 3 derniers face-\u00e0-face.",
    context: "R\u00e9ception d\u2019un adversaire de bas de tableau au Parc des Princes.",
  },
  8: {
    iaProb: 60,
    factors: [
      "Avantage th\u00e9orique au service",
      "Surface favorable \u00e0 Sabalenka",
      "Confiance mod\u00e9r\u00e9e \u2014 match rembours\u00e9",
    ],
    formA: ["V", "V", "D", "V", "V"],
    formB: ["V", "D", "V", "D", "N"],
    formALabel: "Sabalenka",
    formBLabel: "Rybakina",
    h2h: "Duels habituellement tr\u00e8s serr\u00e9s en deux ou trois sets.",
    context: "Match annul\u00e9 sur forfait de Rybakina (blessure). Mise int\u00e9gralement rembours\u00e9e.",
  },
  9: {
    iaProb: 48,
    factors: [
      "Sur-performance historique de Medvedev sur gazon",
      "Cote jug\u00e9e trop haute par le mod\u00e8le",
      "Confiance volontairement basse (2/5)",
    ],
    formA: ["V", "D", "V", "D", "D"],
    formB: ["V", "V", "D", "V", "N"],
    formALabel: "Medvedev",
    formBLabel: "Zverev",
    h2h: "Confrontations \u00e9quilibr\u00e9es, l\u00e9ger avantage Zverev r\u00e9cemment.",
    context: "Tournoi sur gazon de Halle. Pari de value assum\u00e9 malgr\u00e9 une issue d\u00e9favorable.",
  },
};

export const historyRows: HistoryRow[] = [
  { date: "13/06", match: "\u015awi\u0105tek \u2014 Gauff", pari: "Victoire \u015awi\u0105tek", cote: "1,55", mise: "3 u", pl: "+1,65 u", win: true },
  { date: "12/06", match: "Real \u2014 Man City", pari: "Victoire Real", cote: "2,10", mise: "2 u", pl: "\u22122,00 u", win: false },
  { date: "10/06", match: "Monaco \u2014 Lens", pari: "BTTS", cote: "1,80", mise: "1,5 u", pl: "+1,20 u", win: true },
  { date: "09/06", match: "Sabalenka \u2014 Rybakina", pari: "Victoire Sabalenka", cote: "1,70", mise: "1,5 u", pl: "0,00 u", win: null },
  { date: "07/06", match: "PSG \u2014 Brest", pari: "PSG \u22121,5", cote: "1,95", mise: "2 u", pl: "+1,90 u", win: true },
  { date: "05/06", match: "Medvedev \u2014 Zverev", pari: "Victoire Medvedev", cote: "2,25", mise: "1 u", pl: "\u22121,00 u", win: false },
  { date: "03/06", match: "Atalanta \u2014 Roma", pari: "+2,5 buts", cote: "1,78", mise: "1,5 u", pl: "+1,17 u", win: true },
  { date: "02/06", match: "Djokovic \u2014 Ruud", pari: "Victoire Djokovic", cote: "1,62", mise: "2,5 u", pl: "+1,55 u", win: true },
];

export const pipeline: PipelineStep[] = [
  { n: 1, title: "Collecte de donn\u00e9es", desc: "Agr\u00e9gation de donn\u00e9es publiques : r\u00e9sultats, xG, classements, m\u00e9t\u00e9o, blessures, cotes d\u2019ouverture de multiples op\u00e9rateurs." },
  { n: 2, title: "Analyse statistique", desc: "Les mod\u00e8les estiment une probabilit\u00e9 propre pour chaque issue de chaque match, ind\u00e9pendamment du march\u00e9." },
  { n: 3, title: "D\u00e9tection de valeur", desc: "Comparaison probabilit\u00e9 estim\u00e9e vs cote du bookmaker. Une valeur n\u2019existe que si la cote sous-estime le r\u00e9sultat." },
  { n: 4, title: "S\u00e9lection", desc: "Seuls les paris au-dessus du seuil de valeur passent le filtre. La grande majorit\u00e9 des matchs est \u00e9cart\u00e9e." },
  { n: 5, title: "Mise (unit\u00e9s)", desc: "La taille de mise (0,5 \u00e0 3 u) est calcul\u00e9e selon l\u2019ampleur de la valeur, jamais selon une intuition." },
  { n: 6, title: "Publication horodat\u00e9e", desc: "Le conseil est publi\u00e9 avant le match, avec sa cote, son op\u00e9rateur et son horodatage. Jamais modifi\u00e9 ensuite." },
  { n: 7, title: "Bilan quotidien", desc: "Chaque pari r\u00e9gl\u00e9 met \u00e0 jour la bankroll publique et les KPIs en temps r\u00e9el, gains comme pertes." },
  { n: 8, title: "Auto-am\u00e9lioration", desc: "Les \u00e9carts entre pr\u00e9diction et r\u00e9sultat r\u00e9-alimentent les mod\u00e8les pour affiner les estimations futures." },
];

export const plans: PricingPlan[] = [
  {
    key: "decouverte", name: "D\u00e9couverte", tagline: "Pour observer la m\u00e9thode",
    priceM: 0, priceA: 0, cta: "Commencer gratuitement", accent: "#8B98A5",
    features: ["Conseils publi\u00e9s en diff\u00e9r\u00e9 (J+1)", "Bankroll publique en temps r\u00e9el", "1 sport au choix", "Bilan hebdomadaire par email"],
  },
  {
    key: "pro", name: "Pro", tagline: "Pour suivre s\u00e9rieusement",
    priceM: 19, priceA: 15, cta: "Choisir Pro", popular: true, accent: "#16C784",
    features: ["Tous les conseils en temps r\u00e9el", "Football + Tennis", "Analyses IA compl\u00e8tes", "Alertes value en direct", "Historique d\u00e9taill\u00e9", "Notifications email & push"],
  },
  {
    key: "expert", name: "Expert", tagline: "Pour les profils data-driven",
    priceM: 39, priceA: 29, cta: "Choisir Expert", accent: "#22D3EE",
    features: ["Tout le forfait Pro", "Acc\u00e8s API (cotes & signaux)", "Export CSV illimit\u00e9", "Filtres value personnalis\u00e9s", "Support prioritaire"],
  },
];

export const invoices: Invoice[] = [
  { date: "14 juin 2026", amount: "15,00 \u20ac", label: "Abonnement Pro \u2014 annuel", status: "Pay\u00e9e" },
  { date: "14 mai 2026", amount: "15,00 \u20ac", label: "Abonnement Pro \u2014 annuel", status: "Pay\u00e9e" },
  { date: "14 avr. 2026", amount: "15,00 \u20ac", label: "Abonnement Pro \u2014 annuel", status: "Pay\u00e9e" },
];

export const navItems = [
  { key: "accueil", label: "Accueil", icon: "\ud83c\udfe0", href: "/" },
  { key: "conseils", label: "Conseils", icon: "\ud83c\udfaf", href: "/conseils" },
  { key: "bankroll", label: "Bankroll", icon: "\ud83d\udcc8", href: "/bankroll" },
  { key: "methode", label: "M\u00e9thode", icon: "\ud83e\udd16", href: "/methode" },
  { key: "tarifs", label: "Tarifs", icon: "\u26a1", href: "/tarifs" },
];
