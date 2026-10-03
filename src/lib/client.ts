"use client";

export async function api<T = unknown>(url: string, opts: { method?: string; body?: unknown } = {}): Promise<T> {
  const r = await fetch(url, {
    method: opts.method || "GET",
    headers: opts.body !== undefined ? { "Content-Type": "application/json" } : undefined,
    body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
    cache: "no-store",
  });
  const d = await r.json().catch(() => ({}));
  if (r.status === 401) {
    window.location.href = "/admin/login";
  }
  if (!r.ok) throw new Error((d as { error?: string }).error || "خطای سرور");
  return d as T;
}
