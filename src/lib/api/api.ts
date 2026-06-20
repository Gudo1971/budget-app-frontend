// ---------------------------------------------------------
// ⭐ PREMIUM API CLIENT — Future‑Proof Edition
// Eén consistente, veilige, typed API‑laag voor jouw hele app
// ---------------------------------------------------------

// 🔥 1. Base URL — backend only
// In productie: altijd VITE_API_URL
// In dev: fallback naar localhost (zonder /api)
const getApiUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;

  // Debug log
  console.log("[API] Environment variable:", envUrl);

  // Als env var begint met "VITE_API_URL=", is het verkeerd geparsed
  if (
    envUrl &&
    typeof envUrl === "string" &&
    !envUrl.startsWith("VITE_API_URL=")
  ) {
    return envUrl;
  }

  // Fallback voor development
  if (import.meta.env.DEV) {
    return "http://localhost:3001/api";
  }

  // Hardcoded fallback voor production (als env var niet werkt)
  console.warn("[API] Using hardcoded production URL - check Vercel env vars!");
  return "https://budget-app-backend-production-2621.up.railway.app/api";
};

const API_URL = getApiUrl();

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
export const apiBaseUrl = import.meta.env.VITE_API_URL;
