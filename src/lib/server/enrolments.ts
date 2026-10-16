import "server-only";

/**
 * Paid cohort seats live in Supabase (table `drisyon_enrolments`). Written by the Razorpay webhook,
 * read by the order endpoint to enforce the seat cap. PostgREST over fetch, no SDK.
 * The table definition is in supabase/migrations/.
 */
const TABLE = "drisyon_enrolments";

export type Env = Record<string, string | undefined>;
type Fetch = typeof fetch;

export const isConfigured = (env: Env) => Boolean(env.SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY);

async function rest({ env, fetchImpl, path, method = "GET", body, prefer }: { env: Env; fetchImpl: Fetch; path: string; method?: string; body?: unknown; prefer?: string }) {
  const headers: Record<string, string> = {
    apikey: env.SUPABASE_SERVICE_ROLE_KEY!,
    Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
    "Content-Type": "application/json",
  };
  if (prefer) headers.Prefer = prefer;
  const res = await fetchImpl(`${env.SUPABASE_URL!.replace(/\/$/, "")}/rest/v1/${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`${TABLE} ${method === "GET" ? "read" : "write"} failed (${res.status})`);
  return method === "GET" ? res.json() : null;
}

export async function seatsTaken({ env = process.env as Env, fetchImpl = fetch }: { env?: Env; fetchImpl?: Fetch } = {}) {
  const rows = (await rest({ env, fetchImpl, path: `${TABLE}?select=seats&status=eq.paid` })) as { seats: unknown }[];
  return rows.reduce((sum, r) => sum + (Number(r.seats) || 0), 0);
}

type Payment = { id: string; order_id?: string; amount?: number; amount_refunded?: number; refund_status?: string };
type Order = { notes?: Record<string, string> } | undefined;

export async function recordPaid({ payment, order, env = process.env as Env, fetchImpl = fetch }: { payment: Payment; order: Order; env?: Env; fetchImpl?: Fetch }) {
  const notes = order?.notes ?? {};
  const seats = Number(notes.seats);
  if (!Number.isInteger(seats) || seats < 1) throw new Error(`order ${payment?.order_id} has no seats in notes`);
  const row = {
    payment_id: payment.id,
    order_id: payment.order_id,
    program: notes.program ?? null,
    seats,
    amount_paise: payment.amount,
    offer: notes.offer ?? null,
    name: notes.name ?? null,
    email: notes.email ?? null,
    phone: notes.phone ?? null,
    company: notes.company || null,
    gstin: notes.gstin || null,
    status: "paid",
  };
  await rest({ env, fetchImpl, path: `${TABLE}?on_conflict=payment_id`, method: "POST", body: row, prefer: "resolution=merge-duplicates,return=minimal" });
}

export async function recordRefund({ payment, env = process.env as Env, fetchImpl = fetch }: { payment: Payment; env?: Env; fetchImpl?: Fetch }) {
  const body = {
    refunded_paise: payment.amount_refunded ?? 0,
    status: payment.refund_status === "full" ? "refunded" : "paid",
  };
  await rest({ env, fetchImpl, path: `${TABLE}?payment_id=eq.${encodeURIComponent(payment.id)}`, method: "PATCH", body, prefer: "return=minimal" });
}
