import { forwardRef, type InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, id, className = "", error, ...props },
  ref,
) {
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, "-");
  const errorId = error ? `${inputId}-error` : undefined;
  return (
    <label className="flex min-w-0 w-full flex-col gap-1.5 text-sm" htmlFor={inputId}>
      <span className="font-medium text-zinc-600">{label}</span>
      <input
        ref={ref}
        id={inputId}
        aria-invalid={Boolean(error)}
        aria-describedby={errorId}
        className={`min-h-11 w-full rounded-xl border bg-white px-3 py-2 text-base text-zinc-900 shadow-sm transition focus:outline-none focus:ring-2 sm:text-sm ${
          error
            ? "border-red-400 focus:border-red-500 focus:ring-red-200"
            : "border-zinc-200 focus:border-brand focus:ring-brand/25"
        } ${className}`}
        {...props}
      />
      {error ? (
        <span id={errorId} role="alert" className="text-xs text-red-700">
          {error}
        </span>
      ) : null}
    </label>
  );
});
