{{--
    Kanonický QOMIQ credit (credit/ v QOMIQ/brand): stejné texty, odkazy a třídy
    jako QomiqCredit.jsx a qomiq-credit.html, styl credit/qomiq-credit.css.
    Do patičky projektu: @include('qomiq-brand::credit') nebo s ['lang' => 'en'].
    Bez aria-label (přístupný název = viditelný text), symbol je dekorace.
--}}
@php
    $credit = ($lang ?? 'cs') === 'en'
        ? ['text' => 'Built by', 'brand' => 'QOMIQ.eu', 'href' => 'https://qomiq.eu']
        : ['text' => 'Navrhl a vyvinul tým z', 'brand' => 'QOMIQ.cz', 'href' => 'https://qomiq.cz'];
@endphp
<a href="{{ $credit['href'] }}" target="_blank" rel="noopener noreferrer" class="qomiq-credit">
    <span class="qomiq-credit__inner">
        <svg class="qomiq-credit__mark" xmlns="http://www.w3.org/2000/svg" viewBox="120 120 760 760" width="14" height="14" aria-hidden="true" focusable="false">
            <defs>
                <mask id="qomiq-credit-mask-a" maskUnits="userSpaceOnUse" x="0" y="0" width="1000" height="1000">
                    <rect width="1000" height="1000" fill="#fff"/>
                    <path d="M707.3 570.8A204.5 204.5 0 0 1 473.3 553.7" fill="none" stroke="#000" stroke-width="128"/>
                </mask>
                <mask id="qomiq-credit-mask-b" maskUnits="userSpaceOnUse" x="0" y="0" width="1000" height="1000">
                    <rect width="1000" height="1000" fill="#fff"/>
                    <path d="M283.7 376.8A204.5 204.5 0 0 1 517.7 393.9" fill="none" stroke="#000" stroke-width="128"/>
                </mask>
            </defs>
            <g fill="none" stroke="currentColor" stroke-width="80" transform="translate(8 22)">
                <g mask="url(#qomiq-credit-mask-a)">
                    <circle cx="388.5" cy="552.4" r="204.5"/>
                    <path d="M496.8 670.7 595.6 778.5"/>
                </g>
                <g mask="url(#qomiq-credit-mask-b)">
                    <circle cx="602.5" cy="395.2" r="204.5"/>
                    <path d="M710.8 513.5 809.6 621.3"/>
                </g>
            </g>
        </svg>
        <span class="qomiq-credit__text">{{ $credit['text'] }} <span class="qomiq-credit__brand">{{ $credit['brand'] }}</span></span>
    </span>
</a>
