import type { Metadata } from "next";
import { ContactUs } from "@/components/ContactUs";

export const metadata: Metadata = {
  title: "Contact Us | ArtistyCode Studio",
  description:
    "Get in touch with ArtistyCode Studio — a premium full-stack software company in Dhaka, Bangladesh. Reach out for web development, mobile apps, cloud solutions, and digital transformation projects.",
  keywords: [
    "ArtistyCode Studio contact",
    "web development Bangladesh",
    "Next.js agency contact",
    "MERN stack developers",
    "mobile app development Dhaka",
    "software company Bangladesh",
    "cloud solutions contact",
    "UI/UX design studio",
    "digital transformation partner",
  ],
  openGraph: {
    title: "Contact Us | ArtistyCode Studio",
    description:
      "Have a project or idea? Contact ArtistyCode Studio to build scalable web, mobile, and cloud solutions.",
    url: "https://artistycode.com/contact",
    siteName: "ArtistyCode Studio",
    images: [
      {
        url: "/og-contact.jpg",
        width: 1200,
        height: 630,
        alt: "Contact ArtistyCode Studio",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Us | ArtistyCode Studio",
    description:
      "Reach out to ArtistyCode Studio for premium web, mobile, and cloud solutions.",
    images: ["/og-contact.jpg"],
  },
};

export default function ContactPage() {
  return (
    <main className="bg-black text-white px-6 py-8">
      {/* Hero */}
      <section className="text-center max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-5xl font-semibold">
          Let’s Build Something Great
        </h1>
        <p className="text-white/60 mt-6 text-sm md:text-base">
          Have a project, idea, or collaboration in mind? Reach out and let’s
          turn it into a real product. Whether it’s a{" "}
          <strong>web application, mobile app, or cloud-native platform</strong>
          , we’re here to help you scale with confidence.
        </p>
      </section>

      {/* Info */}
      <section className="mt-16 border-y border-white/10 py-10">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 text-sm text-white/60">
          <div>
            <p className="font-medium text-white mb-1">Location</p>
            <p>Dhaka, Bangladesh</p>
            <p className="mt-2">
              Serving clients worldwide with a focus on{" "}
              <em>enterprise-grade digital solutions</em>.
            </p>
          </div>
          <div>
            <p className="font-medium text-white mb-1">Contact</p>
            <p>
              <a
                href="mailto:contact@artistycode.studio"
                className="underline hover:text-white"
              >
                contact@artistycode.studio
              </a>
            </p>
            <p>
              <a
                href="tel:+8801580845746"
                className="underline hover:text-white"
              >
                +880 1580845746
              </a>
            </p>
          </div>
          <div>
            <p className="font-medium text-white mb-1">Response Time</p>
            <p>Usually within 24 hours</p>
            <p className="mt-2">
              Dedicated to clear communication and fast collaboration.
            </p>
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="mt-16">
        <ContactUs />
      </section>
    </main>
  );
}
