/**
 * Inline SVG icon set — no external icon dependency, currentColor-driven.
 * All icons are decorative (aria-hidden); labels come from surrounding text.
 */
import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

function Svg({ children, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {children}
    </svg>
  );
}

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function Spade(props: IconProps) {
  return (
    <Svg fill="currentColor" {...props}>
      <path d="M12 2.6c-.35 0-.66.17-.87.42C9.4 5.1 4.6 8.7 4.6 12.5c0 1.95 1.5 3.4 3.4 3.4.75 0 1.44-.24 2-.63-.2 1.5-.98 2.72-2.12 3.66-.3.25-.13.72.26.72h7.72c.4 0 .56-.47.26-.72-1.14-.94-1.92-2.16-2.12-3.66.56.4 1.25.63 2 .63 1.9 0 3.4-1.45 3.4-3.4 0-3.8-4.8-7.4-6.53-9.48A1.12 1.12 0 0 0 12 2.6Z" />
    </Svg>
  );
}

export function Telegram(props: IconProps) {
  return (
    <Svg fill="currentColor" {...props}>
      <path d="M21.9 4.35a1 1 0 0 0-1.02-.16L3.42 10.9c-.85.33-.83 1.55.03 1.85l4.2 1.47 1.6 5.02c.2.62 1 .8 1.45.34l2.32-2.35 4.28 3.13c.54.4 1.31.11 1.47-.54l3.13-13.6a1 1 0 0 0-.3-1.86ZM9.9 14.03l7.9-4.9c.16-.1.33.12.19.25l-6.4 5.85a.9.9 0 0 0-.28.53l-.25 1.9-1.16-3.63Z" />
    </Svg>
  );
}

export function Check(props: IconProps) {
  return (
    <Svg {...stroke} {...props}>
      <path d="M4.5 12.5l4.5 4.5L19.5 6.5" />
    </Svg>
  );
}

export function Bolt(props: IconProps) {
  return (
    <Svg fill="currentColor" {...props}>
      <path d="M13.2 2.2 4.6 13.1c-.32.4-.03 1 .49 1H10l-1.2 7.5c-.1.6.68.94 1.05.46l8.6-10.9c.32-.4.03-1-.49-1H13l1.2-7.5c.1-.6-.68-.94-1.05-.46Z" />
    </Svg>
  );
}

export function ShieldCheck(props: IconProps) {
  return (
    <Svg {...stroke} {...props}>
      <path d="M12 3 5 5.6v5.2c0 4.2 2.9 7 7 9.2 4.1-2.2 7-5 7-9.2V5.6L12 3Z" />
      <path d="M9 11.8l2.1 2.1L15 10" />
    </Svg>
  );
}

export function Headset(props: IconProps) {
  return (
    <Svg {...stroke} {...props}>
      <path d="M4 13v-1a8 8 0 0 1 16 0v1" />
      <path d="M4 13.5A1.5 1.5 0 0 1 5.5 12H6a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-.5A1.5 1.5 0 0 1 4 15.5v-2ZM20 13.5a1.5 1.5 0 0 0-1.5-1.5H18a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h.5a1.5 1.5 0 0 0 1.5-1.5v-2Z" />
      <path d="M19 17v.5a3 3 0 0 1-3 3h-3" />
    </Svg>
  );
}

export function Gift(props: IconProps) {
  return (
    <Svg {...stroke} {...props}>
      <path d="M4 11h16v8.5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V11Z" />
      <path d="M3 7.5h18V11H3z" />
      <path d="M12 7.5v13" />
      <path d="M12 7.5C11 4.5 9.5 3.5 8 3.5a2 2 0 0 0 0 4h4Zm0 0c1-3 2.5-4 4-4a2 2 0 0 1 0 4h-4Z" />
    </Svg>
  );
}

export function Lock(props: IconProps) {
  return (
    <Svg {...stroke} {...props}>
      <rect x="5" y="10.5" width="14" height="10" rx="2" />
      <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" />
      <path d="M12 14.5v2.5" />
    </Svg>
  );
}

export function Users(props: IconProps) {
  return (
    <Svg {...stroke} {...props}>
      <circle cx="9" cy="8.5" r="3" />
      <path d="M3.5 19.5a5.5 5.5 0 0 1 11 0" />
      <path d="M16 6a3 3 0 0 1 0 5.6" />
      <path d="M17 14.6a5.5 5.5 0 0 1 3.5 4.9" />
    </Svg>
  );
}

export function ArrowLeft(props: IconProps) {
  return (
    <Svg {...stroke} {...props}>
      <path d="M14 6l-6 6 6 6" />
    </Svg>
  );
}

export function ChevronDown(props: IconProps) {
  return (
    <Svg {...stroke} {...props}>
      <path d="M6 9.5l6 6 6-6" />
    </Svg>
  );
}
