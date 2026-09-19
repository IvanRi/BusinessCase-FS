interface LoaderProps {
  label?: string;
  overlay?: boolean;
  className?: string;
}

export function Loader({ label = "Cargando…", overlay = false, className = "" }: LoaderProps) {
  const contenido = (
    <div className="flex flex-col items-center justify-center gap-3" role="status" aria-live="polite">
      <span
        className="h-8 w-8 animate-spin rounded-full border-2 border-brand-soft border-t-brand"
        aria-hidden
      />
      <span className="text-sm text-zinc-500">{label}</span>
    </div>
  );

  if (overlay) {
    return (
      <div className={`absolute inset-0 z-10 grid place-items-center rounded-2xl bg-white/75 backdrop-blur-[1px] ${className}`}>
        {contenido}
      </div>
    );
  }

  return <div className={`py-10 ${className}`}>{contenido}</div>;
}
