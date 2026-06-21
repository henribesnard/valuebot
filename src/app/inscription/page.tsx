"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { useAuth } from "@/lib/auth-context";
import { ApiError } from "@/lib/api";

export default function InscriptionPage() {
  const { register, user } = useAuth();
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [accept18, setAccept18] = useState(false);
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

    if (!accept18) {
      setError("Vous devez certifier avoir 18 ans ou plus.");
      return;
    }

    setIsSubmitting(true);

    try {
      await register(email, password, firstName, accept18);
      router.push("/");
    } catch (err) {
      if (err instanceof ApiError) {
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
          <h1 className="font-heading font-bold text-[30px] mb-2">Créer un compte</h1>
          <p className="text-sm text-vb-text-secondary leading-relaxed">
            Commencez gratuitement. Sans carte bancaire.
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
            S&apos;inscrire avec Google
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

          {/* Prénom */}
          <div>
            <label className="block text-[12.5px] text-vb-text-secondary font-semibold mb-[7px]">Prénom</label>
            <input
              type="text"
              placeholder="Votre prénom"
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full px-[15px] py-[13px] rounded-[11px] bg-white/[0.04] border border-vb-border-input text-vb-text text-sm outline-none focus:border-vb-cyan transition-colors"
            />
          </div>

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
            <label className="block text-[12.5px] text-vb-text-secondary font-semibold mb-[7px]">Mot de passe</label>
            <input
              type="password"
              placeholder="8 caractères minimum"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-[15px] py-[13px] rounded-[11px] bg-white/[0.04] border border-vb-border-input text-vb-text text-sm outline-none focus:border-vb-cyan transition-colors"
            />
          </div>

          {/* 18+ Checkbox */}
          <label className="flex items-start gap-3 cursor-pointer">
            <div
              onClick={() => setAccept18(!accept18)}
              className={`w-[22px] h-[22px] rounded-[6px] border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                accept18
                  ? "bg-vb-green border-vb-green"
                  : "bg-white/[0.04] border-vb-border-input"
              }`}
            >
              {accept18 && (
                <svg width="13" height="10" viewBox="0 0 13 10" fill="none">
                  <path d="M1 5L5 9L12 1" stroke="#08130D" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
            <span className="text-[12.5px] text-vb-text-secondary leading-[1.5]">
              Je certifie avoir <strong className="text-vb-text">18 ans ou plus</strong> et j&apos;accepte les{" "}
              <span className="text-vb-cyan">conditions d&apos;utilisation</span> et la{" "}
              <span className="text-vb-cyan">politique de confidentialité</span>.
            </span>
          </label>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-[14px] rounded-xl bg-vb-green text-[#08130D] font-bold text-sm cursor-pointer hover:brightness-110 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Création en cours..." : "Créer mon compte"}
          </button>
        </form>

        <p className="text-center text-[13px] text-vb-text-secondary mt-5">
          Déjà inscrit ?{" "}
          <Link href="/connexion" className="text-vb-cyan font-semibold">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}
