type JsonBody = object | unknown[] | null;

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "/api";

async function request<T>(
  endpoint: string,
  init: RequestInit = {},
  isMultipart = false
): Promise<T> {
  const headers = new Headers(init.headers ?? {});
  if (!isMultipart && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...init,
    headers,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(
      `HTTP ${response.status}: ${text || response.statusText || "Request failed"}`
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export const apiClient = {
  get: <T>(endpoint: string): Promise<T> => request<T>(endpoint, { method: "GET" }),

  post: <T>(endpoint: string, body?: JsonBody): Promise<T> =>
    request<T>(endpoint, {
      method: "POST",
      body: body === undefined ? undefined : JSON.stringify(body),
    }),

  patch: <T>(endpoint: string, body?: JsonBody): Promise<T> =>
    request<T>(endpoint, {
      method: "PATCH",
      body: body === undefined ? undefined : JSON.stringify(body),
    }),

  uploadFile: <T>(
    endpoint: string,
    file: File,
    fields?: Record<string, string | number | undefined | null>
  ): Promise<T> => {
    const formData = new FormData();
    formData.append("archivo", file);

    if (fields) {
      Object.entries(fields).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      });
    }

    return request<T>(
      endpoint,
      {
        method: "POST",
        body: formData,
      },
      true
    );
  },
};
