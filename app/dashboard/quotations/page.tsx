import { auth } from "@clerk/nextjs/server";
import { getAllQuotations } from "@/lib/actions/quotation.actions";
import QuotationsClient from "./QuotationsClient";

export const metadata = {
  title: "Quotations & Contracts — ArtistyCode Studio Dashboard",
  description: "Manage quotations, project agreements, and 30/40/30 milestone invoices.",
};

export default async function QuotationsPage() {
  const authData = await auth();
  const userId = authData.userId || "";
  const quotations = (await getAllQuotations()) || [];

  return (
    <section className="min-h-screen bg-[#080808] text-white px-5 py-8">
      <QuotationsClient initialQuotations={quotations} userId={userId} />
    </section>
  );
}
