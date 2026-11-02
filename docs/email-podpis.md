# E-mailový podpis

`assets/email/`: `podpis-daniel.html`, `podpis-simon.html` (hotový podpis),
`qq.svg` → `qq.png` (limetková dlaždice QQ, 56 px, PNG 3× = 168 px kvůli retině).

Vzhled: dlaždice vlevo, šedá svislá linka, vpravo jméno (tučně), role
s limetkovou tečkou, kontakty, `qomiq.cz` s limetkovou linkou. Text je černý
na bílém pozadí e-mailu.

## Proč takhle

- **Limetková dlaždice, ne černý wordmark:** v tmavém režimu (Gmail, Apple
  Mail, Outlook) klient přebarví text, ale obrázek ne. Černá plocha
  s chromem by na tmavém pozadí splynula, limetka je čitelná na světlém
  i tmavém. Je to stejná značka jako favicon a profilovka.
- **Jen tabulka a inline styly:** e-mailové klienty ignorují `<style>`,
  flex i grid.
- **Písmo:** Montserrat má v e-mailu jen ten, kdo ho má nainstalované, ostatní
  uvidí Helvetica / Arial. Krona One se v podpisu nepoužívá, nadpis by
  v náhradním písmu vypadal jinak než značka.
- **Obrázek z GitHubu** (`raw.githubusercontent.com/QOMIQ/brand/main/…`,
  repo je veřejné). Funguje až po merge do `main`. Až bude na qomiq.cz
  složka pro statické soubory, přesunout tam a změnit `src` (vlastní doména
  méně často skončí ve spamu nebo za „zobrazit obrázky“).

## Vložení

Otevřít `podpis-<jméno>.html` v prohlížeči (Chrome), `Ctrl+A`, `Ctrl+C`
a vložit do nastavení podpisu. Kopírovat z prohlížeče, ne zdrojový kód.

- **Gmail:** Nastavení → Zobrazit všechna nastavení → Obecné → Podpis →
  Vytvořit nový → vložit → dole Uložit změny. Ve stejném místě nastavit
  podpis pro nové e-maily i odpovědi.
- **Apple Mail (Mac):** Mail → Nastavení → Podpisy → `+` → odškrtnout
  „Vždy použít mé výchozí písmo zprávy“ → vložit.
- **Outlook (web / nový Outlook):** Nastavení → Účet → Podpisy → nový
  podpis → vložit → Uložit, pak vybrat jako výchozí.
- **iPhone Mail:** neumí HTML podpis vložit z počítače; vložit text, nebo
  posílat z Gmail aplikace (ta bere podpis z webu).

Po vložení poslat zkušební e-mail sobě a otevřít ho v telefonu i ve
světlém a tmavém režimu.

## Úprava

Text je přímo v HTML (jméno, e-mail, telefon). Šimon nemá telefon;
přidat ho jako další řádek
`<a href="tel:+420…" style="color:#050607;text-decoration:none;">…</a><br>`
nad `qomiq.cz`. Nový člověk = kopie `podpis-daniel.html`.
Po změně dlaždice: `render-social.bat assets\email\qq.svg`.
