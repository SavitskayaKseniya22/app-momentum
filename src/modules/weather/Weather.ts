import { checkLanguage, translateContent } from "../../i18n";
import i18next from "i18next";
import type { WeatherData } from "./types";
import { getWeather } from "./weatherApi";
import { escapeHTML } from "../../utils";
import "./weather.scss";

class Weather extends HTMLElement {
  private initialized = false;
  private request?: AbortController;

  private refreshLanguage = () => {
    const query = this.querySelector<HTMLInputElement>(".weather__query")?.value.trim();
    if (query) void this.updateWeather(query);
  };

  initialQuery: string;

  constructor() {
    super();
    this.initialQuery = Weather.readStore() || "";
  }

  static readStore() {
    return window.localStorage.getItem("weatherQuery");
  }

  static writeStore(weatherQuery: string) {
    window.localStorage.setItem("weatherQuery", weatherQuery);
  }

  addListener() {
    this.querySelector(".weather__query")?.addEventListener("change", (event: Event) => {
      const query = (event.target as HTMLInputElement).value.trim();
      Weather.writeStore(query);
      this.request?.abort();
      if (query) {
        void this.updateWeather(query);
      } else {
        this.updateWeatherContainer();
        this.updateErrorContainer();
      }
    });
  }

  async updateWeather(query: string) {
    this.request?.abort();
    const request = new AbortController();
    this.request = request;
    try {
      const weatherResponse = await getWeather(query, checkLanguage(), request.signal);
      if (request.signal.aborted || !this.isConnected) return;
      this.updateWeatherContainer(weatherResponse);
      this.updateErrorContainer();
    } catch (error) {
      if (request.signal.aborted || !this.isConnected) return;
      this.updateWeatherContainer();
      this.updateErrorContainer(error);
    }
  }

  updateErrorContainer(error?: unknown) {
    const errorContainer = this.querySelector(".weather__error");
    if (errorContainer) {
      errorContainer.innerHTML = error ? `${escapeHTML(String(error))}<br><span data-i18n="weather.error"></span>` : "";
      translateContent(errorContainer as HTMLElement);
    }
  }

  updateWeatherContainer(weatherResponse?: WeatherData) {
    const weatherDetails = this.querySelector(".weather__details");
    if (weatherDetails) {
      weatherDetails.innerHTML = weatherResponse ? Weather.createWeatherDetails(weatherResponse) : "";
      translateContent(weatherDetails as HTMLElement);
    }
  }

  static createWeatherDetails(weatherResponse: WeatherData) {
    const { main, wind, weather } = weatherResponse;
    const { temp, humidity } = main;
    const { id, description } = weather[0];
    return `
      <i class="owf owf-${id} weather__details_icon"></i>
      <div class="weather__details_temperature">
        <h4 data-i18n="weather.temperature">Temperature: </h4>
        <span class="weather__detail">${temp}</span>°C
      </div>
      <div class="weather__details_description">
        <h4 data-i18n="weather.description">Description: </h4>
        <span class="weather__detail">${escapeHTML(description)}</span>
      </div>
      <div class="weather__details_wind">
        <h4 data-i18n="weather.wind">Wind: </h4>
        <span class="weather__detail">${wind.speed}</span>m/s
      </div>
      <div class="weather__details_humidity">
        <h4 data-i18n="weather.humidity">Humidity: </h4>
        <span class="weather__detail">${humidity}</span>%
      </div>
    `;
  }

  render() {
    this.insertAdjacentHTML(
      "afterbegin",
      `
      <input type="text" class="weather__query title_big" placeholder="Enter city name" data-i18n="[placeholder]weather.placeholder" value="${escapeHTML(this.initialQuery)}" />
      <div class="weather__error"></div>
      <div class="weather__details"></div>
    `,
    );
  }

  connectedCallback() {
    this.classList.add("weather");
    this.dataset.id = "weather-toggle";
    i18next.on("languageChanged", this.refreshLanguage);
    if (!this.initialized) {
      this.render();
      this.addListener();
      this.initialized = true;
    }
    this.refreshLanguage();
  }

  disconnectedCallback() {
    this.request?.abort();
    i18next.off("languageChanged", this.refreshLanguage);
  }
}

export default Weather;
