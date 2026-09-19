import type { ReactNode, SelectHTMLAttributes } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  children: ReactNode;
}

export function Select({ label, id, className = "", children, ...props }: SelectProps) {
  const selectId = id ?? label.toLowerCase().replace(/\s+/g, "-");
  return (
    <label className="flex min-w-0 w-full flex-col gap-1 text-sm sm:w-auto sm:min-w-[10rem]" htmlFor={selectId}>
      <span className="font-medium text-zinc-700">{label}</span>
      <select
        id={selectId}
        className={`min-h-11 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-base text-zinc-900 sm:text-sm ${className}`}
        {...props}
      >
        {children}
      </select>
    </label>
  );
}
