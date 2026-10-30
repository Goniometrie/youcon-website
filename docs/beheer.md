# Beheer en overdracht

De website draait op een paar externe diensten. Doel: **info@youcon.nu is overal eigenaar**, zodat de site niet aan één bestuurslid hangt. Bestuursleden die de site beheren zijn er extra beheerder naast, en halen zichzelf weg als ze het bestuur verlaten.

Bewaar de wachtwoorden van info@youcon.nu en het GitHub-account `stichting-youcon`, de tweestapsverificatie en de herstelcodes in een gedeelde wachtwoordmanager van het bestuur, niet op één persoonlijke telefoon.

## Diensten

| Dienst | Waarvoor | Eigenaar nu | Stand |
|---|---|---|---|
| Google Cloud, project `youcon-website` | Inloggen met Google (zie `google-login.md`) | info@youcon.nu + tomdiks96@gmail.com (beide Owner) | klaar; supportmail is info@youcon.nu |
| Supabase, organisatie "Goniometrie", project `youcon-website` | Database, accounts, foto's | info@youcon.nu (inlog via GitHub `stichting-youcon`) + tomdiks96@gmail.com (beide Owner) | klaar; MFA nog aanzetten |
| GitHub, `stichting-youcon/youcon-website` (openbaar) | Code | `stichting-youcon` (info@youcon.nu); Goniometrie is collaborator met schrijfrechten | klaar (overgezet op 29 oktober 2026) |
| Vercel, gratis Hobby-account | Hosting | info@youcon.nu (inlog via GitHub `stichting-youcon`) | project `youcon-website` draait op https://youcon-website-chi.vercel.app (29 oktober 2026); zie `vercel-keuze.md` voor wat nog open staat. Het oude project in Toms account "Tom's projects" nog verwijderen |
| Domein youcon.nu | Domeinnaam en e-mail | onbekend | nagaan bij welke registrar |

## Nog te doen

1. **Supabase:** zet voor beide accounts tweestapsverificatie (MFA) aan. Overweeg de organisatie te hernoemen van "Goniometrie" naar "YouCon" (Organization Settings).
2. **GitHub:** zet tweestapsverificatie aan voor `stichting-youcon` als dat nog niet zo is. Geen GitHub-organisatie: Vercel Hobby kan geen privérepo's van een organisatie deployen.
3. **Vercel:** het bestuur koos een gratis account (Hobby) op naam van YouCon. Volg het stappenplan in `vercel-keuze.md`. YouCon maakt een nieuw project; het huidige project in "Tom's projects" wordt daarna verwijderd.

## Bij een bestuurswissel

1. Geef het nieuwe bestuur toegang tot de wachtwoordmanager met info@youcon.nu.
2. Voeg de nieuwe beheerder per dienst toe als extra beheerder.
3. Haal de vertrekkende beheerder per dienst weg (Google Cloud → IAM, Supabase → Team, GitHub → People, Vercel → Members).
4. Werk de tabel hierboven bij.
5. Nieuwe bestuursleden maken zelf een account op `/lid-worden`; daarna zet de webbeheerder hun rol op `board` (Supabase → Table Editor → `profiles`). Zet de rol van vertrekkende bestuursleden terug op `member`.
6. Geef nieuwe bestuursleden de [handleiding voor het bestuur](handleiding-bestuur.md): activiteit aanmaken, foto toevoegen, aanmeldingen bekijken en downloaden.
