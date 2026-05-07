CREATE TABLE public.activity_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  activity_id text NOT NULL,
  query text NOT NULL,
  hero_url text NOT NULL,
  gallery_urls jsonb NOT NULL DEFAULT '[]'::jsonb,
  source text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(activity_id)
);

ALTER TABLE public.activity_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Activity images viewable by everyone"
ON public.activity_images FOR SELECT
USING (true);

CREATE INDEX idx_activity_images_activity ON public.activity_images(activity_id);