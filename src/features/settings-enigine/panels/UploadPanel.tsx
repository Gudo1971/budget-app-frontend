import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Text,
  VStack,
  HStack,
  IconButton,
  Progress,
  Tooltip,
  useColorModeValue,
} from "@chakra-ui/react";
import { FiX } from "react-icons/fi";
import { useReceiptStore } from "../../../stores/receiptStore";

type UploadingFile = {
  file: File;
  progress: number;
  status: "pending" | "uploading" | "done" | "error";
};

export function UploadPanel() {
  const [files, setFiles] = useState<UploadingFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const setReceipts = useReceiptStore((s) => s.setReceipts);

  const addFiles = (incoming: File[]) => {
    setFiles((prev) => {
      const existingNames = new Set(prev.map((f) => f.file.name));
      const filtered = incoming
        .filter((f) => !existingNames.has(f.name))
        .map((f) => ({
          file: f,
          progress: 0,
          status: "pending" as const,
        }));

      return [...prev, ...filtered];
    });
  };

  const removeFile = (name: string) => {
    setFiles((prev) => prev.filter((f) => f.file.name !== name));
  };

  const uploadSingleFile = (uploadingFile: UploadingFile): Promise<void> => {
    return new Promise((resolve) => {
      const xhr = new XMLHttpRequest();
      const formData = new FormData();
      formData.append("files", uploadingFile.file);

      xhr.open("POST", "/api/receipts/upload");

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100);

          setFiles((prev) =>
            prev.map((f) =>
              f.file.name === uploadingFile.file.name
                ? { ...f, progress: percent, status: "uploading" }
                : f
            )
          );
        }
      };

      xhr.onload = () => {
        setFiles((prev) =>
          prev.map((f) =>
            f.file.name === uploadingFile.file.name
              ? { ...f, progress: 100, status: "done" }
              : f
          )
        );
        resolve();
      };

      xhr.onerror = () => {
        setFiles((prev) =>
          prev.map((f) =>
            f.file.name === uploadingFile.file.name
              ? { ...f, status: "error" }
              : f
          )
        );
        resolve();
      };

      xhr.send(formData);
    });
  };

  const handleUpload = async () => {
    if (files.length === 0) return;

    setIsUploading(true);

    const formData = new FormData();
    for (const f of files) {
      formData.append("files", f.file);
    }

    // ⭐ BELANGRIJK: gebruik jouw echte backend URL
    const res = await fetch("/api/receipts/upload", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      console.error("Upload failed");
      setIsUploading(false);
      return;
    }

    const data = await res.json();

    // ⭐ Backend geeft ALLE bonnen van deze user terug
    const mapped = data.receipts.map((r: any) => ({
      id: r.id,
      thumbnailUrl: `/api/receipts/${r.id}/file`,
      date: r.uploaded_at,
    }));

    // ⭐ Zet ALLE bonnen in de store
    setReceipts(mapped);

    // UI reset
    setFiles([]);
    setIsUploading(false);
  };

  const allUploadsDone =
    files.length > 0 && files.every((f) => f.status === "done");

  const dropzoneBg = useColorModeValue("gray.50", "gray.800");
  const itemBg = useColorModeValue("gray.100", "gray.700");

  return (
    <VStack align="stretch" spacing={4}>
      {/* DROPZONE */}
      <Box
        border="2px dashed"
        borderColor={useColorModeValue("blue.300", "blue.500")}
        borderRadius="md"
        p={6}
        textAlign="center"
        bg={dropzoneBg}
        onDrop={(e) => {
          e.preventDefault();
          const dropped = Array.from(e.dataTransfer.files);
          addFiles(dropped);
        }}
        onDragOver={(e) => e.preventDefault()}
        cursor="pointer"
      >
        <Text mb={1}>Sleep bonnen hierheen</Text>

        <Text fontSize="sm" opacity={0.7}>
          of{" "}
          <Button
            variant="link"
            size="sm"
            color={useColorModeValue("blue.600", "blue.300")}
            onClick={() =>
              document.getElementById("receipt-upload-input")?.click()
            }
          >
            klik hier
          </Button>{" "}
          om te selecteren
        </Text>

        <input
          type="file"
          multiple
          style={{ display: "none" }}
          id="receipt-upload-input"
          onChange={(e) => {
            if (e.target.files) addFiles(Array.from(e.target.files));
          }}
        />
      </Box>

      {/* BESTANDEN LIJST */}
      {files.length > 0 && (
        <Box>
          <HStack justify="space-between" mb={2}>
            <Text fontWeight="bold">Geselecteerde bestanden:</Text>

            <Button
              size="sm"
              colorScheme="blue"
              onClick={handleUpload}
              isDisabled={isUploading}
              isLoading={isUploading}
            >
              Uploaden
            </Button>
          </HStack>

          <VStack align="stretch" spacing={2}>
            {files.map((f) => {
              const previewUrl = URL.createObjectURL(f.file);

              return (
                <Box key={f.file.name} p={2} borderRadius="md" bg={itemBg}>
                  <HStack justify="space-between">
                    <HStack spacing={3}>
                      <Box
                        boxSize="48px"
                        borderRadius="md"
                        overflow="hidden"
                        bg="blackAlpha.200"
                      >
                        <img
                          src={previewUrl}
                          alt={f.file.name}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      </Box>

                      <Text fontSize="sm" noOfLines={1} maxW="150px">
                        {f.file.name}
                      </Text>
                    </HStack>

                    <IconButton
                      aria-label="Verwijder bestand"
                      icon={<FiX />}
                      size="sm"
                      variant="ghost"
                      onClick={() => removeFile(f.file.name)}
                      isDisabled={isUploading}
                    />
                  </HStack>

                  {f.status !== "pending" && (
                    <Progress
                      mt={2}
                      size="xs"
                      value={f.progress}
                      colorScheme={
                        f.status === "error"
                          ? "red"
                          : f.status === "done"
                            ? "green"
                            : "blue"
                      }
                    />
                  )}
                </Box>
              );
            })}
          </VStack>
        </Box>
      )}
    </VStack>
  );
}
