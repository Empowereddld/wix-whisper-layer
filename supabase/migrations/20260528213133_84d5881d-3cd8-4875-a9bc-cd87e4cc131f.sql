
UPDATE public.resources
SET is_private = true
WHERE id = '31f2e93e-7b0e-4750-9be5-e8ef9ebc35f3';

INSERT INTO public.resource_private_files (resource_id, storage_path)
VALUES ('31f2e93e-7b0e-4750-9be5-e8ef9ebc35f3', 'resources-private/dan-daria-graphic-organizers.pdf')
ON CONFLICT (resource_id) DO UPDATE SET storage_path = EXCLUDED.storage_path, updated_at = now();
