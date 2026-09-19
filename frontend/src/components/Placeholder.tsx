import type { ReactNode } from "react";

export function Placeholder({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-56 w-full min-w-0 items-center justify-center rounded-xl border border-dashed border-brand/30 bg-brand-soft/50 px-4 text-center text-sm text-zinc-500 sm:h-64">
      {children}
    </div>
  );
}
