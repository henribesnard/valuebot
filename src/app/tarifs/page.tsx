"use client";

import { useState } from "react";
import Link from "next/link";
import { plans } from "@/lib/mock-data";
import type { PricingPlan } from "@/types";

type Billing = "mensuel" | "annuel";

export default function TarifsPage() {
  const [billing, setBilling] = useState<Billing>("annuel");

  return (
    <main className="max-w-content mx-auto px-5 pt-12">
      {/* Header */}
      <div className="text-center max-w-[620px] mx-auto mb-[30px]">
        <h1 className="font-heading font-bold text-[32px] text-vb-text mb-2">
          Choisissez votre forfait
        </h1>
        <p className="text-[15px] text-vb-text-secondary leading-[1.55]">
          Un abonnement = un accès aux analyses IA. Pas un compte de paris.
          Annulable à tout moment.
        </p>
      </div>

      {/* Billing toggle */}
      <div className="flex justify-center mb-[34px]">
        <div className="flex gap-[6px] bg-white/[0.04] p-1 rounded-xl">
          <button
            onClick={() => setBilling("mensuel")}
            className={`px-[14px] py-2 rounded-[9px] text-[13px] font-semibold cursor-pointer whitespace-nowrap transition-colors ${
              billing === "mensuel"
                ? "bg-vb-text text-vb-bg"
                : "text-vb-text-secondary"
            }`}
          >
            Mensuel
          </button>
          <button
            onClick={() => setBilling("annuel")}
            className={`px-[14px] py-2 rounded-[9px] text-[13px] font-semibold cursor-pointer whitespace-nowrap transition-colors ${
              billing === "annuel"
                ? "bg-vb-text text-vb-bg"
                : "text-vb-text-secondary"
            }`}
          >
            Annuel{" "}
            <span className="text-vb-green">−25 %</span>
          </button>
        </div>
      </div>

      {/* Plan cards grid */}
      <div className="grid grid-cols-1 mobile:grid-cols-3 gap-[18px] items-start">
        {plans.map((plan: PricingPlan) => {
          const price = billing === "annuel" ? plan.priceA : plan.priceM;
          const isFree = price === 0;
          const isPopular = !!plan.popular;

          return (
            <div
              key={plan.key}
              className={`rounded-[20px] p-7 flex flex-col gap-[18px] relative ${
                isPopular
                  ? "border border-[rgba(22,199,132,0.45)]"
                  : "bg-vb-bg-card-solid border border-vb-border"
              }`}
              style={
                isPopular
                  ? {
                      background:
                        "linear-gradient(135deg, rgba(22,199,132,0.08), rgba(22,199,132,0.02))",
                      boxShadow: "0 18px 50px rgba(22,199,132,0.12)",
                    }
                  : undefined
              }
            >
              {/* Popular badge */}
              {isPopular && (
                <span className="absolute -top-[11px] left-1/2 -translate-x-1/2 bg-vb-green text-[#08130D] text-[11px] font-bold px-3 py-1 rounded-full tracking-wider whitespace-nowrap">
                  POPULAIRE
                </span>
              )}

              {/* Plan name & tagline */}
              <div>
                <h3 className="font-heading font-semibold text-xl text-vb-text">
                  {plan.name}
                </h3>
                <p className="text-[13px] text-vb-text-secondary mt-[3px]">
                  {plan.tagline}
                </p>
              </div>

              {/* Price */}
              <div>
                {isFree ? (
                  <>
                    <span className="font-heading font-bold text-[38px] tracking-tight text-vb-text">
                      Gratuit
                    </span>
                    <span className="text-[14px] text-vb-text-secondary ml-2">
                      pour toujours
                    </span>
                  </>
                ) : (
                  <>
                    <span className="font-heading font-bold text-[38px] tracking-tight text-vb-text">
                      {price} €
                    </span>
                    <span className="text-[14px] text-vb-text-secondary ml-1">
                      {billing === "annuel"
                        ? "/mois · facturé annuellement"
                        : "/mois"}
                    </span>
                  </>
                )}
              </div>

              {/* Features list */}
              <div className="flex flex-col gap-[11px]">
                {plan.features.map((feature: string, i: number) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="text-vb-green text-[14px] leading-[1.4]">
                      ✓
                    </span>
                    <span className="text-[13.5px] text-vb-text-body leading-[1.4]">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              {/* CTA button */}
              <Link
                href={isFree ? "/inscription" : "/souscription"}
                className={`block p-[13px] rounded-xl text-center text-[14.5px] cursor-pointer no-underline ${
                  isPopular
                    ? "bg-vb-green text-[#08130D] font-bold"
                    : "bg-white/[0.06] border border-vb-border-strong text-vb-text font-bold"
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          );
        })}
      </div>

      {/* Bottom disclaimer */}
      <p className="text-center text-[12.5px] text-vb-text-muted mt-7 mb-10">
        Paiement sécurisé · sans engagement · ValueBot ne reçoit aucun dépôt de
        paris et ne gère aucun compte joueur.
      </p>
    </main>
  );
}
