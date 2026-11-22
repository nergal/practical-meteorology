# Practical Meteorology

An interactive encyclopedia for people who want to read the weather for themselves. The first release is a mobile, fully offline cloud atlas for beginners observing the sky over flat terrain or the open sea in temperate latitudes.

The first release includes the field guide in [Ukrainian](content/uk/README.md) and [English](content/en/README.md).

## Project documents

- [Product brief](docs/product-brief.md) records the audience, learning goal, observation methods and longer-term direction.
- [First release](docs/first-release.md) describes the agreed browsing experience, scope, delivery boundary and acceptance checks.
- [Atlas editorial guide](docs/atlas-editorial-guide.md) defines the photographic collection and the content of each article.
- [Cloud photographs](docs/photo-selection/README.md) groups the atlas images, captions and credits by genus.

Product discovery for the first release is complete. The working stack is Capacitor, React and TypeScript, with Android first and iOS planned. The requested build artifact is an APK. The project owner handles distribution.

## Specification-driven development

The project uses GitHub Spec Kit 1.4.3 with Codex. To install the matching CLI, run `uv tool install specify-cli==1.4.3`. Open Codex in the repository root to use the checked-in skills. Start with `$speckit-constitution` to draft project principles from the product documents. Use `$speckit-specify` for the field experience, review the specification with the project owner, then use `$speckit-plan` and `$speckit-tasks` for implementation planning.

## Repository language

Use English for repository documentation, filenames, code, comments, credit records and commit messages. Reader-facing content uses its target language under `content/<locale>/`. The MVP supports Ukrainian (`uk`) and English (`en`). Both editions share photographs, credits and genus filenames.
