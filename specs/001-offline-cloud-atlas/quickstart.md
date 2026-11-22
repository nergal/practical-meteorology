# Validate the offline cloud atlas

## Build and install

Use Node.js compatible with the locked Vite release, JDK 21, an Android SDK matching `android/variables.gradle`, and an Android device or emulator. Make the SDK and its platform tools available to Gradle and ADB.

```sh
npm ci
npm run build
npm run android:apk
```

The debug APK produced by this command is at `android/app/build/outputs/apk/debug/app-debug.apk`. For a fresh-install check, use a clean test device or emulator. Disable connectivity before launching the installed build and keep it disabled for the entire walkthrough.

```sh
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

## Acceptance walkthrough

1. Open the app in airplane mode with Wi-Fi also disabled. Confirm the first genus card has an image, visible credit, name, description and position.
2. Browse all ten genera with directional buttons and swipes. Confirm the card photograph, text, background and position update together. Exercise both ends of the sequence.
3. Open a card via its image, details action and downward swipe. Verify that the first gallery photograph matches the card each time.
4. On each of the ten detail views, page through all three photographs. Check that each active caption, position and credit corresponds to the frame. Open each bundled credit and verify return to the same frame. Verify return to the originating card.
5. Begin a vertical scroll over a gallery and reach the article. Open a related genus, verify that its article opens in the active language and return to the originating article.
6. In both Ukrainian and English, visit all ten articles and check all localized captions. Increase text size and check long credit lines, wrapped headings and controls.
7. Record the device, Android version, APK identity and observed result. Record the beginner field-learning exercise separately from package acceptance.

The [interface contract](contracts/atlas-ui.md) covers the expected control behavior. `npm run dev` opens the browser preview for development.
