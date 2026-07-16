#!/usr/bin/env python3
import json, re, html, time
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import urljoin
import requests

UA='Mozilla/5.0 (compatible; ValueBot/1.0; +https://valuebot.wezon.fr)'
S=requests.Session(); S.headers.update({'User-Agent':UA,'Accept-Language':'fr-FR,fr;q=0.9,en;q=0.8'})
BASE='https://www.betclic.fr'

def get(url):
    r=S.get(url,timeout=25)
    return {'url':url,'status':r.status_code,'bytes':len(r.text),'text':r.text}

def clean(s):
    return re.sub(r'\s+',' ',html.unescape(re.sub('<[^>]+>',' ',s))).strip()

def parse_cards(text, sport, limit):
    out=[]
    for m in re.finditer(r'<a sports-events-event-card=.*?</a>', text, re.S):
        block=m.group(0)
        href_m=re.search(r'href="([^"]+-m\d+)"', block)
        aria_m=re.search(r'aria-label="([^"]+)"', block)
        if not href_m or not aria_m: continue
        names=re.findall(r'data-qa="contestant-[12]-label">\s*([^<]+?)\s*</span>', block)
        labels=re.findall(r'<bcdk-bet-button-label[^>]*>\s*<span class="ellipsis">(.*?)</span>(?:<span class="clip">(.*?)</span>)?', block, re.S)
        odds=re.findall(r'<bcdk-bet-button-odds-animated[^>]*>\s*([0-9]+,[0-9]+)\s*</bcdk-bet-button-odds-animated>', block)
        sel=[]
        for i,o in enumerate(odds):
            lab=''.join(labels[i]) if i < len(labels) else (names[i] if i < len(names) else f'Sélection {i+1}')
            try: odd=float(o.replace(',','.'))
            except: continue
            sel.append({'selection':clean(lab), 'odd':odd})
        if not sel: continue
        comp=clean(re.findall(r'breadcrumb_itemLabel"><!---->\s*(.*?)\s*<!---->', block, re.S)[-1]) if re.findall(r'breadcrumb_itemLabel"><!---->\s*(.*?)\s*<!---->', block, re.S) else None
        out.append({'sport':sport,'event':html.unescape(aria_m.group(1)),'href':urljoin(BASE, href_m.group(1)),'competition':comp,'market':'1N2 temps réglementaire' if sport=='football' else 'Vainqueur du match','odds':sel})
        if len(out)>=limit: break
    return out

def detail_markets(url, sport):
    r=get(url); text=r['text']
    names=[]
    for pat in [r'<h2 class="marketBox_headTitle">\s*(.*?)\s*</h2>', r'<span class="filters_label">\s*(.*?)\s*</span>']:
        for x in re.findall(pat,text,re.S):
            c=clean(x)
            if c and c not in names: names.append(c)
    fam=[]
    wanted_foot=['Résultat du match (tps rég.)','Double chance','Nombre total de buts','Les 2 équipes marquent','Total de buts -','Score exact','Handicap','Mi-temps/Fin de match']
    wanted_tennis=['Vainqueur du match','Nombre total de jeux','Score final (sets)','Les deux joueurs gagnent un set','Écart de sets','Vainqueur du set','Tie-break','Handicap']
    wanted=wanted_foot if sport=='football' else wanted_tennis
    for n in names:
        if any(w in n for w in wanted) and n not in fam: fam.append(n)
    return {'status':r['status'],'bytes':r['bytes'],'markets_seen':fam[:20], 'names_count':len(names)}

def main():
    now=datetime.now(timezone.utc).replace(microsecond=0).isoformat().replace('+00:00','Z')
    checks={}
    robots=get('https://www.betclic.fr/robots.txt'); checks['betclic_robots']={k:robots[k] for k in ['url','status','bytes']}; checks['betclic_robots']['sample']=robots['text'][:120]
    anj=get('https://anj.fr/offre-de-jeu-et-marche/operateurs-agrees'); checks['anj']={'url':anj['url'],'status':anj['status'],'bytes':anj['bytes'],'betclic_present':'Betclic' in anj['text']}
    urls=[('football','https://www.betclic.fr/football-sfootball/coupe-du-monde-2026-c1',10),('tennis','https://www.betclic.fr/tennis-stennis',10)]
    candidates=[]
    for sport,url,lim in urls:
        r=get(url); checks[sport]={'url':url,'status':r['status'],'bytes':r['bytes']}
        cards=parse_cards(r['text'],sport,lim)
        for c in cards:
            time.sleep(0.15)
            d=detail_markets(c['href'], sport)
            c.update({'captured_at_utc':now,'bookmaker':'Betclic','bookmaker_authorized_anj':checks['anj']['betclic_present'],'detail_status':d['status'],'detail_bytes':d['bytes'],'detail_markets_seen':d['markets_seen']})
        candidates.extend(cards)
    # ESPN WC schedule sanity
    esp=[]
    for date in ['20260626','20260627','20260628']:
        try:
            e=S.get(f'https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard?dates={date}',timeout=20).json()
            for ev in e.get('events',[]): esp.append({'name':ev.get('name'),'date':ev.get('date'),'status':ev.get('status',{}).get('type',{}).get('description')})
        except Exception as ex: esp.append({'error':str(ex),'date':date})
    data={'collected_at_utc':now,'method':'HTTPS Betclic listing/detail + ANJ + ESPN scoreboard; no query-string URLs on Betclic','candidates':candidates,'checks':checks,'espn_worldcup':esp}
    path=Path('data/cache')/('valuebot-radar-'+datetime.now(timezone.utc).strftime('%Y%m%dT%H%M%SZ')+'.json')
    path.write_text(json.dumps(data,ensure_ascii=False,indent=2),encoding='utf-8')
    print(path)
    print(json.dumps({'count':len(candidates),'sports':{s:sum(1 for c in candidates if c['sport']==s) for s in ['football','tennis']},'checks':checks},ensure_ascii=False,indent=2))

if __name__=='__main__': main()
