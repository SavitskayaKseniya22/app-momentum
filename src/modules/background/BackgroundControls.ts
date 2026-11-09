class BackgroundControls extends HTMLElement {
  private initialized = false;
  private listeners?: AbortController;

  connectedCallback() {
    this.classList.add("slider__icons");
    if (!this.initialized) {
      this.innerHTML = `
        <button class="slider__icons_prev slider__icons_icon" data-operation="decrease" title="previous image" data-i18n="[title]images.prev">
          <i class="bx bx-chevron-left"></i>
        </button>
        <button class="slider__icons_next slider__icons_icon" data-operation="increase" title="next image" data-i18n="[title]images.next">
          <i class="bx bx-chevron-right"></i>
        </button>`;
      this.initialized = true;
    }
    this.listeners?.abort();
    this.listeners = new AbortController();
    this.addEventListener(
      "click",
      (event) => {
        const button = event.target instanceof Element ? event.target.closest<HTMLElement>("[data-operation]") : null;
        const direction = button?.dataset.operation;
        if (direction !== "increase" && direction !== "decrease") return;
        this.dispatchEvent(new CustomEvent("background-navigate", { detail: direction, bubbles: true }));
      },
      { signal: this.listeners.signal },
    );
  }

  disconnectedCallback() {
    this.listeners?.abort();
  }
}
export default BackgroundControls;
