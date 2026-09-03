import { type ClassValue, clsx } from "clsx";

import { twMerge } from "tailwind-merge";
import qs from "query-string";

import { UrlQueryParams, RemoveUrlQueryParams } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDateTime = (dateString: Date) => {
  const dateTimeOptions: Intl.DateTimeFormatOptions = {
    weekday: "short", // abbreviated weekday name (e.g., 'Mon')
    month: "short", // abbreviated month name (e.g., 'Oct')
    day: "numeric", // numeric day of the month (e.g., '25')
    hour: "numeric", // numeric hour (e.g., '8')
    minute: "numeric", // numeric minute (e.g., '30')
    hour12: true, // use 12-hour clock (true) or 24-hour clock (false)
  };

  const dateOptions: Intl.DateTimeFormatOptions = {
    weekday: "short", // abbreviated weekday name (e.g., 'Mon')
    month: "short", // abbreviated month name (e.g., 'Oct')
    year: "numeric", // numeric year (e.g., '2023')
    day: "numeric", // numeric day of the month (e.g., '25')
  };

  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: "numeric", // numeric hour (e.g., '8')
    minute: "numeric", // numeric minute (e.g., '30')
    hour12: true, // use 12-hour clock (true) or 24-hour clock (false)
  };

  const formattedDateTime: string = new Date(dateString).toLocaleString(
    "en-US",
    dateTimeOptions
  );

  const formattedDate: string = new Date(dateString).toLocaleString(
    "en-US",
    dateOptions
  );

  const formattedTime: string = new Date(dateString).toLocaleString(
    "en-US",
    timeOptions
  );

  return {
    dateTime: formattedDateTime,
    dateOnly: formattedDate,
    timeOnly: formattedTime,
  };
};

export const convertFileToUrl = (file: File) => URL.createObjectURL(file);

export const formatPrice = (price: string) => {
  const amount = parseFloat(price);
  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "AUD",
  }).format(amount);

  return formattedPrice;
};

export function formUrlQuery({ params, key, value }: UrlQueryParams) {
  const currentUrl = qs.parse(params);

  currentUrl[key] = value;

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    { skipNull: true }
  );
}

export function removeKeysFromQuery({
  params,
  keysToRemove,
}: RemoveUrlQueryParams) {
  const currentUrl = qs.parse(params);

  keysToRemove.forEach((key) => {
    delete currentUrl[key];
  });

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    { skipNull: true }
  );
}

export const handleError = (error: unknown) => {
  console.error(error);
  throw new Error(typeof error === "string" ? error : JSON.stringify(error));
};

/* ─────────────────────────────────────────────────────────────
   FINANCIAL CALCULATION HELPERS — single source of truth
   (kept in sync with MongoDB aggregation in dashboard.actions.ts)

   Formulas:
   • totalRevenue = Σ amount where category != "Spend"
   • totalDue    = Σ due_amount (all categories)
   • totalSpend  = Σ amount where category == "Spend"
   • grossReserve= Σ amount where category == "Reserve"
   • totalReserve= max(0, grossReserve − totalSpend)
   • totalEarnings = max(0, totalRevenue − totalSpend)
   ───────────────────────────────────────────────────────────── */

export type TransactionLike = {
  amount?: string | number | null;
  due_amount?: string | number | null;
  category?: string | null;
};

export type FinancialSummary = {
  totalRevenue: number;
  totalDue: number;
  totalSpend: number;
  grossReserve: number;
  totalReserve: number;
  totalEarnings: number;
};

export type MonthlyFinancialEntry = {
  revenue: number;
  spend: number;
  reserve: number;
  due: number;
  earnings: number;
};

export function calculateFinancialSummary<T extends TransactionLike>(
  rows: T[] | null | undefined,
): FinancialSummary {
  let totalRevenue = 0;
  let totalDue = 0;
  let totalSpend = 0;
  let grossReserve = 0;

  for (const t of rows || []) {
    const amount = Number(t.amount ?? 0) || 0;
    const due = Number(t.due_amount ?? 0) || 0;
    const category = String(t.category ?? "");

    totalDue += due;
    if (category === "Spend") {
      totalSpend += amount;
    } else {
      totalRevenue += amount;
      if (category === "Reserve") {
        grossReserve += amount;
      }
    }
  }

  const totalReserve = Math.max(0, grossReserve - totalSpend);
  const totalEarnings = Math.max(0, totalRevenue - totalSpend);

  return {
    totalRevenue,
    totalDue,
    totalSpend,
    grossReserve,
    totalReserve,
    totalEarnings,
  };
}

export function calculateMonthlyFinancials<T extends TransactionLike & { date?: string | Date }>(
  rows: T[] | null | undefined,
): Record<string, MonthlyFinancialEntry> {
  const monthly: Record<string, MonthlyFinancialEntry> = {};

  for (const t of rows || []) {
    const amount = Number(t.amount ?? 0) || 0;
    const due = Number(t.due_amount ?? 0) || 0;
    const category = String(t.category ?? "");

    const monthYear = new Date(t.date ?? 0).toLocaleString("default", {
      month: "short",
      year: "numeric",
    });

    if (!monthly[monthYear]) {
      monthly[monthYear] = { revenue: 0, spend: 0, reserve: 0, due: 0, earnings: 0 };
    }
    const bucket = monthly[monthYear];

    if (category === "Spend") {
      bucket.spend += amount;
    } else {
      bucket.revenue += amount;
      if (category === "Reserve") {
        bucket.reserve += amount;
      }
    }
    bucket.due += due;
  }

  for (const key of Object.keys(monthly)) {
    const b = monthly[key];
    b.earnings = Math.max(0, b.revenue - b.spend);
    b.reserve = Math.max(0, b.reserve - b.spend);
  }

  return monthly;
}
