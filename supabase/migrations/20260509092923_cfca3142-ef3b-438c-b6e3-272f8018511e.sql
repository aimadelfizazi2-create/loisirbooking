-- Partner activities table: a partner manually creates / edits their own activity card
CREATE TABLE IF NOT EXISTS public.partner_activities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  short TEXT NOT NULL DEFAULT '',
  price_mad INTEGER NOT NULL DEFAULT 0,
  duration TEXT NOT NULL DEFAULT '',
  max_group INTEGER NOT NULL DEFAULT 8,
  hero_url TEXT,
  gallery_urls JSONB NOT NULL DEFAULT '[]'::jsonb,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.partner_activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Active partner activities viewable by everyone"
  ON public.partner_activities FOR SELECT
  USING (is_active = true);

CREATE POLICY "Owners view own partner activities"
  ON public.partner_activities FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Owners insert own partner activities"
  ON public.partner_activities FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Owners update own partner activities"
  ON public.partner_activities FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Owners delete own partner activities"
  ON public.partner_activities FOR DELETE
  USING (auth.uid() = user_id);

CREATE TRIGGER update_partner_activities_updated_at
  BEFORE UPDATE ON public.partner_activities
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_partner_activities_user ON public.partner_activities(user_id);
CREATE INDEX idx_partner_activities_city ON public.partner_activities(city) WHERE is_active = true;