import { getAllLeads } from "@/lib/actions/lead.actions";
import LeadsClient from "./LeadsClient";

const Page = async () => {
  const leads = await getAllLeads() || [];

  return (
    <section className="min-h-screen bg-[#080808] text-white px-5 py-8">
      <LeadsClient initialLeads={leads} />
    </section>
  );
};

export default Page;
