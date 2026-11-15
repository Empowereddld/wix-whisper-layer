# Update the existing Resource Library

## Inspection findings
- The Resource Library is part of this website and can be updated directly. No replacement library or account system is needed.
- There are currently **20 resources, 244 account profiles, and 13 purchase records**. All current resources are designated English.
- Resource records already support language, category, title, description, previews, files and permanent individual links.
- Language and resource-type filtering already exist internally, but the gallery does not show those controls. Filter selections currently disappear after leaving the gallery.
- Dedicated resource pages already exist, with previews, descriptions, downloads and recommendations. Recommendations currently prioritize audience rather than language.
- Library pages require sign-in, but some PDFs use public file addresses. The Translated Resources page also currently offers direct PDF downloads. A sign-in button alone cannot protect those files.

## Changes
### 1. Language and category organization
- Add visible Language and Resource Type selectors to the existing gallery. Combine them with search, audience, saved items and sorting.
- Include English plus all ten translated languages listed in the brief. Include additional languages when assigned to resources.
- Preserve existing categories. Present poster and educational-resource labels without changing existing category assignments.
- Extend the existing resource editor with language selection and an optional link to another translation of the same resource.
- Preserve the seven supplied translated posters as original PNG images, not PDFs. Support both image and PDF resource uploads in the existing editor, with languages, categories, translation links and publishing managed without code changes.
- Defer importing the supplied posters until the separate full-integration stage. No existing resource files or records are replaced in Phase 2.

### 2. Individual resource pages
- Keep the existing pages and show language alongside the current resource details and download button.
- Add links to other language versions where connected.
- Use the exact heading **You Might Also Like**, showing up to three resources, with same-language matches first and related categories/audiences next.
- Keep **Back to Resource Library** and restore gallery filter, search, saved-only and sorting selections when returning.
- Keep recommendation purchase actions attached to the recommended item without replacing the open page's details.

### 3. Selected-resource return and deferred file migration
- Carry the exact selected resource through existing sign-in, signup, confirmation and required onboarding, then return directly to that resource rather than the gallery.
- Preserve paid resource checks, the guest Parent Guidebook purchase journey and existing optional newsletter consent. Account creation must not itself grant marketing consent.
- Private-file migration and translated-page download integration are separate future steps. Review backup, verification and rollback procedures with the owner before any live file changes.
- Phase 2 does not copy, convert, remove, replace or migrate existing public or private files.

## Verification and release
- Test combined language/type filters, additional-language handling, translation links, recommendation order and restoration of gallery selections.
- Test signed-out selected-resource redirection and signed-in resource return. Defer private-download rejection and translated-file integration testing until the separate migration stage.
- Check an existing account can still sign in, an existing paid purchase remains accessible, and all original resource IDs and purchase/account counts are preserved.
- Verify desktop and phone layouts and existing consent safeguards.
- Keep website changes unpublished. Phase 2 adds optional resource metadata fields but leaves existing resource records and files untouched. Private-file changes require a separately reviewed procedure.

## Technical approach
- Reuse `resources.languages`, `resource_type`, existing gallery hooks, resource cards and `/hub/resource/:id` pages.
- Add only an optional translation relationship to existing resource records, using an additive migration. Do not introduce a parallel resource catalogue.
- Use URL query parameters for gallery state and retain that return destination through resource navigation and sign-in.
- Reuse `resource_private_files`, the private storage bucket and `generate-download-url`, keeping all payment and publication checks intact.
- Add focused behavior tests for filter combination, recommendation priority, state restoration and signed-in download requirements.