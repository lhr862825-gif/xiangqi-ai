# Portfolio readiness review

## Assessment

There is no universal checklist that makes a project acceptable to every overseas employer. Based on the repository itself, this is a substantive internship portfolio project with an independently testable rules engine, a local search-based opponent and a bilingual interface. It should be presented as a browser game with documented engineering tradeoffs, rather than as a production-grade or competitive chess engine.

## Verified strengths

- Separate engine, AI, rendering and localization responsibilities.
- Search operates on a clone; undo restores captured pieces and the side to move.
- Cancellation protects against stale search and animation results.
- Tests cover rules, AI legality, state isolation, localization and UI lifecycle boundaries.
- Source identifiers, filenames, comments, default HTML text and development documentation use English. Chinese game glyphs and localized content remain runtime data represented with Unicode escapes or HTML entities.
- No runtime dependencies, backend account or build tooling required to play locally.

## Changes in this review

- Replaced Chinese and stale comments with accurate English comments.
- Rewrote the README in English with setup, architecture, AI tradeoffs, test commands and limitations.
- Added package.json with reproducible syntax-check and test commands.
- Added a GitHub Actions workflow for the same checks. The first hosted run completed successfully: https://github.com/lhr862825-gif/xiangqi-ai/actions/runs/38320791036.
- Preserved Chinese/English language switching and existing rules.

## Remaining gaps

1. Live demo: no hosted, verified playable URL is currently documented. A repository link shows the code but is less convenient for trying the game.
2. Browser evidence: actual responsive layout, high-DPI rendering, animation smoothness and modal behavior still need real-browser verification. Stub tests cannot substitute for these checks.
3. Asset provenance: record the texture images' creator, source and redistribution terms, or replace them with assets whose use is established.
4. Screenshots: add actual screenshots after browser validation; no mock screenshots or unmeasured performance claims are included.
5. Accessibility: keyboard interaction exists, but Canvas does not expose a complete accessible board representation to screen readers.
6. Game completeness: official repetition, perpetual-check and draw rules are absent. AI strength and search depth vary by device.
7. Maintenance: some existing functions and tests remain compactly formatted. A consistent formatter and lint configuration would improve future review and collaboration.

## Suggested interview discussion

Explain why the engine is independent of DOM state, how make/unmake supports search, how Alpha-Beta and move ordering reduce work, how cancellation handles restarts, and why static layers and sprite caching reduce repeated Canvas drawing. Distinguish local test evidence from unverified browser behavior and be ready to discuss the limitations above.
