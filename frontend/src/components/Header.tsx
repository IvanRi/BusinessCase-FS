export function Header() {
  return (
    <header className="sticky top-0 z-10 border-b border-zinc-200/80 bg-white/85 backdrop-blur-md">
      <div className="mx-auto flex h-14 w-full min-w-0 max-w-5xl items-center justify-between gap-3 px-4 sm:h-16 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-brand text-sm font-semibold text-white">
            V
          </span>
          <span className="truncate text-sm font-semibold tracking-tight text-zinc-900 sm:text-base">
            Ventas
          </span>
        </div>
        <div className="flex shrink-0 items-center gap-2.5">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-medium leading-tight text-zinc-900">María López</p>
            <p className="text-xs text-zinc-500">Dueña</p>
          </div>
          <span
            className="grid h-9 w-9 place-items-center rounded-full bg-brand-soft text-xs font-semibold text-brand-dark"
            title="María López"
          >
            ML
          </span>
        </div>
      </div>
    </header>
  );
}
