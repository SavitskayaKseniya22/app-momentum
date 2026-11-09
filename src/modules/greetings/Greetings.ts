import { getTimeOfDay } from "../../time";
import { translateContent } from "../../i18n";
import { escapeHTML } from "../../utils";
import "./Greetings.scss";

class Greetings extends HTMLElement {
  private initialized = false;
  private timer?: ReturnType<typeof setInterval>;

  private updateGreeting() {
    const timeOfDay = getTimeOfDay();
    if (this.timeOfDay === timeOfDay) return;
    this.timeOfDay = timeOfDay;
    this.querySelector(".greetings__title")?.setAttribute("data-i18n", `greetings.${timeOfDay}`);
    translateContent(this);
  }
  timeOfDay: string;

  name: string;

  constructor() {
    super();
    this.timeOfDay = getTimeOfDay();
    this.name = Greetings.readStore() || "";
  }

  static readStore() {
    return window.localStorage.getItem("greetingsName");
  }

  static writeStore(greetingsName: string) {
    window.localStorage.setItem("greetingsName", greetingsName);
  }

  addListener() {
    this.querySelector(".greetings__name")?.addEventListener("input", (event: Event) => {
      const { target } = event;
      if (target && target instanceof HTMLInputElement) {
        Greetings.writeStore(target.value);
      }
    });
  }

  render() {
    this.insertAdjacentHTML(
      "afterbegin",
      `
      <span class="greetings__title" data-i18n="greetings.${this.timeOfDay}"></span>
      <input type="text" placeholder="[Enter name]" data-i18n="[placeholder]greetings.placeholder" class="greetings__name" value="${escapeHTML(this.name)}"  />
    `,
    );
  }

  connectedCallback() {
    this.dataset.id = "greetings-toggle";
    this.classList.add("greetings", "title_big");
    if (!this.initialized) {
      this.render();
      this.addListener();
      this.initialized = true;
    }
    this.updateGreeting();
    clearInterval(this.timer);
    this.timer = setInterval(() => this.updateGreeting(), 60_000);
  }

  disconnectedCallback() {
    clearInterval(this.timer);
  }
}

export default Greetings;
