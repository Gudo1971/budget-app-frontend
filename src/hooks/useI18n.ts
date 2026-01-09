import { useEffect, useState } from "react"
import { getLang, subscribe, setLang, t } from "../i18n/i18n"

export function useI18n() {
  const [lang, setLocalLang] = useState(getLang())

  useEffect(() => {
    return subscribe(() => setLocalLang(getLang()))
  }, [])

  return {
    lang,
    t,
    setLang,
  }
}
