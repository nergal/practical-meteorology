# Official F-Droid catalog

Cloud Atlas uses the Android application ID `app.practicalmeteorology.atlas` in both stores. The official F-Droid repository builds the APK from public source, signs it with its own app key and distributes it on its own schedule. Google Play review and Google Play credentials are independent of this process.

## First inclusion

1. Obtain the owner's approval for the public source location. Check that the tagged checkout, all build inputs, the [licenses](../README.md#licenses) and the individual photo credits are accessible to an anonymous reader.
2. Push a new stable tag such as `v1.2.3` to that public repository. Creating a tag also triggers the Google Play production workflow, so coordinate the first tag with the Play release. Making an existing tagged repository public does not replay a tag creation event.
3. Download the artifact named `fdroid-metadata-v1.2.3` from the **Prepare official F-Droid release** workflow. It contains `app.practicalmeteorology.atlas.yml` with the release commit, version name, version code and public source URL filled in.
4. Place that file under `metadata/` in a fork of [fdroiddata](https://gitlab.com/fdroid/fdroiddata). Open a merge request for initial inclusion, following the [submission guide](https://f-droid.org/docs/Submitting_to_F-Droid_Quick_Start_Guide/) and [inclusion policy](https://f-droid.org/docs/Inclusion_Policy/). Mention the mixed licenses, the lockfile for the web dependencies and the localized listing under `fastlane/metadata/android/`. Review the metadata lint and build results with the maintainers.
5. Once the recipe is accepted and the first build is indexed, check the English and Ukrainian descriptions, version and installation in F-Droid. The project is listed under its application ID.

## Later releases

Push one stable tag. For example, the workflow attached to `v1.2.3` adds `fdroid-v1.2.3-1002003` to the same commit. F-Droid's tag checker reads both the display version and the Android integer version code from this second tag. Both stores use the same mapping. Tag creation is skipped in private repositories. An existing marker pointing at a different commit causes the workflow to fail.

After inclusion, F-Droid periodically checks those markers and builds new versions using its accepted recipe. Publication can lag behind the GitHub tag. If dependencies, toolchain requirements or build steps change, propose the updated recipe in fdroiddata. A workflow artifact by itself does not update the catalog's recipe.

F-Droid and Google Play normally sign with different keys. Android users can install updates over a version signed by the same key. Switching stores with different keys requires uninstalling the existing app first, which removes local app data.
