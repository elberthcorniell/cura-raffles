import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getImageSrc(image: string | { src?: string; default?: string } | any): string {
  const fallbackImage = "/placeholder.svg";
  
  if (typeof image === 'string') {
    return image || fallbackImage;
  }
  return image?.src || image?.default || image || fallbackImage;
}
