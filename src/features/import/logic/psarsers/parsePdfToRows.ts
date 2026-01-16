export async function parsePdfToRows(file: File) {
  const base64 = await fileToBase64(file);

  const response = await fetch("/api/ai/pdf-extract", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ pdf: base64 }),
  });

  const data = await response.json();
  return data.rows; // [{ date, description, amount }]
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
