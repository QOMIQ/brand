{{-- Logo v hlavičce panelu. S klientem: symbol QOMIQ + název klienta, bez něj slovní značka. --}}
@if ($client)
    <span class="qomiq-logo qomiq-logo--client">
        {{ \Qomiq\Brand\Logo::symbol('qomiq-logo__symbol') }}
        <span class="qomiq-logo__client">{{ $client }}</span>
    </span>
@else
    <span class="qomiq-logo">
        {{ \Qomiq\Brand\Logo::wordmark('qomiq-logo__wordmark') }}
    </span>
@endif
