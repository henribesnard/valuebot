import { pipeline } from "@/lib/mock-data";

export default function MethodePage() {
  return (
    <main className="max-w-content mx-auto px-5 pt-11">
      {/* Header */}
      <h1 className="font-heading font-bold text-[32px] text-vb-text mb-2">
        Comment ça marche
      </h1>
      <p className="text-[15px] text-vb-text-secondary mb-8 leading-[1.55] max-w-[700px]">
        ValueBot est un pipeline d&apos;agents IA entièrement automatisé qui
        détecte les paris à valeur positive sur le football et le tennis. Voici
        chaque étape, de la donnée brute au conseil publié.
      </p>

      {/* Pipeline grid */}
      <div className="grid grid-cols-1 mobile:grid-cols-2 lg:grid-cols-4 gap-[14px] mb-11">
        {pipeline.map((step) => (
          <div
            key={step.n}
            className="bg-[rgba(22,27,34,0.55)] border border-vb-border rounded-2xl p-5"
          >
            <div className="flex items-center gap-[10px] mb-[10px]">
              <div
                className="flex items-center justify-center font-heading font-bold text-[13px] text-vb-cyan-light rounded-[9px] border border-[rgba(34,211,238,0.3)]"
                style={{
                  width: 30,
                  height: 30,
                  background:
                    "linear-gradient(to bottom right, rgba(34,211,238,0.2), rgba(124,92,252,0.2))",
                }}
              >
                {step.n}
              </div>
              <h3 className="font-heading font-semibold text-[15px] text-vb-text">
                {step.title}
              </h3>
            </div>
            <p className="text-[13px] leading-[1.55] text-vb-text-secondary">
              {step.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Philosophy cards */}
      <div className="grid grid-cols-1 mobile:grid-cols-2 gap-[18px] mb-11">
        {/* Card 1: Value Betting */}
        <div className="bg-vb-bg-card-solid border border-vb-border rounded-[18px] p-[26px]">
          <p className="text-[13px] font-semibold text-vb-green mb-[10px]">
            VALUE BETTING
          </p>
          <h3 className="font-heading font-semibold text-xl text-vb-text mb-3">
            Parier la valeur, pas le favori
          </h3>
          <p className="text-[13.5px] leading-[1.6] text-vb-text-secondary">
            Un pari à valeur positive (« value bet ») survient lorsque la
            probabilité réelle d&apos;un événement est supérieure à ce que la
            cote du bookmaker implique. ValueBot ne prédit pas « qui va
            gagner » : il identifie les situations où le marché se trompe
            suffisamment pour offrir un avantage mathématique. Sur des
            centaines de paris, cet avantage se traduit par un profit
            structurel, indépendant de la chance.
          </p>
        </div>

        {/* Card 2: Sélectivité & Gestion */}
        <div className="bg-vb-bg-card-solid border border-vb-border rounded-[18px] p-[26px]">
          <p className="text-[13px] font-semibold text-vb-cyan mb-[10px]">
            SÉLECTIVITÉ &amp; GESTION
          </p>
          <h3 className="font-heading font-semibold text-xl text-vb-text mb-3">
            On ne parie PAS tous les matchs
          </h3>
          <p className="text-[13.5px] leading-[1.6] text-vb-text-secondary mb-4">
            La majorité des matchs ne présentent aucune valeur exploitable.
            ValueBot ne joue qu&apos;une fraction des événements disponibles,
            avec une mise proportionnelle à la valeur détectée (0,5 à 3 unités).
            Cette discipline de staking protège la bankroll des séries négatives
            et maximise la croissance à long terme.
          </p>
          <div className="flex gap-[10px] flex-wrap">
            <span className="inline-flex items-center px-3 py-[6px] rounded-full bg-white/[0.06] text-[12px] text-vb-text-secondary border border-vb-border">
              ~6 % des matchs joués
            </span>
            <span className="inline-flex items-center px-3 py-[6px] rounded-full bg-white/[0.06] text-[12px] text-vb-text-secondary border border-vb-border">
              0,5 → 3 u / pari
            </span>
          </div>
        </div>
      </div>

      {/* Logo identity section */}
      <h2 className="font-heading font-bold text-2xl text-vb-text mb-2">
        L&apos;identité ValueBot
      </h2>
      <p className="text-[15px] text-vb-text-secondary mb-6 leading-[1.55] max-w-[620px]">
        Un système visuel minimaliste construit autour du check-mark (✓), symbole
        de validation par la donnée. Deux couleurs directrices : vert (profit) et
        cyan (intelligence).
      </p>

      <div className="grid grid-cols-2 mobile:grid-cols-4 gap-[14px] mb-11">
        {/* 1. Dark lockup */}
        <div className="rounded-[18px] border border-vb-border overflow-hidden">
          <div className="bg-vb-bg flex items-center justify-center gap-3 py-10 px-4">
            <svg
              width={40}
              height={34}
              viewBox="0 0 28 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient
                  id="logoDark"
                  x1="3"
                  y1="6"
                  x2="25"
                  y2="3"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#16C784" />
                  <stop offset="1" stopColor="#22D3EE" />
                </linearGradient>
              </defs>
              <path
                d="M3 6 L11 19 L25 3"
                stroke="url(#logoDark)"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
              <circle cx="25" cy="3" r="3" fill="#22D3EE" />
            </svg>
            <span className="font-heading font-bold text-[26px] text-vb-text">
              ValueBot
            </span>
          </div>
          <div className="bg-vb-bg-card-solid px-4 py-3 border-t border-vb-border">
            <p className="text-[11px] text-vb-text-muted">
              Version sombre · principale
            </p>
          </div>
        </div>

        {/* 2. Light lockup */}
        <div className="rounded-[18px] border border-vb-border overflow-hidden">
          <div
            className="flex items-center justify-center gap-3 py-10 px-4"
            style={{ background: "#F4F6F8" }}
          >
            <svg
              width={40}
              height={34}
              viewBox="0 0 28 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient
                  id="logoLight"
                  x1="3"
                  y1="6"
                  x2="25"
                  y2="3"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#0FA76C" />
                  <stop offset="1" stopColor="#0FA6BE" />
                </linearGradient>
              </defs>
              <path
                d="M3 6 L11 19 L25 3"
                stroke="url(#logoLight)"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
              <circle cx="25" cy="3" r="3" fill="#0FA6BE" />
            </svg>
            <span
              className="font-heading font-bold text-[26px]"
              style={{ color: "#1A1F26" }}
            >
              ValueBot
            </span>
          </div>
          <div className="bg-vb-bg-card-solid px-4 py-3 border-t border-vb-border">
            <p className="text-[11px] text-vb-text-muted">Version claire</p>
          </div>
        </div>

        {/* 3. Icon mark */}
        <div className="rounded-[18px] border border-vb-border overflow-hidden">
          <div className="bg-vb-bg-card flex items-center justify-center py-10 px-4">
            <div
              className="flex items-center justify-center rounded-[14px]"
              style={{
                width: 60,
                height: 60,
                background:
                  "linear-gradient(135deg, rgba(22,199,132,0.15), rgba(34,211,238,0.15))",
                border: "1px solid rgba(34,211,238,0.2)",
              }}
            >
              <svg
                width={32}
                height={27}
                viewBox="0 0 28 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <linearGradient
                    id="logoIcon"
                    x1="3"
                    y1="6"
                    x2="25"
                    y2="3"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#16C784" />
                    <stop offset="1" stopColor="#22D3EE" />
                  </linearGradient>
                </defs>
                <path
                  d="M3 6 L11 19 L25 3"
                  stroke="url(#logoIcon)"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
                <circle cx="25" cy="3" r="3" fill="#22D3EE" />
              </svg>
            </div>
          </div>
          <div className="bg-vb-bg-card-solid px-4 py-3 border-t border-vb-border">
            <p className="text-[11px] text-vb-text-muted">
              Pastille / favicon
            </p>
          </div>
        </div>

        {/* 4. Stacked alt */}
        <div className="rounded-[18px] border border-vb-border overflow-hidden">
          <div className="bg-vb-bg-card flex items-center justify-center py-10 px-4">
            <div className="text-center">
              <span className="font-heading font-light text-[22px] text-vb-text block leading-none">
                value
              </span>
              <span className="font-heading font-bold text-[30px] text-vb-text block leading-none">
                Bot
                <span className="text-vb-green">.</span>
              </span>
            </div>
          </div>
          <div className="bg-vb-bg-card-solid px-4 py-3 border-t border-vb-border">
            <p className="text-[11px] text-vb-text-muted">
              Lockup vertical · alt
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
