import { Box, Heading, Select } from "@chakra-ui/react";
import { saveMerchantCategory } from "../services/extractService";

export function MerchantCategorySelector({
  merchant,
  onSelect,
}: {
  merchant: string;
  onSelect: (category: string) => void;
}) {
  return (
    <Box mt={2}>
      <Heading size="sm" mb={1}>
        Kies categorie
      </Heading>

      <Select
        bg="gray.800"
        color="white"
        borderColor="gray.600"
        _placeholder={{ color: "gray.400" }}
        _focus={{ borderColor: "gray.400" }}
        onChange={async (e) => {
          const category = e.target.value;
          await saveMerchantCategory(merchant, category);
          onSelect(category);
        }}
      >
        <option
          style={{ background: "#1A202C", color: "white" }}
          value="restaurant"
        >
          Restaurant
        </option>
        <option style={{ background: "#1A202C", color: "white" }} value="cafe">
          Café
        </option>
        <option
          style={{ background: "#1A202C", color: "white" }}
          value="fastfood"
        >
          Fastfood
        </option>
        <option
          style={{ background: "#1A202C", color: "white" }}
          value="supermarket"
        >
          Supermarkt
        </option>
        <option
          style={{ background: "#1A202C", color: "white" }}
          value="pharmacy"
        >
          Drogist
        </option>
        <option
          style={{ background: "#1A202C", color: "white" }}
          value="retail"
        >
          Winkel
        </option>
        <option
          style={{ background: "#1A202C", color: "white" }}
          value="services"
        >
          Dienst
        </option>
      </Select>
    </Box>
  );
}
