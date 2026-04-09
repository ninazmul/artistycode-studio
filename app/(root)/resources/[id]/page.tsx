import ResourceTopSection from "@/components/ResourceTopSection";
import ResourceOverview from "@/components/ResourceOverview";
import RelatedResources from "@/components/RelatedResources";
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
    <div className="max-w-5xl w-full mx-auto p-4 space-y-8">
      <ResourceTopSection resource={resource} />
      <ResourceOverview description={resource.description} />
      {relatedResources.length > 0 && (
        <RelatedResources items={relatedResources} />
      )}
    </div>
  );
}

export default ResourceDetails;
