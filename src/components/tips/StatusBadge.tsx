import type { TipStatus } from "@/types";
import { getStatusMeta } from "@/lib/utils";

interface StatusBadgeProps {
  status: TipStatus;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const meta = getStatusMeta(status);

  return (
    <span
      className="text-[11px] font-semibold rounded-[7px] px-[9px] py-[4px] leading-none whitespace-nowrap"
      style={{ color: meta.color, backgroundColor: meta.bg }}
    >
      {meta.label}
    </span>
  );
}
