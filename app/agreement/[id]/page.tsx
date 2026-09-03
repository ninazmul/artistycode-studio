import { getQuotationById } from "@/lib/actions/quotation.actions";
import AgreementClient from "./AgreementClient";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  try {
    const quotation = await getQuotationById(id);
    if (!quotation) return { title: "Quotation & Agreement — ArtistyCode Studio" };
    return {
      title: `${quotation.title} — Quotation & Agreement | ArtistyCode Studio`,
      description: `Project proposal and service contract for ${quotation.companyName || quotation.clientName}.`,
    };
  } catch {
    return { title: "Quotation & Agreement — ArtistyCode Studio" };
  }
}

export default async function AgreementPage({ params }: PageProps) {
  const { id } = await params;

  try {
    const quotation = await getQuotationById(id);
    if (!quotation) {
      notFound();
    }

    return <AgreementClient quotation={quotation} />;
  } catch {
    notFound();
  }
}
