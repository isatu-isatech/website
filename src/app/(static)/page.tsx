import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <div className="flex w-full flex-col items-center justify-center">
        <StatsSection />
        <AboutSection />
        <PartnersSection />
        <KwadraSection />
      </div>
    </>
  );
}

function StatsSection() {
  const stats = [
    { quantity: "5+", description: "Startups Established" },
    { quantity: "25+", description: "Awards Earned" },
    { quantity: "50+", description: "Events Participated" },
  ];

  return (
    <>
      <div className="flex w-full max-w-7xl flex-col px-6 py-16 lg:px-8 xl:px-16">
        <div className="flex w-full flex-wrap items-center justify-center gap-y-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="flex w-full flex-col items-center justify-center sm:w-1/2 md:w-1/3"
            >
              <h1>{stat.quantity}</h1>
              <h3>{stat.description}</h3>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function AboutSection() {
  return (
    <>
      <div className="flex w-full max-w-7xl flex-col px-6 py-16 lg:px-8 xl:px-16">
        <div className="flex w-full flex-col items-center justify-center gap-6 md:flex-row-reverse">
          <div className="flex w-full items-center justify-center md:w-1/2">
            <Image
              src="/assets/isatech-icon-dark.svg"
              alt="ISATech Icon"
              width={0}
              height={0}
              className="h-[150px] w-[100px] md:h-[270px] md:w-[185px]"
            />
          </div>
          <div className="flex w-full flex-col items-center justify-center gap-4 md:w-1/2 md:gap-6">
            <div className="flex w-full flex-col items-center justify-center gap-2 text-center md:items-end md:text-end">
              <h2>What is ISATech Society?</h2>
              <h5>
                ISATech is a special interest organization operating under the
                Intellectual Property Management Office (IPMO) and the Kwadra
                Technology Business Incubator (Kwadra-TBI).
              </h5>
            </div>
            <Button asChild>
              <Link href="/">Learn More</Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

function PartnersSection() {
  const partners = [
    {
      src: "/assets/isatu-logo.png",
      alt: "About Us",
      width: 800,
      height: 800,
      className: "h-[75px] w-[75px] lg:h-[100px] lg:w-[100px]",
    },
    {
      src: "/assets/kwadra-tbi-logo-dark.png",
      alt: "About Us",
      width: 1080,
      height: 1080,
      className: "h-[75px] w-[75px] lg:h-[100px] lg:w-[100px]",
    },
    {
      src: "/assets/umwad-logo-dark.png",
      alt: "About Us",
      width: 1632,
      height: 1381,
      className: "h-[75px] w-[90px] lg:h-[100px] lg:w-[120px]",
    },
    {
      src: "/assets/cci-sc-logo.png",
      alt: "About Us",
      width: 1080,
      height: 1080,
      className: "h-[75px] w-[75px] lg:h-[100px] lg:w-[100px]",
    },
  ];

  return (
    <>
      <div className="flex w-full max-w-7xl flex-col px-6 py-16 lg:px-8 xl:px-16">
        <div className="flex w-full flex-col items-center justify-center gap-6">
          <h3 className="text-primary">Our Partners</h3>
          <div className="flex w-full flex-wrap items-center justify-center gap-y-10 px-12 sm:justify-between md:justify-center md:gap-20">
            {partners.map((partner, key) => (
              <div className="flex w-1/2 justify-center sm:w-auto" key={key}>
                <Image
                  src={partner.src}
                  alt={partner.alt}
                  width={partner.width}
                  height={partner.height}
                  className={partner.className}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

function KwadraSection() {
  return (
    <>
      <div className="flex w-full max-w-7xl flex-col px-6 py-16 lg:px-8 xl:px-16">
        <div className="flex w-full flex-col items-center justify-center gap-6 md:flex-row">
          <div className="flex w-full items-center justify-center md:w-1/2">
            <Image
              src="/assets/kwadra-tbi-logo-dark.png"
              alt="ISATech Icon"
              width={1080}
              height={1080}
              className="h-[150px] w-[150px] md:h-[290px] md:w-[290px]"
            />
          </div>
          <div className="flex w-full flex-col items-center justify-center gap-4 md:w-1/2 md:gap-6">
            <div className="flex w-full flex-col items-center justify-center gap-2 text-center md:items-start md:text-start">
              <h2>What is Kwadra-TBI?</h2>
              <h5>
                The Kwadra-TBI functions as a technology business incubator,
                aiming to commercialize university research into startups and to
                nurture deep technology startups.
              </h5>
            </div>
            <Button asChild>
              <Link href="/">Learn More</Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
