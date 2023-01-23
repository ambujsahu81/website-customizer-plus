import { Controls } from "./const";

export function getInput(control: Controls) {
  return getControl<HTMLInputElement>(control);
}

export function getControl<T extends HTMLElement>(control: Controls): T {
  return document.getElementById(control) as T;
}
