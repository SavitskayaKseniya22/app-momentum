import i18next from "i18next";
import { escapeHTML } from "../../utils";
import { readStoredJSON } from "../../storage";
import { checkLanguage } from "../../i18n";
import { readBackgroundState } from "../background/backgroundStore";
import { isImageSource } from "../background/types";
import type { BackgroundOptions } from "../background/types";
import "./settings.scss";

class Settings extends HTMLElement {
  private initialized = false;
  private syncLanguage = () => {
    const languageInput = this.querySelector<HTMLInputElement>(`#${checkLanguage()}`);
    if (languageInput) languageInput.checked = true;
  };
  storage: Storage;

  inputs: string[];

  constructor() {
    super();
    this.storage = window.localStorage;
    this.inputs = [
      "time-toggle",
      "date-toggle",
      "greetings-toggle",
      "quote-toggle",
      "weather-toggle",
      "player-toggle",
      "todolist-toggle",
    ];
  }

  addListener() {
    this.addEventListener("click", (event) => {
      if (event.target && event.target instanceof HTMLElement) {
        if (event.target.closest(".settings__toggle")) {
          const popup = this.querySelector(".settings__popup");
          popup?.classList.toggle("hidden");
        }
      }
    });

    this.addEventListener("change", (event) => {
      const input = event.target;
      if (!(input instanceof HTMLInputElement)) return;
      if (input.closest(".settings__visibility")) {
        this.storeVisibilityCheckboxes();
        this.emitVisibility();
      } else if (input.name === "language") {
        void i18next.changeLanguage(input.id);
      } else if (input.name === "background-source" || input.id === "search-query") {
        const source = this.querySelector<HTMLInputElement>('input[name="background-source"]:checked')?.id;
        const query = this.querySelector<HTMLInputElement>("#search-query")?.value.trim() || "";
        if (source && isImageSource(source)) {
          this.dispatchEvent(
            new CustomEvent<BackgroundOptions>("background-settings-change", {
              detail: { source, query },
              bubbles: true,
            }),
          );
        }
      }
    });
  }

  setCheckedInput(inputList: string[]) {
    this.querySelectorAll<HTMLInputElement>(".settings__visibility input").forEach((input) => {
      input.checked = inputList.includes(input.id);
    });
  }

  private emitVisibility() {
    const visible = Array.from(
      this.querySelectorAll<HTMLInputElement>(".settings__visibility input:checked"),
      (input) => input.id,
    );
    this.dispatchEvent(new CustomEvent<string[]>("visibility-change", { detail: visible, bubbles: true }));
  }

  restoreVisibilityCheckboxes() {
    const checkedInputs = readStoredJSON("checkedInputs");
    if (Array.isArray(checkedInputs) && checkedInputs.every((id) => typeof id === "string")) {
      const arrayOfInputs = checkedInputs;
      this.setCheckedInput(arrayOfInputs);
    } else {
      this.setCheckedInput(this.inputs);
    }
  }

  storeVisibilityCheckboxes() {
    const storage = window.localStorage;
    const checkedInputs: string[] = [];
    this.querySelectorAll(".settings__visibility input:checked").forEach((elem) => {
      checkedInputs.push(elem.id);
    });
    storage.setItem("checkedInputs", JSON.stringify(checkedInputs));
  }

  checkTagInitialValue() {
    return this.storage.getItem("imageTag") || "";
  }

  checkImageSourceInitialValue(inputSource: string) {
    const { source } = readBackgroundState();
    return source === inputSource ? "checked" : "";
  }

  setBackgroundOptions(options: BackgroundOptions) {
    this.querySelectorAll<HTMLInputElement>('input[name="background-source"]').forEach((input) => {
      input.checked = input.id === options.source;
    });
    const query = this.querySelector<HTMLInputElement>("#search-query");
    if (query) query.value = options.query;
  }

  render() {
    this.insertAdjacentHTML(
      "afterbegin",
      `
      <div class="settings__popup hidden">
    <h3>Settings</h3>
    <ul class="settings__popup-content">
      <li class="popup-content__column">
        <div class="settings__item">
          <h4 data-i18n="settings.visibility.visibility">Visibility:</h4>
          <ul class="settings__visibility">
            <li>
              <label for="time-toggle" data-i18n="settings.visibility.time">Time</label>
              <input type="checkbox" id="time-toggle" />
            </li>
            <li>
              <label for="date-toggle" data-i18n="settings.visibility.date">Date</label>
              <input type="checkbox" id="date-toggle" />
            </li>
            <li>
              <label for="greetings-toggle" data-i18n="settings.visibility.greetings">Greetings</label>
              <input type="checkbox" id="greetings-toggle" />
            </li>
            <li>
              <label for="quote-toggle" data-i18n="settings.visibility.quote">Quote</label>
              <input type="checkbox" id="quote-toggle" />
            </li>
            <li>
              <label for="weather-toggle" data-i18n="settings.visibility.weather">Weather</label>
              <input type="checkbox" id="weather-toggle" />
            </li>
            <li>
              <label for="player-toggle" data-i18n="settings.visibility.player">Player</label>
              <input type="checkbox" id="player-toggle" />
            </li>
            <li>
              <label for="todolist-toggle" data-i18n="settings.visibility.todolist">Todolist</label>
              <input type="checkbox" id="todolist-toggle" />
            </li>
          </ul>
        </div>
      </li>
      <li class="popup-content__column">
        <div class="settings__item">
          <h4 data-i18n="settings.source.title">Photo source</h4>
          <ul class="background-source">
            <li>
              <label for="github" >Github</label>
              <input type="radio" name="background-source"
              class="background-source__option" id="github"
              ${this.checkImageSourceInitialValue("github")} />
            </li>
            <li>
              <label for="unsplash">Unsplash</label>
              <input type="radio" name="background-source"
              class="background-source__option" id="unsplash"
              ${this.checkImageSourceInitialValue("unsplash")} />
            </li>
            <li>
              <label for="flickr">Flickr</label>
              <input type="radio" name="background-source"
              class="background-source__option" id="flickr"
              ${this.checkImageSourceInitialValue("flickr")} />
            </li>
          </ul>
        </div>
        <div class="settings__item">
          <h4 data-i18n="settings.search.title">Query:</h4>
          <input
            type="text"
            id="search-query"
            data-i18n="[placeholder]settings.search.placeholder"
            class="background-source__query"
            value="${escapeHTML(this.checkTagInitialValue())}"
          />
        </div>
        <div class="settings__item">
          <h4 data-i18n="settings.lang.title">Language:</h4>
          <ul class="language">
            <li>
              <label for="en" data-i18n="settings.lang.en">English</label>
              <input type="radio" name="language" id="en"/>
            </li>
            <li>
              <label for="ru" data-i18n="settings.lang.ru">Russian</label>
              <input type="radio" name="language" id="ru" />
            </li>
          </ul>
        </div>
      </li>
    </ul>
  </div>
  <button class="settings__toggle" data-i18n="[title]settings.toggle" title="toggle settings">
    <i class="bx bxs-cog"></i>
  </button>
    `,
    );
  }

  connectedCallback() {
    this.classList.add("settings");
    if (!this.initialized) {
      this.render();
      this.addListener();
      this.initialized = true;
    }
    this.restoreVisibilityCheckboxes();
    this.emitVisibility();
    this.syncLanguage();
    i18next.on("languageChanged", this.syncLanguage);
  }

  disconnectedCallback() {
    i18next.off("languageChanged", this.syncLanguage);
  }
}

export default Settings;
