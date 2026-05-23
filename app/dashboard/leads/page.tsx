import { getAllLeads } from "@/lib/actions/lead.actions";
import LeadsClient from "./LeadsClient";

const Page = async () => {
  const leads = await getAllLeads() || [];

  return (
    <section className="min-h-screen bg-black text-white px-6 py-10">
      <LeadsClient initialLeads={leads} />
    </section>
  );
};

export default Page;
