class DurationControl {
  audioElement: HTMLAudioElement;

  constructor(
    audio: HTMLAudioElement,
    private readonly root: HTMLElement,
  ) {
    this.audioElement = audio;
  }

  addListener(signal: AbortSignal) {
    this.audioElement.addEventListener(
      "loadedmetadata",
      () => {
        const durationTotal = this.root.querySelector(".duration__total");
        if (durationTotal) {
          durationTotal.textContent = DurationControl.convertDuration(this.audioElement.duration);
        }
        const durationRange = this.root.querySelector(".duration__range") as HTMLInputElement;
        if (durationRange) {
          durationRange.max = String(Math.floor(this.audioElement.duration));
        }
      },
      { signal },
    );

    this.audioElement.addEventListener(
      "timeupdate",
      () => {
        const durationProgress = this.root.querySelector(".duration__progress");
        if (durationProgress) {
          durationProgress.textContent = DurationControl.convertDuration(this.audioElement.currentTime);
        }
        const durationRange = this.root.querySelector(".duration__range") as HTMLInputElement;
        if (durationRange) {
          durationRange.value = String(Math.floor(this.audioElement.currentTime));
        }
      },
      { signal },
    );

    this.root.querySelector(".duration__range")?.addEventListener(
      "input",
      (event) => {
        this.audioElement.currentTime = Number((event.target as HTMLInputElement).value);
      },
      { signal },
    );
  }

  static convertDuration(value: number) {
    if (!Number.isFinite(value) || value < 0) return "00:00";
    const min = Math.floor(Math.floor(value) / 60);
    const additionMin = min < 10 ? "0" : "";
    const sec = Math.floor(Math.floor(value) % 60);
    const additionSec = sec < 10 ? "0" : "";
    return `${additionMin + min}:${additionSec + sec}`;
  }
}

export default DurationControl;
