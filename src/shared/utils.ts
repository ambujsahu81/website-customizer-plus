import { Controls } from "./const";

export function getInput(control: Controls) {
  return getControl<HTMLInputElement>(control);
}

export function getDomElement(id: string): HTMLElement {
  return document.getElementById(id)!;
}

export function getControl<T extends HTMLElement>(control: Controls): T {
  return document.getElementById(control) as T;
}

export function getHostName(url: string): string {
  return new URL(url).hostname;;
}
