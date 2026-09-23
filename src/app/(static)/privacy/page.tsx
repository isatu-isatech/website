import { Metadata } from "next";
import Link from "next/link";
import ManageCookiesSection from "./cookie-section";
import { SITE_CONFIG, SOCIAL_LINKS } from "@/lib/constants/site";

/**
 * ################################################################################
 * ################################### METADATA ###################################
 * ################################################################################
 */
export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "This Privacy Policy outlines how ISATech Society collects, uses, and protects your information.",
  keywords: [
    "philippines",
    "privacy policy",
    "iloilo",
    "ISATU",
    "startups",
    "technopreneurship",
    "ISATech Society",
    "student founders",
    "innovation",
    "collaboration",
    "community",
  ],
  openGraph: {
    title: "Privacy Policy",
    description:
      "This Privacy Policy outlines how ISATech Society collects, uses, and protects your information.",
    url: `${SITE_CONFIG.url}/privacy`,
    siteName: "ISATech Society",
    images: [
      {
        url: "/assets/seo/ogimage-privacy.jpg",
        width: 1200,
        height: 630,
        alt: "ISATech Society Privacy Header Image",
      },
    ],
    type: "website",
  },
};

/**
 * ################################################################################
 * ################################## COMPONENTS ##################################
 * ################################################################################
 */

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4">
      <h2>{title}</h2>
      {children}
    </div>
  );
}

function PrivacyPageHeader() {
  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-primary">Privacy Policy</h1>
      <p className="text-muted-foreground">Last updated: September 23, 2026</p>
    </div>
  );
}

function PrivacyIntroSection() {
  return (
    <div className="flex flex-col gap-4">
      <p>
        This Privacy Policy describes how the ISAT U Innovators and
        Technopreneurs Society (&quot;ISATech Society&quot;, &quot;We&quot;,
        &quot;Us&quot;, or &quot;Our&quot;) collects, uses, stores, and
        discloses Your information when You use Our website at isatech.club (the
        &quot;Service&quot;). It also tells You about Your privacy rights under
        the Data Privacy Act of 2012 (Republic Act No. 10173) of the Philippines
        and how the law protects You.
      </p>
      <p>
        We use Your Personal Data to operate the Service, respond to Your
        messages, process membership applications, protect the Service from
        abuse, and improve the Service. By using the Service, You agree to the
        collection and use of information in accordance with this Privacy
        Policy. Where Philippine law requires Your consent, submitting a form on
        the Service means You agree to the uses described here.
      </p>
      <p>
        We do not operate user accounts, newsletters, payments, or marketing
        mailing lists on this Service. We do not sell Your Personal Data.
      </p>
    </div>
  );
}

function PrivacyInterpretationSection() {
  return (
    <Section title="Interpretation and Definitions">
      <h3>Interpretation</h3>
      <p>
        The words of which the initial letter is capitalized have meanings
        defined under the following conditions. The following definitions shall
        have the same meaning regardless of whether they appear in singular or
        in plural.
      </p>
      <h3>Definitions</h3>
      <p>For the purposes of this Privacy Policy:</p>
      <ul className="ml-6 list-disc space-y-2">
        <li>
          <strong>Company</strong> (referred to as either &quot;the
          Company&quot;, &quot;We&quot;, &quot;Us&quot; or &quot;Our&quot; in
          this Policy) refers to the ISAT U Innovators and Technopreneurs
          Society (ISATech Society), a student organization at the Iloilo
          Science and Technology University, Iloilo City, Philippines.
        </li>
        <li>
          <strong>Cookies</strong> are small files that a website places on Your
          computer or phone to remember choices and keep the site working. This
          page lists all the cookies and similar temporary storage We use.
        </li>
        <li>
          <strong>Country</strong> refers to: Philippines
        </li>
        <li>
          <strong>Personal Data</strong> is any information that relates to an
          identified or identifiable individual, as defined under the Data
          Privacy Act of 2012 (Republic Act No. 10173).
        </li>
        <li>
          <strong>Service</strong> refers to the Website.
        </li>
        <li>
          <strong>Usage Data</strong> refers to basic details collected
          automatically when You use the Service (for example, which pages You
          visit and how long You stay).
        </li>
        <li>
          <strong>Website</strong> refers to ISATech Society, accessible from
          https://isatech.club
        </li>
        <li>
          <strong>You</strong> means the individual accessing or using the
          Service.
        </li>
      </ul>
    </Section>
  );
}

function PrivacyDataCollectionSection() {
  return (
    <Section title="Collecting and Using Your Personal Data">
      <h3>Types of Data Collected</h3>
      <h4>Contact form</h4>
      <p>
        When You send Us a message through Our contact form, We collect what You
        type into the form:
      </p>
      <ul className="ml-6 list-disc space-y-2">
        <li>Name</li>
        <li>Email address</li>
        <li>Message content</li>
      </ul>
      <p>
        Your message is saved in Our secure database (in Notion) so Our team can
        read and respond to it. We check that You are human when You submit, but
        We do not keep that check data.
      </p>
      <h4>Membership application</h4>
      <p>
        When You apply for membership, We collect what You enter into the
        application form. All fields except those marked optional are required,
        and Your student email must end in @students.isatu.edu.ph:
      </p>
      <ul className="ml-6 list-disc space-y-2">
        <li>Full name and optional nickname</li>
        <li>Birthdate and sex</li>
        <li>
          Contact details: student email, mobile number, student ID, and
          optional Facebook profile URL
        </li>
        <li>School details: college, program, and year level</li>
        <li>
          Role preferences: primary and secondary 4H roles (Hound, Hacker,
          Hipster, or Hustler — please pick two different roles), plus optional
          related skills and experiences
        </li>
        <li>
          Availability: weekly time You can give, willingness to attend events,
          and optional other organizations You belong to
        </li>
      </ul>
      <p>
        You must tick two consent boxes to submit (accepting this privacy notice
        and declaring Your answers are true) — We do not keep a record of those
        ticks. Your application is saved in Our secure membership list (in
        Notion) for the current application period.
      </p>
      <h4>Quiz</h4>
      <p>
        The 4H quiz collects no name, email, phone number, or other Personal
        Data. Your answers stay only in Your browser temporarily so an
        in-progress quiz can resume if You refresh the page or go back in the
        same tab. It is deleted when You close the tab, finish or retake the
        quiz, or stay idle for a while. Sharing a result only copies a link —
        nothing is sent to Us.
      </p>
      <h4>Usage Data</h4>
      <p>
        Usage Data is collected automatically when using the Service. This
        includes basic details such as the pages You visit, the time and date of
        Your visit, how long You stay, Your browser type, and Your IP address.
        On this Service that means:
      </p>
      <ul className="ml-6 list-disc space-y-2">
        <li>
          Anonymous speed measurements, which are always collected and do not
          identify You.
        </li>
        <li>
          Visit counts, which run only if You accept analytics cookies in the
          consent banner.
        </li>
        <li>
          Basic records Our website host keeps so pages, images, and fonts can
          be shown to You.
        </li>
      </ul>
      <h4>Tracking Technologies and Cookies</h4>
      <p>
        We use only the cookies and temporary storage below. There are no
        advertising trackers on this Service. You can review and update Your
        cookie settings at any time via the Manage Cookie Preferences control at
        the bottom of this page.
      </p>
      <ul className="ml-6 list-disc space-y-2">
        <li>
          <strong>Your cookie choice:</strong> remembers what You picked in the
          cookie banner (basic functions are always on; extras stay off unless
          You opt in).
        </li>
        <li>
          <strong>Spam protection:</strong> remembers Your recent form
          submissions (up to 5 per hour per form) so the forms cannot be abused.
          It keeps only submission times, expires after a couple of hours, and
          is not used to track You. Clearing Your cookies resets it.
        </li>
        <li>
          <strong>Temporary quiz memory (not a cookie):</strong> holds an
          unfinished quiz in the current tab only, as described above. It is
          never sent to Our servers.
        </li>
        <li>
          <strong>Analytics cookies:</strong> used for visit counts only after
          You accept analytics. Speed measurements themselves need no cookies.
        </li>
        <li>
          <strong>Embedded content from others:</strong> the human-verification
          box on both forms, the homepage video, and the contact-page location
          map may set their own cookies. These providers receive basic details
          like Your IP address and browser type when their content loads, under
          their own privacy policies.
        </li>
      </ul>
    </Section>
  );
}

function PrivacyDataUseSection() {
  return (
    <Section title="Use of Your Personal Data">
      <p>The Company may use Personal Data for the following purposes:</p>
      <ul className="ml-6 list-disc space-y-2">
        <li>
          <strong>To provide and maintain our Service</strong>, including to
          monitor the usage of our Service and keep its content available.
        </li>
        <li>
          <strong>To process membership applications:</strong> to review Your
          eligibility, role preferences, and availability, and to contact You
          about Your application at the email address or mobile number You
          provided.
        </li>
        <li>
          <strong>To manage Your requests:</strong> to read and respond to
          messages You send through the contact form.
        </li>
        <li>
          <strong>To contact You:</strong> to reply by email about Your message
          or application. We do not send marketing emails, SMS, or telephone
          marketing, and We operate no newsletter.
        </li>
        <li>
          <strong>To protect the Service:</strong> to check that submissions
          come from real people, limit repeated submissions, and fix abuse or
          errors.
        </li>
        <li>
          <strong>For other purposes:</strong> We may look at overall, anonymous
          trends to evaluate and improve our Service. We do not use Personal
          Data for ads.
        </li>
      </ul>
      <p>
        We use Personal Data because You allow it when You submit a form, and
        because We need it to run a safe student-organization website, as
        allowed by the Data Privacy Act of 2012.
      </p>
    </Section>
  );
}

function PrivacyThirdPartiesSection() {
  return (
    <Section title="Third-Party Services">
      <p>
        We share data only with the helpers needed to run this Service. They
        handle data for Us and follow their own privacy policies:
      </p>
      <ul className="ml-6 list-disc space-y-2">
        <li>
          <strong>Notion (where We save forms):</strong> contact messages and
          membership applications are saved in Our private Notion database.
        </li>
        <li>
          <strong>Cloudflare (human check):</strong> when You submit a form, a
          one-time check plus basic details like Your IP address are sent to
          Cloudflare to confirm You are not a bot. The result is kept only long
          enough to accept or reject the submission.
        </li>
        <li>
          <strong>Vercel (where the website lives):</strong> hosts the website
          and keeps basic records needed to show pages to You. Visit counts run
          only if You accept analytics cookies; speed checks are anonymous.
        </li>
        <li>
          <strong>Homepage video (YouTube / Google):</strong> loading the video
          sends basic details like Your IP address and browser type to Google.
          It is set to a privacy-friendly mode that delays cookies until You
          press play.
        </li>
        <li>
          <strong>Contact-page map (OpenStreetMap):</strong> loading the map
          sends basic details like Your IP address and browser type to
          OpenStreetMap.
        </li>
        <li>
          <strong>Fonts (Google Fonts):</strong> loading text styles sends
          standard request details like Your IP address to Google.
        </li>
      </ul>
      <p>
        We send no automatic emails: follow-ups are done manually by Our team
        using the contact details You gave. No Personal Data is sold or shared
        for ads.
      </p>
    </Section>
  );
}

function PrivacyDataRetentionSection() {
  return (
    <Section title="Retention of Your Personal Data">
      <p>
        We keep Your Personal Data only for as long as needed for the purposes
        in this Policy. Contact messages and membership applications are kept
        while needed to respond to You, run the membership application period,
        follow Our legal duties, settle disputes, and enforce Our policies.
        Unfinished quiz data in Your own browser is deleted as described above
        and never kept by Us. When Personal Data is no longer needed, We delete
        it or remove details that identify You.
      </p>
    </Section>
  );
}

function PrivacyDataTransferSection() {
  return (
    <Section title="Transfer of Your Personal Data">
      <p>
        Your information is handled by Our team in the Philippines and by Our
        helpers listed above, some of which may save or process data in other
        countries. By submitting a form, You allow that transfer, under the
        safeguards of the Data Privacy Act of 2012 and the safety measures of
        those helpers.
      </p>
    </Section>
  );
}

function PrivacyDataDeletionSection() {
  return (
    <Section title="Your Rights and How to Exercise Them">
      <p>
        Under the Data Privacy Act of 2012, You have the right to know what We
        hold, to see, correct, or delete it, to limit or object to its use, to
        get a copy of it, and to complain to the National Privacy Commission.
        This site has no accounts or settings page, so to use any of these
        rights — for example to ask for a copy, correction, or deletion of what
        You sent through the contact form or membership application — please
        contact Us using the details in the Contact Us section. We will reply
        within a reasonable time and may ask You to confirm Your identity (for
        example, by writing from the email address You submitted) before acting.
      </p>
    </Section>
  );
}

function PrivacyDataDisclosureSection() {
  return (
    <Section title="Disclosure of Your Personal Data">
      <p>
        We disclose Personal Data only as needed to operate the Service: to the
        providers listed above acting on Our behalf, to fellow ISATech Society
        officers reviewing messages and membership applications, and where
        required by law.
      </p>
      <h3>Law enforcement</h3>
      <p>
        Under certain circumstances, the Company may be required to disclose
        Your Personal Data if required to do so by law or in response to valid
        requests by public authorities (e.g. a court or a government agency).
      </p>
    </Section>
  );
}

function PrivacySecuritySection() {
  return (
    <Section title="Security of Your Personal Data">
      <p>
        We protect Personal Data with reasonable safeguards, including safe
        connections, human verification on forms, limits on repeated
        submissions, careful checks of every entry, and limited access to where
        forms are saved. Please remember, however, that nothing sent over the
        Internet or stored online is 100% safe. While We do Our best to protect
        Your Personal Data, We cannot guarantee its absolute safety.
      </p>
    </Section>
  );
}

function PrivacyChildrenSection() {
  return (
    <Section title="Children's Privacy">
      <p>
        The Service is intended for members of the ISAT U community, generally
        college students, and for visitors interested in Our organization. It is
        not directed to children under the age of 13, and membership
        applications require an ISAT U student email address. We do not
        knowingly collect Personal Data from children under 13. If You are a
        parent or guardian and You believe Your child has provided Us with
        Personal Data, please contact Us so We can delete it.
      </p>
    </Section>
  );
}

function PrivacyLinksSection() {
  return (
    <Section title="Links to Other Websites">
      <p>
        Our Service may contain links to other websites that are not operated by
        Us, including Our Facebook and LinkedIn pages, the Kwadra TBI partner
        page, and embedded OpenStreetMap and YouTube content. If You click on a
        third party link, You will be directed to that third party&apos;s site.
        We strongly advise You to review the Privacy Policy of every site You
        visit. We have no control over and assume no responsibility for the
        content or practices of third-party sites or services.
      </p>
    </Section>
  );
}

function PrivacyChangesSection() {
  return (
    <Section title="Changes to this Privacy Policy">
      <p>
        We may update Our Privacy Policy from time to time, for example when We
        add or change forms, storage, or service providers. We will notify You
        of any changes by posting the new Privacy Policy on this page and
        updating the &quot;Last updated&quot; date above. You are advised to
        review this Privacy Policy periodically for any changes.
      </p>
    </Section>
  );
}

function PrivacyContactSection() {
  return (
    <Section title="Contact Us">
      <p>
        If you have any questions about this Privacy Policy or wish to exercise
        Your data rights, You can contact us:
      </p>
      <ul className="ml-6 list-disc space-y-2">
        <li>
          By email:{" "}
          <a
            href={`mailto:${SOCIAL_LINKS.email}`}
            className="text-primary underline"
          >
            {SOCIAL_LINKS.email}
          </a>
        </li>
        <li>
          By visiting our{" "}
          <Link href="/contact" className="text-primary underline">
            contact page
          </Link>
        </li>
      </ul>
    </Section>
  );
}

/**
 * ################################################################################
 * ##################################### PAGE #####################################
 * ################################################################################
 */
export default function PrivacyPage() {
  return (
    <main className="flex w-full flex-col items-center justify-center">
      <section className="w-full px-4 py-16 sm:px-6 md:px-8 lg:px-12 lg:py-28 xl:px-16 2xl:px-20">
        <div className="mx-auto flex max-w-4xl flex-col gap-8">
          <PrivacyPageHeader />
          <PrivacyIntroSection />
          <PrivacyInterpretationSection />
          <PrivacyDataCollectionSection />
          <PrivacyDataUseSection />
          <PrivacyThirdPartiesSection />
          <PrivacyDataRetentionSection />
          <PrivacyDataTransferSection />
          <PrivacyDataDeletionSection />
          <PrivacyDataDisclosureSection />
          <PrivacySecuritySection />
          <PrivacyChildrenSection />
          <PrivacyLinksSection />
          <PrivacyChangesSection />
          <PrivacyContactSection />
          <section id="manage-cookies">
            <ManageCookiesSection />
          </section>
        </div>
      </section>
    </main>
  );
}
