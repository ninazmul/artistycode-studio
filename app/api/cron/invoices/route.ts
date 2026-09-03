import { NextResponse } from "next/server";
import { auditOverdueInvoices } from "@/lib/actions/quotation.actions";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const results = await auditOverdueInvoices();
    return NextResponse.json({
      success: true,
      message: "Overdue invoices audited and late fee penalties calculated.",
      data: results,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to audit invoices" },
      { status: 500 }
    );
  }
}

export async function POST() {
  return GET();
}
