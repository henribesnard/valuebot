"use client";

import Link from "next/link";
import { plans } from "@/lib/mock-data";

export default function SouscriptionPage() {
  const plan = plans.find((p) => p.key === "pro")!;
  const price = plan.priceA;
  const totalYear = price * 12;
  const saving = (plan.priceM - plan.priceA) * 12;

  return (
    <div className="max-w-[960px] mx-auto px-5 pt-11 pb-14">
      <Link href="/tarifs" className="text-[13.5px] text-vb-cyan mb-5 inline-block">
        ← Retour aux forfaits
      </Link>

      <h1 className="font-heading font-bold text-[clamp(28px,3.6vw,38px)] mb-[30px]">
        Finaliser votre abonnement
      </h1>

      <div className="grid grid-cols-1 mobile:grid-cols-[1.3fr_0.9fr] gap-5 items-start">
        {/* Left: form */}
        <div className="flex flex-col gap-5">
          {/* Coordinates */}
          <div className="bg-vb-bg-card-subtle border border-vb-border rounded-[18px] p-6">
            <h3 className="font-heading font-semibold text-[17px] mb-[18px]">Vos coordonnées</h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-[12.5px] text-vb-text-secondary font-semibold mb-[7px]">Prénom</label>
                <input
                  type="text"
                  placeholder="Alex"
                  className="w-full px-[15px] py-[13px] rounded-[11px] bg-white/[0.04] border border-vb-border-input text-vb-text text-sm outline-none focus:border-vb-cyan transition-colors"
                />
              </div>
              <div>
                <label className="block text-[12.5px] text-vb-text-secondary font-semibold mb-[7px]">Nom</label>
                <input
                  type="text"
                  placeholder="Martin"
                  className="w-full px-[15px] py-[13px] rounded-[11px] bg-white/[0.04] border border-vb-border-input text-vb-text text-sm outline-none focus:border-vb-cyan transition-colors"
                />
              </div>
            </div>
            <div>
              <label className="block text-[12.5px] text-vb-text-secondary font-semibold mb-[7px]">Email</label>
              <input
                type="email"
                placeholder="alex@email.com"
                className="w-full px-[15px] py-[13px] rounded-[11px] bg-white/[0.04] border border-vb-border-input text-vb-text text-sm outline-none focus:border-vb-cyan transition-colors"
              />
            </div>
          </div>

          {/* Payment */}
          <div className="bg-vb-bg-card-subtle border border-vb-border rounded-[18px] p-6">
            <div className="flex items-center justify-between mb-[18px]">
              <h3 className="font-heading font-semibold text-[17px]">Paiement</h3>
              <span className="text-[11px] text-vb-text-muted">🔒 Chiffré · Stripe</span>
            </div>
            <div className="mb-4">
              <label className="block text-[12.5px] text-vb-text-secondary font-semibold mb-[7px]">Numéro de carte</label>
              <input
                type="text"
                placeholder="4242 4242 4242 4242"
                className="w-full px-[15px] py-[13px] rounded-[11px] bg-white/[0.04] border border-vb-border-input text-vb-text text-sm outline-none focus:border-vb-cyan transition-colors"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[12.5px] text-vb-text-secondary font-semibold mb-[7px]">Expiration</label>
                <input
                  type="text"
                  placeholder="MM / AA"
                  className="w-full px-[15px] py-[13px] rounded-[11px] bg-white/[0.04] border border-vb-border-input text-vb-text text-sm outline-none focus:border-vb-cyan transition-colors"
                />
              </div>
              <div>
                <label className="block text-[12.5px] text-vb-text-secondary font-semibold mb-[7px]">CVC</label>
                <input
                  type="text"
                  placeholder="123"
                  className="w-full px-[15px] py-[13px] rounded-[11px] bg-white/[0.04] border border-vb-border-input text-vb-text text-sm outline-none focus:border-vb-cyan transition-colors"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right: recap */}
        <div className="sticky top-[90px]">
          <div className="bg-gradient-to-b from-[rgba(22,199,132,0.06)] to-[rgba(22,27,34,0.6)] border border-[rgba(22,199,132,0.25)] rounded-[18px] p-6">
            <h3 className="font-heading font-semibold text-[17px] mb-[18px]">Récapitulatif</h3>

            <div className="flex justify-between items-center mb-3">
              <span className="text-sm text-vb-text-body">{plan.name}</span>
              <span className="font-heading font-semibold text-sm">{price} € / mois</span>
            </div>

            <div className="flex justify-between items-center mb-4">
              <span className="text-[12.5px] text-vb-text-muted">Facturation annuelle</span>
            </div>

            <div className="bg-vb-green-bg rounded-xl px-[14px] py-[10px] text-[12.5px] text-vb-green font-semibold mb-5">
              🎁 Vous économisez {saving.toFixed(2).replace(".", ",")} € / an
            </div>

            <div className="border-t border-vb-border pt-4 mb-5">
              <div className="flex justify-between items-center">
                <span className="text-[13px] text-vb-text-secondary">Total aujourd&apos;hui (12 mois)</span>
                <span className="font-heading font-bold text-2xl">{totalYear.toFixed(2).replace(".", ",")} €</span>
              </div>
            </div>

            <button className="w-full py-[14px] rounded-xl bg-vb-green text-[#08130D] font-bold text-sm cursor-pointer hover:brightness-110 transition-all mb-4">
              Activer mon abonnement
            </button>

            <p className="text-[11px] text-vb-text-muted leading-[1.6] text-center">
              Paiement sécurisé par Stripe. Annulable à tout moment depuis votre espace compte. Aucun dépôt de pari n&apos;est effectué.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
