/**
 * Cloud Security Cohort 01: single source of truth for what a seat costs.
 * Amounts in paise (₹1 = 100 paise), GST-inclusive. Ported from Talia's drisyon-cyber-cohort.
 * To change the price or offer deadline, edit this file and redeploy; the page and checkout read from here.
 */
export const PROGRAM = Object.freeze({
  code: "CYB-DEVOPS-2026-11",
  name: "Drisyon Cloud Security Cohort 01",
  startDate: "2026-11-01",
  cohortSize: 30,
});

export const LIST_PRICE_PAISE = 1_00_000_00;
export const OFFER_PRICE_PAISE = 75_000_00;
export const OFFER_NAME = "Navratri 25% off";
export const OFFER_ENDS_AT = new Date("2026-10-20T23:59:59+05:30");
export const GST_RATE_BPS = 1800; // 18%
export const MAX_SEATS_PER_ORDER = 10;

export function isOfferLive(now = new Date()) {
  return now.getTime() <= OFFER_ENDS_AT.getTime();
}

export type Quote = Readonly<{
  seats: number;
  offerApplied: boolean;
  offerName: string;
  unitPaise: number;
  listUnitPaise: number;
  totalPaise: number;
  basePaise: number;
  gstPaise: number;
  savingPaise: number;
  currency: "INR";
}>;

export function quote({ seats, now = new Date() }: { seats: number; now?: Date }): Quote {
  if (!Number.isInteger(seats) || seats < 1 || seats > MAX_SEATS_PER_ORDER) {
    throw new RangeError(`seats must be a whole number from 1 to ${MAX_SEATS_PER_ORDER}`);
  }
  const offerApplied = isOfferLive(now);
  const unitPaise = offerApplied ? OFFER_PRICE_PAISE : LIST_PRICE_PAISE;
  const totalPaise = unitPaise * seats;
  const basePaise = Math.round((totalPaise * 10_000) / (10_000 + GST_RATE_BPS));
  return Object.freeze({
    seats,
    offerApplied,
    offerName: offerApplied ? OFFER_NAME : "",
    unitPaise,
    listUnitPaise: LIST_PRICE_PAISE,
    totalPaise,
    basePaise,
    gstPaise: totalPaise - basePaise,
    savingPaise: (LIST_PRICE_PAISE - unitPaise) * seats,
    currency: "INR",
  });
}

/** ₹ formatting in the Indian numbering system, e.g. ₹1,00,000 or ₹63,559.32 */
export function rupees(paise: number, decimals = false) {
  return (
    "₹" +
    (paise / 100).toLocaleString("en-IN", { minimumFractionDigits: decimals ? 2 : 0, maximumFractionDigits: decimals ? 2 : 0 })
  );
}
