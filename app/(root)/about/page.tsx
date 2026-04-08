import type { Metadata } from "next";
import Link from "next/link";
import MagicButton from "@/components/MagicButton";
import { FaLocationArrow } from "react-icons/fa6";

export const metadata: Metadata = {
  title: "About Us | ArtistyCode Studio",
  description:
    "ArtistyCode Studio builds scalable web, mobile, and software solutions for modern businesses.",
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
            We design and build high-performance digital products that help
            businesses scale with confidence.
          </p>
        </div>

        {/* Core Sections */}
        <div className="mt-20 space-y-16">
          {/* Who We Are */}
          <div>
            <h2 className="text-xl md:text-2xl font-medium">Who We Are</h2>
            <p className="text-white/60 mt-4 leading-relaxed">
              ArtistyCode Studio is a full-stack software company focused on
              building scalable digital platforms. We combine engineering,
              design, and product strategy to deliver solutions that are not
              only functional but built for real-world performance.
            </p>
          </div>

          {/* Founder */}
          <div>
            <h2 className="text-xl md:text-2xl font-medium">Founder</h2>
            <p className="text-white/60 mt-4 leading-relaxed">
              Founded by <strong>N.I. Nazmul</strong>, a full-stack developer
              and product-focused builder, ArtistyCode Studio was created with a
              clear vision: to bridge the gap between technical execution and
              real business impact. With experience across web platforms,
              scalable systems, and user-focused design, the studio delivers
              solutions that go beyond code.
            </p>
          </div>

          {/* What We Do */}
          <div>
            <h2 className="text-xl md:text-2xl font-medium">What We Do</h2>
            <ul className="mt-4 space-y-2 text-white/60">
              <li>• High-performance web applications (MERN, Next.js)</li>
              <li>• Scalable mobile apps (React Native, Flutter)</li>
              <li>• Custom CMS & e-commerce platforms</li>
              <li>• Game & interactive digital products</li>
              <li>• API systems and backend architecture</li>
            </ul>
          </div>

          {/* Process */}
          <div>
            <h2 className="text-xl md:text-2xl font-medium">How We Work</h2>
            <ul className="mt-4 space-y-2 text-white/60">
              <li>• Strategy-first approach to reduce risk</li>
              <li>• Agile development with fast iterations</li>
              <li>• Clean, scalable architecture</li>
              <li>• Continuous feedback and improvement</li>
            </ul>
          </div>

          {/* Technologies */}
          <div>
            <h2 className="text-xl md:text-2xl font-medium">Technologies</h2>
            <p className="text-white/60 mt-4">
              React, Next.js, Node.js, Express, MongoDB, Laravel, Flutter,
              Tailwind CSS, TypeScript, Firebase, and modern cloud systems.
            </p>
          </div>

          {/* Proof / Metrics */}
          <div>
            <h2 className="text-xl md:text-2xl font-medium">Our Impact</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-6 text-center">
              <div>
                <p className="text-2xl font-semibold">80+</p>
                <p className="text-white/50 text-sm">Projects Built</p>
              </div>
              <div>
                <p className="text-2xl font-semibold">30+</p>
                <p className="text-white/50 text-sm">Clients</p>
              </div>
              <div>
                <p className="text-2xl font-semibold">5+</p>
                <p className="text-white/50 text-sm">Technologies</p>
              </div>
              <div>
                <p className="text-2xl font-semibold">100%</p>
                <p className="text-white/50 text-sm">Commitment</p>
              </div>
            </div>
          </div>

          {/* Vision */}
          <div>
            <h2 className="text-xl md:text-2xl font-medium">Vision</h2>
            <p className="text-white/60 mt-4">
              To build globally competitive digital products that are scalable,
              efficient, and meaningful—helping businesses grow through
              technology.
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
