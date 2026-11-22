# Feature Specification: Offline cloud atlas

Created 2026-11-22. Status: ready for owner review.

## User Scenarios & Testing

### User Story 1 - Find a cloud in the field (P1)

A beginner outdoors compares the sky with one representative photograph at a time.
On the first launch of a fresh installation in airplane mode, the atlas opens on
a genus card with a photograph, visible credit, name and short identifying description.
Swipe left or right, or tap the directional controls, to browse all ten genera.
The genus name, photograph, credit, description, position and pastel background change together.

### User Story 2 - Confirm a match (P1)

Tap the card's photograph or details action, or swipe down on the card. Details open
for the selected genus, with its name above the gallery. The first frame matches the
card. Swipe horizontally within the gallery or use its arrows to compare three frames.
Each change updates the position, caption, author and source. Tap the source to read
the current image's credit and reuse terms offline. Returning from credits restores
that frame. Returning from details restores the same genus card.

### User Story 3 - Interpret the observation (P2)

Scroll below the gallery to read how the cloud forms, how it may change and which
sign to watch next. Follow a related genus to its article in the current language.
A reader can access both Ukrainian and English versions of every entry, including
the captions and navigation. A reader can finish after visual comparison alone.

### Edge Cases

Vertical article scrolling must remain available when a gesture starts over the gallery.
At the ends of either sequence, navigation must keep the position and displayed content
consistent. Long names and credit lines wrap at enlarged text sizes. The gap before a
card heading starts after the last credit line. External sources may be unreachable at
sea, while their attribution records and the full atlas remain readable.

## Requirements

### Functional Requirements

- FR-01. Offer a complete field experience from first launch without connectivity, sign-in or permissions for observation.
- FR-02. Support the card, gallery, credit and return paths in stories 1 and 2, including visible alternatives to swipes.
- FR-03. Present all approved articles, related entries, photographs and captions in their editorial order in both languages.
- FR-04. Present the source, creator, rights and modifications for the active photograph. Keep credit actions distinct from opening the card.
- FR-05. Preserve the [approved visual design](../../DESIGN.md) and [mockup](../../docs/design/atlas-typography-uk.png): a toolbar-free, borderless view, one pastel background per genus, natural photo edges and separate typographic roles for reading and controls.
- FR-06. Deliver the Android release as an installable APK for distribution by the owner.

### Key Entities

A genus has one representative frame, two comparison frames and one article in each
language. A photograph has localized captions and a shared attribution record.

## Success Criteria

### Measurable Outcomes

- Starting with the radio connections disabled before first launch, browse ten genera, open all thirty photographs and their credits, and read ten articles in each language.
- From any card, open details with each supported gesture or button, reach all three frames, then return to that card. No selection, caption or credit refers to a different genus or frame.
- For a field-learning check, a beginner later describes one visible feature unaided and explains a plausible implication or a change worth watching. Record this separately from the build acceptance checks.

## Assumptions

The [release agreement](../../docs/first-release.md), bilingual content, photo collection
and approved design are inputs. The initial setting is temperate plains and open water.
The observation journal, quizzes, adaptive review and automated recognition are outside
this release. Technical choices and build verification belong in the implementation plan.
