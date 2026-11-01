# Vzhled značky („chrome on black“, 11/2026)

Stejný vzhled jako redesign qomiq.cz (repo webu, `docs/design.md`). Platí pro
web, sociální sítě a další materiály ven. Starší „Ocean“ paleta (teal/sky/violet,
aurora gradienty) je zrušená, působila jako generická AI šablona.

## Barvy

| Token  | Hodnota   | Použití |
|--------|-----------|---------|
| bg     | `#050607` | pozadí (černá, ne čistá `#000`) |
| ink    | `#f4f6f5` | text, plochá značka |
| muted  | `#8a918f` | vedlejší text, štítky |
| accent | `#c8ff3d` | acid lime, **jediný** akcent |

- Žádné gradienty, glow ani druhý akcent. Akcent jen v drobnostech: linka pod
  jedním slovem nadpisu, tečka u štítku, tlačítko, dlaždice favicony/profilovky.
- Ztlumená velká čísla: bílá 8–10 % (`rgba(255,255,255,0.08)`), ne obrys.

## Písmo

- **Krona One** (400, jiný řez nemá): nadpisy, `letter-spacing -0.03em`.
  Je široká, nadpisy menší než u Montserratu.
- **Montserrat**: všechno ostatní. Zvýrazněné slovo v nadpisu = Montserrat
  300 kurzíva + limetková linka (na webu `.light-italic.mark`).
- Štítek: Montserrat 600, verzálky, `letter-spacing 0.2em`, barva muted,
  před ním limetková tečka.
- Žádné třetí písmo, žádný monospace. Obě písma jsou OFL (Google Fonts);
  `assets/fonts/` má woff2 pro export šablon.

## Logo

Složka `assets/logo/qq/`:

| Soubor | Co to je |
|--------|----------|
| `qq.svg` | plochá značka QQ, barva `currentColor` |
| `qq-dlazdice.svg` | limetková dlaždice s černým QQ (favicon webu, tah 88 kvůli 16 px) |
| `qomiq.svg` | wordmark QOMIQ, `currentColor` |
| `qq-chrom.png` | 3D chrom render (1280², průhledné pozadí), 1. snímek smyčky z webu |

- Značka = dvě Q (kruh r 204.5, tah 80, krátká šikmá nožička), provlečené
  jako články řetězu: v horním křížení je navrchu levé Q, v dolním pravé.
  Řez v kruhu vespod je maska podél oblouku (80 + 2 × 24 mezera).
- Wordmark není písmo, je nakreslený z geometrie značky: O = stejný kruh,
  M a I mají stejný tah (80 z 490).
- Chrom render vzniká v Blenderu (`frontend/design/qomiq-logo.blend` v repu
  webu). Nový render = nahradit `qq-chrom.png` a přegenerovat PNG
  (`docs/socialni-site.md`).

## Co ještě zůstává ve starém vzhledu

Filament téma (`tokens.css`, `resources/css/filament.css`) a loga
`assets/logo/qomiq-symbol.svg`, `qomiq-wordmark.svg` jsou pořád monochrom
„inkoust na papíře“ se starým logem z CorelDRAW. Používají je admini
projektů přes Composer; převod na nové logo je samostatná změna (nový tag,
`composer update` v projektech, kontrola v reálném adminu).
