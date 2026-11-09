import { getTimeOfDay } from "../../time";
import type { ImageSource } from "./types";

interface UnsplashImage {
  urls: { regular: string };
}
interface FlickrResponse {
  stat: string;
  photos?: { photo: { url_l?: string }[] };
}

async function getUnsplashImages(query: string, signal?: AbortSignal): Promise<string[]> {
  const apiKey = import.meta.env.VITE_UNSPLASH_API_KEY?.trim();
  if (!apiKey) throw new Error("Missing VITE_UNSPLASH_API_KEY");
  const params = new URLSearchParams({
    orientation: "landscape",
    query,
    client_id: apiKey,
    count: "20",
  });
  const response = await fetch(`https://api.unsplash.com/photos/random?${params}`, { signal });
  if (!response.ok) throw new Error(`${response.status} - ${response.statusText}`);
  const images: UnsplashImage[] = await response.json();
  return images.map((image) => image.urls.regular);
}

async function getFlickrImages(query: string, signal?: AbortSignal): Promise<string[]> {
  const apiKey = import.meta.env.VITE_FLICKR_API_KEY?.trim();
  if (!apiKey) throw new Error("Missing VITE_FLICKR_API_KEY");
  const params = new URLSearchParams({
    method: "flickr.photos.search",
    api_key: apiKey,
    tags: query.trim().split(/\s+/).join(", "),
    tag_mode: "all",
    extras: "url_l",
    content_type: "1",
    per_page: "20",
    format: "json",
    nojsoncallback: "1",
  });
  const response = await fetch(`https://www.flickr.com/services/rest/?${params}`, { signal });
  if (!response.ok) throw new Error(`${response.status} - ${response.statusText}`);
  const data: FlickrResponse = await response.json();
  if (data.stat !== "ok" || !data.photos) throw new Error("Flickr could not load images");
  return data.photos.photo.map((image) => image.url_l).filter((url): url is string => !!url);
}

export async function getImages(source: ImageSource, query: string, signal?: AbortSignal): Promise<string[]> {
  const timeOfDay = getTimeOfDay();
  let images: string[];
  switch (source) {
    case "unsplash":
      images = await getUnsplashImages(query || timeOfDay, signal);
      break;
    case "flickr":
      images = await getFlickrImages(query || timeOfDay, signal);
      break;
    default:
      images = Array.from(
        { length: 20 },
        (_, index) =>
          `https://raw.githubusercontent.com/rolling-scopes-school/stage1-tasks/assets/images/${timeOfDay}/${String(index + 1).padStart(2, "0")}.jpg`,
      );
  }
  const urls = images.filter((url) => typeof url === "string" && url.length > 0);
  if (!urls.length) throw new Error("No images found");
  return urls;
}
