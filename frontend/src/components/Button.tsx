import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "default" | "primary";
}

const VARIANTE = {
  default:
    "border-zinc-200 bg-white text-zinc-800 hover:border-brand/40 hover:text-brand-dark",
  primary: "border-brand bg-brand text-white hover:bg-brand-dark",
} as const;

export function Button({
  children,
  className = "",
  disabled,
  variant = "default",
  ...props
}: ButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      className={`min-h-11 rounded-xl border px-3 py-2 text-sm font-medium shadow-sm transition focus:outline-none focus:ring-2 focus:ring-brand/25 disabled:cursor-not-allowed disabled:opacity-40 ${VARIANTE[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
