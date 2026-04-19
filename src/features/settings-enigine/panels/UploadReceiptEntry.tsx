import { useLocation } from "react-router-dom";
import { UploadPanel } from "./UploadPanel";

export function UploadReceiptEntry() {
  const location = useLocation();
  const transactionId = location.state?.transactionId ?? undefined;

  return <UploadPanel transactionId={transactionId} />;
}
