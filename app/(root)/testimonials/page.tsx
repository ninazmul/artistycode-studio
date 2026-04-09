import type { Metadata } from "next";
import Image from "next/image";
import { getAllReviews } from "@/lib/actions/review.actions";

export const metadata: Metadata = {
  title: "Client Testimonials | ArtistyCode Studio",
  description:
    "Read verified client testimonials and reviews about ArtistyCode Studio. Discover how our web, mobile, and cloud solutions help businesses scale with confidence.",
  keywords: [
    "ArtistyCode Studio testimonials",
    "client reviews",
    "software company feedback",
    "web development company Bangladesh",
    "Next.js agency reviews",
    "MERN stack developers testimonials",
    "mobile app development feedback",
    "cloud solutions reviews",
  ],
  openGraph: {
    title: "Client Testimonials | ArtistyCode Studio",
    description:
      "Verified client feedback about ArtistyCode Studio’s web, mobile, and cloud solutions.",
    url: "https://artistycode.com/testimonials",
    siteName: "ArtistyCode Studio",
    images: [
      {
        url: "/og-testimonials.jpg",
        width: 1200,
        height: 630,
        alt: "ArtistyCode Studio Client Testimonials",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Client Testimonials | ArtistyCode Studio",
    description:
      "Discover what clients say about ArtistyCode Studio’s premium web, mobile, and cloud solutions.",
    images: ["/og-testimonials.jpg"],
  },
};

export default async function Page() {
  const data = await getAllReviews();
  const reviews = data.filter((r: any) => r.verified);

  return (
    <section className="bg-black text-white px-6 py-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-3xl md:text-5xl font-semibold">
          Client Testimonials
        </h1>
        <p className="text-white/60 mt-4 text-sm md:text-base">
          Real feedback from businesses and partners who trusted{" "}
          <strong>ArtistyCode Studio</strong> to deliver scalable digital
          solutions.
        </p>
      </div>

      {/* List */}
      <div className="max-w-6xl mx-auto mt-10 space-y-10">
        {reviews.map((item: any) => (
          <article
            key={item._id}
            className="border border-white/20 rounded-xl p-6 hover:border-white/30 transition"
          >
            {/* Quote */}
            <p className="text-white/80 leading-relaxed text-sm md:text-base">
              “{item.quote}”
            </p>

            {/* User */}
            <div className="flex items-center mt-6 gap-4">
              <Image
                src={item.image || "/assets/images/default-avatar.png"}
                alt={item.name}
                width={50}
                height={50}
                className="rounded-full object-cover"
              />
              <div>
                <h3 className="text-sm font-medium">{item.name}</h3>
                <p className="text-xs text-white/50">{item.title}</p>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Empty */}
      {reviews.length === 0 && (
        <p className="text-center text-white/50 mt-20">
          No testimonials available at the moment. Check back soon for client
          feedback.
        </p>
      )}

      {/* Internal Link */}
      <div className="text-center mt-16">
        <a
          href="/projects"
          className="underline text-white/70 hover:text-white"
        >
          Explore our projects
        </a>
      </div>
    </section>
  );
}
