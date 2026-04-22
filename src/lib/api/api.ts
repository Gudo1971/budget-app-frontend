const API_URL = "http://localhost:3001/api";

// ⭐ Premium API Client
// Consistent, typesafe, abortable, met logging

export async function apiGet<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  console.log(">>> API GET:", path, options);

  const res = await fetch(`${API_URL}${path}`, {
    method: "GET",
    ...options,
  });

  if (!res.ok) {
    console.error("<<< API GET ERROR:", path, res.status);
    throw new Error(`API GET error: ${res.status}`);
  }

  const data = await res.json();
  console.log("<<< API GET RESPONSE:", path, data);

  return data as T;
}

export async function apiPost<T>(
  path: string,
  body: any,
  options: RequestInit = {},
): Promise<T> {
  console.log(">>> API POST:", path, body, options);

  const res = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    ...options,
  });

  if (!res.ok) {
    console.error("<<< API POST ERROR:", path, res.status);
    throw new Error(`API POST error: ${res.status}`);
  }

  const data = await res.json();
  console.log("<<< API POST RESPONSE:", path, data);

  return data as T;
}

export async function apiPatch<T>(
  path: string,
  body: any,
  options: RequestInit = {},
): Promise<T> {
  console.log(">>> API PATCH:", path, body, options);

  const res = await fetch(`${API_URL}${path}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    ...options,
  });

  if (!res.ok) {
    console.error("<<< API PATCH ERROR:", path, res.status);
    throw new Error(`API PATCH error: ${res.status}`);
  }

  const data = await res.json();
  console.log("<<< API PATCH RESPONSE:", path, data);

  return data as T;
}

export async function apiPut(url: string, body: any) {
  const base = import.meta.env.VITE_API_URL;

  if (!base) {
    console.error("❌ VITE_API_URL is undefined!");
  }

  const res = await fetch(base + url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error(`PUT ${url} failed`);
  }

  return res.json();
}

export async function apiDelete<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  console.log(">>> API DELETE:", path, options);

  const res = await fetch(`${API_URL}${path}`, {
    method: "DELETE",
    ...options,
  });

  if (!res.ok) {
    console.error("<<< API DELETE ERROR:", path, res.status);
    throw new Error(`API DELETE error: ${res.status}`);
  }

  const data = await res.json();
  console.log("<<< API DELETE RESPONSE:", path, data);

  return data as T;
}
