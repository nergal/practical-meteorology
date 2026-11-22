# Practical Meteorology project principles

## Core Principles

### I. Start with what the observer can see

Readers must be able to browse photographs, compare a possible match with other images
and choose how far to explore. Captions must point to a visible feature in the frame.
Prior knowledge of cloud names, a camera and automated identification cannot be prerequisites.
The learning goal is met when a beginner later notices a feature unaided and can explain
its significance or identify a useful change to watch for.

### II. Tie weather interpretations to evidence

Articles must connect an observable sign to a physical process and explain how another
observation could strengthen or weaken an interpretation. Qualitative outlooks for rain,
wind and temperature must distinguish present conditions from possible developments.
Use a time horizon supported by the signs within the intended 1 to 24 hour window.
For example, high wisps alone give little basis for predicting rain at the observer's
location. A spreading veil and subsequent thickening provide additional evidence.
Any supporting signs must be accessible in the field through personal observation,
including felt changes in wind or temperature and optional barometer readings.

### III. Make the complete atlas available on first launch offline

The build must include every photograph, caption, article and internal reference needed
to explore the atlas. Release verification must start with a fresh installation, disable
connectivity before the first launch and check the complete collection, including entries
never opened before. A reader at sea must be able to use the atlas under those conditions.

### IV. Use identifiable, documented photographs

Every published photograph must have a checked cloud identification and documented rights
for offline redistribution. Record its source, creator, license or permission, required
attribution and modifications. Each caption must identify the relevant cloud when several
appear together. Historical claims and optional facts must have credible sources.
The editorial criteria are in the [atlas editorial guide](atlas-editorial-guide.md).

### V. Maintain the repository in English

Engineering documentation, filenames, specifications, code, comments, source records and
commit messages must use English. Reader-facing material uses the product languages approved
by the project owner, including localized articles and photograph captions.

## Release Scope

The [first-release agreement](first-release.md) defines the MVP collection,
field settings, deferred features and APK handoff. The [product brief](product-brief.md)
defines the learning outcome. Release quantities and platform choices belong in the release
agreement and technical plan so they can evolve independently of these principles.

## Specification and Review

Describe observable behavior and acceptance scenarios in the feature specification.
Review substantive product changes with the project owner. Record technical decisions
in the implementation plan and check the resulting behavior against the acceptance
scenarios. Refer unresolved product decisions to the owner.

## Governance

Propose amendments with their rationale and the specifications, plans or content they affect.
The project owner approves substantive changes. Record the amendment date and apply semantic
versioning: major for incompatible changes to principles, minor for additions or material
expansions, and patch for clarifications. Reconcile affected documents when adopting an
amendment. If a planned change conflicts with a principle, resolve the conflict with the
owner before implementation.

**Version**: 1.0.1 | **Ratified**: 2026-11-21 | **Last Amended**: 2026-11-22
