# Practical Meteorology

An interactive encyclopedia for people who want to read the weather for themselves. The first release is a mobile, fully offline cloud atlas for beginners observing the sky over flat terrain or the open sea in temperate latitudes.

The first release includes the field guide in [Ukrainian](content/uk/README.md) and [English](content/en/README.md).

## Project documents

- [Project principles](docs/project-principles.md) explain what the atlas must teach, what evidence it can use and how to review changes.
- [Product brief](docs/product-brief.md) records the audience, learning goal, observation methods and longer-term direction.
- [First release](docs/first-release.md) describes the agreed browsing experience, scope, delivery boundary and acceptance checks.
- [Atlas editorial guide](docs/atlas-editorial-guide.md) defines the photographic collection and the content of each article.
- [Cloud photographs](docs/photo-selection/README.md) groups the atlas images, captions and credits by genus.

Each update to main produces an Android APK for testing. Version tags submit signed Android App Bundles to Google Play. The [feature specification](specs/001-offline-cloud-atlas/spec.md) defines the offline acceptance scenarios and the [design guide](DESIGN.md) records the approved typography and photo treatment.

## Run and build

Install Node.js 22.12 or later and run `npm ci`. Use `npm run dev` for local browser development or `npm run build` for the packaged web assets.

For the Android build, install JDK 21, Android SDK Platform 36 and Build Tools 34.0.0 and 35.0.0. Configure `ANDROID_HOME` for your SDK and `JAVA_HOME` for your JDK. Run `npm run android:apk` to build the web application, sync its bundled assets into Android and assemble a debug-signed APK at `android/app/build/outputs/apk/debug/app-debug.apk`. Dependency downloads require connectivity on the build machine. The installed app bundles its own content and fonts.

For a first-launch check on a device, install the APK, turn on airplane mode and open it. Open a genus, browse to frame two, read its credits and return to the same frame. Change the device language between Ukrainian and English in system settings and repeat using a genus you have never opened.

### Download an APK

Every push to `main` triggers an Android build. After the APK passes signature and alignment checks, GitHub Actions publishes `cloud-atlas-debug.apk` under [Releases](https://github.com/nergal/practical-meteorology/releases). Each release points to the commit it was built from. Each fresh runner signs the APK with its own debug key, so installing a newer build over an existing one may require uninstalling the previous build first.

## Google Play releases

Pushing a stable version tag such as `v1.2.3` submits a signed bundle to the production track for full rollout after Google approves it. Complete the [Google Play setup](docs/google-play.md) before the first release.

## F-Droid releases

The [F-Droid release guide](docs/fdroid.md) covers the initial catalog submission and subsequent updates from stable version tags. F-Droid builds and signs its own APK from the public source.

## Licenses

The [MIT License](LICENSE) covers original application code. Both editions of the original articles use [CC BY 4.0](public/licenses/CC-BY-4.0.txt). The cloud launcher icon uses [CC0 1.0](public/licenses/CC0-1.0.txt). The [attribution notice](public/licenses/NOTICE.txt) gives the credit to use when sharing the articles. Each photograph has its own terms in the [photo records](docs/photo-selection/README.md). Font notices accompany the files in [public/fonts](public/fonts/), and bundled third-party tools retain their upstream licenses.

## Repository language

Use English for repository documentation, filenames, code, comments, credit records and commit messages. Reader-facing content uses its target language under `content/<locale>/`. The MVP supports Ukrainian (`uk`) and English (`en`). Both editions share photographs, credits and genus filenames.
