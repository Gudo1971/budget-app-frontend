import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Button,
  VStack,
  HStack,
  Text,
  Input,
  Divider,
  Box,
} from "@chakra-ui/react";

import { useState } from "react";
import type { Category } from "@/features/categories/types/Category";

export function CategorySelectModal({
  isOpen,
  onClose,
  merchant,
  categories,
  onSelectCategory,
  onCreateCategory,
}: {
  isOpen: boolean;
  onClose: () => void;
  merchant: string | null;
  categories: Category[];
  onSelectCategory: (categoryId: number) => void;
  onCreateCategory: (name: string) => void;
}) {
  const [newCategory, setNewCategory] = useState("");

  const handleCreate = () => {
    if (!newCategory.trim()) return;
    onCreateCategory(newCategory.trim());
    setNewCategory("");
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md" isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          Categoriseer {merchant ? `– ${merchant}` : ""}
        </ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <VStack align="stretch" spacing={4}>
            <Text fontSize="sm" color="gray.500">
              Kies een categorie
            </Text>

            {/* ⭐ Lijst met categorieën */}
            <VStack align="stretch" spacing={2}>
              {categories.map((cat) => (
                <Button
                  key={cat.id}
                  variant="outline"
                  justifyContent="flex-start"
                  onClick={() => onSelectCategory(cat.id)}
                >
                  {cat.name}
                </Button>
              ))}
            </VStack>

            <Divider />

            {/* ⭐ Nieuwe categorie aanmaken */}
            <Box>
              <Text fontSize="sm" mb={2}>
                Nieuwe categorie
              </Text>

              <HStack>
                <Input
                  placeholder="Naam categorie"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                />
                <Button onClick={handleCreate} colorScheme="blue">
                  Voeg toe
                </Button>
              </HStack>
            </Box>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button onClick={onClose} variant="ghost">
            Sluiten
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
