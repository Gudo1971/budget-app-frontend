import { nl } from "./nl"
import { en } from "./en"

export type Lang = "nl" | "en"

// current language state
let currentLang: Lang = "nl"

// listeners for rerendering components
let listeners: (() => void)[] = []

// translation function
export function t(key: string): string {
  const parts = key.split(".")
  let obj: any = currentLang === "nl" ? nl : en

  for (const p of parts) {
    obj = obj?.[p]
  }

  return obj ?? key
}

// get current language
export function getLang(): Lang {
  return currentLang
}

// set language + notify listeners
export function setLang(lang: Lang) {
  currentLang = lang
  listeners.forEach((fn) => fn())
}

// subscribe to language changes
export function subscribe(fn: () => void) {
  listeners.push(fn)
  return () => {
    listeners = listeners.filter((l) => l !== fn)
  }
}
