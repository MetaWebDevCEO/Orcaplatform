"use client";

export default function NotificationsWidget() {
  return (
    <div className="relative w-60 overflow-hidden rounded-3xl border border-white/18 bg-white/10 p-3 text-white shadow-[0_22px_80px_-55px_rgba(0,0,0,0.95)] backdrop-blur-xl">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/12 via-white/6 to-transparent" />
      <div className="relative">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl border border-white/18 bg-white/10 backdrop-blur-md">
            <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
              <path
                d="M18 8a6 6 0 10-12 0c0 7-3 7-3 7h18s-3 0-3-7"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M13.73 21a2 2 0 01-3.46 0"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div className="text-xs font-semibold text-white/90">Notificaciones</div>
        </div>

        <div className="mt-2 space-y-2 text-xs text-white/85">
          <div className="rounded-2xl bg-black/20 px-3 py-2 ring-1 ring-white/10">
            <div className="font-medium text-white/95">Orca</div>
            <div className="mt-0.5 text-white/75">Tienes 2 tareas pendientes</div>
          </div>
          <div className="rounded-2xl bg-black/20 px-3 py-2 ring-1 ring-white/10">
            <div className="font-medium text-white/95">Calendario</div>
            <div className="mt-0.5 text-white/75">Reunión a las 16:30</div>
          </div>
        </div>
      </div>
    </div>
  );
}
