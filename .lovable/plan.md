

# Restore Full Original Blog Content with Enhanced Formatting

## Problem
When adding the new typography styles (callout boxes, pull quotes, tables), significant content was cut from several blog posts. The original WordPress content has paragraphs, sub-sections, references, and details that are now missing.

## Posts Requiring Restoration (6 posts)

### 1. Reflexive Questioning (`empowering-your-child-through-reflexive-questioning`)
**Missing content:**
- "Why is this Important?" section with 3 bullet points (self-awareness, reflection, empowerment)
- "If your child seems unsure..." follow-up guidance after the Morning Rush scenario
- "Pro Tip" about visual aids
- The directive vs reflexive comparison lines
- Each scenario's italic `_Scenario:_` context descriptions (e.g., "Your child forgets their hockey stick")
- "Staying Organized" and "Learning from Mistakes" and "Encouraging Persistence" scenarios (3 entire scenarios missing)
- Course CTA paragraph at the end

### 2. DLD as an Adult (`dld-as-an-adult`)
**Missing content:**
- Extended intro paragraph about "Empowered DLD Parenting" and the stats about interpersonal relationships/mental health
- Extended "Challenges" section about grade 4 fighting/withdrawing, the grade 7 devoted teacher who understood DLD
- "Alex's Fiancé" section entirely missing (met on hiking trail, Emily)
- Extended career section about overcoming hurdles, work ethic, promotion to supervisor
- "Persistence and Resilience" section entirely missing
- "Inspiring Others, Shaping the Future" section entirely missing
- "Acknowledge the challenges of DLD during family discussions" bullet point
- Thank-you closing line

### 3. Addressing Inequities (`addressing-inequities-in-dld-therapy`)
**Missing content:**
- Income section missing "If a child's mom doesn't have a lot of education..." bullet
- "Hard for English Learners" missing extended explanation about not knowing enough English
- "More Challenges" missing extended explanation
- Strategy 1 missing sub-bullet about teachers/doctors learning about DLD
- Strategy 2 missing extended explanation
- Strategy 3 missing extended explanation about training more teachers/doctors
- "Closing Thoughts" paragraph entirely missing

### 4. Finding Peace (`finding-peace-as-parent-of-child-with-dld`)
**Missing content:**
- Intro paragraph mentioning "I've seen so many parents struggle with feelings of guilt, hopelessness, and anxiety"
- "These challenges can lead to:" section (strained marriages, career setbacks, etc.)
- Each strategy missing sub-bullets (e.g., "Join online communities like the DLD Community on Facebook", specifics for self-care)
- "Focus on the moments of profound love, joy, and pride..." paragraph
- "Have you found a strategy that helps?" CTA
- **References section entirely missing** (Green 2007, Green 2003, Hobson et al. 2022, Hoyle et al. 2021)

### 5. Development Team (`understanding-your-childs-development-team`)
**Missing content:**
- Each professional's detailed "Focuses on:" sub-bullets (SLP: articulation, vocabulary, grammar; Psychologist: assessments for intelligence, diagnoses; OT: self-regulation, executive function, sensory processing; Special Ed: IEPs; Reading Specialist: phonics, comprehension; Counselor: self-esteem, confidence, resilience)
- Extended "Your Role" paragraph about insights and daily observations being invaluable
- "Working Together for Your Child" section entirely missing
- "We'd Love to Hear From You!" section entirely missing

### 6. Autism vs DLD (`autism-vs-dld-understand-the-difference`)
This was already restored in the previous message. Verify sources are intact (they appear to be).

## Approach
- Use the database insert tool to run `UPDATE` statements on each post's `body` field
- Restore the full original content from the WordPress site
- Keep the enhanced formatting syntax where it fits naturally (callout boxes, pull quotes)
- Preserve all sources/references sections

## No Code File Changes
Only database `blog_posts.body` updates via SQL.

