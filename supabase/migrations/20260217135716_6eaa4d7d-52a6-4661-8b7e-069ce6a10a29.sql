
-- Roles enum and user_roles table for admin access
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- user_roles policies
CREATE POLICY "Admins can view all roles" ON public.user_roles
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage roles" ON public.user_roles
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Schedule classes table
CREATE TABLE public.schedule_classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  day_of_week INT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6), -- 0=Monday, 6=Sunday
  day_name TEXT NOT NULL,
  day_tag TEXT NOT NULL DEFAULT '',
  time TEXT NOT NULL,
  end_time TEXT NOT NULL,
  title TEXT NOT NULL,
  coach TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.schedule_classes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read schedule" ON public.schedule_classes
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage schedule" ON public.schedule_classes
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Community photos table
CREATE TABLE public.community_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url TEXT NOT NULL,
  name TEXT NOT NULL,
  age INT,
  testimonial TEXT NOT NULL DEFAULT '',
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.community_photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read community photos" ON public.community_photos
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage community photos" ON public.community_photos
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Text testimonials table
CREATE TABLE public.testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote TEXT NOT NULL,
  author_name TEXT NOT NULL,
  author_role TEXT DEFAULT '',
  avatar_url TEXT DEFAULT '',
  is_visible BOOLEAN NOT NULL DEFAULT true,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read visible testimonials" ON public.testimonials
  FOR SELECT USING (is_visible = true);

CREATE POLICY "Admins can manage testimonials" ON public.testimonials
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_schedule_classes_updated_at
  BEFORE UPDATE ON public.schedule_classes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_community_photos_updated_at
  BEFORE UPDATE ON public.community_photos
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_testimonials_updated_at
  BEFORE UPDATE ON public.testimonials
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Storage bucket for community photo uploads
INSERT INTO storage.buckets (id, name, public) VALUES ('community-photos', 'community-photos', true);

CREATE POLICY "Anyone can view community photos" ON storage.objects
  FOR SELECT USING (bucket_id = 'community-photos');

CREATE POLICY "Admins can upload community photos" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'community-photos' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update community photos" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'community-photos' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete community photos" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'community-photos' AND public.has_role(auth.uid(), 'admin'));
