import { useState } from "react"
import { Box, VStack, HStack, Input, Button, Text } from "@chakra-ui/react"
import { buildPrompt } from "../utils/promptEngine"
import { callAIStream } from "../service/ai"
import { t } from "../i18n/i18n"

export function Chat() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: t("chat.welcome") }
  ])

  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)

  async function sendMessage() {
    if (!input.trim() || loading) return

    const userMessage = { role: "user" as const, content: input }

    // User + lege assistant bubble toevoegen
    setMessages(prev => [
      ...prev,
      userMessage,
      { role: "assistant" as const, content: "" }
    ])

    const currentInput = input
    setInput("")
    setLoading(true)

    const prompt = buildPrompt({
      userInput: currentInput
    })

    let accumulated = ""

    try {
      await callAIStream(prompt, chunk => {
        accumulated += chunk

        // Update alleen het laatste bericht (de assistant‑bubble)
        setMessages(prev => {
          if (prev.length === 0) return prev
          const updated = [...prev]
          const lastIndex = updated.length - 1
          const last = updated[lastIndex]

          if (last.role !== "assistant") return prev

          updated[lastIndex] = {
            ...last,
            content: accumulated
          }

          return updated
        })
      })
    } catch (e) {
      console.error(e)
      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          content: t("chat.error")
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <VStack w="100%" align="start" p={4} gap={4}>
      
      {/* Messages */}
      <VStack w="100%" align="start" gap={3}>
        {messages.map((m, i) => (
          <Box
            key={i}
            p={3}
            borderRadius="md"
            bg={m.role === "assistant" ? "gray.100" : "blue.100"}
            alignSelf={m.role === "assistant" ? "flex-start" : "flex-end"}
            maxW="80%"
          >
            <Text whiteSpace="pre-wrap">{m.content}</Text>
          </Box>
        ))}
      </VStack>

      {/* Input */}
      <HStack w="100%">
        <Input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder={t("chat.placeholder")}
        />
        <Button
          onClick={sendMessage}
          loading={loading}
          colorScheme="blue"
        >
          {t("chat.send")}
        </Button>
      </HStack>

    </VStack>
  )
}
