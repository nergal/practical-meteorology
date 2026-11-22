# Google Play production releases

Pushing a new stable version tag triggers **Release to Google Play**. GitHub Actions builds an Android App Bundle (AAB) from the tagged commit, signs it with the upload key, saves it as a workflow artifact and submits it to the production track. With managed publishing off, Google releases the approved version to all eligible users in the countries selected in Play Console. A green workflow confirms submission. Play Console shows review and availability.

## Set up the app once

1. In Play Console, open **All apps → Create app**, select **App** and **Free**, and create the listing. When uploading the first bundle, confirm the permanent package name `app.practicalmeteorology.atlas`. Complete the store listing, screenshots, privacy policy, Data safety, content declarations, country selection and any testing requirements shown for your account. Obtain production access and turn off managed publishing for automatic release after approval. [Production access](https://support.google.com/googleplay/android-developer/answer/14151465) · [Publishing overview](https://support.google.com/googleplay/android-developer/answer/9859654)
2. Enroll in Play App Signing. Let Google manage the app signing key and keep a separate, stable upload key with an offline backup. For an existing Play app, use its registered upload key. To create a new upload key, run the command below in a private directory outside the repository. It prompts for passwords. [Play App Signing](https://developer.android.com/studio/publish/app-signing#app-signing-google-play)

   ```sh
   keytool -genkeypair -storetype JKS -keystore cloud-atlas-upload.jks \
     -alias upload -keyalg RSA -keysize 3072 -validity 10000
   ```

3. In GitHub, create the environment `google-play` under **Settings → Environments**. Allow version tags `v*` in its deployment rules. Use a tag ruleset to restrict creation of these tags to release maintainers and protect them from updates and deletion. Configure these environment secrets:

   | Secret | Value |
   | --- | --- |
   | `PLAY_UPLOAD_KEYSTORE_BASE64` | Base64 encoding of the entire upload keystore |
   | `PLAY_UPLOAD_KEY_ALIAS` | Upload key alias |
   | `PLAY_UPLOAD_STORE_PASSWORD` | Keystore password |
   | `PLAY_UPLOAD_KEY_PASSWORD` | Private key password |

   With GitHub CLI authenticated, the keystore can be transferred directly from the private directory:

   ```sh
   base64 < cloud-atlas-upload.jks | gh secret set PLAY_UPLOAD_KEYSTORE_BASE64 \
     --repo nergal/practical-meteorology --env google-play
   ```

4. In Google Cloud, enable the **Google Play Android Developer API**, create a service account, and configure GitHub as an OIDC provider for Workload Identity Federation. Restrict the provider to the numeric owner and repository IDs of `nergal/practical-meteorology`, the `google-play` environment and version tag refs. Map `google.subject=assertion.sub` and `attribute.repository_id=assertion.repository_id`. For this repository, use the following provider condition:

   ```text
   assertion.repository_owner_id == '60627' &&
   assertion.repository_id == '1467029249' &&
   assertion.environment == 'google-play' &&
   assertion.ref.startsWith('refs/tags/v')
   ```

   Grant **Workload Identity User** on the service account to `principalSet://iam.googleapis.com/projects/PROJECT_NUMBER/locations/global/workloadIdentityPools/POOL_ID/attribute.repository_id/1467029249`, substituting the pool project number and pool ID. In **Play Console → Users and permissions**, invite the service account email, limit app access to Cloud Atlas and grant **Release to production, exclude devices, and use Play App Signing** along with app visibility. Set GitHub environment variables `PLAY_WORKLOAD_IDENTITY_PROVIDER` (full provider resource name with the Google Cloud project number) and `PLAY_SERVICE_ACCOUNT` (service account email). The workflow exchanges GitHub's OIDC token for a short-lived Google access token. [Google authentication action](https://github.com/google-github-actions/auth#workload-identity-federation-through-a-service-account) · [Play API setup](https://developers.google.com/android-publisher/getting_started)

5. For a new app, upload the first signed bundle through Play Console. The publishing API requires an existing app with an initial upload. The workflow's **bundle** job produces the signed AAB before the **publish** job needs Play access. You can use that artifact for the first manual upload and finish any first-release or closed-testing steps that Play Console requires. Once eligible, rerun only the failed **publish** job to submit the same artifact, or push the next version tag for an update. [Play API prerequisites](https://developers.google.com/android-publisher/edits)

## Publish a version

Choose a version higher than previous releases. For example, on the intended release commit:

```sh
git tag -a v1.2.3 -m "Release 1.2.3"
git push origin refs/tags/v1.2.3
```

The tag sets Android's version name (`1.2.3`) and version code (`1002003`). The code is `major × 1000000 + minor × 1000 + patch`. Minor and patch each range from 0 to 999. The final code must be between 1 and 2100000000. Use plain decimal components without leading zeros. Main branch pushes continue to generate debug APKs separately.

## Retry a submission

Open **Actions → Release to Google Play** and rerun failed jobs after fixing the reported problem. The publish job retrieves the original signed artifact, compares its SHA-256 with any existing bundle of the same version code, and checks the production track before submission. If Google is already reviewing another release, wait for that review and rerun the failed job. A different binary requires a new version. If the original artifact has expired, use a new tag.
