// ---------------------------------------------------------
// ⭐ PREMIUM API CLIENT — Future‑Proof Edition
// Eén consistente, veilige, typed API‑laag voor jouw hele app
// ---------------------------------------------------------

// 🔥 1. Base URL — backend only
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

// 🔥 2. Shared fetch wrapper
async function request<T>(
  path: string,
  method: string,
  body?: any,
  options: RequestInit = {},
): Promise<T> {
  const url = `${API_URL}${path}`;

  console.log(`>>> API ${method}:`, url, body ?? "", options);

  const res = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    credentials: "include",
    body: body ? JSON.stringify(body) : undefined,
    ...options,
  });

  if (!res.ok) {
    console.error(`<<< API ${method} ERROR:`, url, res.status);
    throw new Error(`API ${method} error: ${res.status}`);
  }

  const data = await res.json().catch(() => null);

  console.log(`<<< API ${method} RESPONSE:`, url, data);

  return data as T;
}

// ---------------------------------------------------------
// ⭐ PUBLIC API FUNCTIONS
// ---------------------------------------------------------

export function apiGet<T>(path: string, options: RequestInit = {}) {
  return request<T>(path, "GET", undefined, options);
}

export function apiPost<T>(path: string, body: any, options: RequestInit = {}) {
  return request<T>(path, "POST", body, options);
}

export function apiPatch<T>(
  path: string,
  body: any,
  options: RequestInit = {},
) {
  return request<T>(path, "PATCH", body, options);
}

export function apiPut<T>(path: string, body: any, options: RequestInit = {}) {
  return request<T>(path, "PUT", body, options);
}

export function apiDelete<T>(path: string, options: RequestInit = {}) {
  return request<T>(path, "DELETE", undefined, options);
}

// ---------------------------------------------------------
// ⭐ DOMAIN‑SPECIFIC API CALLS
// ---------------------------------------------------------

export function getBudget() {
  return apiGet("/budget");
}

export function saveBudget(total_budget: number) {
  return apiPost("/budget", { total_budget });
}
