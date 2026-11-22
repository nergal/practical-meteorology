# Offline atlas data model

These are logical entities. The Vite content module assembles each locale by genus, and the UI derives position and pastel background from the ordered entries and their stable IDs.

## Genus

| Field | Constraint |
| --- | --- |
| `Genus.id` | Unique stable English slug shared by filenames and article links |
| `Genus.position` | Unique position in the atlas order |
| `Genus.background` | Pastel colour assigned to the genus |
| `Genus.readings` | One Ukrainian and one English `Reading` |
| `Genus.frames` | Three ordered `Frame` entries. Index zero is the representative photograph. |

## Reading

| Field | Constraint |
| --- | --- |
| `Reading.locale` | `uk` or `en` |
| `Reading.name` | Localized name, with the Latin genus available in both languages |
| `Reading.description` | Short localized description of an observable feature |
| `Reading.article` | Nonempty localized article with internal links resolved by genus slug and active locale |

## Frame

| Field | Constraint |
| --- | --- |
| `Frame.asset` | Bundled JPEG referenced by the approved photo collection |
| `Frame.captions` | One localized caption per locale, matched to the frame's position |
| `Frame.credit` | One shared attribution record for the asset |

## Credit

| Field | Constraint |
| --- | --- |
| `Credit.title` | Original title |
| `Credit.creator` | Creator and required attribution wording when applicable |
| `Credit.source` | Source collection and original URL |
| `Credit.rights` | Reuse terms and link to the license or rights declaration |
| `Credit.modifications` | Editorial record of crop, resize or other modifications, or confirmation that the original was used |

## View state

Card navigation selects a genus. Opening details selects frame zero for that genus. Gallery navigation selects one of its three frames. A credit record is associated with the frame that opened it. Closing it restores that frame. Returning from a related entry restores its originating view, and leaving the original details restores the genus card. Language changes preserve the current genus and frame.
