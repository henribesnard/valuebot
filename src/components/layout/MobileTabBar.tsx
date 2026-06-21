"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navItems } from "@/lib/mock-data";

export default function MobileTabBar() {
  const pathname = usePathname();

  return (
    <div
      className="block mobile:hidden fixed bottom-0 left-0 right-0 z-[60] backdrop-blur-[16px] border-t border-vb-border"
      style={{ background: "rgba(14,17,22,0.92)" }}
    >
      <div className="px-2 py-2 pb-[calc(8px+env(safe-area-inset-bottom))] flex justify-around">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.key}
              href={item.href}
              className={`flex-1 flex flex-col items-center gap-[3px] py-[6px] px-1 rounded-[10px] cursor-pointer no-underline transition-colors ${
                isActive ? "text-[#22D3EE]" : "text-[#6E7B8A]"
              }`}
            >
              <span className="text-lg leading-none">{item.icon}</span>
              <span className="text-[10.5px] font-semibold">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
