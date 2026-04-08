import ProjectFilters from "@/components/ProjectFilters";
import { getAllProjects } from "@/lib/actions/project.actions";

export default async function Page() {
  const projects = await getAllProjects();
  return (
    <section className="bg-black text-white px-6 py-8">
      <div className="text-center">
        <h1 className="text-3xl md:text-5xl font-semibold">Projects</h1>
        <p className="text-white/60 mt-4 text-sm">
          Selected work across web, mobile, and software systems
        </p>
      </div>
      <ProjectFilters projects={projects} />
    </section>
  );
}
