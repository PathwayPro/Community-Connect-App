import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const handleLinkChange = (value: string) => {
  if (!value) return value;

  // Remove any existing http:// or https:// to avoid duplication
  const cleanUrl = value.replace(/^(https?:\/\/)/, '');

  // Add https:// if it doesn't exist
  const finalUrl = `https://${cleanUrl}`;

  return finalUrl;
};

export const toSentenceCase = (word: string) => {
  return word?.charAt(0)?.toUpperCase() + word?.slice(1)?.toLowerCase();
};
