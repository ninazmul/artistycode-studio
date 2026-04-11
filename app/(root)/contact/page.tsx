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
        url: "/assets/og-image.png",
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
    images: ["/assets/og-image.png"],
  },
};

export default function ContactPage() {
  return (
    <main className="bg-black-100 text-white relative overflow-hidden py-24 lg:py-32">
      {/* Premium Lighting Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[50%] h-[50%] lighting-radial opacity-30" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full lighting-radial opacity-10" />
      </div>

      <div className="wrapper relative z-10 text-center">
        {/* Hero */}
        <section className="max-w-4xl mx-auto mb-24">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass border border-white/5 mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>
            <p className="uppercase tracking-[0.3em] text-[10px] md:text-xs font-semibold text-white/50">
              AVAILABLE FOR COLLABORATION
            </p>
          </div>
          <h1 className="heading mb-8 italic">LET&apos;S ENGINEER <br /> YOUR NEXT PRODUCT</h1>
          <p className="text-white/40 mt-6 text-base md:text-xl font-light leading-relaxed max-w-2xl mx-auto">
            Have a project, idea, or vision? Reach out and let&apos;s 
            turn it into a high-performance reality. We specialize in 
            enterprise-grade systems for global scale.
          </p>
        </section>

        {/* Info Grid */}
        <section className="grid md:grid-cols-3 gap-8 mb-24 max-w-5xl mx-auto">
          {[
            { 
              label: "LOCATION", 
              val: "Dhaka, Bangladesh", 
              desc: "Engineering for the world" 
            },
            { 
              label: "CONTACT", 
              val: "contact@artistycode.studio", 
              link: "mailto:contact@artistycode.studio",
              desc: "+880 1580845746" 
            },
            { 
              label: "AVAILABILITY", 
              val: "24h Response Time", 
              desc: "Monday — Friday" 
            }
          ].map((item, i) => (
            <div key={i} className="glass p-10 rounded-[2.5rem] transition-all duration-500 hover:bg-white/[0.05] flex flex-col items-center">
              <p className="text-[10px] tracking-[0.3em] font-bold text-white/30 uppercase mb-4">{item.label}</p>
              {item.link ? (
                <a href={item.link} className="text-base md:text-lg font-bold hover:text-shine transition-all truncate w-full">
                  {item.val}
                </a>
              ) : (
                <p className="text-base md:text-lg font-bold">{item.val}</p>
              )}
              <p className="text-xs text-white/40 mt-2 font-light">{item.desc}</p>
            </div>
          ))}
        </section>

        {/* Form Container */}
        <section className="glass p-10 md:p-20 rounded-[3.5rem] max-w-4xl mx-auto border-t border-white/10 shadow-2xl relative overflow-hidden bg-white/[0.01]">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          <h2 className="text-2xl md:text-4xl font-bold tracking-tight mb-12 italic">PROJECT INQUIRY</h2>
          <ContactUs />
        </section>
      </div>
    </main>
  );
}
