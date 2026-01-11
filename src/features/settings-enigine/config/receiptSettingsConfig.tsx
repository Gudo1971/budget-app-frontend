import { FiUpload, FiDownload } from "react-icons/fi";
import { HeaderIconButton } from "../../../components/icons/HeaderIconButton";
import { UploadPanel } from "../panels/UploadPanel";
import { DownloadPanel } from "../panels/DownloadPanel";

export const receiptSettingsConfig = [
  {
    key: "upload",
    label: "Upload bonnen",
    preview: UploadPanel,
    actions: ({
      openPreviewFor,
    }: {
      openPreviewFor: (key: string) => void;
    }) => (
      <HeaderIconButton
        label="Upload bonnen"
        icon={<FiUpload />}
        onClick={() => {
          openPreviewFor("upload");
          document.getElementById("receipt-upload-input")?.click();
        }}
      />
    ),
  },
  {
    key: "download",
    label: "Download ZIP",
    preview: DownloadPanel,
    actions: ({
      openPreviewFor,
    }: {
      openPreviewFor: (key: string) => void;
    }) => (
      <HeaderIconButton
        label="Download ZIP"
        icon={<FiDownload />}
        onClick={() => openPreviewFor("download")}
      />
    ),
  },
];
