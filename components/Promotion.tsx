import Image from "next/image";
import hostingerImg from "../public/assets/hostinger.png";

export default function Promotion() {
  return (
    <main className="flex justify-center items-center py-8">
      <a
        href="https://hostinger.com?REFERRALCODE=ACSTUDIO"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Image
          src={hostingerImg}
          alt="Hostinger promotion"
          width={500}
          height={100}
          className="object-cover w-full h-auto"
          priority
        />
      </a>
    </main>
  );
}
