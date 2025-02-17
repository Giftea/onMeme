import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function shortenAddress(
  address: string,
  startLength = 6,
  endLength = 4
): string {
  if (!address || address.length < startLength + endLength) return address;
  return `${address.slice(0, startLength)}...${address.slice(-endLength)}`;
}

export function generateMockEthereumAddress() {
  return (
    "0x" +
    Array.from({ length: 40 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join("")
  );
}

export function formatDate(dateString: string): {
  short: string;
  full: string;
} {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = date.toLocaleString("default", { month: "short" });
  const year = date.getFullYear();
  const hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const period = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 || 12;

  const short = `${day} ${month}`;
  const full = `${day} ${month} ${year} | ${formattedHours}:${minutes}${period}`;
  return { short, full };
}

export function shortenText(text: string): string {
  return text.length > 30 ? `${text.slice(0, 30)}...` : text;
}
