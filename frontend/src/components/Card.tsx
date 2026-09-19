import type { ReactNode } from "react";

export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-sm shadow-brand/10 sm:p-5 ${className}`}
    >
      {children}
    </div>
  );
}
