"use client";

import { TopographyTexture } from "@/components/texture/topography";
import { OptimizedImage } from "@/components/common";

const homepagePartners = [
  {
    src: "/assets/logos/isatu.png",
    alt: "ISATU Logo",
    width: 500,
    height: 500,
    className: "h-[75px] w-[75px] lg:h-[100px] lg:w-[100px]",
    sizes: "(min-width: 1040px) 100px, 75px",
  },
  {
    src: "/assets/logos/kwadra-tbi.png",
    alt: "KWADRA TBI Logo",
    width: 500,
    height: 500,
    className: "h-[75px] w-[75px] lg:h-[100px] lg:w-[100px]",
    sizes: "(min-width: 1040px) 100px, 75px",
  },
  {
    src: "/assets/logos/umwad.png",
    alt: "UMWAD Logo",
    width: 816,
    height: 690,
    className: "h-[75px] w-[90px] lg:h-[100px] lg:w-[120px]",
    sizes: "(min-width: 1040px) 120px, 90px",
  },
  {
    src: "/assets/logos/cci.png",
    alt: "CCI Logo",
    width: 500,
    height: 500,
    className: "h-[75px] w-[75px] lg:h-[100px] lg:w-[100px]",
    sizes: "(min-width: 1040px) 100px, 75px",
  },
];

export function HomepagePartnersSection() {
  return (
    <section
      className="relative flex w-full flex-col items-center justify-center px-6 lg:px-16"
      id="partners"
    >
      <TopographyTexture
        color={"#dfdfdf"}
        className="absolute top-0 left-0 -z-1 h-full w-full opacity-30"
      />
      <div className="flex w-full max-w-6xl flex-col items-center justify-center gap-6 px-6 py-16 lg:px-8 xl:px-16">
        <h3 className="text-primary">Our Partners</h3>
        <div className="flex w-full flex-wrap items-center justify-center gap-x-10 gap-y-10 md:justify-center md:gap-20">
          {homepagePartners.map((partner, key) => (
            <div className="w-fit justify-center" key={key}>
              <OptimizedImage
                src={partner.src}
                alt={partner.alt}
                width={partner.width}
                height={partner.height}
                className={partner.className}
                sizes={partner.sizes}
                brandPlaceholder
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

