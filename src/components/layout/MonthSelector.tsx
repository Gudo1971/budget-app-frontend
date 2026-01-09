import { HStack, IconButton, Text } from "@chakra-ui/react"
import { FiChevronLeft, FiChevronRight } from "react-icons/fi"

type MonthSelectorProps = {
  month: number
  year: number
  onChange: (newMonth: number, newYear: number) => void
}

export function MonthSelector({ month, year, onChange }: MonthSelectorProps) {
  const monthNames = [
    "Januari", "Februari", "Maart", "April", "Mei", "Juni",
    "Juli", "Augustus", "September", "Oktober", "November", "December"
  ]

  const goPrev = () => {
    const newMonth = month === 0 ? 11 : month - 1
    const newYear = month === 0 ? year - 1 : year
    onChange(newMonth, newYear)
  }

  const goNext = () => {
    const newMonth = month === 11 ? 0 : month + 1
    const newYear = month === 11 ? year + 1 : year
    onChange(newMonth, newYear)
  }

  return (
    <HStack justify="center" gap={4}>
      <IconButton
        aria-label="Vorige maand"
        size="sm"
        variant="ghost"
        onClick={goPrev}
      >
        <FiChevronLeft />
      </IconButton>

      <Text fontSize="lg" fontWeight="medium" color="gray.800">
        {monthNames[month]} {year}
      </Text>

      <IconButton
        aria-label="Volgende maand"
        size="sm"
        variant="ghost"
        onClick={goNext}
      >
        <FiChevronRight />
      </IconButton>
    </HStack>
  )
}
