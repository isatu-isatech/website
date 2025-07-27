"use client";

import {
  ISATechDecorationLeft,
  ISATechDecorationRight,
} from "@/components/assets/decorations";
import PerlinNoiseTexture from "@/components/shaders/perlin";
import { BlobsAnimatedBackground, BlobsConfig } from "@/components/ui/blobs";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselApi,
} from "@/components/ui/carousel";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  RocketIcon,
  TargetIcon,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

const advisers = [
  {
    name: "Carmello V. Ambut, Ed. D.",
    title: "VP for Research and Extension",
    image: "/assets/advisers/adviser-ambut.png",
  },
  {
    name: "Naci John C. Trance",
    title: "Director, Intellectual Property Management Office",
    image: "/assets/advisers/adviser-trance.png",
  },
  {
    name: "Rayjand T. Gellamucho",
    title: "Adviser, ISATech Society",
    image: "/assets/advisers/adviser-gellamucho.png",
  },
  {
    name: "John Joseph L. Tabladillo",
    title: "Co-Adviser, ISATech Society",
    image: "/assets/advisers/adviser-tabladillo.png",
  },
];

const adviserSectionBG: BlobsConfig[] = [
  {
    id: "default-blob-2",
    top: "-10rem",
    left: "-10rem",
    animateX: [0, -30, 0],
    animateY: [0, -40, 0],
    duration: 6,
    colorClass: "bg-secondary/60",
    sizeClass: "h-96 w-96",
    blurClass: "blur-[100px]",
  },
];

function AboutUsHeroSection() {
  return (
    <section
      className="flex w-full items-center justify-center px-6 py-12 md:px-16 md:py-6"
      id="hero"
    >
      <div className="relative flex w-full max-w-6xl items-center justify-between py-8 lg:py-16">
        {/* Text Content */}
        <div className="flex w-full gap-8">
          {/* Divider */}
          <div className="from-primary to-secondary w-0.5 bg-gradient-to-bl"></div>
          {/* Text Container */}
          <div className="">
            <h1>About</h1>
            <h1 className="text-secondary">ISATech Society</h1>
          </div>
        </div>
        {/* 4H Decoration */}
        <div className="hidden w-fit items-center justify-center sm:flex sm:w-full">
          <Image
            src="/assets/isatech-decoration-4h-landscape.png"
            alt="Logo"
            width={280}
            height={330}
            className="h-32 w-fit md:h-64"
          />
        </div>
        {/* ISATech Logo Decoration */}
        <Image
          src="/assets/isatech-decoration-2.svg"
          alt="Logo"
          width={200}
          height={305}
          className="absolute top-0 right-0 -z-1 h-full w-auto"
        />
      </div>
    </section>
  );
}

function AboutUsDescriptionSection() {
  return (
    <section
      className="relative flex w-full items-center justify-center px-6 py-6 md:px-16"
      id="description"
    >
      <div className="absolute flex h-full w-full justify-center">
        {/* Decorations */}
        <ISATechDecorationLeft className="absolute top-0 left-0 hidden h-auto w-fit opacity-10 lg:block" />
        <ISATechDecorationRight className="absolute right-0 bottom-0 h-auto w-fit opacity-10" />
      </div>
      <div className="flex w-full max-w-6xl flex-col items-center">
        {/* Text Content */}
        <div className="bg-accent relative flex w-full max-w-6xl flex-col items-center justify-between gap-4 rounded-3xl px-6 lg:px-20">
          <Image
            src="/assets/isatech-group-photo-1.jpg"
            alt="About Us"
            width={1695}
            height={706}
            className="absolute h-full w-auto rounded-3xl object-cover opacity-30"
          />
          <div className="flex flex-col items-center justify-center gap-4 py-16 lg:py-32">
            <Image
              src="/assets/isatech-icon-dark.svg"
              alt="About Us"
              width={100}
              height={100}
            />
            <p className="body text-center">
              ISATech Society (ISAT U Innovators and Technopreneurs Society) is
              a student-led organization at Iloilo Science and Technology
              University dedicated to nurturing innovation, creativity, and
              entrepreneurship.
            </p>
          </div>
        </div>
        {/* Mission and Vission */}
        <div className="grid w-full max-w-6xl grid-cols-1 gap-6 py-5 lg:grid-cols-2 lg:py-8">
          <div className="flex flex-col justify-start gap-4">
            <TargetIcon size={42} />
            <div className="flex flex-col gap-2">
              <h3>Mission</h3>
              <p className="body text-justify">
                To empower ISAT U students with the mindset, skills, and
                opportunities to become future-ready innovators and
                technopreneurs. We provide a platform for students to grow
                through training, mentorship, and community engagement —
                connecting them with industry leaders and supporting their
                journey from ideas to impactful ventures.
              </p>
            </div>
          </div>
          <div className="flex flex-col justify-start gap-4">
            <RocketIcon size={42} />
            <div className="flex flex-col gap-2">
              <h3>Vision</h3>
              <p className="body text-justify">
                Our Vision is to be the premier platform for students across
                ISAT U system wide, raising awareness about startups, providing
                skills and resources for innovations, producing student
                technopreneurs.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function AboutUsEmpowermentSection() {
  return (
    <section
      className="bg-primary relative flex w-full items-center justify-center px-6 py-14 md:py-6 lg:px-16"
      id="empowerment"
    >
      <PerlinNoiseTexture
        color="#FFAC03"
        className="absolute h-full w-full opacity-20"
      />
      <div className="flex w-full max-w-6xl grid-cols-1 flex-col-reverse gap-6 py-5 lg:grid lg:grid-cols-2 lg:py-8">
        <div className="w-fill flex items-center justify-center">
          <h5 className="text-justify text-white">
            We empower students with practical skills, an entrepreneurial
            mindset, and a passion for innovation. Through workshops, training,
            and mentorship, ISATech fosters idea generation, design thinking,
            and startup development. We connect members with mentors, industry
            experts, and potential investors, while also serving as a gateway to
            ISAT U’s technology business incubator, Kwadra TBI.
          </h5>
        </div>
        <div className="w-fill flex items-center justify-center">
          <Image
            src="/assets/isatech-decoration-aboutus-1.png"
            alt="ISATech Society Reseach Hub Stamp"
            width={436}
            height={346}
            className="z-1 h-full w-auto lg:h-96"
          />
        </div>
      </div>
    </section>
  );
}

function AboutUsInitiativesSection() {
  return (
    <section
      className="flex w-full items-center justify-center px-6 py-14 md:py-6 lg:px-16"
      id="initiatives"
    >
      <div className="flex w-full max-w-6xl grid-cols-1 flex-col gap-6 py-5 lg:grid lg:grid-cols-2 lg:py-8">
        <div className="w-fill flex items-center justify-center">
          <Image
            src="/assets/isatech-decoration-aboutus-2.png"
            alt="Dream Innovate Succeed Sticker"
            width={436}
            height={303}
            className="z-1 h-full w-auto lg:h-80"
          />
        </div>
        <div className="w-fill flex items-center justify-center">
          <h5 className="text-justify">
            We empower students with practical skills, an entrepreneurial
            mindset, and a passion for innovation. Through workshops, training,
            and mentorship, ISATech fosters idea generation, design thinking,
            and startup development. We connect members with mentors, industry
            experts, and potential investors, while also serving as a gateway to
            ISAT U’s technology business incubator, Kwadra TBI.
          </h5>
        </div>
      </div>
    </section>
  );
}

function AboutUsAdvisersSection() {
  const [carouselApi, setCarouselApi] = useState<CarouselApi | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  // Set up carousel state and auto-scroll behavior
  useEffect(() => {
    if (!carouselApi) return;

    // Update the current index and total items when carousel changes
    const updateCarouselState = () => {
      setCurrentIndex(carouselApi.selectedScrollSnap());
      setTotalItems(carouselApi.scrollSnapList().length);
    };

    updateCarouselState();

    // Listen for carousel selection changes
    carouselApi.on("select", updateCarouselState);

    // Automatically scroll to the next item every 12 seconds
    const interval = setInterval(() => {
      carouselApi.scrollTo(
        (carouselApi.selectedScrollSnap() + 1) %
          carouselApi.scrollSnapList().length,
      );
    }, 12000);

    // Cleanup listeners and interval on unmount or carouselApi change
    return () => {
      carouselApi.off("select", updateCarouselState);
      clearInterval(interval);
    };
  }, [carouselApi]);

  const scrollToIndex = (index: number) => {
    carouselApi?.scrollTo(index);
  };

  return (
    <section
      className="relative flex w-full items-center justify-center px-6 py-8 md:py-6 lg:px-16 lg:py-14"
      id="advisers"
    >
      {/* Animated Blobs BG */}
      <BlobsAnimatedBackground
        className="absolute h-full w-full"
        blobs={adviserSectionBG}
      />
      <div className="flex w-full max-w-6xl flex-col gap-6 lg:flex-row">
        <div className="flex w-full flex-col items-center justify-center gap-4 lg:max-w-2xs">
          <h3 className="text-primary">Meet our ever supportive Advisers</h3>
          {/* Large Screen Carousel Controls */}
          <div className="hidden w-full gap-2 lg:flex">
            <Button
              size={"icon"}
              onClick={() => scrollToIndex(currentIndex - 1)}
            >
              <ArrowLeftIcon />
            </Button>
            <Button
              size={"icon"}
              onClick={() => scrollToIndex(currentIndex + 1)}
            >
              <ArrowRightIcon />
            </Button>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          {/* Image Carousel */}
          <Carousel
            setApi={setCarouselApi}
            className="w-full"
            opts={{
              align: "start",
              duration: 20,
              loop: true,
            }}
          >
            <CarouselContent>
              {advisers.map((adviser, idx) => (
                <CarouselItem
                  key={adviser.name + idx}
                  className="select-none md:basis-1/2 lg:basis-1/2 xl:basis-1/3"
                >
                  <div className="bg-accent relative flex h-full flex-col items-center justify-center gap-2 rounded-3xl">
                    <Image
                      src={adviser.image}
                      alt={adviser.name}
                      width={300}
                      height={400}
                      className="h-full w-auto rounded-3xl object-cover"
                    />
                    <div className="from-primary to-primary/1 absolute bottom-0 h-3/12 w-full justify-start gap-2 rounded-b-3xl bg-gradient-to-t px-8 py-8 text-white">
                      <p className="text-base font-bold">{adviser.name}</p>
                      <p className="text-sm">{adviser.title}</p>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
          {/* Mobile Carousel Controls and Indicators */}
          <div className="flex w-full justify-center gap-2">
            <Button
              size={"icon"}
              className="lg:hidden"
              onClick={() => scrollToIndex(currentIndex - 1)}
            >
              <ArrowLeftIcon />
            </Button>
            <div className="flex w-fit items-center justify-center space-x-2">
              {Array.from({ length: totalItems }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => scrollToIndex(index)}
                  className={`h-3 w-3 rounded-full ${
                    currentIndex === index ? "bg-primary/80" : "bg-gray-400"
                  }`}
                />
              ))}
            </div>
            <Button
              size={"icon"}
              className="lg:hidden"
              onClick={() => scrollToIndex(currentIndex + 1)}
            >
              <ArrowRightIcon />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function AboutUsPage() {
  return (
    <div className="flex flex-col items-center justify-center">
      <AboutUsHeroSection />
      <AboutUsDescriptionSection />
      <AboutUsEmpowermentSection />
      <AboutUsInitiativesSection />
      <AboutUsAdvisersSection />
    </div>
  );
}
