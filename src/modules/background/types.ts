export type ImageSource = "github" | "unsplash" | "flickr";
export interface BackgroundOptions {
  source: ImageSource;
  query: string;
}
export interface BackgroundState extends BackgroundOptions {
  images: string[];
  index: number;
}
export type BackgroundDirection = "increase" | "decrease";
export function isImageSource(value: string): value is ImageSource {
  return value === "github" || value === "unsplash" || value === "flickr";
}
