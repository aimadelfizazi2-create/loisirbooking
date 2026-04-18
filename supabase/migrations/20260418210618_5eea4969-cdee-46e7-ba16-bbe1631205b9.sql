-- Add user_bookings table for client-side reservations (separate from partner_bookings which is for partners' view)
-- Actually we'll use partner_bookings already. We need: support_messages table + add fields to profiles for editing (already exists)

-- Support messages table
CREATE TABLE public.support_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  sender TEXT NOT NULL CHECK (sender IN ('user', 'support')),
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.support_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own support messages"
  ON public.support_messages FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users insert own support messages"
  ON public.support_messages FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX idx_support_messages_user ON public.support_messages(user_id, created_at);

-- Add booking_reference column to partner_bookings for QR code reference number
ALTER TABLE public.partner_bookings
  ADD COLUMN IF NOT EXISTS booking_reference TEXT,
  ADD COLUMN IF NOT EXISTS client_email TEXT,
  ADD COLUMN IF NOT EXISTS client_phone TEXT;

-- Allow authenticated clients to insert their own bookings
DROP POLICY IF EXISTS "Clients create own bookings" ON public.partner_bookings;
CREATE POLICY "Clients create own bookings"
  ON public.partner_bookings FOR INSERT
  WITH CHECK (auth.uid() = client_user_id);
