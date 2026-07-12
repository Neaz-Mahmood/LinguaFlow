# LinguaFlow Adaptive Onboarding Tasks

- `[x]` Database & Backend Schema updates
  - `[x]` Update `User` entity with `nativeLanguage`, `goals`, and `contentRatios` columns
  - `[x]` Update `UsersService` onboarding logic to calculate content ratios
  - `[x]` Verify NestJS compile stability and PostgreSQL compatibility
- `[x]` Frontend UI & Styles updates
  - `[x]` Update `Onboarding.jsx` to support the full 4-step stepper wizard
  - `[x]` Implement visual assets in `Onboarding.jsx` (Flags grid, Time cards with tooltip, preference toggle cards, goal multiselect)
  - `[x]` Style Flag grid, segmented controls, tooltips, goals select, and spinners in `index.css`
  - `[x]` Integrate state updates in `App.jsx`
- `[x]` Verification and validation
  - `[x]` Re-run backend test suites to confirm compile stability
  - `[x]` Verify frontend local server functionality
