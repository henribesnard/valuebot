interface FormChipsProps {
  form: string[];
}

const chipStyles: Record<string, { bg: string; text: string }> = {
  V: { bg: "rgba(22,199,132,0.14)", text: "#16C784" },
  D: { bg: "rgba(234,57,67,0.14)", text: "#EA3943" },
  N: { bg: "rgba(255,255,255,0.07)", text: "#8B98A5" },
};

export default function FormChips({ form }: FormChipsProps) {
  return (
    <div className="flex gap-[3px]">
      {form.map((result, i) => {
        const style = chipStyles[result] ?? chipStyles.N;
        return (
          <div
            key={i}
            className="w-[26px] h-[26px] rounded-[7px] font-heading font-bold text-xs flex items-center justify-center"
            style={{ backgroundColor: style.bg, color: style.text }}
          >
            {result}
          </div>
        );
      })}
    </div>
  );
}
