// Kanonický QOMIQ credit pro React (Astro, Next, Vite). Zdroj pravdy:
// QOMIQ/brand → credit/. Vzhled a hover dělá qomiq-credit.css, bez závislostí.
//
// Přístupnost (Lighthouse 100): barva se dědí z patičky, klidová průhlednost
// 0.7 (šedá #8a8a8a při 0.55 měla kontrast 3.7:1, WCAG chce 4.5:1) a bez
// aria-label, přístupný název = viditelný text. Symbol je dekorace (aria-hidden).

const CREDIT = {
  cs: { text: "Navrhl a vyvinul tým z", brand: "QOMIQ.cz", href: "https://qomiq.cz" },
  en: { text: "Built by", brand: "QOMIQ.eu", href: "https://qomiq.eu" },
};

// Aktuální symbol z webu qomiq.cz (dvě Q) inline: barva z textu (currentColor),
// žádný požadavek na cizí doménu. Masky jen vyřezávají překryv obou Q (bílá/černá
// je maska, ne barva); id mají prefix, aby nekolidovala s jinými SVG na stránce.
// Shodu s HTML a Blade creditem hlídá tests/CreditTest.php.
const Mark = () => (
  <svg className="qomiq-credit__mark" xmlns="http://www.w3.org/2000/svg" viewBox="120 120 760 760"
    width="14" height="14" aria-hidden="true" focusable="false">
    <defs>
      <mask id="qomiq-credit-mask-a" maskUnits="userSpaceOnUse" x="0" y="0" width="1000" height="1000">
        <rect width="1000" height="1000" fill="#fff" />
        <path d="M707.3 570.8A204.5 204.5 0 0 1 473.3 553.7" fill="none" stroke="#000" strokeWidth="128" />
      </mask>
      <mask id="qomiq-credit-mask-b" maskUnits="userSpaceOnUse" x="0" y="0" width="1000" height="1000">
        <rect width="1000" height="1000" fill="#fff" />
        <path d="M283.7 376.8A204.5 204.5 0 0 1 517.7 393.9" fill="none" stroke="#000" strokeWidth="128" />
      </mask>
    </defs>
    <g fill="none" stroke="currentColor" strokeWidth="80" transform="translate(8 22)">
      <g mask="url(#qomiq-credit-mask-a)">
        <circle cx="388.5" cy="552.4" r="204.5" />
        <path d="M496.8 670.7 595.6 778.5" />
      </g>
      <g mask="url(#qomiq-credit-mask-b)">
        <circle cx="602.5" cy="395.2" r="204.5" />
        <path d="M710.8 513.5 809.6 621.3" />
      </g>
    </g>
  </svg>
);

export default function QomiqCredit({ lang = "cs" }) {
  const { text, brand, href } = CREDIT[lang] ?? CREDIT.cs;
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="qomiq-credit">
      <span className="qomiq-credit__inner">
        <Mark />
        <span className="qomiq-credit__text">
          {text} <span className="qomiq-credit__brand">{brand}</span>
        </span>
      </span>
    </a>
  );
}
