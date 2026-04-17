
-- Enum pour les rôles
CREATE TYPE public.app_role AS ENUM ('admin', 'partner', 'client');

-- Table profiles
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  city TEXT,
  avatar_url TEXT,
  partner_activity_id TEXT,
  partner_business_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles viewable by everyone"
  ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

-- Table user_roles (séparée pour éviter privilege escalation)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function pour vérifier les rôles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Users can view own roles"
  ON public.user_roles FOR SELECT USING (auth.uid() = user_id);

-- Table partner_slots (planning)
CREATE TABLE public.partner_slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_id TEXT NOT NULL,
  slot_date DATE NOT NULL,
  slot_time TIME NOT NULL,
  capacity INT NOT NULL DEFAULT 8,
  booked INT NOT NULL DEFAULT 0,
  price_mad INT NOT NULL,
  is_flash_deal BOOLEAN NOT NULL DEFAULT false,
  flash_discount_pct INT DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.partner_slots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Partners view own slots"
  ON public.partner_slots FOR SELECT
  USING (auth.uid() = partner_user_id);

CREATE POLICY "Partners manage own slots"
  ON public.partner_slots FOR ALL
  USING (auth.uid() = partner_user_id);

-- Table partner_bookings
CREATE TABLE public.partner_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  client_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  client_name TEXT NOT NULL,
  activity_id TEXT NOT NULL,
  booking_date DATE NOT NULL,
  booking_time TIME NOT NULL,
  guests INT NOT NULL DEFAULT 1,
  amount_mad INT NOT NULL,
  status TEXT NOT NULL DEFAULT 'confirmed',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.partner_bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Partners view own bookings"
  ON public.partner_bookings FOR SELECT
  USING (auth.uid() = partner_user_id);

CREATE POLICY "Clients view own bookings"
  ON public.partner_bookings FOR SELECT
  USING (auth.uid() = client_user_id);

CREATE POLICY "Partners manage own bookings"
  ON public.partner_bookings FOR ALL
  USING (auth.uid() = partner_user_id);

-- Trigger update_updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger handle_new_user : crée profile + role 'client' à l'inscription
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, city)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'city', 'tanger')
  );
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'client');
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Index utiles
CREATE INDEX idx_partner_slots_partner ON public.partner_slots(partner_user_id, slot_date);
CREATE INDEX idx_partner_bookings_partner ON public.partner_bookings(partner_user_id, booking_date);
