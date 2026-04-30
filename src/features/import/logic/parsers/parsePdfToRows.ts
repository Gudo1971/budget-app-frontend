export async function parsePdfToRows(file: File) {
  const base64 = await fileToBase64(file);
  const API = import.meta.env.VITE_API_URL;

  const response = await fetch(`${API}/ai/pdf-extract`, {
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
