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
- Keep each translation as a separate resource with its own permanent link, title, description, preview and PDF. Import the seven already supplied translated PDFs without duplicating any matching existing records.

### 2. Individual resource pages
- Keep the existing pages and show language alongside the current resource details and download button.
- Add links to other language versions where connected.
- Use the exact heading **You Might Also Like**, showing up to three resources, with same-language matches first and related categories/audiences next.
- Keep **Back to Resource Library** and restore gallery filter, search, saved-only and sorting selections when returning.
- Keep recommendation purchase actions attached to the recommended item without replacing the open page's details.

### 3. Signed-in downloads
- Route translated-page “Get Resource” buttons to the corresponding library resource page, through the existing sign-in process when needed. Retain the public translated page and its ten language sections.
- Store translated PDFs privately and reuse the existing verified-account download service. Do not create a second download system.
- Protect existing no-cost library PDFs too: copy and verify each file in private storage, retain its resource ID and metadata, then remove public downloadable copies only after successful verification. Do not delete resource records, accounts or purchases. Public previews remain available.
- Remove publicly served translated PDF copies after their protected replacements are verified.
- Preserve paid resource checks and the existing guest Parent Guidebook purchase journey.
- Preserve the existing login, onboarding and optional newsletter consent. Account creation must not itself grant marketing consent.

## Verification and release
- Test combined language/type filters, additional-language handling, translation links, recommendation order and restoration of gallery selections.
- Test signed-out download rejection and signed-in access to both an existing resource and a translated PDF.
- Check an existing account can still sign in, an existing paid purchase remains accessible, and all original resource IDs and purchase/account counts are preserved.
- Verify desktop and phone layouts and existing consent safeguards.
- Keep website changes unpublished. Private-file and resource-record changes affect the shared live library, so execute file protection in verified steps with rollback copies kept outside public serving paths.

## Technical approach
- Reuse `resources.languages`, `resource_type`, existing gallery hooks, resource cards and `/hub/resource/:id` pages.
- Add only an optional translation relationship to existing resource records, using an additive migration. Do not introduce a parallel resource catalogue.
- Use URL query parameters for gallery state and retain that return destination through resource navigation and sign-in.
- Reuse `resource_private_files`, the private storage bucket and `generate-download-url`, keeping all payment and publication checks intact.
- Add focused behavior tests for filter combination, recommendation priority, state restoration and signed-in download requirements.