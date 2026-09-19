import type { ErrorApi } from "../tipos";

const API_URL = import.meta.env.VITE_API_URL;

export class ApiError extends Error {
  readonly status: number;
  readonly codigo?: string;

  constructor(status: number, codigo?: string, mensaje?: string) {
    super(mensaje ?? `HTTP ${status}`);
    this.name = "ApiError";
    this.status = status;
    this.codigo = codigo;
  }
}

export async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  if (init.body && !(init.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const res = await fetch(`${API_URL}${path}`, { ...init, headers });
  if (!res.ok) {
    const body = (await res.json().catch(() => undefined)) as ErrorApi | undefined;
    throw new ApiError(res.status, body?.codigo, body?.mensaje);
  }
  return res.json() as Promise<T>;
}
