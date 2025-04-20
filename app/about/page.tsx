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
        <meta property="og:image" content="/public/assets/images/logo.png" />
      </Head>

      <div className="py-20 bg-black-100 px-4 md:px-10 text-white">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="heading text-center mb-8">
            About <span className="text-purple">Artistycode Studio</span>
          </h1>

          <p className="text-white-200 text-base md:text-lg leading-relaxed max-w-4xl mx-auto">
            <strong>Artistycode Studio</strong> is a cutting-edge, globally
            recognized software development company focused on creating powerful
            web, mobile, and game solutions. By combining innovation, expertise,
            and a deep understanding of technology, we craft scalable and
            transformative digital experiences for businesses worldwide. Our
            full-stack team leverages the latest technologies to shape the
            future of digital platforms.
          </p>

          <div className="mt-16 text-left space-y-12">
            <section>
              <h2 className="text-2xl font-semibold text-purple mb-3">
                Who We Are
              </h2>
              <p className="text-white-200">
                <strong>
                  Founded by N.I. Nazmul (Full-Stack Developer | Visionary
                  Technologist) and Shabur Khan (Computer Engineer & Web
                  Developer)
                </strong>
                , Artistycode Studio is a full-stack software development studio
                that brings together highly skilled developers and technology
                experts across a wide range of fields. Our team specializes in
                web and mobile app development, game design, UI/UX, cloud
                computing, machine learning, and more. We are committed to
                building scalable, reliable, and user-centric digital platforms
                that drive business growth and innovation.
                <br />
                With a passion for technology and a commitment to excellence, we
                aim to be one of the{" "}
                <strong>top-ranked software companies</strong> worldwide,
                providing transformative solutions to clients in various
                industries.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-purple mb-3">
                Our Services
              </h2>
              <ul className="list-disc list-inside text-white-200 space-y-2">
                <li>
                  <strong>Web Development:</strong> Full-stack solutions using
                  MERN, Laravel, and custom frameworks.
                </li>
                <li>
                  <strong>Mobile App Development:</strong> Cross-platform and
                  native apps that engage users using React Native and Flutter.
                </li>
                <li>
                  <strong>CMS & E-commerce Platforms:</strong> Custom Laravel &
                  WordPress solutions designed for scalability and security.
                </li>
                <li>
                  <strong>Game Development:</strong> Engaging and educational 2D
                  games for marketing, entertainment, and education.
                </li>
                <li>
                  <strong>Learning Management Systems (LMS):</strong> Secure,
                  user-friendly platforms for online learning with admin
                  controls and payment integration.
                </li>
                <li>
                  <strong>Maintenance & Optimization:</strong> Continuous
                  support and performance improvements to keep your platform
                  running smoothly.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-purple mb-3">
                Meet Our Experts
              </h2>
              <p className="text-white-200">
                Our team consists of highly skilled professionals who excel in
                various domains:
              </p>
              <ul className="list-disc list-inside text-white-200 space-y-2">
                <li>
                  <strong>Full-Stack Development:</strong> Expertise in MERN,
                  Laravel, and custom solutions for building robust platforms.
                </li>
                <li>
                  <strong>Mobile App Development:</strong> Native and
                  cross-platform apps using React Native, Flutter, and
                  Swift/Java for optimal performance.
                </li>
                <li>
                  <strong>UI/UX Design:</strong> Creative design solutions
                  focused on intuitive, user-friendly interfaces and
                  experiences.
                </li>
                <li>
                  <strong>Game Development:</strong> Game designers and
                  developers skilled in creating interactive, educational, and
                  entertaining 2D browser games.
                </li>
                <li>
                  <strong>AI & Machine Learning:</strong> Innovators utilizing
                  AI and ML for smart, data-driven solutions.
                </li>
                <li>
                  <strong>Cloud Computing & DevOps:</strong> Advanced knowledge
                  of cloud services, containerization, and deployment
                  strategies.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-purple mb-3">
                Technologies We Use
              </h2>
              <p className="text-white-200">
                We leverage the latest and most reliable technologies to deliver
                innovative, scalable, and secure solutions:
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
                <li>
                  Custom solutions designed to meet your business objectives and
                  goals.
                </li>
                <li>
                  Agile development for fast iteration and deployment without
                  compromising quality.
                </li>
                <li>
                  Expert UI/UX design focusing on user experience and
                  mobile-first, responsive designs.
                </li>
                <li>
                  Transparent, ongoing communication ensuring client
                  satisfaction at every step.
                </li>
                <li>
                  Proven track record in optimizing performance, security, and
                  SEO for maximum impact.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-purple mb-3">
                Our Vision
              </h2>
              <p className="text-white-200">
                Our vision is to become a globally recognized leader in software
                development, delivering innovative and impactful digital
                experiences that shape the future of businesses, industries, and
                communities worldwide. We aspire to be the partner of choice for
                companies seeking scalable, secure, and high-performance
                technology solutions.
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
