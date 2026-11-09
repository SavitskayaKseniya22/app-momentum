import { readStoredJSON } from "../../storage";
import { isImageSource } from "./types";
import type { BackgroundState } from "./types";

export function readBackgroundState(): BackgroundState {
  const source = localStorage.getItem("imageSource") || "github";
  const storedImages = readStoredJSON("imageList");
  const images = Array.isArray(storedImages)
    ? storedImages.filter((item): item is string => typeof item === "string" && item.length > 0)
    : [];
  const index = Number(localStorage.getItem("pictureOrder"));
  return {
    source: isImageSource(source) ? source : "github",
    query: localStorage.getItem("imageTag") || "",
    images,
    index: Number.isSafeInteger(index) && index >= 0 && images.length ? index % images.length : 0,
  };
}
export function writeBackgroundState(state: BackgroundState) {
  localStorage.setItem("imageSource", state.source);
  localStorage.setItem("imageTag", state.query);
  localStorage.setItem("imageList", JSON.stringify(state.images));
  localStorage.setItem("pictureOrder", String(state.index));
}
