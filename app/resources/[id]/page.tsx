import Checkout from "@/components/Checkout";
import MagicButton from "@/components/MagicButton";
import {
  getAllResources,
  getResourceById,
} from "@/lib/actions/resource.actions";
import { Code, Layout } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FaLocationArrow } from "react-icons/fa6";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export async function generateMetadata({ params }: PageProps) {
  const resolvedParams = await params;
  const resource = await getResourceById(resolvedParams.id);

  if (!resource) {
    return {
      title: "Resource Not Found | Resources",
      description: "This resource does not exist or has been removed.",
    };
  }

  return {
    title: `${resource.title} | Resource`,
    description: resource.description ?? "Explore this resource in detail.",
    keywords: [
      resource.title,
      resource.stack,
      resource.category,
      "WebApps",
      "MobileApps",
      "Games",
      "WordPress",
      "CMS Themes",
      "UI Templates",
      "Other Scripts",
      "ThemeForest",
      "CodeCanyon",
      "Creative Market",
      "UI8",
      "BootstrapMade",
      "website template",
      "mobile app template",
      "software resource",
      "digital asset",
      "web development",
      "app development",
      "game development",
      "script marketplace",
      "buy templates",
      "premium resources",
      "developer tools",
      "portfolio",
      "digital products",
    ],
    openGraph: {
      title: `${resource.title} | Resource`,
      description: resource.description ?? "Explore this resource in detail.",
      url: resource.url,
      type: "website",
      images: resource.image
        ? [{ url: resource.image, alt: resource.title }]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title: `${resource.title} | Resource`,
      description: resource.description ?? "Explore this resource in detail.",
      images: resource.image
        ? [{ url: resource.image, alt: resource.title }]
        : [],
    },
  };
}

const ResourceDetails = async ({ params }: PageProps) => {
  const resolvedParams = await params;
  const resource = await getResourceById(resolvedParams.id);
  const allResources = await getAllResources();

  const relatedResources = allResources.filter(
    (r: any) =>
      r._id !== resource._id &&
      (r.category === resource.category || r.stack === resource.stack)
  );

  return (
    <section className="flex justify-center bg-black-100 py-12 px-4">
      <div className="w-full max-w-6xl space-y-16">
        {/* Top Section */}
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Image */}
          <div className="relative w-full rounded-2xl overflow-hidden shadow-lg">
            <span className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
            <Image
              src={resource.image}
              alt={resource.title}
              width={1920}
              height={1080}
              className="relative w-full h-full object-cover object-center rounded-2xl p-1 backdrop-blur-sm"
            />
          </div>

          {/* Meta Info */}
          <div className="space-y-6">
            <h1 className="text-3xl md:text-4xl font-bold text-purple">
              {resource.title}
            </h1>

            <div>
              <span className="text-purple font-bold text-2xl">
                {resource.isFree ? "Free" : <>$ {resource.price}</>}
              </span>
            </div>

            <div className="flex flex-wrap gap-4">
              <span className="flex items-center gap-2 px-4 py-2 rounded-full border border-purple text-purple font-medium text-sm">
                {resource.stack}
                <Code size={16} />
              </span>

              <span className="flex items-center gap-2 px-4 py-2 rounded-full border border-purple text-purple font-medium text-sm">
                {resource.category}
                <Layout size={16} />
              </span>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 pt-8">
              {resource.url && (
                <Link href={resource.url} target="_blank">
                  <MagicButton
                    title="Demo"
                    icon={<FaLocationArrow />}
                    position="right"
                  />
                </Link>
              )}
              <Checkout resource={resource} />
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-4">
          <h2 className="text-2xl text-purple font-semibold">Overview</h2>
          <p className="text-base md:text-lg text-white/90 leading-relaxed whitespace-pre-line">
            {resource.description}
          </p>
        </div>

        {/* Related Resources */}
        {relatedResources.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-2xl text-purple font-semibold">
              Related Resources
            </h2>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedResources.map((item: any) => (
                <Link
                  href={`/resources/${item._id}`}
                  passHref
                  key={item._id}
                  className="group border border-purple/20 hover:shadow-xl hover:border-purple rounded-xl overflow-hidden bg-black-200 transition-all duration-300"
                >
                  <div className="w-full h-52 overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.title}
                      width={800}
                      height={600}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  <div className="p-5 flex flex-col justify-between h-[calc(100%-13rem)]">
                    <h2 className="font-semibold text-lg lg:text-xl text-white line-clamp-2 mb-4">
                      {item.title}
                    </h2>

                    <div className="flex justify-between items-center text-sm text-white">
                      <span className="text-purple font-semibold text-lg">
                        {item.isFree ? "Free" : <>$ {item.price}</>}
                      </span>

                      <div className="flex items-center gap-2 text-purple">
                        <span className="capitalize">{item.category}</span>
                        <Layout size={18} />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ResourceDetails;
