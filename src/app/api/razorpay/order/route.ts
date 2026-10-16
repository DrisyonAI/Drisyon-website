import { handleOrder } from "@/lib/server/cohort-payments";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const POST = (request: Request) => handleOrder(request);
