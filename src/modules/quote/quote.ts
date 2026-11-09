import { translateContent } from "../../i18n";
import "./quote.scss";

const QUOTE_MAX_NUMBER = 31;

class Quote extends HTMLElement {
  private initialized = false;
  randomNumber: number;

  constructor() {
    super();
    this.randomNumber = Quote.getRandomInt(QUOTE_MAX_NUMBER);
  }

  static getRandomInt(max: number) {
    return Math.floor(Math.random() * max);
  }

  updateQuote() {
    this.randomNumber = Quote.getRandomInt(QUOTE_MAX_NUMBER);
    const quoteContentContainer = this.querySelector(".quote__content");
    const quoteAuthorContainer = this.querySelector(".quote__author");
    quoteContentContainer?.setAttribute("data-i18n", `quotes.${this.randomNumber}.quote`);
    quoteAuthorContainer?.setAttribute("data-i18n", `quotes.${this.randomNumber}.author`);

    translateContent(this);
  }

  addListener() {
    this.querySelector(".quote__reload")?.addEventListener("click", () => {
      this.updateQuote();
    });
  }

  render() {
    this.insertAdjacentHTML(
      "afterbegin",
      `
          <div class="quote__content" data-i18n="quotes.${this.randomNumber}.quote"></div>
          <div class="quote__author" data-i18n="quotes.${this.randomNumber}.author"></div>
          <button class="quote__reload">
            <i class='bx bx-refresh'></i>
          </button>
       `,
    );
  }

  connectedCallback() {
    this.classList.add("quote");
    this.dataset.id = "quote-toggle";
    if (this.initialized) return;
    this.initialized = true;
    this.render();
    this.addListener();
  }
}

export default Quote;
