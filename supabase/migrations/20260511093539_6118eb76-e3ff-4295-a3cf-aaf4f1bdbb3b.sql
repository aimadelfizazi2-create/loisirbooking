ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS partner_price_mad integer,
  ADD COLUMN IF NOT EXISTS partner_duration text,
  ADD COLUMN IF NOT EXISTS partner_hero_url text;