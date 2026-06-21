"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { useAuth } from "@/lib/auth-context";
import { ApiError } from "@/lib/api";

export default function ConnexionPage() {
  const { login, user } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [totpCode, setTotpCode] = useState("");
  const [needs2FA, setNeeds2FA] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if already logged in
  if (user) {
    router.replace("/");
    return null;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await login(email, password, needs2FA ? totpCode : undefined);
      router.push("/");
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 403 && err.message.toLowerCase().includes("2fa")) {
          setNeeds2FA(true);
          setIsSubmitting(false);
          return;
        }
        setError(err.message);
      } else {
        setError("Une erreur inattendue est survenue.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-content mx-auto px-5 py-14">
      <div className="max-w-[430px] mx-auto">
        <div className="text-center mb-7">
          <h1 className="font-heading font-bold text-[30px] mb-2">Bon retour</h1>
          <p className="text-sm text-vb-text-secondary leading-relaxed">
            Accédez aux analyses IA et à votre suivi de bankroll.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-vb-bg-card border border-vb-border rounded-[20px] p-[30px] flex flex-col gap-5"
        >
          {/* Google button */}
          <button
            type="button"
            className="flex items-center justify-center gap-[10px] p-3 rounded-[11px] border border-vb-border-strong bg-white/[0.03] font-semibold text-sm cursor-pointer hover:bg-white/[0.06] transition-colors"
          >
            <span className="w-[18px] h-[18px] rounded bg-white text-vb-bg flex items-center justify-center text-xs font-bold">G</span>
            Continuer avec Google
          </button>

          {/* Separator */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-vb-border" />
            <span className="text-xs text-vb-text-muted">ou</span>
            <div className="flex-1 h-px bg-vb-border" />
          </div>

          {/* Error message */}
          {error && (
            <div className="text-[13px] text-vb-red bg-[rgba(234,57,67,0.08)] border border-[rgba(234,57,67,0.25)] rounded-xl px-4 py-3">
              {error}
            </div>
          )}

          {/* Email */}
          <div>
            <label className="block text-[12.5px] text-vb-text-secondary font-semibold mb-[7px]">Email</label>
            <input
              type="email"
              placeholder="votre@email.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-[15px] py-[13px] rounded-[11px] bg-white/[0.04] border border-vb-border-input text-vb-text text-sm outline-none focus:border-vb-cyan transition-colors"
            />
          </div>

          {/* Password */}
          <div>
            <div className="flex justify-between items-center mb-[7px]">
              <label className="text-[12.5px] text-vb-text-secondary font-semibold">Mot de passe</label>
              <span className="text-[12px] text-vb-cyan cursor-pointer">Oublié ?</span>
            </div>
            <input
              type="password"
              placeholder="••••••••"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-[15px] py-[13px] rounded-[11px] bg-white/[0.04] border border-vb-border-input text-vb-text text-sm outline-none focus:border-vb-cyan transition-colors"
            />
          </div>

          {/* 2FA code (shown only when needed) */}
          {needs2FA && (
            <div>
              <label className="block text-[12.5px] text-vb-text-secondary font-semibold mb-[7px]">Code 2FA</label>
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                placeholder="123456"
                required
                value={totpCode}
                onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, ""))}
                className="w-full px-[15px] py-[13px] rounded-[11px] bg-white/[0.04] border border-vb-border-input text-vb-text text-sm outline-none focus:border-vb-cyan transition-colors tracking-[0.3em] text-center font-heading text-lg"
              />
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-[14px] rounded-xl bg-vb-green text-[#08130D] font-bold text-sm cursor-pointer hover:brightness-110 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Connexion..." : "Se connecter"}
          </button>
        </form>

        <p className="text-center text-[13px] text-vb-text-secondary mt-5">
          Pas encore de compte ?{" "}
          <Link href="/inscription" className="text-vb-cyan font-semibold">
            Créer un compte
          </Link>
        </p>

        <p className="text-center text-[11.5px] text-vb-text-muted mt-4">
          ValueBot est un outil d&apos;analyse par IA. Il ne constitue en aucun cas un conseil financier ou une incitation au jeu.
        </p>
      </div>
    </div>
  );
}
