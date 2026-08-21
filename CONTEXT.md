# ISATech Website

The public-facing domain for ISATech Society (ISAT U Innovators and Technopreneurs Society): recruitment, membership, events, and credibility. Ownership of terms here is the product/recruitment-layer, not the implementation.

This context is being actively sharpened in a design/roadmap grilling session (H1 polish → H2 membership & events engine → H3a portal/infra deferred; H3b surface additions can land earlier). Terms are captured as they are resolved.

## Language

**Membership**:
Generic membership tier; an application via the standard application form. No committee/position selection.
_Avoid_: Member, signup

**Core Membership**:
A membership tier applied for via a separate direct application in which the applicant selects a primary and secondary Core committee and a Position within one. Core applicants use the standard application form plus Core Membership extensions.
_Avoid_: Core, exec team membership, board membership

**Standard Application Form**:
The shared base form used by both Membership and Core Membership applications: Personal Information (Full Name, Nickname, Student ID, Email, Mobile, Birthdate, Sex, Facebook Profile URL), Academic Information (College, Program, Year Level), Role Preferences (Primary 4H Role, Secondary 4H Role, Related Skills, Related Experiences/Involvements), Availability & Commitment (hours/week, event-attendance willingness, other-org memberships), and Consent & Declaration (Privacy Notice, Declaration of accuracy). Core Membership extends this base with additional fields; the base is identical.
_Avoid_: application form template, signup form

**Core Committee**:
A functional track on the core team that a Core Membership applicant targets. The fixed catalog: Membership Engagement, Marketing, Events and Logistics, Finance, Partnerships. Applicants select a primary and a secondary committee. Each committee has an open/closed status and contains its own Positions in a two-level Notion catalog; both levels are maintained by officers without code changes.
_Avoid_: Core role, work group, department, team

**Position**:
A specific role/listing within a Core Committee (e.g. within Marketing: Graphic Designer, Content Writer, Social Media Manager), sourced from the committee's listing metadata. Each Position has its own open/closed status, independent of its committee's. An applicant applies for one Position within their selected committee. Distinct from the committee itself and from the 4H archetype.
_Avoid_: role, job, seat

**4H archetype**:
A personality / founder perspective frame (Hustler, Hypeman, Hacker, Hipster); who you are as a founder. Lightly captured in the standard form as Primary and Secondary 4H Role selections. Not an application target and never a vetting criterion.
_Avoid_: 4H role (the form labels it “4H Role”, but the canonical term is archetype to avoid clashing with committee/position), persona, type

**Event**:
A recurring or one-off org program (e.g. Codelympics, seminars, office showcases) with announcement content, an RSVP signal, and post-event recap content. Event page information (dates, venue, description, etc.) is stored as a Notion database row. Lifecycle features (capacity, waitlists, automated reminders) are out of scope until H3.
_Avoid_: activity, program, competition (use Event; Codelympics is a specific Event)

**RSVP**:
A lightweight “I’m coming” signal for an Event, distinct from an application. An RSVP carries minimal attendee identity (name/contact) and references the Event; it is not a reviewed application. De-duplication is handled at officer review; it is not an account-gated or hard dedupe.
_Avoid_: registration, signup (where “registration” implies a full reviewed application, use RSVP; a full application process for an event would be Registration)

**Inquiry**:
A non-application contact message submitted through the single Contact form, categorized by an inquiry type (General, Membership, Sponsorship & Partnership, Media). Not an application; routes the lead to the appropriate channel. There is no separate sponsor/partnership form.
_Avoid_: contact, message, lead (use Inquiry when referring to a categorized contact-form submission)

## Boundaries

- **Notion is the primary data store** for Membership applications, Core Membership applications, and Event RSVPs. Officers review and act on submissions directly in Notion; no separate admin UI is built in H2. No mirrored write to an external DB in H2.
- **Event pages are Notion DB rows; RSVPs are a lightweight signal, not a reviewed application.** Event info is authored as a Notion database row. "Registering" for an event is an RSVP carrying minimal attendee identity referencing the Event, written to Notion. It is not an application; there is no officer review pipeline beyond the RSVP list. RSVP de-duplication is handled manually by officers at review, not by an account gate or hard dedupe.
- **Contact is one form with an inquiry-type selector.** A single Turnstile-protected Contact form gathers Inquiries categorized by type (General / Membership / Sponsorship & Partnership / Media), routing leads without multiplying surfaces. There is no dedicated sponsor/partnership form in H2; a partner page is H3b (surface addition, no portal dependency).
- **Contact trust hardening lands in H1** (part of the polish brief’s P2 harden items): fix the `info@isatech.com` domain mismatch to the owned domain, verify or remove the unverified `/privacy#manage-cookies` link, and humanize the bare “Too many requests” rate-limit copy.
- **No user accounts in H2.** Applicants and registrants complete forms anonymously; confirmation is shown on submit and follow-up is sent via the contact channel provided. No email-verification gate; abuse is handled by existing Turnstile + rate limiting. Accounts/status-portal are H3 territory.
- **"What happens next" copy is org-supplied, not invented.** The exact review pipeline (steps/timeline) for Core Membership is a fact about the org's real process; the site must state only what officers actually do.
- **4H quiz and applications are separate devices.** The quiz is a standalone awareness/onboarding device for people unsure of their archetype; it is never a required step and never a vetting criterion. The **form's self-selected Primary/Secondary 4H Role (driven by the applicant's own self-assessment and judgement) is authoritative for the application record**; a computed quiz result is informational context only and never overrides the self-selection.
- **Roadmap sequencing overlaps, not strictly sequential.** The native Membership application (H2 in concept) is pulled forward and built during the H1 polish, replacing the Google Form, so the join surface is built once in final form. Core Membership and Event registration land after that. Polish of the other surfaces proceeds in parallel.
- **Definition of done (H2):** a prospective student can land on the site, understand Membership vs Core Membership, pick one, and complete and submit a full application (or register for an Event), with the submission appearing correctly in the org's Notion for immediate officer review — with zero code changes needed for officers to manage roles/committees, events, or applications. Developers must not promise a specific completion time (the Standard Application Form is ~20 fields); friction is reduced honestly via progressive sections and clear required-vs-optional fields only. No draft/resume mechanism in H2 (drafts overlap the H3 account portal).
- **H2 explicit no's:** no payment/dues collection; no waitlist/capacity/automated reminders (H3a); no officer admin UI beyond Notion; no content/editor system beyond Notion's built-in authoring; no user accounts/portals (H3a); no multi-language; no push notifications; no sponsor/partner-management systems.
- **H3 is split: H3a (portal/infra, deferred) vs H3b (surface additions, cheap).** H3a = accounts, application-status tracking, officer workflows, event-lifecycle tooling (capacity/waitlists/reminders) — a coherent system, genuinely deferred. H3b = pure marketing surface additions with no portal dependency (e.g. a dedicated partner/sponsor page, resumes), which can land with H2 or whenever rather than waiting on the portal. This stops H3 from being a black-box dumping ground for mixed-scope work.
- **Data-resilience = Notion-alone, explicitly accepted (revisit later).** No backup/mirror in H2; Notion's own version history is the accepted posture. This is a recorded risk, not a silent default — a lightweight periodic archive is the leading candidate if revisited.

### Membership model

- **Core Committee** and **4H archetype** are two distinct, orthogonal taxonomies. A Core Member has both: one Committee(+Position) they work in and one 4H archetype (how they think/found). Neither term may be used for the other.
- **Core Membership** and **Membership** are **independent on-ramps**: any student may apply directly to either; Core Membership is NOT an upgrade path reached from Membership, and Membership is not a prerequisite for Core.
- **The two pipelines are separate, but share the Standard Application Form base.** Both use the identical Standard Application Form; Core Membership extends it with committee/position selection and the (Marketing-exclusive) portfolio link. Pipelines remain distinct in storage and officer review — they do not share a single application target or system.
- **Core Membership extensions to the standard form:** Primary Core Committee, Secondary Core Committee, and the Position within a committee they apply for (sourced from the committee's listing metadata); plus a portfolio external-link field, exclusive to the Marketing committee.
- **Committee → Position is a two-level Notion catalog.** Each Core Committee contains its Positions; both a committee and each of its Positions may be independently open/closed. The application's position dropdown reads from this listing, so correctness depends on officers maintaining it.
- **Portfolio field is exclusive to the Marketing committee** (an applicant's explicit call); reintroducing it elsewhere is an org decision to revisit, not silently generalized.
- **Optional concurrent-applicant cross-reference:** a Core Membership applicant may optionally indicate they have _also_ applied for Membership. Officers may use this as a **fallback** — if the Core review/interview concludes the applicant fits Membership instead, that indication routes them to the Membership pipeline by internal agreement. This is an officer-side fallback, not an automated merge; the two applications remain separate records. (Membership→Core fallback in the reverse direction is not defined; the Core application is the designated career-track on-ramp.)
