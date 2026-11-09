import type { PlaylistItem } from "./types";
import DurationControl from "./DurationControl";
import PlayOrder from "./PlayOrder";
import VolumeControl from "./VolumeControl";
import playlist from "../../assets/json/playlist.json";
import "./player.scss";

class Player extends HTMLElement {
  private initialized = false;
  private listeners?: AbortController;
  private static nextId = 0;
  private readonly playerId = ++Player.nextId;
  playlist: PlaylistItem[];

  volumeControl: VolumeControl;

  durationControl: DurationControl;

  order: PlayOrder;

  audioElement: HTMLAudioElement;

  constructor() {
    super();
    this.playlist = playlist.map((item) => ({
      ...item,
      src: `${import.meta.env.BASE_URL}${item.src}`,
    }));
    this.audioElement = this.createAudioElement();
    this.order = new PlayOrder(playlist);
    this.volumeControl = new VolumeControl(this.audioElement, this);
    this.durationControl = new DurationControl(this.audioElement, this);
  }

  createAudioElement() {
    const element = Object.assign(document.createElement("audio"), {
      src: this.playlist[0].src,
      volume: 0.5,
    });
    return element;
  }

  addListener(signal: AbortSignal) {
    this.insertAdjacentElement("afterbegin", this.audioElement);

    this.volumeControl.addListener(signal);
    this.durationControl.addListener(signal);

    this.addEventListener(
      "click",
      (event) => {
        if (event.target && event.target instanceof HTMLElement) {
          if (event.target.closest(".play-toggle-main")) {
            this.updatePlayStatus("toggle");
          } else if (event.target.closest(".playlist-item")) {
            if (event.target.closest("label")) {
              return;
            }
            const parent = event.target.closest(".playlist-item") as HTMLElement;
            if (parent) {
              const index = Number(parent.dataset.index);
              if (this.order.value !== index || (this.order.value === index && this.audioElement.paused)) {
                const prevOrderValue = this.order.value;
                this.order.update("replace", index);
                this.changeActiveTrackBySelection(this.audioElement, prevOrderValue, this.order.value);
              } else {
                this.pauseAudio();
              }
            }
          } else if (event.target.closest(".play-next")) {
            const prevOrderValue = this.order.value;
            this.order.update("increase");
            this.changeActiveTrack(this.audioElement, prevOrderValue, this.order.value);
          } else if (event.target.closest(".play-prev")) {
            const prevOrderValue = this.order.value;
            this.order.update("decrease");
            this.changeActiveTrack(this.audioElement, prevOrderValue, this.order.value);
          }
        }
      },
      { signal },
    );

    this.audioElement.addEventListener(
      "play",
      () => {
        this.toggleMainPlayButtonView("play");
        this.toggleTrackControlView("play", this.order.value);
      },
      { signal },
    );

    this.audioElement.addEventListener(
      "pause",
      () => {
        this.toggleMainPlayButtonView("pause");
        this.toggleTrackControlView("pause", this.order.value);
      },
      { signal },
    );

    this.audioElement.addEventListener(
      "ended",
      () => {
        const prevOrderValue = this.order.value;
        this.order.update("increase");
        this.changeActiveTrack(this.audioElement, prevOrderValue, this.order.value);
      },
      { signal },
    );
  }

  changeActiveTrack(audio: HTMLAudioElement, prevOrder: number, nextOrder: number) {
    this.toggleTrackControlView("pause", prevOrder);

    audio.setAttribute("src", this.playlist[nextOrder].src);
    this.updatePlayStatus("continue");
    this.updateActiveTrackView();
  }

  changeActiveTrackBySelection(audio: HTMLAudioElement, prevOrder: number, nextOrder: number) {
    this.toggleTrackControlView("pause", prevOrder);
    audio.setAttribute("src", this.playlist[nextOrder].src);
    this.playAudio();
  }

  toggleMainPlayButtonView(type: "play" | "pause") {
    const mainButton = this.querySelector(".play-toggle-main");
    if (mainButton) {
      Player.toggleButtonVisibility(type, mainButton);
    }
  }

  toggleTrackControlView(type: "play" | "pause", order: number) {
    const track = this.querySelector(`.playlist-item[data-index="${order}"] .play-toggle`);
    if (track) {
      Player.toggleButtonVisibility(type, track);
    }
  }

  updateActiveTrackView() {
    const track = this.querySelector(`.playlist-item[data-index="${this.order.value}"] input[type="radio"]`);
    if (track) {
      (track as HTMLInputElement).checked = true;
    }
  }

  static toggleButtonVisibility(type: "play" | "pause", container: Element) {
    const playIcon = container.querySelector(".bx-play-circle");
    const pauseIcon = container.querySelector(".bx-pause-circle");
    if (type === "play") {
      playIcon?.classList.add("hidden");
      pauseIcon?.classList.remove("hidden");
    } else {
      playIcon?.classList.remove("hidden");
      pauseIcon?.classList.add("hidden");
    }
  }

  playAudio() {
    this.audioElement.setAttribute("data-playing", "true");
    void this.audioElement.play().catch((error: unknown) => {
      this.audioElement.removeAttribute("data-playing");
      this.toggleMainPlayButtonView("pause");
      this.toggleTrackControlView("pause", this.order.value);
      console.error("Could not play audio", error);
    });
  }

  pauseAudio() {
    this.audioElement.pause();
    this.audioElement.removeAttribute("data-playing");
  }

  updatePlayStatus(type: "continue" | "toggle") {
    if (
      (type === "continue" && this.audioElement.dataset.playing === "true") ||
      (type === "toggle" && this.audioElement.dataset.playing !== "true")
    ) {
      this.playAudio();
    } else {
      this.pauseAudio();
    }
  }

  makePlaylistItem(item: PlaylistItem, index: number) {
    const id = `player-${this.playerId}-track-${index}`;
    return `<li class="playlist-item" data-index="${index}">
      <input 
        type="radio"
        name="playlist-${this.playerId}"
        id="${id}" ${index === 0 ? "checked" : ""}
      />
      <label for="${id}" class="playlist-item__play-index play-toggle">
        <i class="bx bx-play-circle"></i>
        <i class="bx bx-pause-circle hidden"></i>
      </label>
      <label class="playlist-item__title" for="${id}">${item.title}</label>
    </li>`;
  }

  makePlaylist() {
    return this.playlist
      .map((item, index) => {
        return this.makePlaylistItem(item, index);
      })
      .join("");
  }

  render() {
    this.insertAdjacentHTML(
      "afterbegin",
      `
      <div class="custom-player">
  <div class="duration">
    <input
      type="range"
      class="duration__range"
      value="0"
      min="0"
      max="100"
      step="1"
    />
    <span>
      <span class="duration__progress">00:00</span>
      /
      <span class="duration__total">00:00</span>
    </span>
  </div>

  <div class="volume">
    <button class="volume__control">
      <i class="bx bx-volume-full"></i>
    </button>
    <input type="range" class="volume__range" min="0" max="1" step="0.1" />
  </div>

  <div class="player-controls">
    <button class="play-prev player-icon">
      <i class="bx bx-skip-previous-circle"></i>
    </button>
    <button class="play-toggle-main play-toggle player-icon">
      <i class="bx bx-play-circle"></i>
      <i class="bx bx-pause-circle hidden"></i>
    </button>
    <button class="play-next player-icon">
      <i class="bx bx-skip-next-circle"></i>
    </button>
  </div>
</div>

<ul class="playlist">
  ${this.makePlaylist()}
</ul>
    `,
    );
  }

  connectedCallback() {
    this.classList.add("player");
    this.dataset.id = "player-toggle";
    if (!this.initialized) {
      this.render();
      this.initialized = true;
    }
    this.listeners?.abort();
    this.listeners = new AbortController();
    this.addListener(this.listeners.signal);
  }
  disconnectedCallback() {
    this.pauseAudio();
    this.listeners?.abort();
  }
}

export default Player;
