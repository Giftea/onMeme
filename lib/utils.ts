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
