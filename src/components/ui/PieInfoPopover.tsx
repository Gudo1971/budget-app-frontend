import {
  IconButton,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
} from "@chakra-ui/react";
import { InfoIcon } from "@chakra-ui/icons";

export function PieInfoPopover() {
  return (
    <Popover>
      <PopoverTrigger>
        <IconButton
          aria-label="Uitleg grafiek"
          icon={<InfoIcon boxSize={3} />}
          size="xs"
          variant="outline"
          borderRadius="full"
          borderColor="whiteAlpha.300"
          _hover={{
            bg: "whiteAlpha.200",
            borderColor: "whiteAlpha.500",
          }}
          _active={{
            bg: "whiteAlpha.300",
          }}
        />
      </PopoverTrigger>

      <PopoverContent
        p={4}
        bg="blackAlpha.700"
        backdropFilter="blur(6px)"
        borderColor="whiteAlpha.300"
        borderWidth="1px"
      >
        <PopoverHeader fontWeight="bold">Hoe werkt deze grafiek?</PopoverHeader>

        <PopoverBody fontSize="sm">
          Deze grafiek laat zien hoe jouw uitgaven verdeeld zijn over
          categorieën. Het percentage toont welk deel van je totale uitgaven
          naar een categorie ging.
          <br />
          <br />
          Dit helpt je snel zien welke categorieën het zwaarst wegen in je
          maandelijkse uitgaven.
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
}
