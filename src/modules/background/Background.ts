import calculateNumber from "../../utils";
import { readBackgroundState, writeBackgroundState } from "./backgroundStore";
import { getImages } from "./imageService";
import type { BackgroundDirection, BackgroundOptions } from "./types";
import "./background.scss";

class Background extends HTMLElement {
  private initialized = false;
  private listeners?: AbortController;
  private request?: AbortController;
  private pendingImage?: HTMLImageElement;
  private state = readBackgroundState();

  get options(): BackgroundOptions {
    return { source: this.state.source, query: this.state.query };
  }

  async setOptions(options: BackgroundOptions): Promise<boolean> {
    this.request?.abort();
    const request = new AbortController();
    this.request = request;
    try {
      const images = await getImages(options.source, options.query, request.signal);
      if (request.signal.aborted || !this.isConnected) return false;
      const sameCollection = options.source === this.state.source && options.query === this.state.query;
      this.state = { ...options, images, index: sameCollection ? this.state.index % images.length : 0 };
      writeBackgroundState(this.state);
      this.showImage();
      return true;
    } catch (error) {
      if (!request.signal.aborted) console.error("Could not load background collection", error);
      return false;
    }
  }

  private navigate(direction: BackgroundDirection) {
    if (!this.state.images.length) return;
    this.state.index = calculateNumber(direction, this.state.index, this.state.images.length - 1, 0);
    writeBackgroundState(this.state);
    this.showImage();
  }

  private cancelImage() {
    if (!this.pendingImage) return;
    this.pendingImage.onload = null;
    this.pendingImage.onerror = null;
    this.pendingImage = undefined;
  }

  private showImage() {
    this.cancelImage();
    const url = this.state.images[this.state.index];
    if (!url) return;
    const image = new Image();
    this.pendingImage = image;
    image.onload = () => {
      const container = this.querySelector<HTMLElement>(".slider__background");
      if (container && this.isConnected) container.style.backgroundImage = `url(${JSON.stringify(url)})`;
      this.cancelImage();
    };
    image.onerror = () => this.cancelImage();
    image.src = url;
  }

  render() {
    this.insertAdjacentHTML(
      "afterbegin",
      `
      <div class="slider__background"></div>
      <bg-buttons-custom></bg-buttons-custom>
    `,
    );
  }

  connectedCallback() {
    this.classList.add("background");
    if (!this.initialized) {
      this.render();
      this.initialized = true;
    }
    this.listeners?.abort();
    this.listeners = new AbortController();
    this.addEventListener(
      "background-navigate",
      (event) => {
        this.navigate((event as CustomEvent<BackgroundDirection>).detail);
      },
      { signal: this.listeners.signal },
    );
    this.showImage();
    void this.setOptions(this.options);
  }

  disconnectedCallback() {
    this.listeners?.abort();
    this.request?.abort();
    this.cancelImage();
  }
}

export default Background;
