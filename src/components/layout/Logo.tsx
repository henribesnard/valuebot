import { useId } from "react";

interface LogoProps {
  size?: number;
}

export default function Logo({ size = 30 }: LogoProps) {
  const gradientId = useId();

  const scale = size / 30;
  const w = 28 * scale;
  const h = 24 * scale;

  return (
    <svg
      width={w}
      height={h}
      viewBox="0 0 28 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="ValueBot logo"
    >
      <defs>
        <linearGradient id={gradientId} x1="3" y1="6" x2="25" y2="3" gradientUnits="userSpaceOnUse">
          <stop stopColor="#16C784" />
          <stop offset="1" stopColor="#22D3EE" />
        </linearGradient>
      </defs>
      <path
        d="M3 6 L11 19 L25 3"
        stroke={`url(#${gradientId})`}
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <circle cx="25" cy="3" r="3" fill="#22D3EE" />
    </svg>
  );
}
