import { Box } from "@chakra-ui/react"
import { LuInfo } from "react-icons/lu"
import { useState, useEffect, useRef } from "react"
import { useI18n } from "../../hooks/useI18n"

export function ReasoningTooltip({ reasoning }: { reasoning: string }) {
  const [show, setShow] = useState(false)
  const { t } = useI18n()
  const ref = useRef<HTMLDivElement>(null)

  const isTouch =
    typeof window !== "undefined" &&
    window.matchMedia("(pointer: coarse)").matches

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setShow(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <Box
      ref={ref}
      position="relative"
      display="inline-flex"
      alignItems="center"
      cursor="pointer"
      px={1}
      zIndex={50}
      onMouseEnter={!isTouch ? () => setShow(true) : undefined}
      onMouseLeave={!isTouch ? () => setShow(false) : undefined}
      onClick={isTouch ? () => setShow(prev => !prev) : undefined}
    >
      <LuInfo size={17} color="#4299E1" strokeWidth={2} />

      {show && (
        <Box
          position="absolute"
          top="120%"
          left="0"
          p={2}
          bg="gray.700"
          color="white"
          fontSize="sm"
          borderRadius="md"
          boxShadow="xl"
          zIndex={9999}
          width="220px"
          animation="fadeIn 0.15s ease-out"
        >
          {reasoning}
        </Box>
      )}
    </Box>
  )
}
