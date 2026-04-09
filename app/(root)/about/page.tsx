import type { Metadata } from "next";
import Link from "next/link";
import MagicButton from "@/components/MagicButton";
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
    <section className="bg-black text-white px-6 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Hero */}
        <div className="text-center">
          <h1 className="text-3xl md:text-5xl font-semibold">
            About ArtistyCode Studio
          </h1>
          <p className="text-white/60 mt-6 max-w-2xl mx-auto text-sm md:text-base">
            We craft enterprise-grade digital products that empower businesses
            to scale confidently. From web and mobile apps to cloud-native
            platforms, our solutions are engineered for performance, security,
            and long-term growth.
          </p>
        </div>

        {/* Core Sections */}
        <div className="mt-20 space-y-16">
          {/* Who We Are */}
          <div>
            <h2 className="text-xl md:text-2xl font-medium">Who We Are</h2>
            <p className="text-white/60 mt-4 leading-relaxed">
              ArtistyCode Studio is a full-stack software company dedicated to
              building scalable, future-ready digital platforms. Our team
              combines engineering precision, design clarity, and product
              strategy to deliver solutions that are not only functional but
              also optimized for real-world performance and user trust.
            </p>
          </div>

          {/* Founder */}
          <div>
            <h2 className="text-xl md:text-2xl font-medium">Founder</h2>
            <p className="text-white/60 mt-4 leading-relaxed">
              Founded by <strong>N.I. Nazmul</strong>, a visionary full-stack
              developer and product architect, ArtistyCode Studio was created to
              bridge the gap between technical execution and business impact.
              With expertise in{" "}
              <em>
                Next.js, MERN stack, scalable cloud systems, and UI/UX strategy
              </em>
              , Nazmul has led projects across fintech, healthcare, e-commerce,
              and enterprise sectors—delivering solutions that inspire trust and
              drive measurable growth.
            </p>
          </div>

          {/* What We Do */}
          <div>
            <h2 className="text-xl md:text-2xl font-medium">What We Do</h2>
            <ul className="mt-4 space-y-2 text-white/60">
              <li>• Enterprise-grade web applications (MERN, Next.js)</li>
              <li>• Scalable mobile apps (React Native, Flutter)</li>
              <li>• Custom CMS & e-commerce platforms</li>
              <li>• Interactive games & digital experiences</li>
              <li>
                • API systems, backend architecture & cloud-native deployments
              </li>
            </ul>
          </div>

          {/* Process */}
          <div>
            <h2 className="text-xl md:text-2xl font-medium">How We Work</h2>
            <ul className="mt-4 space-y-2 text-white/60">
              <li>• Strategy-first approach to reduce risk</li>
              <li>• Agile development with rapid iterations</li>
              <li>• Clean, scalable architecture with strong typing</li>
              <li>• Continuous feedback, testing, and improvement</li>
              <li>• Accessibility and performance as core principles</li>
            </ul>
          </div>

          {/* Technologies */}
          <div>
            <h2 className="text-xl md:text-2xl font-medium">Technologies</h2>
            <p className="text-white/60 mt-4">
              React, Next.js, Node.js, Express, MongoDB, TypeScript, Tailwind
              CSS, Firebase, Flutter, Laravel, and modern cloud systems (AWS,
              Azure, Vercel). We engineer solutions with strong typing,
              maintainable schemas, and scalable infrastructure.
            </p>
          </div>

          {/* Proof / Metrics */}
          <div>
            <h2 className="text-xl md:text-2xl font-medium">Our Impact</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-6 text-center">
              <div>
                <p className="text-2xl font-semibold">80+</p>
                <p className="text-white/50 text-sm">Projects Delivered</p>
              </div>
              <div>
                <p className="text-2xl font-semibold">30+</p>
                <p className="text-white/50 text-sm">Global Clients</p>
              </div>
              <div>
                <p className="text-2xl font-semibold">10+</p>
                <p className="text-white/50 text-sm">Industries Served</p>
              </div>
              <div>
                <p className="text-2xl font-semibold">100%</p>
                <p className="text-white/50 text-sm">
                  Commitment to Excellence
                </p>
              </div>
            </div>
          </div>

          {/* Vision */}
          <div>
            <h2 className="text-xl md:text-2xl font-medium">Vision</h2>
            <p className="text-white/60 mt-4">
              Our vision is to build globally competitive digital products that
              are scalable, efficient, and meaningful—empowering businesses to
              thrive in the era of digital transformation. We aim to set new
              standards in precision engineering, luxury-grade branding, and
              user trust.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="flex flex-col items-center mt-24 text-center">
          <p className="text-white/60 mb-6 max-w-md">
            Have an idea or project in mind? Let’s build something impactful
            together.
          </p>

          <Link href="/contact">
            <MagicButton
              title="Start a Project"
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
