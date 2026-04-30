import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from "@chakra-ui/react";
import { useState } from "react";
import { apiPost } from "@/lib/api/api";

type Props = {
  userId: string;
  isOpen: boolean;
  onClose: () => void;
  onCreated: (cat: { id: number; name: string }) => void;
};

export function NewCategoryModal({
  userId,
  isOpen,
  onClose,
  onCreated,
}: Props) {
  const [name, setName] = useState("");

  async function createCategory() {
    const newCat = await apiPost<{ id: number; name: string }>("/categories", {
      userId,
      name,
    });

    onCreated(newCat);
    setName("");
    onClose();
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent bg="gray.900" color="white">
        <ModalHeader>Nieuwe categorie</ModalHeader>
        <ModalBody>
          <Input
            placeholder="Categorie naam"
            value={name}
            onChange={(e) => setName(e.target.value)}
            bg="gray.800"
            borderColor="gray.700"
          />
        </ModalBody>
        <ModalFooter>
          <Button mr={3} onClick={onClose}>
            Annuleren
          </Button>
          <Button colorScheme="green" onClick={createCategory}>
            Opslaan
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
