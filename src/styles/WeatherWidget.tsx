"use client";

import { useEffect, useState } from "react";

type WeatherData = {
  temp: number;
  temp_min: number;
  temp_max: number;
  description: string;
  wind_speed: number;
  humidity: number;
  location: string;
};

export default function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const fetchWeather = async (lat: number, lon: number) => {
      try {
        const res = await fetch(`/api/weather?lat=${lat}&lon=${lon}`, {
          cache: "no-store",
        });
        
        if (!res.ok) {
          return;
        }
        
        const data = (await res.json()) as WeatherData;
        
        if (!cancelled) setWeather(data);
      } catch {
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    const fetchFallbackWeather = async () => {
      try {
        const res = await fetch(`/api/weather?q=${encodeURIComponent("Mexico City")}`, {
          cache: "no-store",
        });
        
        if (!res.ok) {
          return;
        }
        
        const data = (await res.json()) as WeatherData;
        
        if (!cancelled) setWeather(data);
      } catch {
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchWeather(position.coords.latitude, position.coords.longitude);
        },
        () => {
          // Fallback if denied or error
          fetchFallbackWeather();
        }
      );
    } else {
      fetchFallbackWeather();
    }

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="relative w-60 overflow-hidden rounded-3xl border border-white/18 bg-white/10 p-3 text-white shadow-[0_22px_80px_-55px_rgba(0,0,0,0.95)] backdrop-blur-xl">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/12 via-white/6 to-transparent" />
      <div className="relative">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl border border-white/18 bg-white/10 backdrop-blur-md">
            <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
              <path d="M12 3v2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              <path
                d="M4.22 5.22l1.42 1.42"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
              <path d="M3 12h2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              <path
                d="M5.64 18.36l1.42-1.42"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
              <path d="M12 19v2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              <path
                d="M18.36 18.36l-1.42-1.42"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
              <path d="M19 12h2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              <path
                d="M18.36 5.64l-1.42 1.42"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
              <path
                d="M12 8a4 4 0 100 8 4 4 0 000-8z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="text-xs font-semibold text-white/90">Clima</div>
        </div>

        <div className="mt-2 flex items-end justify-between min-h-[64px]">
          {loading ? (
            <div className="text-sm text-white/70 animate-pulse flex items-center h-full w-full">Cargando...</div>
          ) : weather ? (
            <>
              <div>
                <div className="text-xs font-medium text-white/70">Hoy</div>
                <div className="mt-1 text-3xl font-semibold tracking-tight text-white">{weather.temp}°</div>
                <div className="mt-0.5 text-xs text-white/75 truncate max-w-[100px]">{weather.description} · {weather.temp_min}° / {weather.temp_max}°</div>
              </div>
              <div className="text-right text-xs text-white/70">
                <div className="font-medium text-white/80 truncate max-w-[90px]">{weather.location}</div>
                <div className="mt-0.5">Viento {weather.wind_speed} km/h</div>
                <div className="mt-0.5">Humedad {weather.humidity}%</div>
              </div>
            </>
          ) : (
            <div className="text-xs text-white/70">Error al cargar datos</div>
          )}
        </div>
      </div>
    </div>
  );
}
