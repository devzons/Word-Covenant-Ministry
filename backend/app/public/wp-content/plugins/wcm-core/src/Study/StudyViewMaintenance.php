<?php

declare(strict_types=1);

namespace WCM\Study;

final class StudyViewMaintenance
{
    public const CRON_HOOK = 'wcm_study_view_maintenance_daily';

    public function __construct(
        private readonly StudyViewService $service = new StudyViewService()
    ) {
    }

    public function ensureSchedule(): void
    {
        if (wp_next_scheduled(self::CRON_HOOK) !== false) {
            return;
        }

        wp_schedule_event(time() + HOUR_IN_SECONDS, 'daily', self::CRON_HOOK);
    }

    public function run(): void
    {
        $this->service->pruneExpiredEvents();
        $this->service->refreshAllRollingStats();
    }

    public static function clearSchedule(): void
    {
        wp_clear_scheduled_hook(self::CRON_HOOK);
    }
}
