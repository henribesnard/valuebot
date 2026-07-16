#!/usr/bin/env python3
"""Scan ESPN scoreboard for upcoming World Cup matches."""
import json, subprocess, sys, re
from datetime import datetime, timezone, timedelta

now = datetime.now(timezone.utc)
dates = [now + timedelta(days=d) for d in range(0, 4)]

for d in dates:
    ds = d.strftime("%Y%m%d")
    try:
        r = subprocess.run(
            ["curl", "-s", f"https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard?dates={ds}"],
            capture_output=True, text=True, timeout=15
        )
        data = json.loads(r.stdout)
        events = data.get("events", [])
        if not events:
            continue
        print(f"\n=== {d.strftime('%Y-%m-%d %A')} === {len(events)} matchs")
        for e in events:
            name = e.get("name","?")
            dt = e.get("date","?")
            comps = e.get("competitions",[{}])[0]
            teams = comps.get("competitors",[])
            status = comps.get("status",{}).get("type",{}).get("description","?")
            abb = {t.get("team",{}).get("abbreviation","?"): t.get("team",{}).get("displayName","?") for t in teams}
            print(f"  {name} | {status} | teams: {abb}")
    except Exception as ex:
        print(f"{ds}: error {ex}")
