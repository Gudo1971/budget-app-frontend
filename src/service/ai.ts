import { emitAIDebug } from "../aiDebug"
const API_URL = "http://localhost:3001"
const DEV = import.meta.env.DEV

export async function callAIStream(
  prompt: string,
  onChunk: (chunk: string) => void
) {
  const id = crypto.randomUUID()
  const startTime = performance.now()

  if (DEV) {
    console.log("%c[AI STREAM START]", "color: green; font-weight: bold;")
    console.log("Prompt:", prompt)
  }
  emitAIDebug({ id, type: "start", prompt })

  const response = await fetch(`${API_URL}/api/ai/stream`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ prompt })
  })


  if (!response.body) throw new Error("Streaming not supported")

  const reader = response.body.getReader()
  const decoder = new TextDecoder()

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    const text = decoder.decode(value)
    onChunk(text)

    emitAIDebug({ id, type: "chunk", chunk: text })
  }

  const durationMs = Math.round(performance.now() - startTime)

  if (DEV) {
    console.log("%c[AI STREAM END]", "color: red; font-weight: bold;")
    console.log("Duration:", durationMs, "ms")
  }
  emitAIDebug({ id, type: "end", durationMs })
}
