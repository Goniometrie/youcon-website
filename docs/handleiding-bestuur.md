# Handleiding voor het bestuur

Korte uitleg voor bestuursleden: activiteiten op de website zetten en aanmeldingen bekijken. De website staat nu nog op https://youcon-website-chi.vercel.app en verhuist later naar youcon.nu.

## Toegang krijgen

1. Maak een account op **Lid worden** (`/lid-worden`), met Google of met je e-mailadres en een wachtwoord. Gebruik voorlopig Google: de bevestigingsmail voor een account met e-mailadres werkt pas als de mail van youcon.nu is ingericht (zie `email-login.md`).
2. Laat de webbeheerder weten met welk e-mailadres je het account hebt gemaakt. Die geeft je de rol *bestuur*.
3. Log in via **Inloggen**. In de menubalk staat dan **Beheer**; daar kom je op `/admin`.

Zie je op `/admin` de melding *"Je account heeft (nog) geen toegang tot het beheer"*, dan is je rol nog niet gezet. Vraag het de webbeheerder.

## Een activiteit aanmaken

1. Ga naar **Beheer** en klik op **+ Nieuwe activiteit**.
2. Vul het formulier in. Verplicht zijn alleen **Titel**, **Datum**, **Locatie** en **Omschrijving**.
   - **Wat, waar en wanneer:** kies de soort (Excursie, Thema-avond of Event) en de voertaal. Laat **Begintijd** leeg als die nog niet bekend is; op de site staat dan "tijd volgt". **Partner** is de organisatie waarmee je de activiteit organiseert.
   - **Tekst:** twee tot vier zinnen over wat we gaan doen. Onder **Engelse versie** kun je een Engelse titel en tekst invullen; laat je die leeg, dan toont de Engelse site de Nederlandse tekst.
   - **Publicatie:** vul bij **Maximum aantal deelnemers** een getal in als er een limiet is; is de activiteit vol, dan kan niemand zich meer inschrijven. Gebruik **Externe inschrijflink** alleen als mensen zich ergens anders inschrijven (bijvoorbeeld bij een congres); er is dan geen inschrijving op onze site.
   - Vink **Zichtbaar op de website** uit om de activiteit eerst als concept op te slaan. In het overzicht staat dan het label *Concept*.
3. Klik op **Opslaan**. Je komt terug in het overzicht met *"De activiteit is opgeslagen."*

Aanpassen doe je met **Bewerken** achter de activiteit. **Verwijderen** vraagt eerst om bevestiging en kan niet ongedaan worden gemaakt; liever verbergen? Vink dan **Zichtbaar op de website** uit.

## Een foto toevoegen

1. Ga in het formulier naar het blok **Foto** en klik op **Foto kiezen**.
2. Kies een JPG, PNG of WebP van maximaal 10 MB. Een liggende foto werkt het best.
3. Wacht tot *"Foto uploaden…"* weg is; zolang kun je niet opslaan.
4. Vul **Wat staat er op de foto?** in: een korte beschrijving voor bezoekers die de foto niet kunnen zien.
5. Klik op **Opslaan**.

Met **Andere foto** vervang je de foto, met **Foto weghalen** haal je hem weg.

## Aanmeldingen bekijken en downloaden

1. Klik in het overzicht op de link met het aantal aanmeldingen (bijvoorbeeld *"12 van 30 aanmeldingen"*). Bij activiteiten met een externe inschrijflink staat die link er niet.
2. Je ziet een tabel met naam, bedrijf, e-mailadres en datum van inschrijving.
3. **Download als CSV** geeft een bestand dat je direct in Excel opent.
4. **Mail iedereen** opent je mailprogramma met alle deelnemers in de BCC.

Op dezelfde pagina kun je bij **Iemand toevoegen** iemand met een account handmatig inschrijven (die persoon krijgt daar geen bericht van), en met **Uitschrijven** iemand van de lijst halen.

## Hulp nodig?

Neem contact op met de webbeheerder. Rollen en accounts staan in `docs/beheer.md`.
