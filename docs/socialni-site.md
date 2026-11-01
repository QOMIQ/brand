# Sociální sítě: bannery, profilovky, šablony příspěvků

Vše v `assets/social/`. Zdroj je vždy SVG, PNG vedle něj je export
(`npm` ani instalace písem nejsou potřeba, viz Export). Vzhled: `docs/znacka.md`.

## Hotové podklady

| Soubor (`assets/social/`) | Kam | Rozměr SVG | PNG |
|---------------------------|-----|-----------|-----|
| `linkedin-profil-banner` | pozadí osobního profilu (Daniel, …) | 1584×396 | 2× |
| `linkedin-firma-cover` | cover firemní stránky QOMIQ | 1128×191 | 2× |
| `profil-lime` | profilovka Instagram, logo firmy na LinkedIn | 1080×1080 | 1× |
| `profil-chrom` | alternativní profilovka (chrom na černé) | 1080×1080 | 1× |

- **LinkedIn osobní:** vlevo dole je profilová fotka, proto text začíná
  na x = 600. Zóny fotky ve `*-voditka.png` jsou odhad (počítač / mobil),
  po nahrání zkontrolovat na obou.
- **LinkedIn firma:** návody se v rozměru rozcházejí (1128×191, nověji
  1512×256 nebo 4200×700), poměr je ale skoro stejný (~5,9 : 1). Export 2×
  (2256×382) LinkedIn zmenší. Logo firmy překrývá levý dolní roh, text
  začíná na x = 232.
- **Profilovka** se ořízne do kruhu a zobrazuje se malá (≈ 110 px). Značka je
  uvnitř kružnice r 430 z 540. Na malé velikosti čte lépe `profil-lime`
  (stejná dlaždice jako favicon webu); `profil-chrom` je volba pro velké
  zobrazení.

## Šablony příspěvků (`assets/social/sablony/`)

| Šablona | Rozměr | Na co |
|---------|--------|-------|
| `ig-post-text` | 1080×1350 (4:5) | sdělení, tip, díl karuselu (číslo strany, velké ztlumené číslo) |
| `ig-post-projekt` | 1080×1350 (4:5) | projekt: screenshot + název + popis + odkaz |
| `ig-post-ctverec` | 1080×1080 | krátké sdělení s chrom značkou |
| `linkedin-post-text` | 1200×627 | sdělení s chrom značkou vpravo |
| `linkedin-post-projekt` | 1200×627 | projekt: text vlevo, screenshot vpravo |

Ukázkový text je z qomiq.cz. U každé šablony je `<název>-voditka.png`
s vyznačenými oblastmi textu, obrázku a okraji. Instagram profil ukazuje
příspěvky 4:5 oříznuté na 3:4 (po stranách ~34 px), obsah je v okraji 88 px,
takže se nic neusekne.

### Nový příspěvek

1. Zkopírovat šablonu do složky ve stejné hloubce, např.
   `assets/social/prispevky/2026-11-lobfit.svg` (cesty k obrázkům a chrom
   renderu jsou relativní, `../../logo/…`, `../obrazky/…`) a upravit:
   - **Figma / Inkscape:** otevřít SVG, vrstvy mají jména podle `id`
     (`stitek`, `nadpis-1`, `nadpis-2`, `nadpis-zvyrazneni`, `text`, `web`,
     `strana`, `cislo`, `obrazek`). Písma Krona One a Montserrat musí být
     nainstalovaná (Google Fonts), jinak editor ukáže náhradní.
   - **Textový editor:** přepsat text v `<text>` / `<tspan>`. Každý řádek je
     vlastní `<tspan>`, SVG text samo nezalamuje. Délky řádků jsou ve vodítkách.
2. **Zvýrazněné slovo** (`nadpis-zvyrazneni`) má pod sebou obdélník
   `nadpis-zvyrazneni-linka`; po změně textu mu nastavit šířku podle slova
   (Figma: změřit, nebo natáhnout myší). Linka jen pod jedním slovem/řádkem.
3. **Obrázek:** do `assets/social/obrazky/` (nebo vedle SVG) a změnit `href`
   u `<image id="obrazek">`. Ořez dělá `preserveAspectRatio` (`slice` = vyplní
   rámeček, `xMidYMin` = drží střed a horní okraj screenshotu).
4. Nepotřebné prvky smazat (`cislo`, `strana`), nic nepřidávat
   v jiných barvách. Copy věcně, česky; anglicky jen pro anglický profil
   (texty z qomiq.cz/en/).
5. Export (níže) a nahrát PNG.

## Export

```
render-social.bat                          všechna SVG v assets/social a assets/tisk
render-social.bat cesta\k\prispevek.svg    jen vybrané
```

(nebo `node scripts/render-social.mjs …`). Potřebuje Node a Chrome / Edge
(cesta jde přepsat proměnnou `CHROME`). Kreslí stejný renderer jako web,
písma bere z `assets/fonts/`, takže nemusí být nainstalovaná. Velikost PNG =
`width`/`height` SVG × `data-export-scale` (bannery 2). SVG se skupinou
`voditka` dostane navíc `-voditka.png`.

Po změně SVG v repu vždy přegenerovat a commitnout i PNG. Commitnout jen
soubory, které se změnou opravdu změnily; přeměřené setiny px v ostatních
SVG/PNG vrátit (`git restore`).

## Story (video)

`story-novy-web.mp4` (1080×1920, 16 s, H.264 bez zvuku): upoutávka na nový
qomiq.cz. Statická verze `story-novy-web.png`.

- Úvod jako logo na webu: uprostřed spojené QQ, Q se rozjedou a naskočí „OMI“
  (časy a křivky z `global.css` webu), hotový wordmark odjede nahoru. Pak se
  prolne chrom smyčka a zespodu vyjede text.
- Nahoře ~200 px a dole ~280 px překrývá Instagram (lišta, pole pro odpověď),
  tam nic důležitého. Link sticker přidat v Instagramu pod text (zóna ve
  `-voditka.png`).

Nová story = kopie SVG, upravit text, pak:

```
render-story.bat assets\social\story-novy-web.svg [délka v s]
```

Skript vezme z SVG: `<g data-intro="wordmark">` (úvod s logem, cílové místo =
transformace wordmarku), `<image id="chrom">` (sem dá smyčku
`assets/logo/qq/qq-loop.mp4`, stejný ořez jako `qq-chrom.png`) a
`<g data-rise="<s>">` (vyjede zespodu; čas od konce úvodu). Potřebuje ffmpeg
(v PATH nebo proměnná `FFMPEG`). Pozadí videa je barva podkladu smyčky, ne
`#050607` ze SVG: tmavé odstíny se v YUV zaokrouhlí jinak a na hraně smyčky
by byl vidět šev.

## Balíček

`assets/social`, `assets/tisk`, `assets/fonts`, `scripts`, `docs`, chrom render a smyčka jsou
v `.gitattributes` jako `export-ignore`: Composer je do projektů (Filament
téma) nestahuje.
