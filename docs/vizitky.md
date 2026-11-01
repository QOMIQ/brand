# Vizitky

`assets/tisk/`: přední strana pro každého zvlášť, zadní strana společná.

| Soubor | Co |
|--------|----|
| `vizitka-daniel.*` | Daniel Poledník, přední strana |
| `vizitka-simon.*` | Šimon Blatoň, přední strana |
| `vizitka-zadni.*` | zadní strana (limetková, značka QQ, QOMIQ.CZ) |

Ke každé: `.svg` zdroj, `.pdf` do tiskárny, `.png` náhled, `-voditka.png`
s ořezem a bezpečnou zónou.

## Rozměr a tisk

- 90 × 50 mm (český standard), **spadávka 3 mm** → soubor 96 × 56 mm.
  Chrome zaokrouhlí stránku PDF o ±0,1 mm; je to ve spadávce, okraj má barvu
  pozadí. Pozadí jde do spadávky, text a logo drží 4 mm od ořezu
  (bezpečná zóna 82 × 42 mm).
- PDF je vektor s vloženými písmy, barvy v RGB. Tiskárna je převede do CMYK:
  **limetka `#c8ff3d` je mimo CMYK** a vytiskne se matnější. Pro věrnou barvu
  objednat Pantone / fluo přímou barvu, nebo si nechat poslat nátisk.
  Černé pozadí tiskárna převede na sytou černou (rich black); jen K by bylo šedé.
- Nejmenší písmo 2,5 mm (≈ 7 pt). Menší nepoužívat, šedá `#8a918f` na černé
  by se v tisku slévala.
- Papír: matný, 350 g a víc. Lesk dělá z černé zrcadlo s otisky prstů.
- Tiskárně poslat přední PDF (každý svoje) + `vizitka-zadni.pdf`, oboustranně.

## Úprava

Text je v SVG (`jmeno`, `role`, `kontakt` = jeden `<tspan>` na řádek).
Po změně jména upravit šířku `jmeno-linka` (limetková linka pod jménem) podle
jména, pak `render-social.bat` (vygeneruje PDF i PNG). Nový člověk = kopie
`vizitka-daniel.svg`.

Kontakt: osobní e-mail (daniel@ / simon@qomiq.cz), qomiq.cz, LinkedIn.
Telefon přidat jako další `<tspan>` do `kontakt`, max. 4 řádky, aby se
vešly do bezpečné zóny.
