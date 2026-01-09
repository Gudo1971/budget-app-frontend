export type AIDebugEvent = {
  id: string
  type: "start" | "chunk" | "end" | "error"
  prompt?: string
  chunk?: string
  durationMs?: number
  time: string
}

type Listener = (event: AIDebugEvent) => void

const listeners = new Set<Listener>()

export function subscribeToAIDebug(listener: Listener) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener) // cleanup returns void, perfect
  }
}

export function emitAIDebug(event: Omit<AIDebugEvent, "time">) {
  const full: AIDebugEvent = {
    ...event,
    time: new Date().toISOString()
  }
  listeners.forEach(l => l(full))
}
