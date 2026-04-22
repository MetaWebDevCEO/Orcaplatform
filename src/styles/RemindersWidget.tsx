"use client";

export default function RemindersWidget() {
  return (
    <div className="relative w-60 overflow-hidden rounded-3xl border border-white/18 bg-white/10 p-3 text-white shadow-[0_22px_80px_-55px_rgba(0,0,0,0.95)] backdrop-blur-xl">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/12 via-white/6 to-transparent" />
      <div className="relative">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl border border-white/18 bg-white/10 backdrop-blur-md">
            <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
              <path d="M8 6h13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              <path d="M8 12h13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              <path d="M8 18h13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              <path
                d="M3.5 6.5l1 1 2-2"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M3.5 12.5l1 1 2-2"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M4.5 18.5h0.01"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div className="text-xs font-semibold text-white/90">Recordatorios</div>
        </div>

        <div className="mt-2 space-y-2 text-xs text-white/85">
          <div className="flex items-center justify-between rounded-2xl bg-black/20 px-3 py-2 ring-1 ring-white/10">
            <div className="font-medium text-white/95">Enviar reporte</div>
            <div className="text-white/65">Hoy</div>
          </div>
          <div className="flex items-center justify-between rounded-2xl bg-black/20 px-3 py-2 ring-1 ring-white/10">
            <div className="font-medium text-white/95">Pagar internet</div>
            <div className="text-white/65">Mañana</div>
          </div>
          <div className="flex items-center justify-between rounded-2xl bg-black/20 px-3 py-2 ring-1 ring-white/10">
            <div className="font-medium text-white/95">Gym</div>
            <div className="text-white/65">18:00</div>
          </div>
        </div>
      </div>
    </div>
  );
}
