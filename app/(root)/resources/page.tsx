import ResourceFilters from "@/components/ResourceFilters";
import { getAllResources } from "@/lib/actions/resource.actions";

export default async function Page() {
  const resources = await getAllResources();
  return (
    <section className="bg-black text-white px-6 py-8">
      <div className="text-center">
        <h1 className="text-3xl md:text-5xl font-semibold">Resources</h1>
        <p className="text-white/60 mt-4 text-sm">
          Premium tools, templates, and systems to accelerate your workflow
        </p>
      </div>
      <ResourceFilters resources={resources} />
    </section>
  );
}
