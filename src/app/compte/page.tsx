"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { invoices } from "@/lib/mock-data";
import ToggleSwitch from "@/components/ui/ToggleSwitch";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/lib/auth-context";
import AdminTipsPanel from "./AdminTipsPanel";

const tabDefs = [
  { key: "profil", label: "Profil", icon: "👤" },
  { key: "abonnement", label: "Abonnement", icon: "⚡" },
  { key: "facturation", label: "Facturation", icon: "💳" },
  { key: "notifications", label: "Notifications", icon: "🔔" },
  { key: "securite", label: "Sécurité", icon: "🔒" },
];

function getInitials(firstName: string | null, lastName: string | null): string {
  const f = firstName?.charAt(0)?.toUpperCase() || "";
  const l = lastName?.charAt(0)?.toUpperCase() || "";
  return f + l || "?";
}

function getPlanLabel(plan: string): string {
  const labels: Record<string, string> = {
    decouverte: "DÉCOUVERTE",
    pro: "PRO",
    expert: "EXPERT",
  };
  return labels[plan] || plan.toUpperCase();
}

function CompteContent() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState("profil");
  const [notifs, setNotifs] = useState({ conseils: true, value: true, bilan: true, news: false });
  const [twofa, setTwofa] = useState(false);

  const toggleNotif = (key: keyof typeof notifs) => {
    setNotifs((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  if (!user) return null;

  const displayName = [user.first_name, user.last_name].filter(Boolean).join(" ") || user.email;

  return (
    <div className="max-w-content mx-auto px-5 pt-11 pb-14">
      {/* User header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-[60px] h-[60px] rounded-full bg-gradient-to-br from-vb-green to-vb-cyan flex items-center justify-center font-heading font-bold text-xl text-[#08130D] shrink-0">
          {getInitials(user.first_name, user.last_name)}
        </div>
        <div>
          <div className="flex items-center gap-[10px] mb-1">
            <span className="font-heading font-bold text-xl">{displayName}</span>
            <span className="text-[11px] font-bold px-[9px] py-[3px] rounded-[7px] bg-vb-green-bg text-vb-green tracking-wider">
              {getPlanLabel(user.plan)}
            </span>
          </div>
          <span className="text-[13px] text-vb-text-secondary">{user.email}</span>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 mobile:grid-cols-[230px_1fr] gap-5 items-start">
        {/* Sidebar */}
        <div className="flex flex-col gap-1">
          {[...tabDefs, ...(user.role === "admin" ? [{ key: "admin", label: "Admin conseils", icon: "🛠️" }] : [])].map((t) => {
            const active = tab === t.key;
            return (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`flex items-center gap-[10px] px-[14px] py-[11px] rounded-[11px] text-sm font-semibold text-left transition-colors ${
                  active
                    ? "text-vb-text bg-white/[0.06] border border-[rgba(255,255,255,0.08)]"
                    : "text-vb-text-secondary border border-transparent"
                }`}
              >
                <span>{t.icon}</span>
                {t.label}
              </button>
            );
          })}
          <button
            onClick={handleLogout}
            className="flex items-center gap-[10px] px-[14px] py-[11px] rounded-[11px] text-sm font-semibold text-vb-text-secondary mt-2 text-left hover:text-vb-text transition-colors"
          >
            ↩ Se déconnecter
          </button>
        </div>

        {/* Content */}
        <div>
          {/* Profil */}
          {tab === "profil" && (
            <div className="bg-vb-bg-card-subtle border border-vb-border rounded-[18px] p-6">
              <h3 className="font-heading font-semibold text-[17px] mb-[18px]">Informations personnelles</h3>
              <div className="grid grid-cols-1 mobile:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-[12.5px] text-vb-text-secondary font-semibold mb-[7px]">Prénom</label>
                  <input defaultValue={user.first_name || ""} className="w-full px-[15px] py-[13px] rounded-[11px] bg-white/[0.04] border border-vb-border-input text-vb-text text-sm outline-none focus:border-vb-cyan transition-colors" />
                </div>
                <div>
                  <label className="block text-[12.5px] text-vb-text-secondary font-semibold mb-[7px]">Nom</label>
                  <input defaultValue={user.last_name || ""} className="w-full px-[15px] py-[13px] rounded-[11px] bg-white/[0.04] border border-vb-border-input text-vb-text text-sm outline-none focus:border-vb-cyan transition-colors" />
                </div>
              </div>
              <div className="mb-5">
                <label className="block text-[12.5px] text-vb-text-secondary font-semibold mb-[7px]">Email</label>
                <input defaultValue={user.email} className="w-full px-[15px] py-[13px] rounded-[11px] bg-white/[0.04] border border-vb-border-input text-vb-text text-sm outline-none focus:border-vb-cyan transition-colors" />
              </div>
              <div className="mb-5">
                <label className="block text-[12.5px] text-vb-text-secondary font-semibold mb-[7px]">Sports suivis</label>
                <div className="flex gap-2">
                  <span className="px-3 py-[7px] rounded-full bg-vb-green-bg border border-vb-green/30 text-vb-green text-[12.5px] font-semibold">⚽ Football ✓</span>
                  <span className="px-3 py-[7px] rounded-full bg-vb-cyan-bg border border-vb-cyan/30 text-vb-cyan text-[12.5px] font-semibold">🎾 Tennis ✓</span>
                </div>
              </div>
              <button className="px-5 py-[11px] rounded-xl bg-vb-green text-[#08130D] font-bold text-sm cursor-pointer">
                Enregistrer
              </button>
            </div>
          )}

          {/* Abonnement */}
          {tab === "abonnement" && (
            <div className="flex flex-col gap-5">
              <div className="bg-gradient-to-r from-[rgba(22,199,132,0.08)] to-[rgba(22,27,34,0.6)] border border-[rgba(22,199,132,0.3)] rounded-[18px] p-6">
                <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
                  <div>
                    <span className="font-heading font-bold text-xl">{getPlanLabel(user.plan)}</span>
                    <span className="text-[13px] text-vb-text-secondary ml-2">
                      {user.plan === "decouverte" ? "· Gratuit" : "· 15 € / mois · annuel"}
                    </span>
                  </div>
                  <span className="text-[11px] font-bold px-[9px] py-[3px] rounded-[7px] bg-vb-green-bg text-vb-green">ACTIF</span>
                </div>
                <p className="text-[13px] text-vb-text-secondary mb-4">
                  {user.plan === "decouverte"
                    ? "Accès aux analyses avec un délai de 24h."
                    : "Prochain renouvellement le 14 juillet 2026. Annulable à tout moment."}
                </p>
                <div className="flex gap-3">
                  <button className="px-4 py-[10px] rounded-xl bg-white/[0.06] border border-vb-border-strong text-vb-text font-semibold text-[13px]">
                    Changer de forfait
                  </button>
                  {user.plan !== "decouverte" && (
                    <button className="px-4 py-[10px] rounded-xl bg-white/[0.03] border border-vb-border text-vb-text-secondary font-semibold text-[13px]">
                      Annuler
                    </button>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 mobile:grid-cols-3 gap-4">
                {[
                  { v: "612", l: "Conseils consultés" },
                  { v: "48", l: "Alertes reçues" },
                  { v: "180 €", l: "Prochaine facture" },
                ].map((s) => (
                  <div key={s.l} className="bg-vb-bg-card-solid border border-vb-border rounded-[14px] p-[18px]">
                    <div className="font-heading font-bold text-2xl mb-1">{s.v}</div>
                    <div className="text-xs text-vb-text-secondary">{s.l}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Facturation */}
          {tab === "facturation" && (
            <div className="flex flex-col gap-5">
              <div className="bg-vb-bg-card-subtle border border-vb-border rounded-[18px] p-6">
                <h3 className="font-heading font-semibold text-[17px] mb-[18px]">Moyen de paiement</h3>
                <div className="flex items-center justify-between p-[14px] rounded-xl bg-white/[0.03] border border-vb-border">
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-1 rounded bg-white/10 text-[11px] font-bold text-vb-text">VISA</span>
                    <span className="text-sm text-vb-text-body">····  ····  ····  4242</span>
                    <span className="text-[12px] text-vb-text-muted">exp. 09/28</span>
                  </div>
                  <span className="text-[12.5px] text-vb-cyan cursor-pointer font-semibold">Modifier</span>
                </div>
              </div>
              <div className="bg-vb-bg-card-subtle border border-vb-border rounded-[18px] p-6">
                <h3 className="font-heading font-semibold text-[17px] mb-[18px]">Historique des factures</h3>
                <div className="overflow-x-auto vb-scroll">
                  <table className="w-full text-[13px] min-w-[400px]">
                    <thead>
                      <tr className="text-vb-text-muted text-[11px] text-left tracking-wider">
                        <th className="pb-3 font-semibold">DATE</th>
                        <th className="pb-3 font-semibold">LIBELLÉ</th>
                        <th className="pb-3 font-semibold text-right">MONTANT</th>
                        <th className="pb-3 font-semibold text-right">STATUT</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoices.map((inv, i) => (
                        <tr key={i} className="border-t border-vb-border-subtle">
                          <td className="py-3 text-vb-text-secondary whitespace-nowrap">{inv.date}</td>
                          <td className="py-3 text-vb-text-body">{inv.label}</td>
                          <td className="py-3 text-right font-heading">{inv.amount}</td>
                          <td className="py-3 text-right">
                            <span className="text-[11px] font-semibold px-[9px] py-1 rounded-[7px] bg-vb-green-bg text-vb-green">
                              {inv.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Notifications */}
          {tab === "notifications" && (
            <div className="bg-vb-bg-card-subtle border border-vb-border rounded-[18px] p-6">
              <h3 className="font-heading font-semibold text-[17px] mb-[18px]">Préférences de notifications</h3>
              <div className="flex flex-col gap-[18px]">
                {([
                  { key: "conseils" as const, label: "Conseils du jour", desc: "Recevez chaque pari dès sa publication" },
                  { key: "value" as const, label: "Alertes value en direct", desc: "Notification quand une forte value est détectée" },
                  { key: "bilan" as const, label: "Bilan hebdomadaire", desc: "Résumé de la performance chaque lundi" },
                  { key: "news" as const, label: "Nouveautés produit", desc: "Améliorations du modèle et du site" },
                ]).map((row) => (
                  <div key={row.key} className="flex items-center justify-between gap-4">
                    <div>
                      <div className="text-sm font-semibold mb-1">{row.label}</div>
                      <div className="text-[12.5px] text-vb-text-secondary">{row.desc}</div>
                    </div>
                    <ToggleSwitch active={notifs[row.key]} onToggle={() => toggleNotif(row.key)} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Admin conseils */}
          {tab === "admin" && user.role === "admin" && <AdminTipsPanel />}

          {/* Sécurité */}
          {tab === "securite" && (
            <div className="flex flex-col gap-5">
              <div className="bg-vb-bg-card-subtle border border-vb-border rounded-[18px] p-6">
                <h3 className="font-heading font-semibold text-[17px] mb-[18px]">Changer le mot de passe</h3>
                <div className="flex flex-col gap-4 max-w-[360px]">
                  <div>
                    <label className="block text-[12.5px] text-vb-text-secondary font-semibold mb-[7px]">Mot de passe actuel</label>
                    <input type="password" placeholder="••••••••" className="w-full px-[15px] py-[13px] rounded-[11px] bg-white/[0.04] border border-vb-border-input text-vb-text text-sm outline-none focus:border-vb-cyan transition-colors" />
                  </div>
                  <div>
                    <label className="block text-[12.5px] text-vb-text-secondary font-semibold mb-[7px]">Nouveau mot de passe</label>
                    <input type="password" placeholder="8 caractères minimum" className="w-full px-[15px] py-[13px] rounded-[11px] bg-white/[0.04] border border-vb-border-input text-vb-text text-sm outline-none focus:border-vb-cyan transition-colors" />
                  </div>
                  <button className="px-5 py-[11px] rounded-xl bg-vb-green text-[#08130D] font-bold text-sm cursor-pointer w-fit">
                    Mettre à jour
                  </button>
                </div>
              </div>

              <div className="bg-vb-bg-card-subtle border border-vb-border rounded-[18px] p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-heading font-semibold text-[17px] mb-1">Authentification à deux facteurs</h3>
                    <p className="text-[12.5px] text-vb-text-secondary">Ajoutez une couche de sécurité supplémentaire à votre compte.</p>
                  </div>
                  <ToggleSwitch active={twofa} onToggle={() => setTwofa(!twofa)} />
                </div>
              </div>

              <div className="border border-[rgba(234,57,67,0.3)] rounded-[18px] p-6">
                <h3 className="font-heading font-semibold text-[17px] text-vb-red mb-2">Supprimer le compte</h3>
                <p className="text-[12.5px] text-vb-text-secondary mb-4">
                  Cette action est irréversible. Toutes vos données seront définitivement supprimées.
                </p>
                <button className="px-5 py-[10px] rounded-xl bg-[rgba(234,57,67,0.12)] border border-[rgba(234,57,67,0.4)] text-vb-red font-semibold text-[13px] cursor-pointer">
                  Supprimer mon compte
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ComptePage() {
  return (
    <ProtectedRoute>
      <CompteContent />
    </ProtectedRoute>
  );
}
