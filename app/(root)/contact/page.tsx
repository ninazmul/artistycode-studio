import { ContactUs } from "@/components/ContactUs";

export default function ContactPage() {
  return (
    <main className="bg-black text-white px-6">
      {/* Hero */}
      <section className="text-center max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-5xl font-semibold">
          Let’s Build Something Great
        </h1>
        <p className="text-white/60 mt-6 text-sm md:text-base">
          Have a project, idea, or collaboration in mind? Reach out and let’s
          turn it into a real product.
        </p>
      </section>

      {/* Info */}
      <section className="mt-16 border-y border-white/10 py-10">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8 text-sm text-white/60">
          <div>
            <p className="font-medium text-white mb-1">Location</p>
            <p>Dhaka, Bangladesh</p>
          </div>
          <div>
            <p className="font-medium text-white mb-1">Contact</p>
            <p>contact@artistycode.studio</p>
            <p>+880 1580845746</p>
          </div>
          <div>
            <p className="font-medium text-white mb-1">Response Time</p>
            <p>Usually within 24 hours</p>
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
