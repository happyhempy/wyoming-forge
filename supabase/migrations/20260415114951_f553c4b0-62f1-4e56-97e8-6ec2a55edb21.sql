
-- Public can read published blog posts
CREATE POLICY "Anyone can read published blog posts"
ON public.blog_posts FOR SELECT
USING (published = true);

-- Superadmins can manage all blog posts
CREATE POLICY "Superadmins can manage blog posts"
ON public.blog_posts FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'superadmin'))
WITH CHECK (public.has_role(auth.uid(), 'superadmin'));
