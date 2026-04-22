"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { Toaster, toast } from "sonner";
import WidgetsBar from "./src/styles/widgets";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

const LOGIN_BACKGROUND_IMAGE_URL = "https://images.pexels.com/photos/35659868/pexels-photo-35659868.jpeg";

const supabase =
  SUPABASE_URL && SUPABASE_ANON_KEY
    ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    : null;

export default function Login() {
  const router = useRouter();
  const [now, setNow] = useState(() => new Date());
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [selectedUsername, setSelectedUsername] = useState<string | null>(null);
  const [selectedUserLabel, setSelectedUserLabel] = useState<string | null>(null);

  useEffect(() => {
    const interval = window.setInterval(() => setNow(new Date()), 10_000);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    try {
      const lastUser = window.localStorage.getItem("orca.lastUser");
      const lastUserName = window.localStorage.getItem("orca.lastUserName");
      queueMicrotask(() => {
        if (lastUser) setSelectedUsername(lastUser);
        if (lastUserName) setSelectedUserLabel(lastUserName);
      });
    } catch {}
  }, []);

  const timeLarge = useMemo(() => {
    return new Intl.DateTimeFormat("es-MX", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(now);
  }, [now]);

  const dayLine = useMemo(() => {
    return new Intl.DateTimeFormat("es-MX", {
      weekday: "long",
      month: "long",
      day: "numeric",
    }).format(now);
  }, [now]);

  const avatarSeed = selectedUserLabel ?? selectedUsername ?? usernameInput;
  const avatarLetter = (avatarSeed?.trim()?.[0] ?? "?").toUpperCase();
  const avatarHue = useMemo(() => {
    const source = avatarSeed.trim().toLowerCase();
    let hash = 0;
    for (let i = 0; i < source.length; i += 1) {
      hash = (hash * 31 + source.charCodeAt(i)) | 0;
    }
    return Math.abs(hash) % 360;
  }, [avatarSeed]);

  const startLoginWithUsername = (name: string) => {
    const normalized = name.trim();
    if (!normalized) return;
    setSelectedUsername(normalized);
    setSelectedUserLabel(normalized);
    setPasswordInput("");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUsername) {
      startLoginWithUsername(usernameInput);
      return;
    }
    const password = passwordInput;
    if (!password.trim()) {
      toast.error("Ingresa tu contraseña");
      return;
    }

    if (!supabase) {
      toast.error("Faltan variables de Supabase en .env.local");
      return;
    }

    const email = selectedUsername.trim();
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError || !signInData.user) {
      toast.error("Credenciales incorrectas");
      return;
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", signInData.user.id)
      .maybeSingle();

    if (profileError || !profile) {
      await supabase.auth.signOut();
      toast.error("No autorizado");
      return;
    }

    const profileRecord = profile as Record<string, unknown>;
    const fullNameRaw =
      profileRecord["full_name"] ?? profileRecord["fullname"] ?? profileRecord["fullName"];
    const displayName =
      typeof fullNameRaw === "string" && fullNameRaw.trim() ? fullNameRaw.trim() : email;

    toast.success("Acceso correcto");
    try {
      window.localStorage.setItem("orca.lastUser", email);
      window.localStorage.setItem("orca.lastUserName", displayName);
    } catch {}
    try {
      document.cookie = `orca.user=${encodeURIComponent(displayName)}; Path=/; SameSite=Lax`;
    } catch {}

    router.push("/plataforma");
  };

  return (
    <div
      className="min-h-screen bg-black antialiased"
      style={{
        backgroundImage: `url(${LOGIN_BACKGROUND_IMAGE_URL})`,
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    >
      <Toaster
        position="top-center"
        theme="light"
        toastOptions={{
          style: {
            background: "rgba(255,255,255,0.72)",
            color: "#0a0a0a",
            border: "1px solid rgba(255,255,255,0.38)",
            borderRadius: 22,
            backdropFilter: "blur(18px) saturate(180%)",
            WebkitBackdropFilter: "blur(18px) saturate(180%)",
            boxShadow: "0 22px 70px -45px rgba(0,0,0,0.85)",
          },
          classNames: {
            toast: "px-4 py-3",
            title: "text-[13px] font-semibold tracking-tight",
            description: "text-[12px] text-black/70",
            icon: "text-black",
            closeButton: "text-black/60 hover:text-black/80",
          },
        }}
      />
      <div className="min-h-screen bg-gradient-to-b from-black/15 via-black/20 to-black/55">
        <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-10">
          <div className="flex flex-col items-center text-center pt-10 sm:pt-12">
            <div
              className="text-sm font-medium text-white/85"
              style={{ textShadow: "0 1px 14px rgba(0,0,0,0.55)" }}
              suppressHydrationWarning
            >
              {dayLine.charAt(0).toUpperCase() + dayLine.slice(1)}
            </div>
            <div
              className="mt-2 text-[120px] font-extralight leading-none tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white/95 via-white/70 to-white/35 sm:text-[170px]"
              style={{ filter: "drop-shadow(0 10px 40px rgba(0,0,0,0.45))" }}
              suppressHydrationWarning
            >
              {timeLarge}
            </div>
          </div>

          <div className="mx-auto mt-7 w-full max-w-4xl px-0 sm:mt-10">
            <WidgetsBar />
          </div>

          <div className="mt-auto flex flex-col items-center pb-10 sm:pb-12">
            <div className="flex flex-col items-center gap-2">
              <div
                className="flex h-14 w-14 items-center justify-center rounded-full text-lg font-semibold text-white shadow-[0_18px_48px_-30px_rgba(0,0,0,0.80)] ring-1 ring-white/20"
                style={{
                  background: `linear-gradient(180deg, hsla(${avatarHue}, 85%, 86%, 1) 0%, hsla(${avatarHue}, 85%, 72%, 1) 100%)`,
                }}
                suppressHydrationWarning
              >
                <span suppressHydrationWarning>{avatarLetter}</span>
              </div>

              {selectedUsername ? (
                <div className="mt-2 text-sm font-semibold text-white/95" suppressHydrationWarning>
                  {selectedUserLabel ?? selectedUsername}
                </div>
              ) : null}

              {selectedUsername ? (
                <div className="text-xs font-medium text-white/70">
                  Ingresa la contraseña
                </div>
              ) : null}
            </div>

            <div className="mt-4 flex w-full flex-col items-center gap-4">
              {selectedUsername ? (
                <div className="flex w-full flex-col items-center gap-3">
                  <form onSubmit={handleLogin} className="relative">
                    <input
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      placeholder="Contraseña"
                      type="password"
                      autoComplete="current-password"
                      className="h-11 w-72 rounded-full border border-white/25 bg-white/12 px-5 pr-14 text-sm text-white shadow-[0_18px_45px_-34px_rgba(0,0,0,0.85)] outline-none backdrop-blur-md transition placeholder:text-white/60 focus:border-white/45 focus:shadow-[0_0_0_4px_rgba(255,255,255,0.16)] sm:w-80"
                    />
                    <button
                      type="submit"
                      aria-label="Entrar"
                      className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 ring-1 ring-white/18 shadow-[0_12px_28px_-18px_rgba(0,0,0,0.65)] transition hover:bg-black/50 active:scale-[0.98]"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        className="h-5 w-5"
                        aria-hidden="true"
                      >
                        <path
                          d="M9 6l6 6-6 6"
                          stroke="white"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </form>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedUsername(null);
                      setSelectedUserLabel(null);
                      setUsernameInput("");
                      setPasswordInput("");
                      try {
                        window.localStorage.removeItem("orca.lastUser");
                        window.localStorage.removeItem("orca.lastUserName");
                      } catch {}
                      try {
                        document.cookie = "orca.user=; Path=/; Max-Age=0; SameSite=Lax";
                      } catch {}
                    }}
                    className="text-xs font-medium text-white/70 hover:text-white/85 transition-colors"
                  >
                    Cambiar usuario
                  </button>
                </div>
              ) : (
                <form onSubmit={handleLogin} className="relative">
                  <input
                    value={usernameInput}
                    onChange={(e) => setUsernameInput(e.target.value)}
                    placeholder="Email"
                    autoComplete="username"
                    className="h-11 w-72 rounded-full border border-white/25 bg-white/12 px-5 pr-14 text-sm text-white shadow-[0_18px_45px_-34px_rgba(0,0,0,0.85)] outline-none backdrop-blur-md transition placeholder:text-white/60 focus:border-white/45 focus:shadow-[0_0_0_4px_rgba(255,255,255,0.16)] sm:w-80"
                  />
                  <button
                    type="submit"
                    aria-label="Continuar"
                    className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 ring-1 ring-white/18 shadow-[0_12px_28px_-18px_rgba(0,0,0,0.65)] transition hover:bg-black/50 active:scale-[0.98]"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      className="h-5 w-5"
                      aria-hidden="true"
                    >
                      <path
                        d="M9 6l6 6-6 6"
                        stroke="white"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
