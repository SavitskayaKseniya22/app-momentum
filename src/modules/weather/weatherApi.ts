import type { WeatherData } from "./types";

export async function getWeather(query: string, language: string, signal?: AbortSignal): Promise<WeatherData> {
  const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY?.trim();
  if (!apiKey) throw new Error("Missing VITE_OPENWEATHER_API_KEY");
  const params = new URLSearchParams({ q: query, appid: apiKey, units: "metric", lang: language });
  const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?${params}`, { signal });
  if (!response.ok) throw new Error(`${response.status} - ${response.statusText}`);
  return response.json();
}
