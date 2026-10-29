# Inloggen met Google

Leden maken zelf een account aan met hun Google-account (`/lid-worden`) en loggen ermee in (`/inloggen`). Een nieuw account krijgt de rol `member`; na de eerste login vult het lid op `/account` zijn gegevens aan (geboortedatum is verplicht).

Heeft iemand al een account met hetzelfde e-mailadres, dan koppelt Supabase de Google-login aan dat account. Er ontstaat dus geen dubbel account.

## Zo werkt het

1. De knop "Doorgaan met Google" roept de Server Action `signInWithGoogle` aan (`src/app/[lang]/inloggen/actions.ts`). Die vraagt Supabase om een Google-URL en stuurt de bezoeker daarheen.
2. Google stuurt terug via Supabase naar `/{lang}/inloggen/callback?code=…` (`callback/route.ts`). Die ruilt de code in voor een sessie (PKCE, de verifier staat in een cookie).
3. Heeft het profiel nog geen geboortedatum, dan gaat het lid naar `/account`; anders naar `?next=` of `/account`.

De trigger `private.handle_new_user` maakt het profiel aan en haalt voor- en achternaam uit de gegevens van Google.

## Huidige stand (29 oktober 2026)

- Google Cloud-project `youcon-website` (eigenaren tomdiks96@gmail.com en info@youcon.nu, zie `beheer.md`), OAuth-client "YouCon website (Supabase)".
- Supabase: Google staat aan; redirect-URL's `http://localhost:3000/**` en `https://youcon.nu/**`. Site URL staat nog op `http://localhost:3000`.
- Branding: homepage `https://youcon.nu`, privacyverklaring `https://youcon.nu/nl/privacy` (de pagina `src/app/[lang]/privacy/`; live zodra de nieuwe site op youcon.nu staat).
- Publicatiestatus: **In production**, dus iedereen met een Google-account kan inloggen. Geen verificatie nodig zolang er geen logo is en alleen `email`/`profile` wordt gevraagd.

## Eenmalig instellen

### Google Cloud Console

1. Maak een project (of gebruik een bestaand project van YouCon) op https://console.cloud.google.com.
2. **Google Auth Platform → Branding:** app-naam "YouCon", supportmail `info@youcon.nu`, logo, homepage `https://youcon.nu`, link naar de privacyverklaring, en `youcon.nu` en `supabase.co` als geautoriseerde domeinen.
3. **Audience:** "External", en zet de app op "In production" (anders kunnen alleen testgebruikers inloggen).
4. **Clients → Create client:** type "Web application".
   - Authorized JavaScript origins: `http://localhost:3000` en `https://youcon.nu`
   - Authorized redirect URI: `https://ufnafujtromrhiruvrjo.supabase.co/auth/v1/callback`
5. Kopieer de client-ID en het client secret.

Alleen de standaardscopes (`openid`, `email`, `profile`) worden gebruikt, dus een verificatie door Google is niet nodig.

### Supabase-dashboard

1. **Authentication → Sign In / Providers → Google:** zet aan en vul de client-ID en het secret in.
2. **Authentication → URL Configuration:**
   - Site URL: `https://youcon.nu` (zolang de site nog niet live is: de Vercel-URL)
   - Redirect URLs: `http://localhost:3000/**`, `https://youcon.nu/**` en voor previews `https://*-<vercel-team>.vercel.app/**`
3. "Allow new users to sign up" (Authentication → Sign In / Providers) moet aan staan, anders werkt Google alleen voor bestaande accounts.

## Privacy

Bij inloggen met Google ontvangt YouCon de naam, het e-mailadres en de profielfoto van het Google-account. Neem dat op in de privacyverklaring.
