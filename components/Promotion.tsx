import Image from "next/image";

export default function Promotion() {
  return (
    <section
      id="promotion"
      className="w-full flex justify-center items-center pb-10"
    >
      <a
        href="https://hostinger.com?REFERRALCODE=ACSTUDIO"
        target="_blank"
        rel="noopener noreferrer"
        className="w-full max-w-7xl"
      >
        <div className="relative w-full h-14 md:h-20 lg:h-40">
          <Image
            src="/assets/hotinger.webp"
            alt="Hostinger promotion"
            fill
            className="object-fit rounded-2xl"
            priority
          />
        </div>
      </a>
    </section>
  );
}
