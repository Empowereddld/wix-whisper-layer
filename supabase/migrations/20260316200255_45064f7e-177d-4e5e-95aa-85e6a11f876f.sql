
ALTER TABLE public.resources ADD COLUMN IF NOT EXISTS long_description text;
ALTER TABLE public.resources ADD COLUMN IF NOT EXISTS great_for text[];

UPDATE public.resources
SET
  long_description = E'Meaningful conversations with children help build language, confidence, and strong relationships. This printable guide includes a collection of conversation starter cards designed to spark thoughtful and fun discussions between parents and children.\n\nThe prompts are organized into themes such as silly questions, social emotional reflections, home life conversations, and school life discussions. Each question invites children to share their ideas, experiences, and feelings while giving parents a simple way to keep conversations going.\n\nThese prompts can be used during everyday moments such as family dinners, bedtime routines, car rides, or quiet one on one time. The goal is not just to ask questions, but to create opportunities for connection, storytelling, and deeper understanding.\n\nBecause the cards are printable, families can cut them out and use them again and again whenever they want to start a meaningful conversation.',
  great_for = ARRAY[
    'Parents who want to build stronger everyday conversations with their child',
    'Encouraging children to share thoughts, feelings, and experiences',
    'Supporting language development through natural conversation',
    'Family connection during meals, car rides, or bedtime routines',
    'Sparking storytelling, imagination, and social emotional reflection'
  ]
WHERE id = '2630ce77-c3b2-49cd-bf73-da63799d0d0a';
