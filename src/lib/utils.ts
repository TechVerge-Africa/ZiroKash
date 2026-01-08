import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

import { toast } from "sonner";

export async function copyToClipboard(text: string, label: string = 'Text') {
  // Try modern API first
  if (navigator.clipboard && navigator.clipboard.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${label} copied to clipboard`);
      return;
    } catch (err) {
      console.warn('Clipboard API failed', err);
    }
  }

  // Fallback logic
  try {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-9999px";
    textArea.style.top = "0";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);

    if (successful) {
      toast.success(`${label} copied to clipboard`);
    } else {
      throw new Error("execCommand failed");
    }
  } catch (err) {
    console.error('Copy failed:', err);
    toast.error(`Failed to copy ${label.toLowerCase()}`);
  }
}
