ALTER TABLE public.resources ADD COLUMN IF NOT EXISTS translation_group_id uuid REFERENCES public.resources(id) ON DELETE SET NULL;
ALTER TABLE public.resources ADD COLUMN IF NOT EXISTS file_format text;
CREATE INDEX IF NOT EXISTS resources_translation_group_idx ON public.resources(translation_group_id);
COMMENT ON COLUMN public.resources.translation_group_id IS 'Canonical resource ID shared by language versions; null resources use their own ID as the group.';
COMMENT ON COLUMN public.resources.file_format IS 'Optional uploaded file extension; existing resources retain their original file addresses and formats.';