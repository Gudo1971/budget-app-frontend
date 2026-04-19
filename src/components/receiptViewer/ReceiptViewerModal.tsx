import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  IconButton,
  Box,
  useColorModeValue,
} from "@chakra-ui/react";
import { FiX, FiPrinter } from "react-icons/fi";
import { useRef } from "react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
};

export function ReceiptViewerModal({ isOpen, onClose, imageUrl }: Props) {
  const bg = useColorModeValue("rgba(0,0,0,0.85)", "rgba(0,0,0,0.9)");
  const imgRef = useRef<HTMLImageElement>(null);

  const handlePrint = () => {
    if (!imgRef.current) return;

    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>Bon printen</title>
          <style>
            body { margin: 0; padding: 0; text-align: center; }
            img { max-width: 100%; }
          </style>
        </head>
        <body>
          <img src="${imageUrl}" />
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="full">
      <ModalOverlay bg="rgba(0,0,0,0.85)" backdropFilter="blur(6px)" />
      <ModalContent
        bg={bg}
        boxShadow="0 0 20px #00bfff"
        border="1px solid rgba(0,191,255,0.4)"
      >
        <ModalBody
          display="flex"
          justifyContent="center"
          alignItems="center"
          p={0}
          position="relative"
        >
          {/* Close button */}
          <IconButton
            aria-label="Sluiten"
            icon={<FiX />}
            position="absolute"
            top="20px"
            right="20px"
            size="lg"
            variant="ghost"
            color="white"
            _hover={{ color: "#00bfff" }}
            onClick={onClose}
          />

          {/* Print button */}
          <IconButton
            aria-label="Print bon"
            icon={<FiPrinter />}
            position="absolute"
            top="20px"
            right="80px"
            size="lg"
            variant="ghost"
            color="white"
            _hover={{ color: "#00bfff" }}
            onClick={handlePrint}
          />

          {/* Zoomable image */}
          <Box
            maxW="90%"
            maxH="90%"
            overflow="hidden"
            borderRadius="md"
            boxShadow="0 0 20px #00bfff"
          >
            <img
              ref={imgRef}
              src={imageUrl}
              alt="Bon"
              style={{
                width: "100%",
                height: "auto",
                cursor: "zoom-in",
              }}
              onClick={(e) => {
                const img = e.currentTarget;
                img.style.transform =
                  img.style.transform === "scale(1.8)"
                    ? "scale(1)"
                    : "scale(1.8)";
                img.style.transition = "transform 0.25s ease";
                img.style.cursor =
                  img.style.transform === "scale(1.8)" ? "zoom-out" : "zoom-in";
              }}
            />
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
