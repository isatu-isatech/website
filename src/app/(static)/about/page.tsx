import Image from "next/image";

function AboutUsHeroSection() {
  return (
    <section
      className="flex w-full items-center justify-center px-6 py-12 md:py-6"
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
    <section className="description-section">
      <h2>Our Mission</h2>
      <p>We strive to provide the best services to our customers.</p>
    </section>
  );
}

function AboutUsOfferEmpowermentSection() {
  return (
    <section className="offer-empowerment-section">
      <h2>Empowerment Through Knowledge</h2>
      <p>
        We believe in empowering our customers with knowledge and resources.
      </p>
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
      <AboutUsOfferEmpowermentSection />
      <AboutUsInitiativesSection />
      <AboutUsAdvisersSection />
    </div>
  );
}
