"use client";

interface ToggleSwitchProps {
  active: boolean;
  onToggle: () => void;
}

export default function ToggleSwitch({ active, onToggle }: ToggleSwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={active}
      onClick={onToggle}
      className={`w-[46px] h-[26px] rounded-full shrink-0 cursor-pointer p-[3px] flex items-center transition-colors duration-150 ${
        active ? "bg-vb-green justify-end" : "bg-white/[0.14] justify-start"
      }`}
    >
      <span className="w-5 h-5 rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.3)]" />
    </button>
  );
}
