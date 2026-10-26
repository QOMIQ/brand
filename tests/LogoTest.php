<?php

use Qomiq\Brand\Logo;

/*
| Loga z CorelDRAW měla deklaraci UTF-16, natvrdo barvu a viewBox 100×100.
| Vyčištěná verze: UTF-8, currentColor, ořezaný viewBox, popisek pro čtečky.
*/

it('loga jsou ciste SVG s barvou z textu', function (string $file) {
    $svg = (string) file_get_contents(Logo::path($file));

    expect($svg)->toStartWith('<svg ')
        ->not->toContain('<?xml')
        ->not->toContain('CorelDRAW')
        ->not->toContain('#2B2A29')
        ->not->toContain('viewBox="0 0 100 100"')
        ->toContain('fill="currentColor"')
        ->toContain('aria-label="QOMIQ"')
        ->and(mb_check_encoding($svg, 'UTF-8'))->toBeTrue();
})->with(['qomiq-symbol.svg', 'qomiq-wordmark.svg']);

it('favicon je data URI se svetlou variantou pro tmavy rezim', function () {
    $uri = Logo::faviconDataUri();

    expect($uri)->toStartWith('data:image/svg+xml;base64,');

    $svg = base64_decode(substr($uri, strlen('data:image/svg+xml;base64,')));

    expect($svg)->toContain('<svg ')
        ->toContain('#121212')
        ->toContain('prefers-color-scheme:dark');
});

it('vlozi tridu do inline SVG a escapuje ji', function () {
    expect((string) Logo::symbol('a" onload="x'))
        ->toStartWith('<svg class="a&quot; onload=&quot;x" ')
        ->and((string) Logo::wordmark())->toStartWith('<svg xmlns=');
});
