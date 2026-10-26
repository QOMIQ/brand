# QOMIQ: značka

Loga, barvy a písmo QOMIQ na jednom místě + Filament téma pro adminy
projektů (náš superadmin i admin pro klienty).

```
assets/logo/        qomiq-symbol.svg, qomiq-wordmark.svg (currentColor), favicon.svg
tokens.css          barvy, písmo, zaoblení, pohyb (světlý + tmavý režim)
resources/css/      filament.css: téma pro Filament 4
resources/views/    logo v hlavičce, QOMIQ credit
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
