# LinguaFlow Daily Flow Orchestrator Tasks

- `[x]` Database & Backend Service updates
  - `[x]` Update `User` entity with `streakCount` and `lastActiveDate`
  - `[x]` Update `FlowSession` entity with `stepsCompleted`
  - `[x]` Add `getTodayFullSession()` method to `FlowSessionsService` (bundling story, flashcards, shadowing, output)
  - `[x]` Implement streak calculation & increments on Step 4 completion in `FlowSessionsService`
  - `[x]` Expose `/api/flow-session/today` in `FlowSessionsController`
- `[x]` Frontend Orchestrator Setup
  - `[x]` Create `DailyFlowContainer.jsx` to manage sequential steps 1–5
  - `[x]` Create `FlowCompletion.jsx` to display streaks and polyglot milestone badges
  - `[x]` Update `App.jsx` to delegate daily flow steps to `DailyFlowContainer`
- `[x]` Verification and validation
  - `[x]` Re-run backend unit tests
  - `[x]` Verify frontend local server compiles successfully
