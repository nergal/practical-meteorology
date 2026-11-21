# Practical Meteorology

An interactive encyclopedia for people who want to read the weather for themselves. The first release is a mobile, fully offline cloud atlas for beginners observing the sky over flat terrain or the open sea in temperate latitudes.

## Project documents

- [Product brief](docs/product-brief.md) records the audience, learning goal, observation methods and longer-term direction.
- [First release](docs/first-release.md) describes the agreed browsing experience, scope, delivery boundary and acceptance checks.
- [Atlas editorial guide](docs/atlas-editorial-guide.md) defines the photographic collection and the content of each article.

Product discovery for the first release is complete. The working stack is Capacitor, React and TypeScript, with Android first and iOS planned. The requested build artifact is an APK. The project owner handles distribution.

## Specification-driven development

The project uses GitHub Spec Kit 1.4.3 with Codex. To install the matching CLI, run `uv tool install specify-cli==1.4.3`. Open Codex in the repository root to use the checked-in skills. Start with `$speckit-constitution` to draft project principles from the product documents. Use `$speckit-specify` for the field experience, review the specification with the project owner, then use `$speckit-plan` and `$speckit-tasks` for implementation planning.

## Repository language

Use English for everything added to this repository, including documentation, filenames, source code, comments, asset descriptions and commit messages. The language of the published interface and articles remains a separate product decision.
