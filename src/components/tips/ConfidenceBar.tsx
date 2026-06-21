interface ConfidenceBarProps {
  level: number;
}

export default function ConfidenceBar({ level }: ConfidenceBarProps) {
  return (
    <div className="flex gap-[3px]">
      {Array.from({ length: 5 }, (_, i) => (
        <div
          key={i}
          className={`w-[17px] h-[6px] rounded-[3px] ${
            i < level ? "bg-[#22D3EE]" : "bg-white/[0.12]"
          }`}
        />
      ))}
    </div>
  );
}
