# Registreren met e-mail en wachtwoord

Naast Google (`google-login.md`) kunnen leden een account aanmaken met hun e-mailadres en een wachtwoord, op `/lid-worden`. Ze bevestigen hun adres via een link in een mail. Wie zijn wachtwoord kwijt is, vraagt op `/inloggen/wachtwoord-vergeten` een link aan om een nieuw wachtwoord te kiezen.

## Aan- en uitzetten

Registreren met e-mail staat **uit** tot de eigen mailserver (stap 1 hieronder) werkt; zonder komt de bevestigingsmail niet aan. `/lid-worden` biedt dan alleen Google aan, met de melding dat e-mail binnenkort kan. Inloggen en "wachtwoord vergeten" op `/inloggen` blijven gewoon werken voor accounts die al bestaan.

Aanzetten: zet in Vercel (Settings → Environment Variables, Production en Preview) en in `.env.local` de variabele `NEXT_PUBLIC_EMAIL_SIGNUP_ENABLED=true` en deploy opnieuw (de waarde wordt bij de build ingebakken). Leeg of iets anders is uit. De schakelaar is `emailSignUpEnabled` in `src/lib/site.ts`.

## Zo werkt het

- **Registreren:** het formulier op `/lid-worden` (`signup-form.tsx`) roept `signUp` aan (`lid-worden/actions.ts`). Die controleert geboortedatum en wachtwoord en maakt het account aan bij Supabase, met naam, bedrijf en geboortedatum als metadata. De trigger `private.handle_new_user` zet die in het profiel (rol `member`).
- **Bevestigen:** Supabase mailt een link die terugkomt op `/{lang}/inloggen/callback?type=email`. De callback logt het lid in en stuurt door naar `?next=` of `/account`.
- **Wachtwoord vergeten:** `requestPasswordReset` (`inloggen/actions.ts`) laat Supabase een link mailen naar `/{lang}/inloggen/callback?type=recovery`. De callback logt in en stuurt door naar `/inloggen/nieuw-wachtwoord`, waar `setNewPassword` het nieuwe wachtwoord opslaat.
- **Inloggen:** zonder bevestigd adres zegt het loginformulier dat het lid eerst op de link moet klikken. Leden gaan na het inloggen naar `/account`, het bestuur naar `/admin`.

De formulieren verraden niet welke e-mailadressen al een account hebben: bij een bestaand adres zegt registreren ook "we hebben een mail gestuurd" (Supabase stuurt dan niets), en "wachtwoord vergeten" zegt het altijd.

## Eenmalig instellen

### 1. Eigen mailserver (SMTP)

De ingebouwde mailserver van Supabase mailt **alleen naar leden van het Supabase-team** en maar een paar keer per uur. Voor echte leden is een eigen SMTP-dienst nodig. Advies: [Resend](https://resend.com) (gratis tot 3000 mails per maand, 100 per dag).

1. Maak een Resend-account met `info@youcon.nu` en voeg het domein `youcon.nu` toe. Zet de DNS-records die Resend geeft (SPF/DKIM) bij de domeinbeheerder van youcon.nu.
2. Maak een API-key met alleen "Sending access".
3. Supabase-dashboard → **Authentication → Emails → SMTP Settings:** zet "Enable custom SMTP" aan.
   - Sender email `noreply@youcon.nu`, sender name `YouCon`
   - Host `smtp.resend.com`, port `465`, username `resend`, password: de API-key
4. **Authentication → Rate Limits:** zet "emails per hour" op bijvoorbeeld 30.
5. Zet Resend in de privacyverklaring bij "Partijen die ons helpen" (`privacy` in de dictionaries) en in `beheer.md`.

### 2. Bevestigen aan

**Authentication → Sign In / Providers → Email:** "Confirm email" aan, "Minimum password length" op 8 (gelijk aan `MIN_PASSWORD_LENGTH` in `src/lib/password.ts`).

### 3. Mailteksten

Standaard werkt de link in de mail alleen in de browser waarin het lid zich registreerde (PKCE). Met deze templates werkt hij overal, bijvoorbeeld als iemand zich op de laptop registreert en de mail op de telefoon opent. De callback (`callback/route.ts`) kan beide aan.

`{{ .RedirectTo }}` is de callback-URL die de site meegeeft en heeft altijd al `?type=…`, dus het token komt er met `&` achter.

**Authentication → Emails → Templates → Confirm signup**, onderwerp "Bevestig je account bij YouCon":

```html
<h2>Welkom bij YouCon!</h2>
<p>Klik op de link om je e-mailadres te bevestigen en je account te activeren.</p>
<p><a href="{{ .RedirectTo }}&token_hash={{ .TokenHash }}">Account activeren</a></p>
<p>Heb je geen account aangemaakt? Dan kun je deze mail negeren.</p>
<hr>
<p>Click the link above to confirm your email address and activate your YouCon account.</p>
```

**Reset Password**, onderwerp "Nieuw wachtwoord voor YouCon":

```html
<h2>Nieuw wachtwoord</h2>
<p>Klik op de link om een nieuw wachtwoord te kiezen.</p>
<p><a href="{{ .RedirectTo }}&token_hash={{ .TokenHash }}">Nieuw wachtwoord kiezen</a></p>
<p>Heb je dit niet aangevraagd? Dan kun je deze mail negeren; je wachtwoord blijft hetzelfde.</p>
<hr>
<p>Click the link above to choose a new password for your YouCon account.</p>
```

De redirect-URL's (`http://localhost:3000/**`, `https://youcon.nu/**`, de Vercel-URL's) staan al goed voor Google en gelden ook hier.

## Database

`supabase/migrations/20261029120000_profiles_signup_details.sql` laat de trigger ook bedrijf en geboortedatum uit de metadata halen. Een ongeldige geboortedatum wordt genegeerd; het lid vult hem dan op `/account` in (de callback stuurt daarheen als hij ontbreekt).
