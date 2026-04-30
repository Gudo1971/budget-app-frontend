import { apiPost } from "@/lib/api/api";

export async function parsePdfToRows(file: File) {
  const base64 = await fileToBase64(file);

  // ⭐ Gebruik API-client (apiPost ondersteunt JSON én FormData)

  const data = await apiPost<{ rows: any[] }>("/ai/pdf-extract", {
    pdf: base64,
  });

  return data.rows;
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
