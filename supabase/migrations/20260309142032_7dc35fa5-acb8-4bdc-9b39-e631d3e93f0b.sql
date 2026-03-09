
-- Drop restrictive write policies
DROP POLICY IF EXISTS "Admins can manage videos" ON public.videos;
DROP POLICY IF EXISTS "Admins can manage playlists" ON public.playlists;
DROP POLICY IF EXISTS "Admins can manage playlist_videos" ON public.playlist_videos;
DROP POLICY IF EXISTS "Admins can manage categories" ON public.categories;
DROP POLICY IF EXISTS "Admins can manage settings" ON public.site_settings;

-- Allow public full access (admin password gate provides access control)
CREATE POLICY "Public can manage videos" ON public.videos FOR ALL TO public USING (true) WITH CHECK (true);
CREATE POLICY "Public can manage playlists" ON public.playlists FOR ALL TO public USING (true) WITH CHECK (true);
CREATE POLICY "Public can manage playlist_videos" ON public.playlist_videos FOR ALL TO public USING (true) WITH CHECK (true);
CREATE POLICY "Public can manage categories" ON public.categories FOR ALL TO public USING (true) WITH CHECK (true);
CREATE POLICY "Public can manage settings" ON public.site_settings FOR ALL TO public USING (true) WITH CHECK (true);
