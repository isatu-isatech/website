# Native Membership application pulled forward into the H1 polish

The native Membership application flow (conceptually H2) is built during the H1 polish pass, replacing the external Google Form; Core Membership and Event registration remain H2. This overlaps the roadmap rather than strictly sequencing polish-then-engine.

**Why:** The Membership surface is the strongest ask on the site, and the polish pass would otherwise rebuild a nicer shell around a Google Form that H2 then rips out — double work and a persistent dead-end to applicants. Building the native form once, in final form, during the first touch avoids rebuilding the join surface.

**Consequences:** H1's scope grows to include one native form's storage + confirmation (Notion write, Turnstile, rate limiting). The two application pipelines decision means H1 touches only the Membership pipeline, not Core. A future reader might assume polish-before-rebuild; this ADR records the deliberate overlap.
