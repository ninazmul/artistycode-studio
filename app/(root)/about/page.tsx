import type { Metadata } from "next";
import Link from "next/link";
import MagicButton from "@/components/MagicButton";
import AdSense from "@/components/AdSense";
import { FaLocationArrow } from "react-icons/fa6";

export const metadata: Metadata = {
  title: "About Us | ArtistyCode Studio",
  description:
    "ArtistyCode Studio is a premium full-stack software company specializing in scalable web, mobile, and cloud solutions. We deliver enterprise-grade platforms with precision, performance, and design excellence.",
  keywords: [
    "ArtistyCode Studio",
    "web development company",
    "Next.js agency",
    "MERN stack development",
    "mobile app development",
    "software solutions Bangladesh",
    "cloud-native platforms",
    "UI/UX design",
    "scalable systems",
    "digital transformation",
  ],
  openGraph: {
    title: "About Us | ArtistyCode Studio",
    description:
      "Discover ArtistyCode Studio — building scalable, enterprise-grade web and mobile solutions with precision and design excellence.",
    url: "https://artistycode.com/about",
    siteName: "ArtistyCode Studio",
    images: [
      {
        url: "/assets/og-image.png",
        width: 1200,
        height: 630,
        alt: "ArtistyCode Studio About Us",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Us | ArtistyCode Studio",
    description:
      "Scalable web, mobile, and software solutions engineered for modern businesses.",
    images: ["/assets/og-image.png"],
  },
};

const Page = () => {
  return (
    <section className="bg-black-100 text-white relative overflow-hidden pt-40 pb-32">
      {/* Premium Lighting Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[60%] h-[60%] lighting-radial opacity-30" />
        <div className="absolute bottom-0 left-0 w-[60%] h-[60%] lighting-radial opacity-20" />
      </div>

      <div className="wrapper relative z-10">
        {/* Hero */}
        <div className="text-center mb-32">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass border border-white/5 mb-8">
            <p className="uppercase tracking-[0.3em] text-[10px] md:text-xs font-semibold text-white/50">
              EST. 2024 · INNOVATION HUB
            </p>
          </div>
          <h1 className="heading mb-8 italic">ABOUT <br /> ARTISTYCODE STUDIO</h1>
          <p className="text-white/40 mt-6 max-w-2xl mx-auto text-base md:text-xl font-light leading-relaxed">
            We architect enterprise-grade digital products that empower businesses
            to scale with confidence. Engineering for performance, security,
            and long-term growth.
          </p>
        </div>

        {/* Core Sections Grid */}
        <div className="grid lg:grid-cols-2 gap-12 mt-20">
          {/* Who We Are */}
          <div className="glass p-10 md:p-12 rounded-2xl transition-all duration-500 hover:bg-white/[0.05]">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-6 italic text-shine">WHO WE ARE</h2>
            <p className="text-white/50 leading-relaxed text-base md:text-lg font-light">
              ArtistyCode Studio is a full-stack engineering firm dedicated to
              building scalable, future-ready digital platforms. Our team
              combines technical precision with luxury branding and product
              strategy to deliver solutions optimized for global user trust.
            </p>
          </div>

          {/* Core Values */}
          <div className="glass p-10 md:p-12 rounded-2xl transition-all duration-500 hover:bg-white/[0.05]">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-6 italic text-shine">CORE VALUES</h2>
            <p className="text-white/50 leading-relaxed text-base md:text-lg font-light">
              Our work is guided by a few uncompromising principles that shape every project.
            </p>
            <ul className="mt-6 space-y-3 text-white/50 font-light">
              <li><strong>Precision</strong> — engineering with exacting standards.</li>
              <li><strong>Clarity</strong> — simple interfaces, clear product decisions.</li>
              <li><strong>Longevity</strong> — solutions built to evolve, not expire.</li>
              <li><strong>Partnership</strong> — we measure success by client outcomes.</li>
            </ul>
          </div>

          {/* What We Do */}
          <div className="glass p-10 md:p-12 rounded-2xl transition-all duration-500 hover:bg-white/[0.05]">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-6 italic text-shine">PRECISION STACK</h2>
            <ul className="space-y-4 text-white/50 font-light">
              <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-white/20" /> Enterprise-grade Web Applications (Next.js, TS)</li>
              <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-white/20" /> Scalable Mobile Systems (React Native)</li>
              <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-white/20" /> Performance Backend & Cloud Architecture</li>
              <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-white/20" /> Strategy-led UI/UX Design Systems</li>
            </ul>
          </div>

          {/* Vision */}
          <div className="glass p-10 md:p-12 rounded-2xl transition-all duration-500 hover:bg-white/[0.05]">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-6 italic text-shine">THE VISION</h2>
            <p className="text-white/50 leading-relaxed text-base md:text-lg font-light">
              Our vision is to define globally competitive digital excellence.
              We aim to set new industry standards in precision engineering,
              minimalist luxury branding, and enduring user trust for the world&apos;s
              most ambitious startups.
            </p>
          </div>
        </div>

        {/* Impact / Metrics */}
        <div className="mt-32 pt-20 border-t border-white/5">
          <h2 className="text-center text-sm font-bold tracking-[0.5em] text-white/30 uppercase mb-20 italic">MISSION STATS</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {[
              { label: "DELIVERED", val: "80+", desc: "Digital Products" },
              { label: "PARTNERS", val: "30+", desc: "Global Clients" },
              { label: "INDUSTRIES", val: "10+", desc: "Niche expertise" },
              { label: "PRECISION", val: "100%", desc: "Commitment" }
            ].map((stat, i) => (
              <div key={i} className="group glass p-8 rounded-2xl transition-all duration-500 hover:bg-white/[0.03]">
                <p className="text-3xl md:text-4xl font-black italic text-shine mb-2">{stat.val}</p>
                <p className="text-[10px] md:text-xs tracking-[0.2em] font-bold text-white/30 uppercase mb-1">{stat.label}</p>
                <p className="text-xs text-white/40 font-light">{stat.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* AdSense Placement */}
        <AdSense className="my-16" />

        {/* CTA Section */}
        <div className="mt-32 glass p-16 rounded-2xl flex flex-col items-center text-center">
          <h3 className="text-2xl md:text-4xl font-bold tracking-tight mb-6 italic">BUILD YOUR LEGACY</h3>
          <p className="text-white/40 mb-10 max-w-md font-light">
            Have an idea or high-impact project? Let’s engineer its potential
            with precision and design excellence.
          </p>

          <Link href="/contact">
            <MagicButton
              title="Start Collaboration"
              icon={<FaLocationArrow />}
              position="right"
            />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Page;
