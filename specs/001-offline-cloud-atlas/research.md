# Technical decisions for the offline cloud atlas

## Bundle the collection at build time

Use Vite asset imports for JPEGs and fonts and include the bilingual articles and attribution data in the production output. Resolve all internal entry links in the client. Vite emits the web bundle into `dist/`, and Capacitor copies it into the Android project. This provides a predictable first launch at sea. A service worker with a cache populated on first use would depend on prior access. A database would add a data layer for static content. [Vite static asset handling](https://vite.dev/guide/assets.html) · [Capacitor Android setup](https://capacitorjs.com/docs/v7/android)

## Keep interaction state local

Use the genus and frame indexes to select related values as a unit, with a view history for card, details and credit. Preserve the current frame when closing its credit record and the selected genus when returning from details. Use the same navigation actions for buttons and directional gestures. Distinguish horizontal gallery gestures from vertical article scrolling. Browser URL routing is available if deep links later become a requirement. A transient field session needs only the app's view state.

## Bundle typography and keep source actions explicit

Bundle the Latin and Cyrillic glyphs used by Spectral, PT Serif and Source Sans 3. Use the approved photo and typography layout, allow wrapping and use a discrete link for the bundled credit. A hosted font stylesheet would require connectivity. Use the original attribution URL only through a separate action in that credit view.

## Package Android and verify first launch

Use Capacitor with the Gradle wrapper and an Android SDK matching the native project's configured platform. Build an installable package locally and check it with the Android tooling. An Android device or emulator can verify the APK with network disabled before first launch. The web preview is useful for iteration and interaction checks. The APK acceptance walkthrough exercises the native package and its assets.
