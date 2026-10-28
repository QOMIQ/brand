<?php

namespace Qomiq\Brand;

use Closure;
use Filament\Contracts\Plugin;
use Filament\Panel;
use Filament\View\PanelsRenderHook;
use Illuminate\Contracts\View\Factory;
use Illuminate\Contracts\View\View;

/**
 * Filament panel ve značce QOMIQ: barvy, písmo, logo, favicon, patička (i na přihlášení).
 *
 *     $panel->plugin(QomiqBrand::make());                         // náš admin
 *     $panel->plugin(QomiqBrand::make()->client(fn () => ...));   // admin klienta
 *
 * S klientem je v hlavičce jeho název se symbolem QOMIQ, bez něj slovní
 * značka QOMIQ. Vzhled komponent dělá CSS téma (resources/css/filament.css),
 * které si projekt importuje ve svém Filament tématu, viz README.
 */
final class QomiqBrand implements Plugin
{
    /** Montserrat jako na qomiq.cz, přes Bunny Fonts (EU, bez logování). */
    public const FONT_URL = 'https://fonts.bunny.net/css?family=montserrat:400,500,600,700,800,900&display=swap';

    private string|Closure|null $client = null;

    public static function make(): self
    {
        return new self;
    }

    public function getId(): string
    {
        return 'qomiq-brand';
    }

    /** Název klienta (shopu, firmy) v hlavičce a na přihlášení. */
    public function client(string|Closure|null $name): self
    {
        $this->client = $name;

        return $this;
    }

    public function getClient(): ?string
    {
        $name = $this->client instanceof Closure ? ($this->client)() : $this->client;

        return is_string($name) && trim($name) !== '' ? trim($name) : null;
    }

    public function register(Panel $panel): void
    {
        $logo = fn (): View => self::view('logo', ['client' => $this->getClient()]);

        $panel
            ->brandName(fn (): string => $this->getClient() ?? 'QOMIQ')
            // Stejné logo pro oba režimy: SVG bere barvu z textu (currentColor).
            ->brandLogo($logo)
            ->darkModeBrandLogo($logo)
            ->brandLogoHeight('2rem')
            ->favicon(Logo::faviconDataUri())
            ->colors(Palette::all())
            ->font('Montserrat', self::FONT_URL)
            // FOOTER se vykresluje v hlavním i jednoduchém layoutu (přihlášení).
            ->renderHook(PanelsRenderHook::FOOTER, fn (): View => self::view('credit-bar'));
    }

    /**
     * Pohled balíčku (resources/views, registruje BrandServiceProvider).
     *
     * @param  'logo'|'credit-bar'  $name
     * @param  array<string, mixed>  $data
     */
    private static function view(string $name, array $data = []): View
    {
        // Podle cesty, ne `qomiq-brand::…`: Larastan namespace balíčku nevidí.
        return app(Factory::class)->file(dirname(__DIR__)."/resources/views/{$name}.blade.php", $data);
    }

    public function boot(Panel $panel): void {}
}
