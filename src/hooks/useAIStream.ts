import { useState, useRef } from "react"
import { callAIStream } from "../service/ai"

// simpele cache om dubbele prompts te vermijden
const seenPrompts = new Set<string>()

export function useAIStream() {
  const [text, setText] = useState("")
  const isRunning = useRef(false)

  async function start(prompt: string) {
    // als we deze prompt al eens hebben gestuurd: niks doen
    if (seenPrompts.has(prompt)) return
    if (isRunning.current) return

    isRunning.current = true
    seenPrompts.add(prompt)
    setText("")

    try {
      await callAIStream(prompt, chunk => {
        setText(prev => prev + chunk)
      })
    } finally {
      isRunning.current = false
    }
  }

  return { text, start }
}
