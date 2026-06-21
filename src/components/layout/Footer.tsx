import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="border-t border-vb-border mt-14 bg-black/20">
      <div className="max-w-content mx-auto px-5 py-8">
        {/* Top row: 18+ badge + legal text */}
        <div className="flex items-start gap-[18px] flex-wrap">
          {/* 18+ badge */}
          <div
            className="shrink-0 w-[50px] h-[50px] rounded-full border-[2.5px] border-vb-red flex items-center justify-center font-heading font-bold text-[15px] text-vb-red"
          >
            18+
          </div>

          {/* Legal text */}
          <div className="flex-1 min-w-[280px] text-[12.5px] leading-[1.7] text-vb-text-secondary">
            <p className="m-0">
              <strong>
                Les paris sportifs comportent des risques : endettement, isolement, dépendance.
              </strong>
            </p>
            <p className="m-0 mt-1">
              Interdit aux mineurs (18+). Ce site ne prend aucun pari et ne gère aucun compte joueur.
              Les analyses publiées sont purement informatives et ne constituent pas un conseil financier.
              Jouez de manière responsable.
            </p>
            <p className="m-0 mt-1">
              09-74-75-13-13 (Joueurs Info Service, appel non surtaxé)
            </p>
          </div>
        </div>

        {/* Bottom row */}
        <div className="border-t border-vb-border-subtle mt-6 pt-[18px] flex justify-between items-center flex-wrap gap-3">
          {/* Left: logo + brand + copyright */}
          <div className="flex items-center gap-[10px]">
            <Logo size={22} />
            <span className="font-heading font-bold text-[14px] text-vb-text leading-none">
              Value<span className="text-vb-green">Bot</span>
            </span>
            <span className="text-[11px] text-vb-text-muted leading-none">
              © 2026 · Analyses 100% IA
            </span>
          </div>

          {/* Right: ANJ notice */}
          <span className="text-[11px] text-vb-text-muted leading-snug">
            Cotes relevées chez des opérateurs agréés ANJ · horodatées à la source
          </span>
        </div>
      </div>
    </footer>
  );
}
