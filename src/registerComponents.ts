import Background from "./modules/background/Background";
import BackgroundControls from "./modules/background/BackgroundControls";
import ActualDate from "./modules/actualDate/ActualDate";
import Greetings from "./modules/greetings/Greetings";
import Footer from "./modules/footer/footer";
import Quote from "./modules/quote/quote";
import Settings from "./modules/settings/Settings";
import TodoList from "./modules/todolist/TodoList";
import Weather from "./modules/weather/Weather";
import Player from "./modules/player/Player";

export function registerComponents() {
  customElements.define("greetings-custom", Greetings);
  customElements.define("quote-custom", Quote);
  customElements.define("footer-custom", Footer);
  customElements.define("date-custom", ActualDate);
  customElements.define("todo-custom", TodoList);
  customElements.define("weather-custom", Weather);
  customElements.define("settings-custom", Settings);
  customElements.define("bg-buttons-custom", BackgroundControls);
  customElements.define("background-custom", Background);
  customElements.define("player-custom", Player);
}
