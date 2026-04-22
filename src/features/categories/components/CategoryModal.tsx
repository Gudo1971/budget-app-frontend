import { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Select,
  VStack,
} from "@chakra-ui/react";

import { useCreateCategory } from "@/features/categories/hooks/useCreateCategory";

type CategoryModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (category: { id: number; name: string; type: string }) => void;
};

export function CategoryModal({
  isOpen,
  onClose,
  onCreated,
}: CategoryModalProps) {
  const [name, setName] = useState("");
  const [type, setType] = useState<"fixed" | "flexible">("fixed");

  const { mutateAsync: createCategory, isPending } = useCreateCategory();

  async function handleSave() {
    const newCategory = await createCategory({
      name,
      type,
    });

    onCreated(newCategory);
    onClose();
    setName("");
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <ModalOverlay />
      <ModalContent bg="gray.900">
        <ModalHeader color="white">Nieuwe categorie</ModalHeader>

        <ModalBody>
          <VStack spacing={3}>
            <Input
              placeholder="Categorienaam"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <Select
              value={type}
              onChange={(e) => setType(e.target.value as any)}
            >
              <option value="fixed">Vaste kosten</option>
              <option value="flexible">Variabele kosten</option>
            </Select>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button mr={3} onClick={onClose}>
            Annuleren
          </Button>
          <Button
            colorScheme="purple"
            onClick={handleSave}
            isLoading={isPending}
            isDisabled={!name.trim()}
          >
            Opslaan
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
