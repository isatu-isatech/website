# Notion as the primary data store for applications and registrations

Membership applications, Core Membership applications, and Event registrations are stored directly in Notion databases, which also acts as the officer-facing review surface — rather than in a relational/transactional database or a hybrid with a mirrored write.

**Why:** The org has no ops team to run and secure infrastructure, officers already live in Notion, and a Notion write means applications appear in the tool they actually use with zero code changes. A separate database or an admin UI would force an infra/security burden and an unfamiliar review surface onto a student org for little early gain.

**Consequences:** Notion's write path (rate limits, no transactions, no relational integrity) becomes the submission contract; robustness and queries are constrained by Notion's API. H3's portal must account for reading from Notion or migrating. Buffer/retry against Notion rate limits is a real build item, and this is why the data-resilience decision below matters.
