import { useState } from "react";

export function PdfUploader({ onData }: { onData: (rows: any[]) => void }) {
  const [error, setError] = useState("");

  async function handleFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("pdf", file);

      const res = await fetch("/api/ai/pdf-extract", {
        method: "POST",
        body: formData, // GEEN headers zetten!
      });

      if (!res.ok) {
        throw new Error("Upload mislukt");
      }

      const data = await res.json();
      console.log("PDF LOADED!", data.rows);

      onData(data.rows);
    } catch (e) {
      console.error(e);
      setError("PDF kon niet worden gelezen");
    }
  }

  return (
    <>
      <input type="file" accept=".pdf" onChange={handleFile} />
      {error && <div style={{ color: "red" }}>{error}</div>}
    </>
  );
}
