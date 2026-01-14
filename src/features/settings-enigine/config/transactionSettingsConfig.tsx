import { HeaderIconButton } from "@/components/icons/HeaderIconButton";
import { FiUpload, FiFileText, FiFilePlus } from "react-icons/fi";

import { CsvPanel } from "@/features/import/panels/CsvPanel";
import { PdfPanel } from "../panels/PdfPanel";
import { UploadPanel } from "../panels/UploadPanel";

export const transactionSettingsConfig = [
  {
    key: "csv",
    label: "CSV importeren",
    preview: CsvPanel,
    actions: ({ openPreviewFor }: any) => (
      <HeaderIconButton
        label="CSV importeren"
        icon={<FiUpload />}
        onClick={() => openPreviewFor("csv")}
      />
    ),
  },
  {
    key: "pdf",
    label: "PDF importeren",
    preview: PdfPanel,
    actions: ({ openPreviewFor }: any) => (
      <HeaderIconButton
        label="PDF importeren"
        icon={<FiFileText />}
        onClick={() => openPreviewFor("pdf")}
      />
    ),
  },
  {
    key: "receipts",
    label: "Bonnen uploaden",
    preview: UploadPanel,
    actions: ({ openPreviewFor }: any) => (
      <HeaderIconButton
        label="Bonnen uploaden"
        icon={<FiFilePlus />}
        onClick={() => openPreviewFor("receipts")}
      />
    ),
  },
];
