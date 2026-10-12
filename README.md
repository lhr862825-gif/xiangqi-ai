# Xiangqi AI

A bilingual Chinese chess game built with vanilla JavaScript and Canvas. Play locally against another person or a time-limited AI opponent, with no server, build step or runtime dependencies.

## Run locally

Clone this repository and open index.html in a modern browser. Select English or Chinese from the language menu. The first visit follows your browser language; later visits remember your selection when browser storage is available.

## Features

- Two-player mode and human-versus-AI mode (human: Red, AI: Black).
- Easy, Medium and Hard AI settings with iterative deepening and time budgets.
- Legal destination hints, check notifications, checkmate and stalemate detection.
- Continuous undo in two-player mode; undo to the human's turn against the AI.
- Cancelable AI searches and animations when restarting, undoing or changing modes.
- Pre-rendered piece sprites and a cached static board with device-pixel-ratio support.
- English and Chinese controls, status messages and beginner instructions.
- Mouse and keyboard controls. Arrow keys move the cursor; Enter or Space selects or moves a piece. H toggles page contrast; + and - adjust page text size.

## Architecture

| File | Responsibility |
| --- | --- |
| engine.js | DOM-independent board state, rules, legal move generation, undo, cloning and game-state evaluation |
| ai.js | Negamax search, Alpha-Beta pruning, MVV-LVA move ordering and positional evaluation |
| script.js | Canvas rendering, sprite cache, input handling, animations and AI lifecycle |
| i18n.js | Translation dictionary, language switching and preference persistence |
| tests/ | Engine regressions, AI smoke tests, localization and stubbed UI lifecycle tests |

The UI owns a XiangqiGame instance. AI search clones it, applies and undoes candidate moves, and returns a move without mutating the live game. A generation counter and AbortController discard obsolete results after user actions.

Board coordinates use rows 0-9 and columns 0-8. Black's home rank is row 0; Red's is row 9. Moves have this shape:

~~~js
{ from: { row: 6, col: 0 }, to: { row: 5, col: 0 } }
~~~

Game-state evaluation returns status (playing, red_wins or black_wins), reason (checkmate, stalemate, captured or null) and inCheck. Stalemate is a loss in Xiangqi.

## AI design and tradeoffs

Search uses iterative deepening: Easy attempts depth 2 with a 0.5-second budget, Medium depth 4 with 1 second, and Hard depth 6 with 1.5 seconds. The achieved depth depends on hardware and position complexity. An unfinished iteration is discarded; if no iteration completes, the AI returns a legal fallback move.

Evaluation combines material values, mirrored piece-square tables and a crossed-river soldier bonus. Easy mode introduces variation among close-scoring root candidates. Repeated positions within a search path score zero.

Search periodically yields through setTimeout(0), including within an iteration, to let the main thread handle UI work. This keeps file-based launch simple, at the cost of main-thread search overhead. A Web Worker is a possible future improvement.

## Validation

Node.js 20 or later is required only for development checks. No npm install is needed.

~~~sh
npm run check
npm test
~~~

The suite currently contains 28 tests covering 14 rule regressions, exact undo restoration, clone isolation, legal AI moves for both colors, controlled terminal positions, cancellation, event-loop yielding, DPR setup, scaled clicks, mode behavior and localization.

GitHub Actions is configured to run syntax checks and tests on pushes and pull requests. Local tests have passed, and the first [GitHub Actions run](https://github.com/lhr862825-gif/xiangqi-ai/actions/runs/38320791036) completed successfully.

Manual browser checks: test both modes, all difficulty levels, both languages, keyboard navigation, the rules dialog, undo/restart during AI thinking, and a high-DPI/mobile viewport. Automated UI tests use DOM/Canvas stubs; they do not validate actual browser layout or visual smoothness.

## Current limitations

- No official repetition, perpetual-check or draw adjudication. Full self-play is not guaranteed to terminate.
- No quiescence search or transposition table; the AI is a portfolio implementation, not a competitive engine.
- Canvas pieces retain traditional Chinese glyphs; the English instructions explain the corresponding names.
- Screen-reader board interaction and real-browser visual verification remain incomplete.
- No hosted demo is configured in this repository yet.
- The source and redistribution terms of the two existing texture images have not been documented. See images/ASSETS.md.

## Project review

See docs/PORTFOLIO_REVIEW.md for the repository audit, verified evidence and remaining presentation work. This project demonstrates frontend state management, game rules, search algorithms, rendering optimization, localization and testing; it does not imply professional production experience or measured recruiter outcomes.
