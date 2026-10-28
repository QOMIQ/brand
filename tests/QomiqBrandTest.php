<?php

use Filament\Panel;
use Qomiq\Brand\Palette;
use Qomiq\Brand\QomiqBrand;

/*
| Plugin nastaví panelu značku QOMIQ. Ověřuje, že přepíše i výchozí věci
| jiného panelu (Lunar nastavuje vlastní logo, barvy a Poppins).
*/

function brandedPanel(?QomiqBrand $plugin = null): Panel
{
    return Panel::make()
        ->id('test')
        ->brandName('Lunar')
        ->font('Poppins')
        ->darkModeBrandLogo('lunar-logo-dark.svg')
        ->plugin($plugin ?? QomiqBrand::make());
}

it('bez klienta je v hlavicce slovni znacka QOMIQ', function () {
    $panel = brandedPanel();

    expect($panel->getBrandName())->toBe('QOMIQ')
        ->and((string) $panel->getBrandLogo()->toHtml())->toContain('qomiq-logo__wordmark')
        ->not->toContain('qomiq-logo__client');
});

it('s klientem je v hlavicce symbol a nazev klienta', function () {
    $panel = brandedPanel(QomiqBrand::make()->client(fn () => '  Veronia Candles '));
    $logo = (string) $panel->getBrandLogo()->toHtml();

    expect($panel->getBrandName())->toBe('Veronia Candles')
        ->and($logo)->toContain('qomiq-logo__symbol')
        ->toContain('<span class="qomiq-logo__client">Veronia Candles</span>');
});

it('nazev klienta je escapovany', function () {
    $logo = (string) brandedPanel(QomiqBrand::make()->client('<script>x</script>'))->getBrandLogo()->toHtml();

    expect($logo)->not->toContain('<script>')
        ->toContain('&lt;script&gt;');
});

it('prazdny klient se chova jako bez klienta', function (mixed $client) {
    expect(brandedPanel(QomiqBrand::make()->client($client))->getBrandName())->toBe('QOMIQ');
})->with([null, '', '   ', fn () => fn () => null]);

it('tmavy rezim ma stejne logo, ne logo puvodniho panelu', function () {
    $panel = brandedPanel();

    expect((string) $panel->getDarkModeBrandLogo()->toHtml())->toContain('qomiq-logo__wordmark');
});

it('nastavi Montserrat z Bunny Fonts vcetne vahy 900, favicon a barvy', function () {
    $panel = brandedPanel();

    expect($panel->getFontFamily())->toBe('Montserrat')
        ->and($panel->getFontUrl())->toBe(QomiqBrand::FONT_URL)
        ->toStartWith('https://fonts.bunny.net/')
        ->toContain('900')
        ->and($panel->getFavicon())->toStartWith('data:image/svg+xml;base64,')
        ->and($panel->getColors()['primary'])->toBe(Palette::INK)
        ->and($panel->getColors()['gray'])->toBe(Palette::GRAY)
        ->and($panel->getColors())->toHaveKeys(['danger', 'success', 'warning', 'info']);
});

it('primarni barva je inkoust z qomiq.cz', function () {
    expect(Palette::INK[600])->toBe('#121212')
        ->and(Palette::GRAY[100])->toBe('#f4f4f2')
        ->and(array_keys(Palette::INK))->toBe([50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]);
});

it('credit odkazuje na qomiq.cz v nove zalozce bezpecne', function () {
    $html = view('qomiq-brand::credit')->render();

    expect($html)->toContain('Navrhl a vyvinul tým z')
        ->toContain('<span class="qomiq-credit__brand">QOMIQ.cz</span>')
        ->toContain('href="https://qomiq.cz"')
        ->toContain('rel="noopener noreferrer"')
        ->toContain('qomiq-credit__mark')
        ->not->toContain('aria-label=');
});

it('tema importuje tokeny a styluje logo i credit', function () {
    $css = (string) file_get_contents(dirname(__DIR__).'/resources/css/filament.css');

    expect($css)->toContain("@import '../../tokens.css';")
        ->toContain('.qomiq-logo__client')
        ->toContain("@import '../../credit/qomiq-credit.css';")
        ->toContain('prefers-reduced-motion');
});
