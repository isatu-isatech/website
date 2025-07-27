import { ISATechDecorationRight } from "@/components/assets/decorations";
import PerlinNoiseTexture from "@/components/shaders/perlin";
import { BlobsAnimatedBackground, BlobsConfig } from "@/components/ui/blobs";
import { Button } from "@/components/ui/button";
import { GraduationCap, NotepadText, Rocket, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="debug flex w-full flex-col items-center justify-center">
      <StatsSection />
      <AboutSection />
      <HomepagePartnersSection />
      <KwadraSection />
      <TeamSection />
      <OfferSection />
      <ContactSection />
    </div>
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
  const blobsConfig: BlobsConfig[] = [
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

  return (
    <section
      className="debug relative flex w-full flex-col items-center justify-center px-6 py-16 lg:px-16 lg:py-28"
      id="about"
    >
      <div className="absolute flex h-full w-full items-center justify-center">
        <BlobsAnimatedBackground
          className="debug absolute h-full w-full"
          blobs={blobsConfig}
        />
        <ISATechDecorationRight className="absolute top-0 right-0 h-full w-auto opacity-10" />
      </div>
      <div className="debug flex w-full max-w-6xl flex-col items-center justify-center gap-6 md:flex-row-reverse">
        <div className="flex w-full items-center justify-center md:w-1/2">
          <Image
            src="/assets/isatech-icon-dark.svg"
            alt="ISATech Icon"
            width={0}
            height={0}
            className="z-1 h-[150px] w-[100px] md:h-[270px] md:w-[185px]"
          />
        </div>
        <div className="flex w-full flex-col items-center justify-center gap-4 md:w-1/2 md:gap-6">
          <div className="flex w-full flex-col items-center justify-center gap-2 text-center md:items-end md:text-end">
            <h2>What is ISATech Society?</h2>
            <h5 className="text-center lg:text-right">
              ISATech is a special interest organization operating under the
              Intellectual Property Management Office (IPMO) and the Kwadra
              Technology Business Incubator (Kwadra-TBI).
            </h5>
          </div>
          <div className="flex w-full items-center justify-center md:justify-end">
            <Button variant={"default"} size={"lg"}>
              <Link href="/about">Learn More</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

function HomepagePartnersSection() {
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
    <section
      className="debug relative flex w-full flex-col items-center justify-center px-6 lg:px-16"
      id="partners"
    >
      <PerlinNoiseTexture
        color={"#ececec"}
        className="absolute top-0 left-0 -z-1 h-full w-full opacity-30"
      />
      <div className="debug flex w-full max-w-6xl flex-col items-center justify-center gap-6 px-6 py-16 lg:px-8 xl:px-16">
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
    </section>
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
            <Button>
              <Link href="/">Learn More</Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

function TeamSection() {
  const members = [
    {
      role: "Hustler",
      path: "/assets/hustler.svg",
    },
    {
      role: "Hacker",
      path: "/assets/hacker.svg",
    },
    {
      role: "Hipster",
      path: "/assets/hipster.svg",
    },
    {
      role: "Hound",
      path: "/assets/hound.svg",
    },
  ];

  return (
    <>
      <div className="bg-primary flex w-full justify-center">
        <div className="flex w-full max-w-7xl flex-col px-6 py-20 lg:px-8 xl:px-16">
          <div className="flex w-full flex-col items-center justify-center gap-6">
            <div className="flex w-full flex-col items-center justify-center gap-2 text-center">
              <h2 className="text-secondary">Are You One of the 4H?</h2>
              <h5 className="text-primary-foreground flex lg:w-5/6 xl:w-2/3">
                At ISATech Society, we believe every great innovation starts
                with a diverse team. Whether you&apos;re a creative, a coder, a
                go-getter, or a researcher — there&apos;s a place for you here.
                Which one are you?
              </h5>
            </div>
            <div className="grid grid-cols-2 gap-6 sm:flex sm:items-center sm:justify-center sm:gap-6">
              {members.map((member, key) => (
                <div
                  key={key}
                  className="flex flex-col items-center justify-center gap-4 rounded-2xl border-white bg-gradient-to-b from-white to-gray-500 p-[1px] backdrop-blur-md lg:rounded-4xl"
                >
                  <div className="bg-primary flex flex-col items-center justify-center gap-4 rounded-2xl lg:rounded-4xl">
                    <div className="bg-card/25 flex flex-col flex-wrap items-center justify-center gap-4 rounded-2xl px-6 py-8 lg:rounded-4xl lg:px-8 lg:py-10">
                      <div className="bg-secondary flex items-center justify-center rounded-2xl p-2 lg:rounded-3xl lg:p-6 xl:size-40">
                        <Image
                          src={member.path}
                          alt={member.role}
                          width={500}
                          height={500}
                          className="size-20 rounded-2xl sm:size-16 md:size-24 lg:size-28"
                        />
                      </div>
                      <h6 className="text-primary-foreground font-bold">
                        {member.role}
                      </h6>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Button variant={"secondary"} size={"lg"}>
              <Link href="">
                <h5>Join Now</h5>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

function OfferSection() {
  const features = [
    {
      icon: Rocket,
      title: "Hackathons",
      description:
        "A race of innovation where ideas thrive and take shape. Hackathons challenge students to build creative tech solutions under pressure.",
    },
    {
      icon: NotepadText,
      title: "Seminars",
      description:
        "Insightful talks from industry leaders. Seminars offer fresh perspectives, discuss emerging trends, and share valuable knowledge beyond the classroom.",
    },
    {
      icon: GraduationCap,
      title: "Trainings",
      description:
        "Skill-up sessions to help you stay ahead. Whether it's coding, design, or entrepreneurship — our trainings empower members with hands-on experience and practical tools.",
    },

    {
      icon: Users,
      title: "Cohorts",
      description:
        "Focused learning communities designed for growth. Cohorts bring members together to explore specific skills, to build real-world projects, and to support one another in a collaborative environment.",
    },
  ];

  return (
    <>
      <div className="flex w-full max-w-7xl flex-col px-6 py-16 lg:px-8 xl:px-16">
        <div className="flex flex-col items-center justify-center gap-6 text-center">
          <h2 className="text-primary">What do we offer?</h2>
          <div className="flex flex-col gap-6 md:grid md:grid-cols-2">
            {features.map((item, index) => (
              <div
                key={index}
                className="flex flex-col gap-4 rounded-2xl bg-gray-300/50 px-6 py-4"
              >
                <item.icon size={32} />
                <div className="flex flex-col gap-2 text-start">
                  <p className="text-body-bold">{item.title}</p>
                  <p className="text-label">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export function ContactSection() {
  return (
    <>
      <div className="flex w-full max-w-7xl flex-col px-6 py-16 lg:px-8 xl:px-16">
        <div className="bg-primary flex flex-col items-center justify-center gap-4 rounded-2xl px-4 py-8 sm:gap-6 sm:rounded-3xl">
          <div className="text-primary-foreground flex flex-col text-center">
            <h2>Let&apos;s dream big!</h2>
            <h6>Got an idea? Let&apos;s make it happen.</h6>
          </div>
          <Button variant={"secondary"} size={"lg"}>
            <Link href="/">
              <h5>Contact Us</h5>
            </Link>
          </Button>
        </div>
      </div>
    </>
  );
}
