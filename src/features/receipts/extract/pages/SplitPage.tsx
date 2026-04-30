import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

async function fetchSplitItems(transactionId: string) {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/split-transactions/${transactionId}`,
  );

  if (!res.ok) throw new Error("Failed to fetch split items");
  return res.json();
}

export default function SplitPage() {
  const { id } = useParams();
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (!id) return;
    fetchSplitItems(id).then(setItems);
  }, [id]);

  return (
    <div>
      <h1>Split Items</h1>
      <pre>{JSON.stringify(items, null, 2)}</pre>
    </div>
  );
}
