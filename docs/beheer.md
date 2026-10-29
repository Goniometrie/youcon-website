# Beheer en overdracht

De website draait op een paar externe diensten. Doel: **info@youcon.nu is overal eigenaar**, zodat de site niet aan één bestuurslid hangt. Bestuursleden die de site beheren zijn er extra beheerder naast, en halen zichzelf weg als ze het bestuur verlaten.

Bewaar het wachtwoord van info@youcon.nu, de tweestapsverificatie en de herstelcodes in een gedeelde wachtwoordmanager van het bestuur, niet op één persoonlijke telefoon.

## Diensten

| Dienst | Waarvoor | Eigenaar nu | Stand |
|---|---|---|---|
| Google Cloud, project `youcon-website` | Inloggen met Google (zie `google-login.md`) | info@youcon.nu + tomdiks96@gmail.com (beide Owner) | klaar; supportmail is info@youcon.nu |
| Supabase, organisatie "Goniometrie", project `youcon-website` | Database, accounts, foto's | tomdiks96@gmail.com | nog overzetten |
| GitHub, `Goniometrie/youcon-website` | Code | persoonlijk account Goniometrie | nog overzetten |
| Vercel, team "toms-projects" | Hosting | persoonlijk account | nog overzetten |
| Domein youcon.nu | Domeinnaam en e-mail | onbekend | nagaan bij welke registrar |

## Nog te doen

1. **Supabase:** nodig info@youcon.nu uit als Owner van de organisatie, of maak een organisatie "YouCon" en verplaats het project (Project Settings → General → Transfer project). URL en sleutels blijven gelijk.
2. **GitHub:** maak een (gratis) organisatie "YouCon" en verplaats de repo (Settings → Transfer). Koppel daarna Vercel opnieuw aan de repo.
3. **Vercel:** maak een account voor info@youcon.nu en verplaats het project, of neem een team. Let op: het gratis Hobby-abonnement is bedoeld voor persoonlijk, niet-commercieel gebruik; laat het bestuur kiezen.

## Bij een bestuurswissel

1. Geef het nieuwe bestuur toegang tot de wachtwoordmanager met info@youcon.nu.
2. Voeg de nieuwe beheerder per dienst toe als extra beheerder.
3. Haal de vertrekkende beheerder per dienst weg (Google Cloud → IAM, Supabase → Team, GitHub → People, Vercel → Members).
4. Werk de tabel hierboven bij.
