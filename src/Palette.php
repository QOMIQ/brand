<?php

namespace Qomiq\Brand;

use Filament\Support\Colors\Color;

/**
 * Barvy Filamentu z tokenů značky (tokens.css). Monochrom: `gray` je papír
 * až inkoust, `primary` je inkoust. Stavové barvy tlumené.
 *
 * `primary` 600 je černá (tlačítka, zaškrtnutí, fokus ve světlém režimu),
 * 400 světle šedá (odkazy v tmavém režimu). Tmavá tlačítka v tmavém režimu
 * přebarví téma na papír, paleta to bez skoku neumí.
 */
final class Palette
{
    public const GRAY = [
        50 => '#f8f8f6',
        100 => '#f4f4f2',
        200 => '#ebebe9',
        300 => '#d8d8d4',
        400 => '#a1a19f',
        500 => '#6e6e6c',
        600 => '#525250',
        700 => '#3a3a38',
        800 => '#2a2a2a',
        900 => '#1c1c1c',
        950 => '#0c0c0c',
    ];

    public const INK = [
        50 => '#f8f8f6',
        100 => '#f4f4f2',
        200 => '#ebebe9',
        300 => '#d8d8d4',
        400 => '#a1a19f',
        500 => '#6e6e6c',
        600 => '#121212',
        700 => '#0f0f0f',
        800 => '#0c0c0c',
        900 => '#0a0a0a',
        950 => '#050505',
    ];

    /** @return array<string, array<int, string>> */
    public static function all(): array
    {
        return [
            'primary' => self::INK,
            'gray' => self::GRAY,
            'danger' => Color::hex('#b3261e'),
            'success' => Color::hex('#2e6b4a'),
            'warning' => Color::hex('#9a5b00'),
            'info' => Color::hex('#35597a'),
        ];
    }
}
