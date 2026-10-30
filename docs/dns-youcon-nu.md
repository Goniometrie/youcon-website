# DNS van youcon.nu

Wat er nu in de DNS van youcon.nu staat, wat daarvan moet blijven, en het stappenplan om het domein naar de nieuwe site op Vercel te laten wijzen (issue #25). **Belangrijk: de mail van info@youcon.nu moet blijven werken.** Daarom veranderen we alleen de records van de website en blijven alle mailrecords staan.

## Wie beheert het domein?

Opgezocht op 30 oktober 2026 (WHOIS en `dig`):

| | |
|---|---|
| Registrar | Key-Systems GmbH (groothandel; domeinen lopen daar meestal via een webbureau of hostingbedrijf) |
| Houder | handle `arebet3360-00001` (naam afgeschermd in de WHOIS) |
| Geregistreerd sinds | 18 februari 2010, in 2016 verhuisd naar Key-Systems |
| Verloopt | **18 februari 2027** |
| Status | `serverTransferProhibited`, `serverRenewProhibited`; DNSSEC aan |
| Nameservers | `ns1.leaseweb.nl`, `ns5.leaseweb.nl`, `ns4.leaseweb.net` (Leaseweb) |
| Oude website en mailserver | `136.144.169.242` = `server5.clweb.nl`, een server van **CL Web** (webbureau, clweb.nl) bij TransIP |

CL Web zet zijn eigen domein clweb.nl ook op dezelfde Leaseweb-nameservers. Hoogstwaarschijnlijk regelt **CL Web** dus de registratie (via Key-Systems), de DNS (bij Leaseweb) en de hosting van de oude WordPress-site. Wie bij YouCon het contact met CL Web heeft, en of er een eigen inlog voor YouCon bestaat, is nog **onbekend**.

## Huidige records

Opgevraagd bij `ns1.leaseweb.nl` op 30 oktober 2026. Een zoneoverdracht (AXFR) is geweigerd, dus records op onbekende namen kunnen ontbreken; de gebruikelijke namen (`autodiscover`, `_dmarc`, `webmail`, `ftp`, DKIM-selectors enz.) zijn nagelopen en bestaan niet. Er is geen wildcard. De SOA (serienummer `2021110400`) laat zien dat de zone sinds november 2021 niet gewijzigd is.

| Naam | Type | TTL | Waarde | Waarvoor | Wat ermee doen |
|---|---|---|---|---|---|
| `youcon.nu` | A | 300 | `136.144.169.242` | oude WordPress-site | **vervangen** door het A-record van Vercel |
| `www.youcon.nu` | A | 300 | `136.144.169.242` | oude WordPress-site | **vervangen** door het CNAME-record van Vercel |
| `youcon.nu` | MX | 60 | `1 smtp.google.com` | mail van info@youcon.nu (Google Workspace) | **blijft** |
| `youcon.nu` | MX | 60 | `10 mail.youcon.nu` | reserve-mailserver op de oude server | **blijft** voorlopig, zie [Opruimen na de verhuizing](#opruimen-na-de-verhuizing) |
| `mail.youcon.nu` | A | 300 | `136.144.169.242` | oude mailserver (hoort bij het MX-record hierboven) | **blijft** zolang dat MX-record er staat |
| `smtp.youcon.nu` | A | 300 | `136.144.169.242` | oude mailserver | **blijft** voorlopig (misschien gebruikt in een mailprogramma) |
| `pop.youcon.nu` | A | 300 | `136.144.169.242` | oude mailserver | **blijft** voorlopig |
| `youcon.nu` | TXT | 300 | `v=spf1 include:mailgun.org ip4:136.144.169.242 ~all` | SPF: wie mag mailen namens @youcon.nu | **blijft**, maar Google ontbreekt; zie [SPF aanvullen](#spf-aanvullen) |
| `youcon.nu` | TXT | 300 | `google-site-verification=rqu4j-xDD4F5jDGshwOJD5vLDymiZyaEa9ocnRUN7Ok` | eigendomsbewijs bij Google (Workspace of Search Console) | **blijft** |
| `smtp._domainkey.youcon.nu` | TXT | 300 | `k=rsa; p=MIGfMA0GCSqGSIb3…` | DKIM-sleutel van Mailgun (mail van de oude WordPress-site) | **blijft** voorlopig |
| `youcon.nu` | NS | 86400 | `ns1.leaseweb.nl`, `ns5.leaseweb.nl`, `ns4.leaseweb.net` | nameservers | **blijft** (niet wijzigen, zie DNSSEC hieronder) |

Niet aanwezig: AAAA (IPv6), CAA, `_dmarc`, `autodiscover`, Google-DKIM (`google._domainkey`).

Zelf opnieuw controleren:

```bash
for t in A AAAA MX TXT; do dig +noall +answer @ns1.leaseweb.nl youcon.nu $t; done; dig +noall +answer @ns1.leaseweb.nl www.youcon.nu A
```

### Aandachtspunten

- **DNSSEC staat aan.** Laat de nameservers bij Leaseweb en verander alleen records. Wie de DNS later naar een andere partij verhuist (bijvoorbeeld de nameservers van Vercel), moet eerst DNSSEC uitzetten bij de registrar, anders is youcon.nu een tijd onbereikbaar, inclusief de mail.
- **SPF mist Google.** Mail die via Gmail van info@youcon.nu verstuurd wordt, staat niet in het SPF-record. Dat werkt nu waarschijnlijk dankzij de DKIM-ondertekening van Google, maar is een risico voor de spamfilter.
- **Het certificaat van de oude site is verlopen** (12 oktober 2026; het is bovendien uitgegeven voor `mail.youcon.nu`, niet voor youcon.nu). Na de verhuizing regelt Vercel zelf een geldig certificaat.
- De TTL's zijn kort (60-300 seconden): een wijziging is binnen enkele minuten overal zichtbaar, en terugdraaien kan net zo snel.

## Stappenplan verhuizing

De site wordt `https://youcon.nu` (zonder www, zie `site.url` in `src/lib/site.ts`); `www.youcon.nu` stuurt door naar youcon.nu.

### Stap 0. Toegang regelen (bestuur)

- [ ] Achterhalen wie bij YouCon contact heeft met CL Web en of er een contract of factuur voor domein en hosting is.
- [ ] Bij CL Web navragen: wie staat als houder (`arebet3360-00001`) geregistreerd, kan YouCon zelf inloggen om DNS te beheren, en zo niet, of CL Web de records hieronder wil zetten.
- [ ] Inlog (of contactpersoon en klantnummer) in de wachtwoordmanager van het bestuur zetten en in `beheer.md` noemen.

Zonder deze toegang kan niemand de DNS wijzigen. Twee routes:

- **Snel:** CL Web zet de records uit stap 2 en 4 voor ons. Mail ze de tabellen uit dit document.
- **Duurzaam:** het domein verhuist naar een registrar waar info@youcon.nu zelf eigenaar is (bijvoorbeeld TransIP of een andere Nederlandse registrar die .nu aanbiedt). Daarvoor is de verhuiscode (auth-code) van CL Web nodig, en mogelijk moet de status `serverTransferProhibited` eerst worden opgeheven. Doe dit vóór **18 februari 2027**, anders verlengt CL Web het domein nog een jaar. Zet bij de nieuwe registrar eerst exact dezelfde records (tabel hierboven, plus die uit stap 2), denk aan DNSSEC, en pas daarna de nameservers aan.

Advies: eerst de snelle route (de site en Resend kunnen dan meteen live), daarna rustig de verhuizing naar een eigen registrar.

### Stap 1. Domein toevoegen in Vercel (kan nu al)

Dit verandert niets aan de oude site; Vercel laat daarna zien welke records nodig zijn.

1. Log in bij Vercel als `stichting-youcon` → project `youcon-website` → **Settings → Domains → Add Domain**.
2. Voeg `youcon.nu` toe. Vercel stelt standaard voor om youcon.nu door te sturen naar www; kies in plaats daarvan de optie waarbij **`www.youcon.nu` doorstuurt naar `youcon.nu`**. Vercel voegt `www.youcon.nu` dan zelf toe als doorverwijzing.
3. Vercel toont "Invalid Configuration" met de records die nodig zijn. Neem de waarden **exact** over in stap 2: Vercel geeft sinds 2025 per project een eigen IP-adres en CNAME (bijvoorbeeld `216.198.79.1` en `…vercel-dns-017.com`). Het oudere `76.76.21.21` en `cname.vercel-dns.com` werken ook nog.
4. Vraagt Vercel om een TXT-record op `_vercel.youcon.nu` (als het domein al ergens anders bij Vercel bekend is), neem dat ook mee.

### Stap 2. Records voor de website (bij Leaseweb, via CL Web)

Vervang alleen deze twee records; laat al het andere staan.

| Naam | Oud | Nieuw |
|---|---|---|
| `youcon.nu` | A `136.144.169.242` | A `<IP-adres uit Vercel>` |
| `www.youcon.nu` | A `136.144.169.242` | CNAME `<CNAME uit Vercel>` (eerst het A-record verwijderen; een naam kan niet allebei hebben) |

Eventueel `_vercel.youcon.nu` TXT uit stap 1.4.

Kies hiervoor een rustig moment: zodra het A-record om is, is de oude WordPress-site niet meer bereikbaar op youcon.nu. De redirects van oude URL's (#24) zitten al in de nieuwe site.

### Stap 3. Controleren

- [ ] `dig +short youcon.nu A` en `dig +short www.youcon.nu CNAME` geven de waarden van Vercel.
- [ ] Vercel → Settings → Domains toont bij beide domeinen "Valid Configuration" en een certificaat.
- [ ] https://youcon.nu laat de nieuwe site zien; https://www.youcon.nu stuurt door naar https://youcon.nu.
- [ ] `dig +short youcon.nu MX` geeft nog steeds `smtp.google.com` en `mail.youcon.nu`; stuur een testmail naar info@youcon.nu en antwoord erop.

### Stap 4. Records voor Resend (#16)

Kan tegelijk met stap 2 in één verzoek aan CL Web; deze records botsen niet met de bestaande. Zie `email-login.md` voor de rest van de instelling.

1. Maak een Resend-account met info@youcon.nu, voeg het domein `youcon.nu` toe (regio EU) en neem de records over die Resend toont. Meestal zijn dat:

   | Naam | Type | Waarde |
   |---|---|---|
   | `resend._domainkey.youcon.nu` | TXT | DKIM-sleutel uit Resend (`p=…`) |
   | `send.youcon.nu` | MX | `10 feedback-smtp.eu-west-1.amazonses.com` (exacte waarde uit Resend) |
   | `send.youcon.nu` | TXT | `v=spf1 include:amazonses.com ~all` |

   Resend gebruikt het subdomein `send`, dus het SPF-record van youcon.nu zelf hoeft hiervoor niet te veranderen.
2. Klik in Resend op **Verify**; daarna SMTP instellen in Supabase volgens `email-login.md`.

### Stap 5. Supabase

**Authentication → URL Configuration:**

- [ ] Site URL: `https://youcon.nu` (nu nog `https://youcon-website-chi.vercel.app`).
- [ ] Redirect URLs: `https://youcon.nu/**` staat er al. Laat `http://localhost:3000/**`, `https://youcon-website-chi.vercel.app/**` en `https://*-stichting-youcon.vercel.app/**` staan voor ontwikkeling en previews.

### Stap 6. Google Cloud

Project `youcon-website` → **Google Auth Platform**:

- [ ] **Clients → "YouCon website (Supabase)" → Authorized JavaScript origins:** `https://youcon.nu` staat erin (en `http://localhost:3000`). De redirect-URI blijft `https://ufnafujtromrhiruvrjo.supabase.co/auth/v1/callback`.
- [ ] **Branding:** homepage `https://youcon.nu` en privacyverklaring `https://youcon.nu/nl/privacy` openen nu echt de nieuwe site; `youcon.nu` staat bij de geautoriseerde domeinen.
- [ ] Testen (#17): inloggen met Google en met e-mail op https://youcon.nu.

### Stap 7. Afronden

- [ ] `beheer.md` bijwerken: inlog domein, datum van de verhuizing.
- [ ] SEO-controle (#23): Google Search Console voor youcon.nu (het `google-site-verification`-record staat er al), sitemap `https://youcon.nu/sitemap.xml` indienen.
- [ ] Hostingcontract van de oude WordPress-site bij CL Web opzeggen, pas nadat de mail is nagelopen (zie hieronder).

## Opruimen na de verhuizing

Niet nodig voor de verhuizing zelf; doe dit pas als de nieuwe site draait.

### SPF aanvullen

Als de oude WordPress-site weg is, heeft Mailgun geen functie meer. Voorgesteld SPF-record voor youcon.nu:

```
v=spf1 include:_spf.google.com ~all
```

Laat `ip4:136.144.169.242` staan zolang er nog mail via de oude server gaat, en `include:mailgun.org` zolang de oude site nog mailt. Er mag maar één SPF-record (TXT dat met `v=spf1` begint) op youcon.nu staan.

### Oude mailserver

Het tweede MX-record (`10 mail.youcon.nu`) wijst naar de server van CL Web. Als Google ooit niet bereikbaar is, komt mail daar terecht in plaats van in de mailbox van info@youcon.nu. Vraag CL Web of er op die server nog mailboxen voor youcon.nu zijn. Zo niet, dan kunnen weg: MX `10 mail.youcon.nu` en de A-records `mail`, `smtp` en `pop`. Ook `smtp._domainkey` (Mailgun) kan weg als de oude site uit is. Doe dit **vóór** het opzeggen van de hosting bij CL Web.

### Later aanzetten

- **DKIM voor Google Workspace:** Google Admin → Apps → Google Workspace → Gmail → E-mail verifiëren; zet het record dat Google geeft in de DNS.
- **DMARC:** na SPF en DKIM een TXT-record op `_dmarc.youcon.nu` met `v=DMARC1; p=none; rua=mailto:info@youcon.nu`; later eventueel strenger.
