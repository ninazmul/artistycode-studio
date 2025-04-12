import { ContactUs } from "@/components/ContactUs";

export default async function ContactPage() {
  return (
    <main className="pb-20 bg-black-100 px-4 md:px-10 text-white">
      {/* Header Section */}
      <section className="px-6 md:px-16 py-20 text-center border-b border-gray-800">
        <h1 className="heading text-center mb-8">
          Get in <span className="text-purple">Touch</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
          We’re here to collaborate, innovate, and help you succeed. Reach out
          to Artistycode Studio — let’s build the future together.
        </p>
      </section>

      {/* Info Section */}
      <section className="px-6 md:px-16 py-20 space-y-6 border-b border-gray-800">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 text-gray-200">
          <div>
            <h2 className="text-xl font-semibold mb-2">Head Office</h2>
            <p className="text-gray-400">
              Dhaka, Bangladesh <br />
              (Remote & Global Operations)
            </p>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2">Contact</h2>
            <p className="text-gray-400">
              Email: contact@artistycode.studio <br />
              Phone: +880 1580845746
            </p>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2">Business Hours</h2>
            <p className="text-gray-400">
              Monday – Saturday: 9:00 AM – 8:00 PM <br />
              Sunday: Closed
            </p>
          </div>
        </div>
      </section>
      <section className="py-20 space-y-6">
        <ContactUs />
      </section>
    </main>
  );
}
