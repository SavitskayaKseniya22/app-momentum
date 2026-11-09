import "./ActualDate.scss";
import { checkLanguage } from "../../i18n";

class ActualDate extends HTMLElement {
  private initialized = false;
  private timer?: ReturnType<typeof setInterval>;

  static getActualDate() {
    const lang = checkLanguage();
    const now = new Date();
    const dateString = now.toLocaleDateString(lang, {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    return { now, dateString, timeString: now.toLocaleTimeString(lang) };
  }

  updateDateContainer() {
    const { now, timeString, dateString } = ActualDate.getActualDate();
    const timeContainer = this.querySelector(".date__time");
    const dateContainer = this.querySelector(".date__date");
    if (timeContainer) {
      timeContainer.textContent = timeString;
      (timeContainer as HTMLTimeElement).dateTime = now.toISOString();
    }
    if (dateContainer) {
      dateContainer.textContent = dateString;
      (dateContainer as HTMLTimeElement).dateTime = now.toISOString();
    }
  }

  updater() {
    clearInterval(this.timer);
    this.timer = setInterval(() => {
      this.updateDateContainer();
    }, 1000);
  }

  render() {
    const { now, timeString, dateString } = ActualDate.getActualDate();
    this.insertAdjacentHTML(
      "afterbegin",
      `
    <time class="date__time" data-id="time-toggle" datetime="${now.toISOString()}">${timeString}</time>
    <br>
    <time class="date__date" data-id="date-toggle" datetime="${now.toISOString()}">${dateString}</time>
    `,
    );
  }

  connectedCallback() {
    this.classList.add("date");
    if (!this.initialized) {
      this.render();
      this.initialized = true;
    }
    this.updateDateContainer();
    this.updater();
  }

  disconnectedCallback() {
    clearInterval(this.timer);
  }
}

export default ActualDate;
