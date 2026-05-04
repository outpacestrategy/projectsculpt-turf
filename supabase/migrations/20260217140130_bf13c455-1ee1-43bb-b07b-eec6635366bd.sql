
-- Drop the restrictive select policy and add one that lets admins see all
DROP POLICY "Anyone can read visible testimonials" ON public.testimonials;

CREATE POLICY "Anyone can read visible testimonials" ON public.testimonials
  FOR SELECT USING (
    is_visible = true OR public.has_role(auth.uid(), 'admin')
  );
