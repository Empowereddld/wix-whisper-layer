

# Update Blog Post Markdown to Use New Formatting

## What
Update the markdown body of existing blog posts (via database migration or direct update) to incorporate the callout box, pull quote, and table syntax that the CSS already supports.

## Posts to Update

### 1. Reflexive Questioning
- Wrap the opening `**Did you know?**` paragraph in a blockquote: `> **Did you know?** Children who develop...`
- Add a pull quote for the key insight about directive vs reflexive approach

### 2. Autism vs DLD
- Convert the similarities/differences comparison into a **markdown table** with columns for Feature, ASD, DLD
- Add a callout box: `> **Key takeaway:** ...`

### 3. Addressing Inequities in DLD Therapy
- The numbered list (Racial Inequity, Income, Being a Girl, etc.) already works with the step counter styling
- Add a pull quote highlighting a key stat

### 4. Finding Peace as a Parent
- Add a callout: `> **Remember:** You are not alone...`

### 5. Understanding Your Child's Development Team
- Could benefit from a table listing each team member and their role

### 6. DLD as an Adult
- Add a pull quote from Alex's story

## How
Use database updates to modify the `body` field of each published blog post, adding the correct markdown syntax:
- **Callout**: `> **Did you know?** text...` (blockquote with bold opener)
- **Pull quote**: `> *"Meaningful quote here"*` (blockquote with only italic)
- **Table**: Standard markdown table with `| Header | Header |` syntax

## Files Changed
- No code files — only database `blog_posts.body` content updates via SQL

