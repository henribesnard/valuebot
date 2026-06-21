"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "./Logo";
import { navItems, equity } from "@/lib/mock-data";
import { computeChartPaths } from "@/lib/chart-utils";
import { useAuth } from "@/lib/auth-context";

const sparkData = equity.slice(-26);
const spark = computeChartPaths(sparkData, 78, 26, 1, 3, 3);

function getInitials(firstName: string | null, lastName: string | null): string {
  const f = firstName?.charAt(0)?.toUpperCase() || "";
  const l = lastName?.charAt(0)?.toUpperCase() || "";
  return f + l || "?";
}

export default function Header() {
  const pathname = usePathname();
  const { user } = useAuth();

  return (
    <header
      className="sticky top-0 z-50 backdrop-blur-[14px] border-b"
      style={{
        background: "rgba(14,17,22,0.78)",
        borderColor: "rgba(255,255,255,0.07)",
      }}
    >
      <div className="max-w-content mx-auto px-5 py-[14px] flex items-center gap-5">
        {/* Logo + brand */}
        <Link href="/" className="flex items-center gap-[10px] no-underline shrink-0">
          <Logo size={30} />
          <span className="font-heading font-bold text-[21px] text-vb-text leading-none">
            Value<span className="text-vb-green">Bot</span>
          </span>
        </Link>

        {/* Desktop nav links */}
        <nav className="hidden mobile:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.key}
                href={item.href}
                className={`px-[14px] py-2 rounded-[10px] text-sm font-semibold no-underline transition-colors ${
                  isActive
                    ? "text-vb-text bg-white/[0.06]"
                    : "text-vb-text-secondary hover:text-vb-text hover:bg-white/[0.03]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right side */}
        <div className="ml-auto flex items-center gap-4">
          {/* Sparkline mini chart */}
          <div
            className="hidden wide:flex items-center gap-[10px] border rounded-xl p-[6px_12px]"
            style={{
              borderColor: "rgba(255,255,255,0.08)",
              background: "rgba(255,255,255,0.02)",
            }}
          >
            <svg width="78" height="26" viewBox="0 0 78 26" fill="none">
              <defs>
                <linearGradient id="header-spark-grad" x1="0" y1="0" x2="78" y2="0" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#16C784" />
                  <stop offset="1" stopColor="#22D3EE" />
                </linearGradient>
                <linearGradient id="header-spark-area" x1="0" y1="0" x2="0" y2="26" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#16C784" stopOpacity="0.25" />
                  <stop offset="1" stopColor="#16C784" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d={spark.area} fill="url(#header-spark-area)" />
              <path d={spark.line} stroke="url(#header-spark-grad)" strokeWidth="1.5" fill="none" />
              <circle cx={spark.lastX} cy={spark.lastY} r="2.5" fill="#22D3EE" />
            </svg>
            <div className="flex flex-col items-end">
              <span className="text-[13px] font-bold text-vb-text leading-tight tabular-nums">148,6 u</span>
              <span className="text-[11px] font-semibold text-vb-green leading-tight tabular-nums">+48,6%</span>
            </div>
          </div>

          {/* 100% IA badge */}
          <div
            className="hidden mobile:flex items-center gap-[6px] rounded-full px-[14px] py-[6px] text-[13px] font-semibold"
            style={{
              background: "linear-gradient(135deg, rgba(34,211,238,0.14), rgba(124,92,252,0.14))",
              border: "1px solid rgba(34,211,238,0.25)",
            }}
          >
            <span className="leading-none">🤖</span>
            <span className="text-vb-cyan-light">100% IA</span>
          </div>

          {/* Auth button */}
          {user ? (
            <Link
              href="/compte"
              className="flex items-center gap-[10px] no-underline group"
            >
              <div className="w-[34px] h-[34px] rounded-full bg-gradient-to-br from-vb-green to-vb-cyan flex items-center justify-center font-heading font-bold text-[13px] text-[#08130D] shrink-0">
                {getInitials(user.first_name, user.last_name)}
              </div>
              <span className="hidden mobile:inline text-sm font-semibold text-vb-text-secondary group-hover:text-vb-text transition-colors">
                {user.first_name || user.email}
              </span>
            </Link>
          ) : (
            <Link
              href="/connexion"
              className="bg-vb-green text-[#0E1116] rounded-[10px] font-bold text-sm px-4 py-[9px] no-underline hover:brightness-110 transition-all whitespace-nowrap"
            >
              Se connecter
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
