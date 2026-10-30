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

**Bevestigd door het bestuur (30 oktober 2026):** CL Web beheert de DNS, YouCon niet. YouCon heeft geen eigen inlog; wijzigingen gaan via een verzoek aan CL Web. Het domein gaat over ongeveer twee weken om (verwacht rond half november 2026); tot dan blijft de oude site op youcon.nu.

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

### Stap 0. Verzoek aan CL Web voorbereiden (bestuur)

CL Web beheert de DNS; YouCon heeft geen eigen inlog. Alle wijzigingen gaan dus in één verzoek naar CL Web. Daarvoor zijn eerst de exacte waarden van Vercel en Resend nodig:

- [x] Stap 1: domein in Vercel toegevoegd (30 oktober 2026).
- [x] Stap 4: domein in Resend aangemaakt (30 oktober 2026).
- [ ] Contactpersoon en klantnummer bij CL Web in de wachtwoordmanager van het bestuur zetten en in `beheer.md` noemen.
- [ ] Verzoek aan CL Web sturen, met daarin:
  - het moment van omzetten (de oude site is daarna niet meer bereikbaar op youcon.nu);
  - de twee records uit stap 2 (website) en de records uit stap 4 (Resend), met de exacte waarden;
  - uitdrukkelijk: **alle andere records ongewijzigd laten**, vooral MX, SPF, `mail`, `smtp`, `pop` en `google-site-verification` (mail van info@youcon.nu), en de nameservers en DNSSEC niet aanraken;
  - de vraag wie als houder van het domein (`arebet3360-00001`) staat geregistreerd en of er op de oude server nog mailboxen voor youcon.nu zijn (zie [Oude mailserver](#oude-mailserver)).

Op termijn: het domein verhuizen naar een registrar waar info@youcon.nu zelf eigenaar is (bijvoorbeeld TransIP of een andere Nederlandse registrar die .nu aanbiedt). Daarvoor is de verhuiscode (auth-code) van CL Web nodig, en mogelijk moet de status `serverTransferProhibited` eerst worden opgeheven. Doe dit vóór **18 februari 2027**, anders wordt het domein nog een jaar verlengd. Zet bij de nieuwe registrar eerst exact dezelfde records, denk aan DNSSEC, en pas daarna de nameservers aan. Dit hoeft niet voor de verhuizing van de site.

### Stap 1. Domein toevoegen in Vercel (klaar, 30 oktober 2026)

- [x] In Vercel (`stichting-youcon` → project `youcon-website` → **Settings → Domains**) staan nu:
  - `youcon.nu`, gekoppeld aan Production;
  - `www.youcon.nu`, met een permanente doorverwijzing (308) naar `youcon.nu`.

  Bij het toevoegen stelt Vercel standaard voor om youcon.nu naar www door te sturen ("Redirect apex domains to www"); dat vinkje is bewust uitgezet, omdat de site op youcon.nu zelf staat.
- Beide staan op "Invalid Configuration" tot CL Web de records uit stap 2 zet. Dat is normaal en raakt de oude site niet. Een TXT-record om het domein te verifiëren was niet nodig.

### Stap 2. Records voor de website (CL Web zet ze)

Vervang alleen deze twee records; laat al het andere staan. Waarden zoals Vercel ze op 30 oktober 2026 opgaf:

| Naam | Oud | Nieuw |
|---|---|---|
| `youcon.nu` | A `136.144.169.242` | A `216.198.79.1` |
| `www.youcon.nu` | A `136.144.169.242` | CNAME `972a407821e68577.vercel-dns-017.com.` (eerst het A-record verwijderen; een naam kan niet allebei hebben) |

Vercel noemt `76.76.21.21` en `cname.vercel-dns.com` als oudere waarden die ook blijven werken; gebruik bij voorkeur die hierboven. Kijk vlak voor het verzoek nog even in Vercel (Settings → Domains → View DNS configuration) of de waarden niet veranderd zijn.

Kies hiervoor een rustig moment: zodra het A-record om is, is de oude WordPress-site niet meer bereikbaar op youcon.nu. De redirects van oude URL's (#24) zitten al in de nieuwe site.

### Stap 3. Controleren

- [ ] `dig +short youcon.nu A` en `dig +short www.youcon.nu CNAME` geven de waarden van Vercel.
- [ ] Vercel → Settings → Domains toont bij beide domeinen "Valid Configuration" en een certificaat.
- [ ] https://youcon.nu laat de nieuwe site zien; https://www.youcon.nu stuurt door naar https://youcon.nu.
- [ ] `dig +short youcon.nu MX` geeft nog steeds `smtp.google.com` en `mail.youcon.nu`; stuur een testmail naar info@youcon.nu en antwoord erop.

### Stap 4. Records voor Resend (#16)

Gaat mee in hetzelfde verzoek aan CL Web; deze records botsen niet met de bestaande. Ze staan los van de website, dus CL Web kan ze ook al eerder zetten als #16 niet op de verhuizing hoeft te wachten. Zie `email-login.md` voor de rest van de instelling.

- [x] Resend-account (info@youcon.nu) en domein `youcon.nu` aangemaakt, regio Ireland (`eu-west-1`). Status: "Not Started" tot de records er staan.

Records zoals Resend ze op 30 oktober 2026 opgaf (Resend → **Domains → youcon.nu**):

| Naam | Type | Waarde | Waarvoor |
|---|---|---|---|
| `resend._domainkey.youcon.nu` | TXT | zie hieronder | DKIM: bewijst dat de mail echt van youcon.nu komt |
| `send.youcon.nu` | CNAME | `send.forge.rmta.net` | SPF en bounces voor het verzenden |
| `rsend.youcon.nu` | CNAME | `rsend-euw1.forge.rmta.net` | idem |
| `_dmarc.youcon.nu` | TXT | `v=DMARC1; p=none;` | DMARC (optioneel, aangeraden; zie hieronder) |

Waarde van het DKIM-record (één regel, zonder spaties; het is een openbare sleutel, dus geen geheim):

```
p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC947pM9GfuPPriUNQx8wCrfj0YaY5PckHBuQQwcFtNdMvmiw6cFtBpKXZfb+Txnq4NHz0pZ+POb4+dDqw369NG8EQ7RGQQH+Tqizp2ZOd/SjEnUpfCiBiY2yArfG1w2VxBxcq5csuEBSehEG42Oquopyi/dyqEl3SEACbygFx8VwIDAQAB
```

- Resend werkt met de subdomeinen `send` en `rsend`, dus het SPF-record van youcon.nu zelf hoeft hiervoor niet te veranderen, en de mail van info@youcon.nu merkt er niets van.
- **DMARC** met `p=none` vraagt ontvangers niets te weigeren; het maakt bezorging wel betrouwbaarder (Gmail en Yahoo verwachten een DMARC-record). Gebruik dit record in plaats van het voorstel onder [Later aanzetten](#later-aanzetten).
- Zet in Resend **niet** "Enable receiving" aan: dat vraagt een MX-record op youcon.nu, en dan komt de mail van info@youcon.nu niet meer bij Google aan.

Daarna: in Resend op **Verify DNS records** klikken en SMTP instellen in Supabase volgens `email-login.md`.

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
- **DMARC:** het record `v=DMARC1; p=none;` gaat mee in het verzoek voor Resend (stap 4). Later eventueel strenger (`p=quarantine`), pas als SPF en DKIM voor Google Workspace en Resend allebei kloppen.
