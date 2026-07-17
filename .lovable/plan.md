## Task
Remove the following text from the description shown under the **Description** tab on the resource detail page for *Supporting a Child with DLD: A Guide for Tutors*:

> Who Is This For:
> - Tutors supporting a child with DLD or language differences
> - Parents sharing a quick, clear guide with their child's tutor
> - Educators and support staff working one to one with students
> - Anyone who helps a child learn and wants to understand DLD

## What I found
The text is stored in the `long_description` column of the `resources` table for the resource with ID `ca08f2dd-6e0c-42dc-8dbe-51e7b3b8739b`. The current value ends with that block appended after the main description.

The separate **Who Is This For** tab is powered by the `great_for` array and will remain unchanged.

## Plan
1. Update the `long_description` column for this resource, stripping the trailing `\n\nWho Is This For:...` block and leaving only the main description ending with `"What can I do to help?"`.
2. Verify the change by re-querying the database.

## SQL to run
```sql
UPDATE resources
SET long_description = 'Developmental Language Disorder (DLD) affects roughly 1 in 14 people, yet it often goes unnoticed in tutoring sessions where children are quietly struggling to understand language, follow instructions, or express what they know. This short, welcoming guide gives tutors a clear starting point.

Inside, you''ll find plain-language explanations of what DLD is, how it can show up during learning, and small, doable strategies that make a real difference: simpler instructions, extra processing time, visual supports, and ways to build a child''s confidence alongside their skills. It also offers a compassionate lens for understanding behaviour that might otherwise be misread. Designed to be easy to reference and share, it helps the adults around a child move from "What is DLD?" to "What can I do to help?"'
WHERE id = 'ca08f2dd-6e0c-42dc-8dbe-51e7b3b8739b';
```

No application code changes are required.