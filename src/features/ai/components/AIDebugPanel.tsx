import { useEffect, useState } from "react"
import { AIDebugEvent, subscribeToAIDebug } from "../../aiDebug"
import { Box, Text, VStack } from "@chakra-ui/react"

export function AIDebugPanel() {
  const [events, setEvents] = useState<AIDebugEvent[]>([])

  useEffect(() => {
    const unsubscribe = subscribeToAIDebug(event => {
      setEvents(prev => [...prev.slice(-99), event])
    })
    return () => unsubscribe()
  }, [])

  return (
    <Box
      position="fixed"
      bottom="0"
      right="0"
      width="420px"
      maxHeight="50vh"
      overflowY="auto"
      bg="gray.900"
      color="white"
      fontSize="xs"
      p={3}
      borderTopLeftRadius="md"
      boxShadow="lg"
      zIndex={2000}
    >
      <Text fontWeight="bold" mb={2}>
        AI Debug
      </Text>

      <VStack align="stretch" gap={2}>
        {events.map((e, index) => {
          const color =
            e.type === "start"
              ? "yellow.300"
              : e.type === "chunk"
              ? "green.300"
              : e.type === "end"
              ? "blue.300"
              : "red.300"

          return (
            <Box
              key={index}
              borderLeft="2px solid"
              borderColor={color}
              pl={2}
            >
              <Text color="gray.400">
                [{e.time}] {e.type.toUpperCase()} ({e.id.slice(0, 8)})
              </Text>

              {e.prompt && (
                <Text color="yellow.200">Prompt: {e.prompt}</Text>
              )}

              {e.chunk && (
                <Text color="green.300">Chunk: {e.chunk}</Text>
              )}

              {e.durationMs !== undefined && (
                <Text color="blue.300">
                  Duration: {e.durationMs} ms
                </Text>
              )}
            </Box>
          )
        })}
      </VStack>
    </Box>
  )
}
