# Tasks for the offline cloud atlas

**Inputs** [Specification](spec.md) · [Plan](plan.md) · [Data model](data-model.md) · [Atlas interface](contracts/atlas-ui.md) · [Validation guide](quickstart.md)

## Phase 1 — Setup

- [x] T001 Configure React, TypeScript and Vite with the locked npm dependencies and launch/build commands in `package.json`, `package-lock.json`, `tsconfig.json`, `vite.config.mjs`, `index.html` and `src/main.tsx`.
- [x] T002 Configure Capacitor 7, Android build tooling and the APK build command in `capacitor.config.json`, `android/` and `package.json` after the shared npm setup.

## Phase 2 — Offline content

- [x] T003 Assemble the bundled index and assets in `scripts/content.mjs` and `src/atlas.ts` from `content/{uk,en}/clouds/` and `docs/photo-selection/`. Apply the [Genus constraints](data-model.md#genus) to `Genus.id`, `Genus.position`, `Genus.background`, `Genus.readings` and `Genus.frames`, the [Reading constraints](data-model.md#reading) to `Reading.locale`, `Reading.name`, `Reading.description` and `Reading.article`, and the [Frame constraints](data-model.md#frame) to `Frame.asset`, `Frame.captions` and `Frame.credit`.
- [x] T004 Supply the bundled reuse records in `scripts/content.mjs` and `src/atlas.ts` using the [Credit constraints](data-model.md#credit) for `Credit.title`, `Credit.creator`, `Credit.source`, `Credit.rights` and `Credit.modifications`.
- [x] T005 [P] Bundle Spectral, PT Serif and Source Sans 3 with the required glyphs and document rights in the `public/fonts/`. Wire typography and enlarged-text wrapping in `src/styles.css`.

## Phase 3 — User story 1 · Find a cloud in the field (P1)

**Goal** Browse one representative photograph at a time from first launch.

**Independent check** On fresh launch with radios disabled, page through ten correctly labelled cards using buttons and horizontal swipes. The photograph, credit, position, description and pastel background track the selected genus.

- [x] T006 [US1] Render the active card, visible source action, name, description and position in `src/App.tsx`. Apply the approved card spacing, natural photo edges and pastel backgrounds in `src/styles.css`.
- [x] T007 [US1] Bind card buttons and swipes to the same genus selection and handle the sequence boundaries in `src/App.tsx`.

## Phase 4 — User story 2 · Confirm a match (P1)

**Goal** Open the matching detail gallery, compare three photographs and read the credit for the active frame.

**Independent check** Open details via photo, action and swipe down. Compare three frames, open a current-frame credit, then return to that frame and to the originating genus card.

- [x] T008 [US2] Add the detail gallery, card entry actions, ordered localized captions and current-frame credit in `src/App.tsx`. Apply gallery spacing and gesture behavior in `src/styles.css`.
- [x] T009 [US2] Render the bundled attribution record and wire return navigation to restore the originating frame or card in `src/App.tsx`. Support Android back in the native wrapper.

## Phase 5 — User story 3 · Interpret the observation (P2)

**Goal** Read the selected article and follow a related entry in either language.

**Independent check** Scroll from over the gallery to the article, follow a related link, and return. Change the device language and verify the article, captions and navigation are localized with the current selection preserved.

- [x] T010 [US3] Render the localized article below the gallery and navigate related entries by active locale and stable slug in `src/App.tsx` and `src/atlas.ts`.
- [x] T011 [US3] Provide Ukrainian and English navigation and article text, follow the system language and preserve the current selection when it changes in `src/App.tsx`.

## Phase 6 — Release verification

- [x] T012 Verify the production build contains all 30 photographs, bilingual content, bundled credits and fonts through the `package.json` build command and `dist/` inventory.
- [x] T013 Check mobile interaction and typography against `contracts/atlas-ui.md` and `DESIGN.md`, including long credits, text zoom and gesture direction.
- [x] T014 Build the installable APK using `package.json` and `android/`. Verify package integrity and retain the APK for owner handoff.
- [ ] T015 Execute the fresh-install airplane-mode walkthrough in `quickstart.md` on Android, including all three card entry actions for a selected genus, all 30 frames and credits, and all articles across both locales.
- [ ] T016 Record the beginner field-learning result from `spec.md` separately from technical acceptance.

## Dependencies and parallel work

1. Configure the shared npm project, then work on Android tooling alongside the content index and type definitions. Font preparation can proceed independently of both.
2. Complete the offline content and card navigation for US1. During US1, visual comparison can use early builds while the untouched credit and article content are checked.
3. US2 reuses the card selection from US1. During US2, manually check attribution records against the approved photo selection in parallel with detail interaction work.
4. US3 reuses the gallery detail view from US2. During US3, bilingual proofreading and link review can proceed independently of navigation implementation.
5. Run the production and device checks after the complete field path is available.

Start with the offline card for the first vertical slice, add detail and credit navigation, then finish the article path. The APK handoff covers all three stories.
