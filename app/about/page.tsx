"use client";

import MagicButton from "@/components/MagicButton";
import Head from "next/head";
import Link from "next/link";
import { FaLocationArrow } from "react-icons/fa6";

const Page = () => {
  return (
    <>
      <Head>
        <title>About Us | Artistycode Studio</title>
        <meta
          name="description"
          content="Artistycode Studio is a global software company offering cutting-edge web, mobile, and game development services using MERN, Laravel, Flutter, React Native, WordPress and more."
        />
        <meta
          name="keywords"
          content="Artistycode Studio, software company, MERN stack, Laravel, React Native, Flutter, WordPress, web development, mobile app development, game development, global tech studio"
        />
        <meta name="author" content="Artistycode Studio" />
        <meta property="og:title" content="About Us | Artistycode Studio" />
        <meta
          property="og:description"
          content="We are a future-driven software company building powerful web, mobile, and gaming platforms with a global footprint. Learn more about Artistycode Studio."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://artistycodestudio.com/about" />
        <meta property="og:image" content="/logo.png" />
      </Head>

      <div className="py-20 bg-black-100 px-4 md:px-10 text-white">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="heading text-center mb-8">
            About <span className="text-purple">Artistycode Studio</span>
          </h1>

          <p className="text-white-200 text-base md:text-lg leading-relaxed max-w-4xl mx-auto">
            <strong>Artistycode Studio</strong> is a future-driven global
            software company committed to delivering cutting-edge digital
            solutions. From full-stack web platforms to mobile apps and games,
            we empower businesses and innovators worldwide with modern,
            scalable, and impactful technology.
          </p>

          <div className="mt-16 text-left space-y-12">
            <section>
              <h2 className="text-2xl font-semibold text-purple mb-3">
                Who We Are
              </h2>
              <p className="text-white-200">
                Founded by <strong>N.I. Nazmul</strong>, a visionary full-stack
                developer and creative technologist, Artistycode Studio brings
                together a global team of passionate engineers, designers, and
                strategists. Our goal is to become one of the
                <strong> top-ranked software companies</strong> worldwide by
                building reliable, innovative, and user-first solutions across
                industries.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-purple mb-3">
                Our Services
              </h2>
              <ul className="list-disc list-inside text-white-200 space-y-2">
                <li>
                  <strong>Web Development:</strong> Full-stack apps using MERN,
                  Laravel, and more.
                </li>
                <li>
                  <strong>Mobile App Development:</strong> Native &
                  cross-platform apps using React Native and Flutter.
                </li>
                <li>
                  <strong>CMS & E-commerce Platforms:</strong> Custom Laravel &
                  WordPress solutions with secure payments.
                </li>
                <li>
                  <strong>Game Development:</strong> Engaging 2D browser games
                  for education, marketing, and entertainment.
                </li>
                <li>
                  <strong>Learning Management Systems (LMS):</strong> Secure
                  platforms with admin control, user analytics, and manual
                  payments.
                </li>
                <li>
                  <strong>Maintenance & Optimization:</strong> Ongoing support,
                  security updates, and performance tuning.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-purple mb-3">
                Technologies We Use
              </h2>
              <p className="text-white-200">
                We build solutions with the most trusted technologies in the
                industry:
                <br />
                <span className="italic">
                  React, Next.js, Node.js, Express, MongoDB, Redis, React
                  Native, Flutter, Laravel, PHP, WordPress, Tailwind CSS,
                  TypeScript, Firebase, MySQL, Stripe, SSLCommerz, and more.
                </span>
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-purple mb-3">
                Why Choose Us
              </h2>
              <ul className="list-disc list-inside text-white-200 space-y-2">
                <li>Client-focused solutions tailored to business goals</li>
                <li>Agile development with fast iteration and delivery</li>
                <li>Creative UI/UX with responsive, mobile-first design</li>
                <li>Transparent communication and long-term partnerships</li>
                <li>SEO, speed, security, and performance best practices</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-purple mb-3">
                Our Vision
              </h2>
              <p className="text-white-200">
                To become a globally recognized, top-ranked software company
                delivering impactful digital experiences through modern
                technology, creative design, and innovation.
              </p>
            </section>
          </div>

          <div className="text-center mt-20">
            <Link href="/contact">
              <MagicButton
                title="Let’s Work Together"
                icon={<FaLocationArrow />}
                position="right"
              />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
