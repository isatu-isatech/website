import {
  ISATechDecorationLeft,
  ISATechDecorationRight,
} from "@/components/assets/decorations";
import PerlinNoiseTexture from "@/components/shaders/perlin";
import { RocketIcon, TargetIcon } from "lucide-react";
import Image from "next/image";

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
      className="flex w-full items-center justify-center px-6 py-6 md:px-16"
      id="description"
    >
      <div className="relative flex w-full max-w-7xl flex-col items-center">
        {/* Decorations */}
        <ISATechDecorationLeft className="absolute top-0 left-0 hidden h-auto w-fit opacity-10 lg:block" />
        <ISATechDecorationRight className="absolute right-0 bottom-0 h-auto w-fit opacity-10" />
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
      <PerlinNoiseTexture className="absolute h-full w-full opacity-10" />
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
            alt="Empowerment"
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
    <section className="initiatives-section">
      <h2>Our Initiatives</h2>
      <p>We are involved in various initiatives to support our community.</p>
    </section>
  );
}

function AboutUsAdvisersSection() {
  return (
    <section className="advisers-section">
      <h2>Meet Our Advisers</h2>
      <p>Learn about the experts guiding our mission.</p>
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
