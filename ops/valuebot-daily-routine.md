# Routine quotidienne ValueBot

Ce document décrit la routine autonome créée le 2026-06-21.

## Exécution

Le cron Hermes quotidien travaille depuis :

```text
/home/hermes/apps/valuebot
```

Il utilise le script support :

```bash
python3 scripts/valuebot_cycle.py <commande>
```

Commandes utiles :

```bash
python3 scripts/valuebot_cycle.py metrics
python3 scripts/valuebot_cycle.py report
python3 scripts/valuebot_cycle.py no-bet --observation "..." --candidates N
python3 scripts/valuebot_cycle.py add-tip /tmp/tip.json
python3 scripts/valuebot_cycle.py settle <tip_id> won|lost|void --source "URL publique résultat"
python3 scripts/valuebot_cycle.py rebuild-restart
```

## Règles strictes

- Validation Henri : publication automatique renouvelée explicitement le 2026-07-02 21:34 Europe/Paris, active jusqu’au 2026-07-12 21:34 Europe/Paris inclus sauf contre-ordre explicite. Pendant cette fenêtre, publier automatiquement tout conseil qui passe les filtres, y compris `publication_tier="prudent_signal"`.
- Ne jamais publier un pari sans : probabilité modèle argumentée, cote exacte, bookmaker agréé ANJ, timestamp, sources publiques traçables.
- Ne jamais publier juste pour remplir le site : la validation autorise l’automatisation, pas l’abaissement des critères.
- Ne jamais inventer une cote, un résultat, une probabilité ou une source.
- EV minimum conseil officiel : 0,03. EV minimum signal prudent : 0,01.
- Mise : Kelly fractionné 25 %, plafonnée à 3 unités ; exposition quotidienne max 6 unités. Signal prudent plafonné à 0,5 unité, idéalement 0,25 à 0,5 u.
- Ledger append-only : `data/state/bankroll_ledger.jsonl`.
- État public : `data/state/valuebot_state.json` puis rendu dans `src/lib/mock-data.ts`.
- En période validée, si un conseil est publiable : `add-tip`, `rebuild-restart`, puis vérification réelle de `https://valuebot.wezon.fr/conseils` et de la page détail.
- Le radar ne doit plus se limiter au 1X2/vainqueur : scanner football (1X2, double chance, DNB, handicaps, over/under, BTTS, team goals; corners/cartons seulement si stats fiables) et tennis (vainqueur, handicap jeux/sets, over/under jeux/sets, joueur gagne un set, tie-break).
- En période Coupe du monde + Wimbledon, couvrir football ET tennis sur aujourd’hui/demain/72h, viser 12 à 20 candidats si le calendrier le permet.
- Si aucun conseil ne passe les filtres, publier zéro pari, journaliser `no-bet`, mais fournir aussi un “radar abonnés / à surveiller” avec angles concrets non publiables ou à recontrôler.

## Livraison

Le rapport quotidien est livré par le cron dans le thread Discord d’origine ValueBot :

```text
1518251556565291219
```
