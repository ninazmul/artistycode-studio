import Image from "next/image";
import { getAllReviews } from "@/lib/actions/review.actions";

export default async function Page() {
  const data = await getAllReviews();
  const reviews = data.filter((r: any) => r.verified);

  return (
    <section className="bg-black text-white px-6">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-3xl md:text-5xl font-semibold">
          Client Testimonials
        </h1>
        <p className="text-white/60 mt-4 text-sm">
          Real feedback from people we’ve worked with
        </p>
      </div>

      {/* List */}
      <div className="max-w-6xl mx-auto my-16 space-y-10">
        {reviews.map((item: any) => (
          <div
            key={item._id}
            className="border border-white/20 rounded-xl p-6 hover:border-white/30 transition"
          >
            {/* Quote */}
            <p className="text-white/80 leading-relaxed text-sm md:text-base">
              “{item.quote}”
            </p>

            {/* User */}
            <div className="flex items-center mt-6 gap-4">
              <Image
                src={item.image || "/assets/images/default-avatar.png"}
                alt={item.name}
                width={50}
                height={50}
                className="rounded-full object-cover"
              />

              <div>
                <p className="text-sm font-medium">{item.name}</p>
                <p className="text-xs text-white/50">{item.title}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty */}
      {reviews.length === 0 && (
        <p className="text-center text-white/50 mt-20">
          No testimonials available.
        </p>
      )}
    </section>
  );
}
