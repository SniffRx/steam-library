<?php

namespace App\Services\Analytics;

use Illuminate\Support\Facades\Log;

class AnalyticsService
{
    public function trackEvent(string $event, array $data = []): void
    {
        // Интеграция с Google Analytics, Mixpanel, etc.
        Log::channel('analytics')->info($event, $data);

        // Пример для Google Analytics 4
        // Http::post('https://www.google-analytics.com/mp/collect', [...]);
    }

    public function trackPageView(string $page, array $data = []): void
    {
        $this->trackEvent('page_view', array_merge($data, ['page' => $page]));
    }
}
