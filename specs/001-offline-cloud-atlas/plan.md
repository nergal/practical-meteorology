# Implementation plan for the offline cloud atlas

**Feature** `001-offline-cloud-atlas` · **Date** 2026-11-22 · [Specification](spec.md)

## Summary

Build a bilingual React application that starts with a cloud photograph and leads to two comparison photographs, their local credit records and an article. Vite packages the app, photographs and fonts for Capacitor to copy into a native Android build. Verify the complete experience from a fresh installation in airplane mode before APK handoff.

## Technical context

| Area | Decision |
| --- | --- |
| Language and tooling | TypeScript, React 19, Vite and Node.js/npm |
| Android | Capacitor 7, the Android SDK platform configured in `android/variables.gradle` and JDK 21 (minimum Android API 23), with the Gradle wrapper generated for the Android project |
| Storage | Bundled Markdown, JPEG assets, font files and attribution data. Read the preferred languages from the device. Keep navigation state in the app. |
| Verification | TypeScript and production Vite build, bundle inventory, mobile interaction checks and native fresh-install acceptance |
| Target | Android APK. The shared React app can be previewed in a browser during development. |
| Scale | Ten genera, three photographs per genus and ten entries per language |
| Constraints | First launch with radios disabled, readable controls and typography, complete bundled credits, and explicit gestures and controls |

## Applying the project principles

| Principle | Implementation and review |
| --- | --- |
| I. Visible field signs | Open on a recognition card. Keep the gallery ahead of the article, and show the active caption alongside the photograph. |
| II. Evidence-based interpretation | Ship the reviewed bilingual articles and exercise their related links. Keep the field-learning exercise separate from build acceptance. |
| III. Offline first launch | Bundle all required assets and check every entry and credit from a clean install with radios disabled. |
| IV. Documented photographs | Load only the approved collection and include its source, rights and modifications in local credit records. |
| V. English repository | Keep engineering files and identifiers in English. Localize all reader-facing material to Ukrainian and English. |

The [project principles](../../docs/project-principles.md) explain these requirements. The [quickstart](quickstart.md) defines the acceptance walkthrough.

## Project structure

| Path | Purpose |
| --- | --- |
| `src/main.tsx`, `src/App.tsx`, `src/styles.css`, `index.html` | Application, typography and mobile interface |
| `src/atlas.ts`, `scripts/content.mjs` | Atlas types and bundled content assembly |
| `content/{uk,en}/clouds/` | Localized, reviewed articles and captions |
| `docs/photo-selection/` | Approved JPEGs and their editorial attribution records |
| `package.json`, `package-lock.json`, `tsconfig.json`, `vite.config.mjs` | Type checking, development and production build |
| `capacitor.config.json`, `android/` | Native WebView shell and APK build |
| `specs/001-offline-cloud-atlas/` | Specification, plan, decisions, data model, interface contract and acceptance checks |

Use a single client project and a native Android shell. Local source files are build inputs for a self-contained `dist/` directory.

## Supporting documents

- [Technical decisions](research.md) explain the bundling, navigation and distribution choices.
- The [data model](data-model.md) and [atlas interface](contracts/atlas-ui.md) define the content and interaction behavior.
