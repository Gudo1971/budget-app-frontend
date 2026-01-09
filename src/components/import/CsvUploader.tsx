import { useRef, useState } from "react"
import { Box, Button, Text, VStack, HStack } from "@chakra-ui/react"
import Papa from "papaparse"
import { t } from "../i18n"

export type CSVUploaderProps = {
  onData: (rows: any[]) => void
}

export function CSVUploader({ onData }: CSVUploaderProps) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [fileName, setFileName] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.name.endsWith(".csv")) {
      setError(t("csv.errorInvalid"))
      return
    }

    setError(null)
    setFileName(file.name)

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        onData(result.data)
      },
      error: () => {
        setError(t("csv.errorParse"))
      }
    })
  }

  return (
    <VStack align="start" w="100%" gap={3}>
      <input
        type="file"
        accept=".csv"
        ref={inputRef}
        style={{ display: "none" }}
        onChange={handleFileSelect}
      />

      <Button
        colorScheme="blue"
        onClick={() => inputRef.current?.click()}
      >
        {t("csv.uploadButton")}
      </Button>

      {fileName && (
        <Text fontSize="sm" color="gray.600">
          {t("csv.selected")}: {fileName}
        </Text>
      )}

      {error && (
        <Box
          bg="red.100"
          color="red.700"
          p={2}
          borderRadius="md"
          w="100%"
        >
          {error}
        </Box>
      )}
    </VStack>
  )
}
