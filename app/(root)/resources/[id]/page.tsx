import ResourceTopSection from "@/components/ResourceTopSection";
import ResourceOverview from "@/components/ResourceOverview";
import RelatedResources from "@/components/RelatedResources";
import Link from "next/link";
import {
  getAllResources,
  getResourceById,
} from "@/lib/actions/resource.actions";
import { IResource } from "@/lib/database/models/resource.model";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export async function ResourceDetails({ params }: PageProps) {
  const resolvedParams = await params;
  const resource = await getResourceById(resolvedParams.id);
  const allResources = await getAllResources();

  if (!resource) return <p>Resource not found</p>;

  const relatedResources = allResources.filter(
    (r: IResource) =>
      r._id !== resource._id &&
      (r.category === resource.category || r.stack === resource.stack),
  );

  return (
    <section className="bg-black-100 text-white min-h-screen relative overflow-hidden pt-40 pb-32">
      {/* Premium Lighting Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-[50%] h-[50%] lighting-radial opacity-30" />
        <div className="absolute bottom-0 right-0 w-[50%] h-[50%] lighting-radial opacity-20" />
      </div>

      <div className="wrapper relative z-10 space-y-24">
        {/* Back Link */}
        <div className="flex justify-start">
          <Link href="/resources" className="text-xs font-bold tracking-[0.2em] text-white/30 hover:text-white transition-all flex items-center gap-2 group">
            <span className="group-hover:-translate-x-1 transition-transform">←</span> BACK TO RESOURCES
          </Link>
        </div>

        <ResourceTopSection resource={resource} />
        
        <div className="grid lg:grid-cols-3 gap-16">
          <div className="lg:col-span-2">
            <ResourceOverview description={resource.description} />
          </div>
          
          <div className="space-y-8">
            <div className="glass p-8 rounded-2xl border border-white/5">
              <h3 className="text-sm font-bold tracking-[0.3em] text-white/20 uppercase mb-4 italic">SPECIFICATIONS</h3>
              <ul className="space-y-4 text-xs font-medium text-white/50 uppercase tracking-widest">
                <li className="flex justify-between border-b border-white/5 pb-2"><span>Type</span> <span className="text-white">{resource.isFree ? "Open Source" : "Premium"}</span></li>
                <li className="flex justify-between border-b border-white/5 pb-2"><span>Stack</span> <span className="text-white">{resource.stack}</span></li>
                <li className="flex justify-between border-b border-white/5 pb-2"><span>Category</span> <span className="text-white">{resource.category}</span></li>
              </ul>
            </div>
          </div>
        </div>

        {relatedResources.length > 0 && (
          <div className="pt-24 border-t border-white/5">
            <RelatedResources items={relatedResources} />
          </div>
        )}
      </div>
    </section>
  );
}

export default ResourceDetails;
