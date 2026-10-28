-- Derde voertaal: Nederlands, maar Engels als dat nodig is (bijvoorbeeld als er
-- deelnemers zijn die geen Nederlands spreken). Tussen 'nl' en 'en' geplaatst,
-- zodat het beheerformulier de opties in die volgorde toont.
-- Toegepast op het Supabase-project "youcon-website" (eu-central-1).

alter type public.activity_language add value 'en-optional' after 'nl';
