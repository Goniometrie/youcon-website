# Beheer en overdracht

De website draait op een paar externe diensten. Doel: **info@youcon.nu is overal eigenaar**, zodat de site niet aan één bestuurslid hangt. Bestuursleden die de site beheren zijn er extra beheerder naast, en halen zichzelf weg als ze het bestuur verlaten.

Bewaar de wachtwoorden van info@youcon.nu en het GitHub-account `stichting-youcon`, de tweestapsverificatie en de herstelcodes in een gedeelde wachtwoordmanager van het bestuur, niet op één persoonlijke telefoon.

## Diensten

| Dienst | Waarvoor | Eigenaar nu | Stand |
|---|---|---|---|
| Google Cloud, project `youcon-website` | Inloggen met Google (zie `google-login.md`) | info@youcon.nu + tomdiks96@gmail.com (beide Owner) | klaar; supportmail is info@youcon.nu |
| Supabase, organisatie "YouCon" (gratis plan), project `youcon-website` | Database, accounts, foto's | info@youcon.nu (Owner, inlog via GitHub `stichting-youcon`) + tomdiks96@gmail.com (Owner, uitgenodigd 30 oktober 2026) | project op 30 oktober 2026 verhuisd uit de persoonlijke organisatie "Goniometrie"; URL en sleutels bleven gelijk. MFA nog aanzetten |
| GitHub, `stichting-youcon/youcon-website` (openbaar) | Code | `stichting-youcon` (info@youcon.nu); Goniometrie is collaborator met schrijfrechten | klaar (overgezet op 29 oktober 2026) |
| Vercel, gratis Hobby-account | Hosting | info@youcon.nu (inlog via GitHub `stichting-youcon`) | project `youcon-website` draait op https://youcon-website-chi.vercel.app (29 oktober 2026); zie `vercel-keuze.md` voor wat nog open staat |
| Domein youcon.nu | Domeinnaam en e-mail | webbureau CL Web beheert registratie (Key-Systems) en DNS (Leaseweb); YouCon heeft geen eigen inlog, wijzigingen via een verzoek aan CL Web | omzetten naar Vercel verwacht rond half november 2026; verloopt **18 februari 2027**. DNS vastgelegd en stappenplan in `dns-youcon-nu.md` |
| Resend, team "youcon" | Mails van de site (bevestigen account, wachtwoord vergeten) via SMTP, zie `email-login.md` | info@youcon.nu (Admin) | domein `youcon.nu` aangemaakt (regio EU, 30 oktober 2026); wacht op de DNS-records (`dns-youcon-nu.md`, stap 4). MFA nog aanzetten |
| E-mail info@youcon.nu | Mail van de vereniging | onbekend wie Google Workspace beheert | MX wijst naar Google (`smtp.google.com`); records blijven staan bij de verhuizing |

## Nog te doen

1. **Supabase en Resend:** zet tweestapsverificatie (MFA) aan (Supabase voor beide accounts; Resend: Settings → Account). Laat in Supabase info@youcon.nu de persoonlijke organisatie "Goniometrie" verlaten (Team → Leave team).
2. **GitHub:** zet tweestapsverificatie aan voor `stichting-youcon` als dat nog niet zo is. Geen GitHub-organisatie: Vercel Hobby kan geen privérepo's van een organisatie deployen.
3. **Vercel:** het bestuur koos een gratis account (Hobby) op naam van YouCon. Volg het stappenplan in `vercel-keuze.md`. Het oude project in "Tom's projects" (persoonlijk account van de ontwikkelaar) is op 30 oktober 2026 verwijderd; `youcon-website.vercel.app` bestaat niet meer.
4. **Domein youcon.nu:** CL Web beheert de DNS. Zet contactpersoon en klantnummer bij CL Web in de wachtwoordmanager en stuur CL Web één verzoek met de records uit `dns-youcon-nu.md` (stap 0). Vraag daarbij wie de houder van het domein is. Op termijn het domein verhuizen naar een registrar waar info@youcon.nu eigenaar is, vóór de verlenging op 18 februari 2027.
5. **Google Workspace:** nagaan wie beheerder is van de Google Workspace van youcon.nu (de mailbox info@youcon.nu) en die inlog ook in de wachtwoordmanager zetten.

## Bij een bestuurswissel

1. Geef het nieuwe bestuur toegang tot de wachtwoordmanager met info@youcon.nu.
2. Voeg de nieuwe beheerder per dienst toe als extra beheerder.
3. Haal de vertrekkende beheerder per dienst weg (Google Cloud → IAM, Supabase → Team, GitHub → People, Vercel → Members) en geef het domein een nieuwe contactpersoon bij de registrar.
4. Werk de tabel hierboven bij.
5. Nieuwe bestuursleden maken zelf een account op `/lid-worden`; daarna zet de webbeheerder hun rol op `board` (Supabase → Table Editor → `profiles`). Zet de rol van vertrekkende bestuursleden terug op `member`.
6. Geef nieuwe bestuursleden de [handleiding voor het bestuur](handleiding-bestuur.md): activiteit aanmaken, foto toevoegen, aanmeldingen bekijken en downloaden.
