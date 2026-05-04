
-- Create coaches table
CREATE TABLE public.coaches (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  certifications TEXT NOT NULL DEFAULT '',
  bio TEXT NOT NULL DEFAULT '',
  image_url TEXT NOT NULL DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.coaches ENABLE ROW LEVEL SECURITY;

-- Public read
CREATE POLICY "Anyone can read coaches"
ON public.coaches FOR SELECT
USING (true);

-- Admin manage
CREATE POLICY "Admins can manage coaches"
ON public.coaches FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Updated at trigger
CREATE TRIGGER update_coaches_updated_at
BEFORE UPDATE ON public.coaches
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.coaches;

-- Seed initial data
INSERT INTO public.coaches (name, role, certifications, bio, image_url, sort_order) VALUES
('Marcus Johnson', 'Head Coach', 'NSCA-CSCS, HYROX Pro Coach', 'Former D1 athlete turned strength coach. Marcus brings 10+ years of experience training everyone from weekend warriors to competitive athletes. His philosophy: lift heavy, move well, have fun.', 'https://images.unsplash.com/photo-1534308143481-c55f00be8bd7?w=600&q=80', 0),
('Sarah Chen', 'Performance Coach', 'CF-L3, Precision Nutrition L2', '3x HYROX podium finisher and nutrition specialist. Sarah''s attention to detail and programming expertise has helped hundreds of athletes hit PRs they never thought possible.', 'https://images.unsplash.com/photo-1594381898411-846e7d193883?w=600&q=80', 1),
('James Rodriguez', 'Strength Coach', 'USAW-L2, FRC Mobility Specialist', 'Olympic lifting background with a passion for making strength training accessible. James specializes in bulletproofing athletes and building raw power.', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80', 2),
('Ashley Torres', 'Conditioning Coach', 'ACE-CPT, HYROX Coach', 'Marathon runner turned functional fitness enthusiast. Ashley brings endless energy and creative programming that makes every conditioning session feel like a new challenge.', 'https://images.unsplash.com/photo-1548690312-e3b507d8c110?w=600&q=80', 3);
