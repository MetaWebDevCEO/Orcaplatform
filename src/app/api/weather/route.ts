import { NextResponse } from "next/server"

function toNumber(value: string | null) {
  if (!value) return null
  const n = Number(value)
  return Number.isFinite(n) ? n : null
}

export async function GET(request: Request) {
  const url = new URL(request.url)
  const lat = toNumber(url.searchParams.get("lat"))
  const lon = toNumber(url.searchParams.get("lon"))
  const q = url.searchParams.get("q")

  const apiKey =
    process.env.WEATHER_API_KEY ?? process.env.NEXT_PUBLIC_WEATHER_API_KEY

  if (!apiKey) {
    return NextResponse.json(
      { error: "WEATHER_API_KEY faltante" },
      { status: 500 }
    )
  }

  const upstreamUrl =
    lat !== null && lon !== null
      ? `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=es`
      : `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(q ?? "Mexico City")}&appid=${apiKey}&units=metric&lang=es`

  try {
    const res = await fetch(upstreamUrl, { cache: "no-store" })

    if (!res.ok) {
      const body = await res.json().catch(() => null)
      return NextResponse.json(
        { error: body?.message ?? res.statusText },
        { status: res.status }
      )
    }

    const data = await res.json()

    return NextResponse.json(
      {
        temp: Math.round(data.main.temp),
        temp_min: Math.round(data.main.temp_min),
        temp_max: Math.round(data.main.temp_max),
        description:
          data.weather?.[0]?.description
            ? data.weather[0].description.charAt(0).toUpperCase() +
              data.weather[0].description.slice(1)
            : "",
        wind_speed: Math.round((data.wind?.speed ?? 0) * 3.6),
        humidity: data.main.humidity,
        location: data.name,
      },
      { status: 200 }
    )
  } catch {
    return NextResponse.json(
      { error: "Error al conectar con OpenWeather" },
      { status: 502 }
    )
  }
}

