# Phase 3 follow-up: test results and private-file proposal

## Implemented in preview

- Both email-registration pages collect required first name and optional last name. New-member onboarding also offers these fields, including for social signups. Existing completed members bypass onboarding without profile changes.
- Names are trimmed and length-validated, saved to the existing profile fields through existing account creation and onboarding. No schema or auth-template changes.
- The shared download helper fetches original file bytes using the existing file URL or authorized signed URL and delivers a descriptive title/language filename. The resource preview is unchanged.
- Desktop downloads start automatically. On touch devices, Download prepares the file and a Save file action preserves browser permission to save; compatible phones offer the native share sheet with Save to Files.

## Tests

| Test | Result |
| --- | --- |
| Earlier real email verification, onboarding, exact French poster return | Passed, reported by owner |
| Post-change real signup and profile name saving | Passed: ResourceTest / Verification saved, no immediate session |
| Confirmation requirement | Passed: new test account remains unconfirmed, verification screen shown |
| Selected resource to login/signup destination | Passed with exact French poster return path |
| Existing signed-in account PNG and PDF downloads | Passed with original file signatures and nonempty bytes |
| Desktop 1280px and phone-width 393px downloads | Passed |
| Touch Download then Save file | Passed for PNG and PDF in Chromium phone emulation |
| Filename | Word Finding Strategies - French.png; Dan and Daria Self Advocacy Poster - English.pdf |
| Download-specific errors | Zero console errors, page errors or failed requests |
| Automated tests | 18 passed across names, delivery, organization, return paths, translations and gallery |
| New post-change email click, onboarding save and final return | Pending owner mailbox action, not marked passed |
| Physical iPhone Safari share sheet and Save to Files | Manual verification needed |
| Existing-member password login | Not retested; authenticated existing-member access tested |

New confirmation requested for jinean+resource-test-20261116@empowereddld.com. Actual alias delivery is unverified. Test credentials remain only in temporary browser-test storage, never project source or this report.

## Current security finding

The resources bucket is public and its read policy allows anyone to read objects. An account-gated Download button cannot protect those direct file URLs. The private resources-private bucket is not public and has admin-only object reads; member delivery goes through generate-download-url. Until an approved migration removes public access to originals, existing public URLs remain reachable without signing in.

Read-only inventory at review: 28 resources, 247 profiles after the new test, 14 purchases before testing, 32 public-bucket files and 7 private-bucket files. This work changes no existing accounts, purchases, file objects or product records. Public files may include samples, so count alone is not a migration list.

## Proposed separate migration, NOT approved or executed

1. **Inventory and backup first.** Map every downloadable original to its resource ID, URL, format, byte size and SHA-256 checksum. Identify shared objects and distinguish downloadable originals from public thumbnails/sample previews. Export resource/private-file mappings and relevant access policies into an encrypted, access-controlled backup; copy original bytes to private backup storage and verify every checksum. Record counts and a restore manifest. Do not include customer data in public artifacts.
2. **Verify the existing gate.** Confirm verified-email enforcement server-side and signed-out denial in generate-download-url, keeping admin and paid-purchase rules intact. The current function validates identity but does not explicitly check email_confirmed_at. Add an explicit check for the member-only no-cost path as part of the separately approved migration scope, not a blanket change to guest paid access. Review revoked/refunded access behavior without altering existing paid fulfillment or guest passes.
3. **Copy, never convert.** Copy approved no-cost originals to resources-private with unique paths; preserve PNG/PDF bytes. Verify sizes and hashes before changing mappings. Do not move paid files, products, purchases, previews or thumbnails.
4. **Switch mappings in controlled batches.** For the same resource IDs, create/update resource_private_files mappings, set is_private=true and clear public file_url in one transaction. Resource-page URLs and translation relationships stay identical. The existing admin editor already supports private files; verify its create/edit flow before cutover. Signed-in verified members request an expiring URL via the existing function and save bytes through the shared download helper.
5. **Test before public removal.** Check verified members, unverified members, signed-out visitors and non-purchasers. Test direct private-object requests, the signing endpoint without identity, expired links, unpublished drafts, both formats and desktop/mobile. Re-test actual paid purchaser delivery and guest guidebook delivery without creating/refunding real purchases. A previously issued signed link remains a bearer capability until its short expiry; signing out does not instantly invalidate it.
6. **Remove public originals only after approval and validation.** Keeping an original public copy means protection is incomplete. After the private path works, remove only approved originals from the public bucket, retaining private backup copies. Purge/invalidate cached public URLs where supported, then test old URLs without a session. Already-downloaded copies cannot be revoked and cached copies may persist until expiry. Do not make the entire bucket private, as it may contain samples needed by the published site.
7. **Rollback.** Before public removal, restore the saved resource mapping and flags if any batch fails. After removal, restoring public originals would deliberately re-expose files and requires explicit approval; safer rollback is to restore the verified original bytes to private storage and retain the account gate. Backups include hashes and exact previous mappings so neither route loses files. Stop immediately on mismatched bytes, broken editor links or paid-access regressions.

The shared backend serves the published website too. An approved storage cutover affects live downloads even without publishing frontend changes, so schedule and approve that cutover independently. No storage settings, policies, file migrations or deletions were made in this follow-up.