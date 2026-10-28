<?php

use Qomiq\Brand\Logo;

/*
| Kanonický QOMIQ credit (credit/): React, HTML i Blade mají stejné texty,
| odkazy a symbol. Přístupnost podle QOMIQ/eshop#48: bez aria-label (přístupný
| název = viditelný text), barva z patičky, klidová průhlednost 0.7.
*/

function creditFile(string $file): string
{
    return (string) file_get_contents(dirname(__DIR__).'/credit/'.$file);
}

/** @return list<string> */
function symbolPaths(string $source): array
{
    preg_match_all('/<path d="([^"]+)"/', $source, $m);

    return $m[1];
}

it('blade credit ma texty a odkazy pro cs i en', function (?string $lang, string $text, string $brand, string $href) {
    $html = view('qomiq-brand::credit', $lang === null ? [] : ['lang' => $lang])->render();

    expect($html)->toContain($text.' <span class="qomiq-credit__brand">'.$brand.'</span>')
        ->toContain('href="'.$href.'"')
        ->toContain('target="_blank" rel="noopener noreferrer"');
})->with([
    'vychozi cs' => [null, 'Navrhl a vyvinul tým z', 'QOMIQ.cz', 'https://qomiq.cz'],
    'cs' => ['cs', 'Navrhl a vyvinul tým z', 'QOMIQ.cz', 'https://qomiq.cz'],
    'en' => ['en', 'Built by', 'QOMIQ.eu', 'https://qomiq.eu'],
]);

it('blade credit nema aria-label a symbol je dekorace', function () {
    $html = view('qomiq-brand::credit')->render();

    expect($html)->not->toContain('aria-label=')
        ->not->toContain('role="img"')
        ->toContain('<svg class="qomiq-credit__mark" ')
        ->toContain('aria-hidden="true"')
        ->toContain('width="14" height="14"');
});

it('dekorativni symbol nema popisek, bezny ano', function () {
    expect((string) Logo::symbol(decorative: true))->not->toContain('aria-label=')->toContain('aria-hidden="true"')
        ->and((string) Logo::symbol())->toContain('role="img" aria-label="QOMIQ"');
});

it('React a HTML credit maji stejne texty a odkazy jako Blade', function (string $file) {
    $source = creditFile($file);

    expect($source)->toContain('Navrhl a vyvinul tým z')->toContain('QOMIQ.cz')->toContain('https://qomiq.cz')
        ->toContain('Built by')->toContain('QOMIQ.eu')->toContain('https://qomiq.eu')
        ->toContain('rel="noopener noreferrer"')
        ->toContain('aria-hidden="true"')
        ->not->toContain('aria-label=')
        ->not->toContain('qomiq.cz/Qomiq.svg');
})->with(['QomiqCredit.jsx', 'qomiq-credit.html']);

it('symbol v React a HTML creditu odpovida assets/logo', function (string $file) {
    $asset = (string) file_get_contents(Logo::path('qomiq-symbol.svg'));
    $paths = symbolPaths(creditFile($file));

    // HTML má cs i en variantu, každá se symbolem.
    expect(array_values(array_unique($paths)))->toBe(symbolPaths($asset));
})->with(['QomiqCredit.jsx', 'qomiq-credit.html']);

it('styl creditu dedi barvu a drzi klidovou pruhlednost 0.7', function () {
    $css = creditFile('qomiq-credit.css');

    expect($css)->toContain('color: inherit')
        ->toContain('opacity: 0.7')
        ->toContain(':focus-visible')
        ->toContain('prefers-reduced-motion')
        ->not->toContain('#8a8a8a')
        ->not->toContain('0.55')
        ->not->toMatch('/["\']Mont["\']/');
});

it('filament tema bere styl creditu z credit/ a neprebiji ho', function () {
    $css = (string) file_get_contents(dirname(__DIR__).'/resources/css/filament.css');

    expect($css)->toContain("@import '../../credit/qomiq-credit.css';")
        ->not->toContain('#8a8a8a')
        ->not->toMatch('/\.qomiq-credit[\s{]/');
});

it('paticka panelu obali credit do listy', function () {
    $html = view('qomiq-brand::credit-bar')->render();

    expect($html)->toContain('<footer class="qomiq-credit-bar">')
        ->toContain('Navrhl a vyvinul tým z')
        ->not->toContain('aria-label=');
});
