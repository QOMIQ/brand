<?php

namespace Qomiq\Brand;

use Illuminate\Support\ServiceProvider;

class BrandServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        $this->loadViewsFrom(dirname(__DIR__).'/resources/views', 'qomiq-brand');
    }
}
