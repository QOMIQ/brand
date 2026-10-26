<?php

namespace Qomiq\Brand;

use Illuminate\Support\HtmlString;

/**
 * Loga z assets/logo jako inline SVG (barva = currentColor, takže sedí na
 * světlém i tmavém pozadí) a favicon jako data URI (bez publikování souborů).
 */
final class Logo
{
    public static function symbol(string $class = ''): HtmlString
    {
        return self::inline('qomiq-symbol.svg', $class);
    }

    public static function wordmark(string $class = ''): HtmlString
    {
        return self::inline('qomiq-wordmark.svg', $class);
    }

    public static function faviconDataUri(): string
    {
        return 'data:image/svg+xml;base64,'.base64_encode(self::file('favicon.svg'));
    }

    public static function path(string $file): string
    {
        return dirname(__DIR__).'/assets/logo/'.$file;
    }

    private static function inline(string $file, string $class): HtmlString
    {
        $svg = self::file($file);

        if ($class !== '') {
            $svg = preg_replace('/^<svg /', '<svg class="'.e($class).'" ', $svg, 1) ?? $svg;
        }

        return new HtmlString($svg);
    }

    private static function file(string $file): string
    {
        return trim((string) file_get_contents(self::path($file)));
    }
}
