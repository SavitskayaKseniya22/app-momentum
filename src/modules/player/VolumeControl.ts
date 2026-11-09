class VolumeControl {
  audioElement: HTMLAudioElement;

  constructor(
    audio: HTMLAudioElement,
    private readonly root: HTMLElement,
  ) {
    this.audioElement = audio;
  }

  addListener(signal: AbortSignal) {
    const range = this.root.querySelector<HTMLInputElement>(".volume__range");
    if (range) range.value = String(this.audioElement.muted ? 0 : this.audioElement.volume);
    this.root.addEventListener(
      "click",
      (event) => {
        if (event.target && event.target instanceof HTMLElement) {
          if (event.target.closest(".volume__control")) {
            this.toggleVolume();
          }
        }
      },
      { signal },
    );

    this.root.querySelector(".volume__range")?.addEventListener(
      "input",
      (event) => {
        this.audioElement.muted = false;
        this.audioElement.volume = Number((event.target as HTMLInputElement).value);
        const volumeControl = this.root.querySelector(".volume__control") as HTMLElement;
        if (this.audioElement.volume) {
          delete volumeControl.dataset.muted;
        } else {
          volumeControl.dataset.muted = "true";
        }
      },
      { signal },
    );
  }

  toggleVolume() {
    const audio = this.audioElement;
    const volumeRange = this.root.querySelector(".volume__range") as HTMLInputElement;
    const volumeControl = this.root.querySelector(".volume__control") as HTMLElement;
    const isMuted = audio.muted;
    if (audio.volume) {
      if (isMuted) {
        audio.muted = false;
        volumeRange.value = String(audio.volume);
        delete volumeControl.dataset.muted;
      } else {
        audio.muted = true;

        volumeRange.value = "0";
        volumeControl.dataset.muted = "true";
      }
    } else {
      audio.volume = 0.5;
      audio.muted = false;
      volumeRange.value = "0.5";
      delete volumeControl.dataset.muted;
    }
  }
}

export default VolumeControl;
