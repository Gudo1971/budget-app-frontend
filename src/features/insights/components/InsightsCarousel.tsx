import { ReactNode, useCallback, useEffect, useState } from "react";
import { Box, HStack, Circle } from "@chakra-ui/react";
import useEmblaCarousel from "embla-carousel-react";
import React from "react";

type InsightsCarouselProps = {
  children: ReactNode | ReactNode[];
  onCardChange?: (index: number) => void;
  initialSlide?: number;
};

export function InsightsCarousel({
  children,
  onCardChange,
  initialSlide = 0,
}: InsightsCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: "center",
    skipSnaps: false,
  });

  const [selectedIndex, setSelectedIndex] = useState(initialSlide);
  const items = React.Children.toArray(children);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    const index = emblaApi.selectedScrollSnap();
    setSelectedIndex(index);
    onCardChange?.(index);
  }, [emblaApi, onCardChange]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.scrollTo(initialSlide, true);
  }, [emblaApi, initialSlide]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    onSelect();
  }, [emblaApi, onSelect]);

  return (
    <Box w="100%" minW="0">
      {/* VIEWPORT */}
      <Box
        overflow="hidden" // ⭐ voorkomt breedte-lekken
        ref={emblaRef}
        w="100%"
        minW="0"
        minH="440px"
      >
        <Box display="flex" gap={4} minW="0">
          {items.map((child, i) => (
            <Box
              key={i}
              flex="0 0 100%" // ⭐ elke slide exact 100% van de container
              display="flex"
              justifyContent="center"
              minW="0"
            >
              <Box
                w="100%"
                maxW="500px" // ⭐ kaartbreedte
                minW="0"
                mx="auto" // ⭐ centreert de kaart binnen de slide
              >
                {child}
              </Box>
            </Box>
          ))}
        </Box>
      </Box>

      {/* DOTS */}
      <HStack justify="center" mt={3} spacing={2}>
        {items.map((_, i) => (
          <Circle
            key={i}
            size="8px"
            bg={i === selectedIndex ? "teal.400" : "gray.500"}
            opacity={i === selectedIndex ? 1 : 0.4}
            transition="0.2s"
          />
        ))}
      </HStack>

      {/* SLIDE COUNTER */}
      <Box
        mt={2}
        fontSize="xs"
        color="gray.500"
        textAlign="center"
        opacity={0.6}
      >
        Slide {selectedIndex + 1} / {items.length}
      </Box>
    </Box>
  );
}
