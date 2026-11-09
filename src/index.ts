import type Background from "./modules/background/Background";
import type Settings from "./modules/settings/Settings";
import type { BackgroundOptions } from "./modules/background/types";
import { registerComponents } from "./registerComponents";
import { i18nReady, translateContent } from "./i18n";
import "normalize.css";
import "./style.scss";

registerComponents();

function App() {
  return `
    <main>
    <player-custom></player-custom>
    <background-custom></background-custom>
    <date-custom></date-custom>
    <greetings-custom></greetings-custom>
    <weather-custom></weather-custom>
    <todo-custom></todo-custom>
    <quote-custom></quote-custom>
    <settings-custom></settings-custom>
    </main>
    <footer-custom></footer-custom>
    `;
}

async function mountApp() {
  await i18nReady;
  const template = document.createElement("template");
  template.innerHTML = App();
  const main = template.content.querySelector("main")!;
  let backgroundRequest = 0;

  main.addEventListener("visibility-change", (event) => {
    const visible = (event as CustomEvent<string[]>).detail;
    main.querySelectorAll<HTMLElement>("[data-id]").forEach((element) => {
      element.classList.toggle("invisible", !visible.includes(element.dataset.id || ""));
    });
  });
  main.addEventListener("background-settings-change", async (event) => {
    const background = main.querySelector<Background>("background-custom");
    const settings = main.querySelector<Settings>("settings-custom");
    if (!background || !settings) return;
    const request = ++backgroundRequest;
    await background.setOptions((event as CustomEvent<BackgroundOptions>).detail);
    if (request === backgroundRequest) settings.setBackgroundOptions(background.options);
  });
  document.body.prepend(template.content);
  translateContent();
}

void mountApp();
