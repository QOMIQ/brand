---
name: qomiq-footer
description: Vloží do projektu QOMIQ footer credit ("Navrhl a vyvinul tým z QOMIQ.cz" / "Built by QOMIQ.eu"). Použij pokaždé, když uživatel chce footer / patičku s creditem na nás, "credit na QOMIQ", QOMIQ patičku apod.
---

# QOMIQ footer credit

Zdroj pravdy je **https://github.com/QOMIQ/brand → `credit/`** (veřejné repo).
Komponentu nepiš od nuly ani nepřepisuj, vezmi ji odtud:

| Projekt | Soubor |
|---|---|
| React (Astro + React, Next, Vite) | `credit/QomiqCredit.jsx` (bez závislostí) |
| Astro bez Reactu, statické HTML | `credit/qomiq-credit.html` (varianta `cs` nebo `en`) |
| Laravel / Blade s `qomiq/brand` | `@include('qomiq-brand::credit', ['lang' => 'cs'])` |
| Filament s pluginem `QomiqBrand` | nic, plugin ho dá do patičky sám |
| Styl (všude kromě Filamentu) | `credit/qomiq-credit.css` |

Stáhnout aktuální verzi (nebo z tagu místo `main`):

```
curl -fsSLO https://raw.githubusercontent.com/QOMIQ/brand/main/credit/QomiqCredit.jsx
curl -fsSLO https://raw.githubusercontent.com/QOMIQ/brand/main/credit/qomiq-credit.css
```

## Integrace

1. **Texty, odkazy, symbol a vzhled neměň.** `cs` → „Navrhl a vyvinul tým z
   **QOMIQ.cz**“ (`https://qomiq.cz`), `en` → „Built by **QOMIQ.eu**“
   (`https://qomiq.eu`). Výchozí `cs`, pokud projekt neurčí jinak. Změna
   vzhledu nebo textu = PR do QOMIQ/brand, ne úprava v projektu.
2. **Vlož credit do existující patičky** (najdi `<footer>` / layout) a zarovnej
   ho podle okolí. Komponenta je jen odkaz (`<a class="qomiq-credit">`),
   rozložení patičky dělá projekt.
3. **Styl:** naimportuj `qomiq-credit.css`. Projekt na Tailwindu / CSS modules
   ho může převést, výsledek ale musí být stejný (stejné hodnoty, hover
   i `:focus-visible` na opacity 1, `prefers-reduced-motion`).
4. V Astru stačí React komponenta bez `client:` direktivy (statické HTML, žádný JS).

## Kontrola přístupnosti (povinná)

Credit dědí barvu z patičky (`color: inherit`) a v klidu má průhlednost 0.7.
**Ověř kontrast ≥ 4.5:1** výsledné barvy (barva patičky při 0.7 smíchaná
s pozadím) proti pozadí patičky, ve světlém i tmavém režimu:

- Vypočítej smíchanou barvu: `c = 0.7 · text + 0.3 · pozadí` (po kanálech)
  a její kontrast proti pozadí (WCAG), nebo pusť Lighthouse / axe na stránce.
- Nevychází? Uprav barvu textu patičky (tmavší / světlejší), **ne** průhlednost
  pod 0.7 a ne pevnou šedou na creditu.
- Nepřidávej `aria-label` na odkaz, přístupný název je viditelný text.
- Cíl: Lighthouse Accessibility 100.

Proč: původní credit (`#8a8a8a` při 0.55, kontrast 3.7:1, a `aria-label="QOMIQ"`
neodpovídající textu) shodil Lighthouse, zjištěno v QOMIQ/eshop#48.
