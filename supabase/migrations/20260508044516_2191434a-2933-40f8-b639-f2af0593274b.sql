
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS partner_description text;

CREATE TABLE IF NOT EXISTS public.lightning_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id text NOT NULL,
  user_id uuid NOT NULL,
  user_name text NOT NULL,
  message text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.lightning_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users read lightning messages"
ON public.lightning_messages FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Users insert own lightning messages"
ON public.lightning_messages FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_lightning_messages_group ON public.lightning_messages(group_id, created_at);

ALTER PUBLICATION supabase_realtime ADD TABLE public.lightning_messages;
