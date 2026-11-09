export interface WeatherData {
  main: { temp: number; humidity: number };
  wind: { speed: number };
  weather: [{ id: number; description: string }];
}
