import { Bell } from "lucide-react";

type TopBarProps = {
  breadcrumbs: string[];
};

export function TopBar({ breadcrumbs }: TopBarProps) {
  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-gray-50 px-7">
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm">
        {breadcrumbs.map((breadcrumb, index) => {
          const isLast = index === breadcrumbs.length - 1;

          return (
            <span key={`${breadcrumb}-${index}`} className="flex items-center gap-2">
              <span
                className={
                  isLast
                    ? "font-semibold text-slate-950"
                    : "font-medium text-slate-500"
                }
              >
                {breadcrumb}
              </span>
              {!isLast ? (
                <span className="text-slate-400" aria-hidden="true">
                  ›
                </span>
              ) : null}
            </span>
          );
        })}
      </nav>

      <button
        type="button"
        aria-label="Notifications"
        className="relative flex size-9 items-center justify-center rounded-full text-slate-600 transition-colors hover:bg-white hover:text-slate-950"
      >
        <Bell className="size-5" />
        <span className="absolute -right-0.5 -top-0.5 flex min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold leading-4 text-white">
          9+
        </span>
      </button>
    </header>
  );
}
