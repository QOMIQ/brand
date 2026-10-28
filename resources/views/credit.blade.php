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
        {{ \Qomiq\Brand\Logo::symbol('qomiq-credit__mark', decorative: true) }}
        <span class="qomiq-credit__text">{{ $credit['text'] }} <span class="qomiq-credit__brand">{{ $credit['brand'] }}</span></span>
    </span>
</a>
