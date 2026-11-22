# Practical Meteorology

An interactive encyclopedia for people who want to read the weather for themselves. The first release is a mobile, fully offline cloud atlas for beginners observing the sky over flat terrain or the open sea in temperate latitudes.

The first release includes the field guide in [Ukrainian](content/uk/README.md) and [English](content/en/README.md).

## Project documents

- [Product brief](docs/product-brief.md) records the audience, learning goal, observation methods and longer-term direction.
- [First release](docs/first-release.md) describes the agreed browsing experience, scope, delivery boundary and acceptance checks.
- [Atlas editorial guide](docs/atlas-editorial-guide.md) defines the photographic collection and the content of each article.
- [Cloud photographs](docs/photo-selection/README.md) groups the atlas images, captions and credits by genus.

The first delivery is an Android APK. The project owner handles distribution. The [feature specification](specs/001-offline-cloud-atlas/spec.md) defines the offline acceptance scenarios and the [design guide](DESIGN.md) records the approved typography and photo treatment.

## Run and build

Install Node.js 22.12 or later and run `npm ci`. Use `npm run dev` for local browser development or `npm run build` for the packaged web assets.

For the Android build, install JDK 21, Android SDK Platform 35 and Build Tools 34.0.0 and 35.0.0. Configure `ANDROID_HOME` for your SDK and `JAVA_HOME` for your JDK. Run `npm run android:apk` to build the web application, sync its bundled assets into Android and assemble a debug-signed APK at `android/app/build/outputs/apk/debug/app-debug.apk`. Dependency downloads require connectivity on the build machine. The installed app bundles its own content and fonts.

For a first-launch check on a device, install the APK, turn on airplane mode and open it. Open a genus, browse to frame two, read its credits and return to the same frame. Change the device language between Ukrainian and English in system settings and repeat using a genus you have never opened.

## Specification-driven development

The project uses GitHub Spec Kit 1.4.3 with Codex. To install the matching CLI, run `uv tool install specify-cli==1.4.3`. Open Codex in the repository root to use the checked-in skills. The [constitution](.specify/memory/constitution.md) records the project principles. Use `$speckit-specify` for the field experience, review the specification with the project owner, then use `$speckit-plan` and `$speckit-tasks` for implementation planning.

## Repository language

Use English for repository documentation, filenames, code, comments, credit records and commit messages. Reader-facing content uses its target language under `content/<locale>/`. The MVP supports Ukrainian (`uk`) and English (`en`). Both editions share photographs, credits and genus filenames.
