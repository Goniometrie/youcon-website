# Vercel: gratis account of betaald team?

Keuze voor het bestuur. Vercel host de website: elke wijziging op GitHub wordt automatisch gebouwd en gepubliceerd. Het doel uit `beheer.md` blijft: **info@youcon.nu is eigenaar**, niet een bestuurslid.

Stand op 29 oktober 2026: het project `youcon-website` staat tijdelijk in Toms persoonlijke Hobby-account ("Tom's projects") en bouwt daar `main` en elke pull request. Het eenvoudigst is dat YouCon een nieuw project aanmaakt (er gaan alleen twee omgevingsvariabelen mee) en dat het oude daarna verwijderd wordt.

## De twee opties

| | A. Gratis (Hobby) | B. Betaald team (Pro) |
|---|---|---|
| Kosten | € 0 | $ 20 per maand per persoon die mag deployen, excl. 21% btw. Met info@youcon.nu als eigenaar en één ontwikkelaar: $ 40/maand, ca. $ 580 per jaar incl. btw |
| Voorwaarden | Alleen **niet-commercieel** gebruik | Geen beperking |
| Wie kan inloggen | Eén account (info@youcon.nu); bestuur deelt de inlog via de wachtwoordmanager | Iedereen een eigen login. Meekijkers (alleen lezen) gratis, beheerders $ 20 per persoon |
| Code van anderen publiceren | Bij een **privé**-repo publiceert Vercel alleen commits van de eigenaar van het account. Commits van de ontwikkelaar worden geblokkeerd. Die controle geldt volgens Vercel voor privérepo's, dus met een **openbare** repo zou het moeten werken (eerst testen) | Werkt, zolang de ontwikkelaar lid is van het team |
| Bij te veel bezoekers | Site gaat offline tot de volgende maand (100 GB dataverkeer per maand; ruim genoeg voor een vereniging) | Je betaalt bij; stel een maximum in met automatische pauze |
| Overstappen | Later upgraden naar Pro kan zonder te verhuizen | Terug naar Hobby kan; extra leden worden dan verwijderd |

Prijzen: [vercel.com/pricing](https://vercel.com/pricing) en [Pro-plan](https://vercel.com/docs/plans/pro-plan). Vercel rekent in dollars; betalen gaat met een creditcard.

## Wat telt als commercieel?

Volgens Vercel ([Fair Use](https://vercel.com/docs/limits/fair-use-guidelines)) is een site commercieel als iemand er geld aan verdient. Voorbeelden:

- betalingen via de site (bijvoorbeeld inschrijfgeld of contributie),
- reclame of het aanprijzen van producten en diensten,
- iemand die betaald wordt om de site te maken, bij te werken of te hosten.

Vragen om donaties is níet commercieel. De site zoals hij nu is (activiteiten, inschrijven zonder betalen, verenigingen, bestuur) valt daar buiten. Twijfelgevallen: een sponsorpagina met logo's, vacatures van bedrijven, betaalde inschrijvingen. Komt dat erbij, kies dan Pro. Bij twijfel kan het bestuur het aan Vercel Support vragen.

## Wat er per optie moet gebeuren

**A. Gratis (Hobby)** — gekozen, zie [Stappenplan](#stappenplan-gratis-account).

1. Maak met info@youcon.nu een Vercel-account aan, ingelogd via GitHub `stichting-youcon` (net als Supabase).
2. Zet de repo over naar `stichting-youcon` en maak hem **openbaar**. Dat is veilig: wachtwoorden en sleutels staan niet in de code maar in Vercel (zie `tech-stack.md`). Zonder openbare repo worden commits van de ontwikkelaar niet gepubliceerd.
3. Importeer de repo in Vercel, zet de omgevingsvariabelen uit `.env.example` en koppel youcon.nu.
4. Test met één pull request van de ontwikkelaar of de preview gebouwd wordt.

**B. Betaald team (Pro)**

1. Maak met info@youcon.nu een Vercel-account aan (via GitHub `stichting-youcon`) en daarin een team "YouCon" op Pro, met de creditcard van de vereniging.
2. Stel onder Settings → Billing een maximum in (bijvoorbeeld $ 50 per maand) met automatische pauze.
3. Nodig de ontwikkelaar uit als Member. Bestuursleden die alleen willen meekijken: Viewer (gratis).
4. Importeer de repo (mag privé blijven), zet de omgevingsvariabelen en koppel youcon.nu.

## Advies

Begin met **A (gratis)**, met een openbare repo. De site verdient geen geld, het verkeer past ruim binnen de gratis limiet, en upgraden naar Pro kan later zonder te verhuizen. Kies meteen **B** als de site binnenkort betalingen of sponsoring krijgt, als meerdere mensen met een eigen login moeten kunnen beheren, of als de code niet openbaar mag.

**Beslissing van het bestuur (29 oktober 2026):** optie A, gratis Hobby-account op naam van YouCon, met een openbare repo. Upgraden naar Pro zodra de site betalingen of sponsoring krijgt, of als commits van de ontwikkelaar toch niet gepubliceerd worden.

## Stappenplan gratis account

Vink af wat klaar is.

**1. Repo naar YouCon en openbaar**

Alleen de eigenaar van een repo op een persoonlijk GitHub-account kan die aan Vercel koppelen ([Vercel](https://vercel.com/kb/guide/unable-to-find-github-repository)). Daarom wordt `stichting-youcon` eigenaar en blijft Goniometrie de ontwikkelaar als collaborator.

- [x] Geschiedenis gecontroleerd op sleutels en `.env`-bestanden: niets gevonden. Wel zichtbaar na openbaar maken: e-mailadressen in de docs en in de commits.
- [x] Repo openbaar gemaakt (29 oktober 2026).
- [x] Repo overgezet naar `stichting-youcon` (29 oktober 2026).
- [x] Goniometrie is collaborator met schrijfrechten.
- [ ] Iedereen met een lokale kopie werkt de remote bij: `git remote set-url origin git@github.com:stichting-youcon/youcon-website.git` (de oude URL stuurt GitHub wel door).

Een collaborator op een persoonlijke repo kan pushen, branches maken, pull requests openen, reviewen en mergen, en issues beheren. Alleen de eigenaar kan instellingen wijzigen (zoals branchbeveiliging en secrets), collaborators toevoegen, en de repo overzetten of verwijderen.

**2. Vercel-account**

- [x] Hobby-account aangemaakt via GitHub `stichting-youcon`, e-mailadres info@youcon.nu (29 oktober 2026).
- [ ] Tweestapsverificatie aanzetten (Account Settings → Authentication); herstelcodes in de wachtwoordmanager.
- [x] Vercel GitHub-app geïnstalleerd, alleen voor `stichting-youcon/youcon-website`.

**3. Project**

- [x] Project `youcon-website` geïmporteerd in team `stichting-youcon` (29 oktober 2026). Framework: Next.js, verder standaard.
- [x] Omgevingsvariabelen voor Production en Preview (waarden uit Supabase → Project Settings → API Keys):
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, type **Config**. Vercel weigert een `NEXT_PUBLIC_`-variabele van het type Secret; zo'n variabele kun je daarna ook niet meer omzetten, alleen verwijderen en opnieuw aanmaken.
- [x] Productie draait op https://youcon-website-chi.vercel.app.

Tip: de kopieerknop in het Supabase-dashboard werkt niet in elke ingebouwde browser. Controleer na het plakken dat er echt een `sb_publishable_…`-sleutel staat; een verkeerde sleutel geeft bij de build "Invalid API key".

**4. Supabase laten kloppen** (Authentication → URL Configuration, zie `google-login.md`)

- [x] Redirect URL's toegevoegd: `https://youcon-website-chi.vercel.app/**` en voor previews `https://*-stichting-youcon.vercel.app/**`.
- [ ] Site URL: `https://youcon-website-chi.vercel.app`, tot youcon.nu omgezet is (nu nog `http://localhost:3000`).

**5. Testen**

- [ ] Inloggen met e-mail en met Google werkt op de Vercel-URL.
- [x] Een pull request van Goniometrie krijgt een preview (getest met #14 op 29 oktober 2026): met een openbare repo blokkeert Hobby commits van collaborators niet. Mocht dat ooit veranderen ("Hobby teams do not support collaboration"), dan is upgraden naar Pro de oplossing (Settings → Billing).
- Previews zijn standaard afgeschermd met Vercel Authentication: alleen wie als `stichting-youcon` bij Vercel is ingelogd kan ze openen. Openbaar maken kan via Settings → Deployment Protection.

**6. Domein** (later, als de nieuwe site af is)

- [ ] Nagaan bij welke registrar youcon.nu staat (zie `beheer.md`); let op dat de e-mail van info@youcon.nu blijft werken.
- [ ] Domein toevoegen in Vercel (Settings → Domains) en de DNS-records zetten die Vercel aangeeft.
- [ ] Site URL in Supabase op `https://youcon.nu`.

**7. Oude project opruimen** (zodra het YouCon-project werkt)

- [ ] Verwijder `youcon-website` uit "Tom's projects" (Settings → General → Delete Project), anders bouwen beide projecten elke commit.
- [ ] Haal de oude preview-URL's van "Tom's projects" weg uit de redirect URL's in Supabase.
