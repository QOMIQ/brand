# QOMIQ: značka

Loga, barvy a písmo QOMIQ na jednom místě + Filament téma pro adminy
projektů (náš superadmin i admin pro klienty).

```
assets/logo/        qomiq-symbol.svg, qomiq-wordmark.svg (currentColor), favicon.svg
tokens.css          barvy, písmo, zaoblení, pohyb (světlý + tmavý režim)
resources/css/      filament.css: téma pro Filament 4
credit/             QOMIQ credit do patičky: React, HTML, CSS (zdroj pravdy)
resources/views/    logo v hlavičce, QOMIQ credit (Blade)
skills/             Claude skill qomiq-footer (integrace creditu)
src/                QomiqBrand (Filament plugin), Palette, Logo
```

Zdroj podkladů: [QOMIQ/web](https://github.com/QOMIQ/web) (`app/globals.css`,
`public/Qomiq.svg`, `public/QomiqFULL.svg`). Loga jsou vyčištěné exporty
z CorelDRAW: UTF-8, barva z textu (`currentColor`), ořezaný viewBox.
Písmo Montserrat (OFL) přes Bunny Fonts (EU, bez logování). Soubory
`Mont-*DEMO.otf` z webu nepoužívat, DEMO licence nedovoluje komerční použití.

## Filament admin ve značce QOMIQ

Repo je veřejné (loga a barvy jsou stejně na qomiq.cz, žádná tajemství),
takže Composer ho stáhne v CI, při nasazení i na serveru bez tokenu.

1. **Composer** (`backend/composer.json`):

   ```json
   "repositories": [
       { "type": "vcs", "url": "https://github.com/QOMIQ/brand.git" }
   ],
   "require": {
       "qomiq/brand": "^0.1"
   }
   ```

2. **Téma** `resources/css/filament/admin/theme.css`:

   ```css
   @import '../../../../vendor/filament/filament/resources/css/theme.css';
   @import '../../../../vendor/qomiq/brand/resources/css/filament.css';

   @source '../../../../app/Filament/**/*';
   @source '../../../../resources/views/filament/**/*';
   ```

   a přidat ho do `input` ve `vite.config` (vedle `resources/js/app.tsx`).

3. **Panel:**

   ```php
   use Qomiq\Brand\QomiqBrand;

   $panel
       ->plugin(QomiqBrand::make())                          // náš admin: slovní značka QOMIQ
       // ->plugin(QomiqBrand::make()->client(fn () => …))  // admin klienta: symbol + název klienta
       ->viteTheme('resources/css/filament/admin/theme.css');
   ```

Plugin nastaví barvy (monochrom, `primary` = inkoust), písmo, logo pro
světlý i tmavý režim, favicon a QOMIQ credit v patičce i na přihlášení.
Přepíše i výchozí vzhled jiného panelu (Lunar).

## Credit v patičce

„Navrhl a vyvinul tým z **QOMIQ.cz**“ (`cs`, odkaz `https://qomiq.cz`) /
„Built by **QOMIQ.eu**“ (`en`, `https://qomiq.eu`). Zdroj pravdy je tady,
v projektech se nepřepisuje; změna = PR sem.

| Projekt | Použití |
|---|---|
| React (Astro, Next, Vite) | `credit/QomiqCredit.jsx`, `<QomiqCredit lang="cs" />`, bez závislostí |
| Astro bez Reactu, HTML | `credit/qomiq-credit.html`, vložit variantu `cs` nebo `en` |
| Laravel / Blade | `@include('qomiq-brand::credit', ['lang' => 'en'])` (výchozí `cs`) |
| Filament | plugin `QomiqBrand` ho dá do patičky i na přihlášení sám |

Styl `credit/qomiq-credit.css` je společný (Filament téma ho importuje).
Integraci pro agenty popisuje skill [`skills/qomiq-footer`](skills/qomiq-footer/SKILL.md).

**Přístupnost (Lighthouse Accessibility 100):**

- Barva se **dědí z patičky** (`color: inherit`), ne pevná šedá. Klidová
  průhlednost **0.7**, hover a `:focus-visible` 1. Kontrast výsledné barvy
  proti pozadí patičky musí být **≥ 4.5:1** (WCAG AA), ve světlém i tmavém
  režimu; když nevychází, upraví se barva patičky, ne průhlednost pod 0.7.
- **Bez `aria-label`** na odkazu: přístupný název = viditelný text. Symbol je
  dekorace (`aria-hidden`).
- Proč: původní credit měl `#8a8a8a` při průhlednosti 0.55 (kontrast 3.7:1)
  a `aria-label="QOMIQ"`, který neodpovídal viditelnému textu
  (label-content-name-mismatch). Obojí shodilo Lighthouse, zjištěno
  v QOMIQ/eshop#48.

**Symbol inline, ne `<img src="https://qomiq.cz/Qomiq.svg">`:** symbol
z `assets/logo/qomiq-symbol.svg` je přímo v komponentě. Bere barvu z textu
(`currentColor`), takže je vidět i na tmavé patičce (obrázek má pevnou
tmavou barvu), a stránka nedělá požadavek na cizí doménu. Raw soubory
z GitHubu se jako `<img>` nezobrazí (`text/plain`). Shodu s `assets/` hlídá
`tests/CreditTest.php`, při změně loga se upraví i `credit/`.

Písmo Montserrat (`--qomiq-font`), ne Mont z qomiq.cz (DEMO licence, viz výš).

## Vývoj

```
composer install
vendor/bin/pest
vendor/bin/phpstan analyse
vendor/bin/pint
```

Vzhled se kontroluje v reálném adminu (třeba e-shop), balíček připojený
přes Composer `path` repository. Změna = PR, squash merge, nový tag
(`v0.x.y`), v projektech `composer update qomiq/brand`.
