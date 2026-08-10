import type { Metadata } from "next";
import Image from "next/image";
import AdSense from "@/components/AdSense";
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
        url: "/assets/og-image.png",
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
    images: ["/assets/og-image.png"],
  },
};

export default async function Page() {
  const data = await getAllReviews();
  const reviews = data.filter((r: any) => r.verified);

  return (
    <section className="bg-black-100 text-white relative overflow-hidden pt-40 pb-32 min-h-screen">
      {/* Premium Lighting Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-[50%] h-[50%] lighting-radial opacity-30" />
        <div className="absolute bottom-0 right-0 w-[50%] h-[50%] lighting-radial opacity-20" />
      </div>

      <div className="wrapper relative z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass border border-white/5 mb-8">
            <p className="uppercase tracking-[0.3em] text-[10px] md:text-xs font-semibold text-white/50">
              VERIFIED SUCCESS STORIES
            </p>
          </div>
          <h1 className="heading mb-8 italic">CLIENT <br /> TESTIMONIALS</h1>
          <p className="text-white/40 mt-6 text-base md:text-lg font-light leading-relaxed">
            Voices of partnership. We take pride in the transformative digital systems 
            we build alongside our global clients.
          </p>
        </div>

        {/* List Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mx-auto">
          {reviews.map((item: any) => (
            <article
              key={item._id}
              className="group glass p-10 rounded-2xl transition-all duration-500 hover:bg-white/[0.05] flex flex-col items-center text-center relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              {/* Profile */}
              <div className="flex flex-col items-center gap-4 mb-8">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white/10 p-1 bg-white/5">
                  <Image
                    src={item.image || "/assets/images/default-avatar.png"}
                    alt={item.name}
                    width={64}
                    height={64}
                    className="rounded-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                  />
                </div>
                <div>
                  <h3 className="text-base font-bold tracking-tight">{item.name}</h3>
                  <p className="text-[10px] tracking-[0.2em] font-bold text-white/30 uppercase mt-1">{item.title}</p>
                </div>
              </div>

              {/* Quote */}
              <blockquote className="text-base md:text-lg font-light italic leading-relaxed text-white/80">
                &ldquo;{item.quote}&rdquo;
              </blockquote>
            </article>
          ))}
        </div>

        {/* AdSense Placement */}
        <AdSense className="mt-16" />

        {/* Empty */}
        {reviews.length === 0 && (
          <div className="glass p-20 rounded-2xl text-center border-dashed border-white/10">
            <p className="text-white/40 font-light italic">
              Our success stories are being documented. Check back soon for new partnerships.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
