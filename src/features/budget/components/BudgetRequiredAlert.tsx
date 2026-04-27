import {
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Button,
  Text,
} from "@chakra-ui/react";
import { useRef } from "react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onFocusBudget: () => void;
};

export function BudgetRequiredAlert({ isOpen, onClose, onFocusBudget }: Props) {
  const cancelRef = useRef<HTMLButtonElement>(null);

  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
      isCentered
    >
      <AlertDialogOverlay bg="rgba(0,0,0,0.65)" backdropFilter="blur(4px)" />

      <AlertDialogContent
        bg="#1a1a1a"
        border="1px solid rgba(255,255,255,0.15)"
        boxShadow="0 0 30px rgba(255,0,0,0.4)"
      >
        <AlertDialogHeader fontSize="lg" fontWeight="bold" color="red.300">
          Totaalbudget vereist
        </AlertDialogHeader>

        <AlertDialogBody>
          <Text color="gray.300">
            Je totaalbudget kan niet 0 zijn. Vul een bedrag in voordat je deze
            pagina verlaat.
          </Text>
        </AlertDialogBody>

        <AlertDialogFooter gap={3}>
          <Button
            ref={cancelRef}
            onClick={onClose}
            variant="ghost"
            color="gray.400"
          >
            Annuleren
          </Button>

          <Button
            bg="red.400"
            color="white"
            _hover={{ bg: "red.500" }}
            onClick={onFocusBudget}
          >
            Budget invullen
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
