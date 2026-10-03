import { NextResponse } from "next/server";

export function ok(data: unknown, status = 200) {
  return NextResponse.json(data, { status });
}

export function fail(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export async function handle(fn: () => Promise<Response>) {
  try {
    return await fn();
  } catch (e) {
    console.error(e);
    const msg = e instanceof Error ? e.message : "خطای سرور";
    return fail(msg, 500);
  }
}
