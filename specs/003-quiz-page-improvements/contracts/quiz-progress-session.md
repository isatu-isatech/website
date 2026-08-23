# Contract: Quiz Progress Session — browser `sessionStorage`

Session-scoped persistence of an in-progress quiz (FR-008).

## Storage

Key: `4h-quiz-progress-v1` (versioned).

Payload (JSON):

```jsonc
{
  "version": "<derived from quiz-data shape>",
  "phase": "quiz" | "tiebreaker",
  "currentQuestionIndex": 0,
  "usedTieBreakers": 0,
  "scores": { "Hustler": 0, "Hacker": 0, "Hipster": 0, "Hound": 0 },
  "answers": [{ "choice": "<text>", "weight": { ... } }],
  "questionOrder": [...],
  "choiceOrders": [[...], ...]
}
```

## Lifecycle

| Event                                  | Action                             |
| -------------------------------------- | ---------------------------------- |
| Quiz start                             | Write a fresh record.              |
| Answer / undo                          | Rewrite the record.                |
| Result reached                         | Clear the record.                  |
| Retake                                 | Clear, then fresh record on start. |
| Tab close                              | Record disappears (session scope). |
| `version` mismatch (quiz data changed) | Discard record; quiz starts fresh. |

## Invariants

- Restore happens once on mount, client-only (no hydration mismatch).
- `phase: "intro"`/`"result"` are never stored (transient phases).
- Each tab has its own record (per-tab isolation).
