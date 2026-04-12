import Image from "next/image";

export default function Promotion() {
  return (
    <section
      id="promotion"
      className="wrapper py-20 relative overflow-hidden"
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full lighting-radial opacity-10 pointer-events-none" />
      
      <a
        href="https://hostinger.com?REFERRALCODE=ACSTUDIO"
        target="_blank"
        rel="noopener noreferrer"
        className="block glass p-2 rounded-2xl overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:bg-white/5 border border-white/5 hover:border-white/10"
      >
        <div className="relative w-full aspect-[4/1] md:aspect-[8/1] rounded-xl overflow-hidden">
          <Image
            src="/assets/hotinger.webp"
            alt="Hostinger promotion"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-white/5 group-hover:bg-transparent transition-colors" />
        </div>
      </a>
    </section>
  );
}
