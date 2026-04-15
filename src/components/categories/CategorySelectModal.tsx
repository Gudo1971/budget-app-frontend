import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  VStack,
  HStack,
  Text,
  Input,
} from "@chakra-ui/react";
import { useState } from "react";

// -----------------------------
// TYPES
// -----------------------------
type Category = {
  id: number;
  name: string;
};

type CategorySelectModalProps = {
  isOpen: boolean;
  onClose: () => void;
  merchant: string | null;
  categories: Category[];
  onSelectCategory: (categoryId: number) => void;
  onCreateCategory: (name: string) => void;
};

// -----------------------------
// COMPONENT
// -----------------------------
export function CategorySelectModal({
  isOpen,
  onClose,
  merchant,
  categories,
  onSelectCategory,
  onCreateCategory,
}: CategorySelectModalProps) {
  const [newCategory, setNewCategory] = useState("");
  const [creating, setCreating] = useState(false);

  const handleCreate = () => {
    if (!newCategory.trim()) return;
    onCreateCategory(newCategory.trim());
    setNewCategory("");
    setCreating(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="md">
      <ModalOverlay />
      <ModalContent bg="rgba(20,20,20,0.85)" backdropFilter="blur(10px)">
        <ModalHeader color="white">
          Categoriseer: {merchant ?? "Onbekend"}
        </ModalHeader>

        <ModalBody>
          <VStack align="stretch" spacing={3}>
            {categories.map((cat: Category) => (
              <Button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                bg="rgba(255,255,255,0.05)"
                _hover={{ bg: "rgba(255,255,255,0.15)" }}
                color="white"
              >
                {cat.name}
              </Button>
            ))}

            {!creating && (
              <Button
                mt={4}
                variant="outline"
                color="white"
                borderColor="white"
                onClick={() => setCreating(true)}
              >
                + Nieuwe categorie
              </Button>
            )}

            {creating && (
              <VStack align="stretch" spacing={2}>
                <Input
                  placeholder="Naam nieuwe categorie"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  bg="rgba(255,255,255,0.1)"
                  color="white"
                />
                <HStack>
                  <Button colorScheme="blue" onClick={handleCreate}>
                    Opslaan
                  </Button>
                  <Button
                    variant="ghost"
                    color="white"
                    onClick={() => setCreating(false)}
                  >
                    Annuleren
                  </Button>
                </HStack>
              </VStack>
            )}
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" color="white" onClick={onClose}>
            Sluiten
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
