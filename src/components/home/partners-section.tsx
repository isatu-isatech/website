"use client";

import { TopographyTexture } from "@/components/texture/topography";
import { OptimizedImage } from "@/components/common";

const homepagePartners = [
  {
    src: "/assets/logos/isatu.png",
    alt: "ISATU Logo",
    width: 500,
    height: 500,
    className: "h-18.75 w-18.75 lg:h-25 lg:w-25",
    sizes: "(min-width: 1040px) 100px, 75px",
  },
  {
    src: "/assets/logos/kwadra-tbi.png",
    alt: "KWADRA TBI Logo",
    width: 500,
    height: 500,
    className: "h-18.75 w-18.75 lg:h-25 lg:w-25",
    sizes: "(min-width: 1040px) 100px, 75px",
  },
  {
    src: "/assets/logos/umwad.png",
    alt: "UMWAD Logo",
    width: 816,
    height: 690,
    className: "h-18.75 w-22.5 lg:h-25 lg:w-30",
    sizes: "(min-width: 1040px) 120px, 90px",
  },
  {
    src: "/assets/logos/cci.png",
    alt: "CCI Logo",
    width: 500,
    height: 500,
    className: "h-18.75 w-18.75 lg:h-25 lg:w-25",
    sizes: "(min-width: 1040px) 100px, 75px",
  },
];

export function HomepagePartnersSection() {
  return (
    <section
      className="relative flex w-full flex-col items-center justify-center px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20"
      id="partners"
    >
      <TopographyTexture
        color={"#dfdfdf"}
        className="absolute top-0 left-0 -z-1 h-full w-full opacity-30"
      />
      <div className="flex w-full max-w-7xl flex-col items-center justify-center gap-6 py-16 lg:py-28">
        <h2 className="text-secondary-dark dark:text-secondary">
          Our Partners
        </h2>
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
