<?php

declare(strict_types=1);

namespace WCM\Core;

use WCM\Admin\CrossReferenceReviewPage;
use WCM\Api\ApiRegistrar;
use WCM\Api\Auth\AuthFrontendUrlBuilder;
use WCM\Api\AuthRestBridge;
use WCM\Database\BibleBooksSeeder;
use WCM\Database\BibleVersionSeeder;
use WCM\Database\DatabaseHealthCheck;
use WCM\Database\SchemaInstaller;
use WCM\PostTypes\PostTypeRegistrar;
use WCM\Settings\SettingsRegistrar;
use WCM\Study\StudyViewMaintenance;

final class Plugin
{
    private static bool $booted = false;

    public static function boot(): void
    {
        if (self::$booted) {
            return;
        }

        self::$booted = true;

        add_action('init', [self::class, 'ensureSchema'], 1);
        add_action('init', [self::class, 'registerPostTypes']);
        add_action('init', [self::class, 'ensureStudyViewMaintenanceSchedule']);
        add_action('rest_api_init', [self::class, 'registerApi']);
        add_action(StudyViewMaintenance::CRON_HOOK, [self::class, 'runStudyViewMaintenance']);
        add_action('admin_init', [self::class, 'registerSettings']);
        add_action('admin_menu', [self::class, 'registerAdminPages']);
        add_action('admin_enqueue_scripts', [self::class, 'enqueueAdminAssets']);
        add_action('admin_notices', [self::class, 'renderDatabaseHealthNotice']);
        add_filter('allowed_http_origins', [self::class, 'filterAllowedHttpOrigins']);
        add_filter('wp_mail_from', [self::class, 'filterMailFromAddress']);
        add_filter('wp_mail_from_name', [self::class, 'filterMailFromName']);
        add_filter('determine_current_user', [self::class, 'determineAuthBridgeCurrentUser'], 5);
        add_filter('rest_authentication_errors', [self::class, 'bypassAuthBridgeNonceCheck'], 90);
    }

    public static function activate(): void
    {
        if (class_exists(SchemaInstaller::class)) {
            (new SchemaInstaller())->install();
        }

        if (class_exists(StudyViewMaintenance::class)) {
            (new StudyViewMaintenance())->ensureSchedule();
        }

        if (class_exists(BibleVersionSeeder::class)) {
            (new BibleVersionSeeder())->seed();
        }

        if (class_exists(BibleBooksSeeder::class)) {
            (new BibleBooksSeeder())->seed();
        }

        if (class_exists(PostTypeRegistrar::class)) {
            (new PostTypeRegistrar())->register();
        }

        flush_rewrite_rules();
    }

    public static function deactivate(): void
    {
        if (class_exists(StudyViewMaintenance::class)) {
            StudyViewMaintenance::clearSchedule();
        }

        flush_rewrite_rules();
    }

    public static function registerPostTypes(): void
    {
        if (class_exists(PostTypeRegistrar::class)) {
            (new PostTypeRegistrar())->register();
        }
    }

    public static function ensureSchema(): void
    {
        if (class_exists(SchemaInstaller::class)) {
            (new SchemaInstaller())->install();
        }
    }

    public static function registerApi(): void
    {
        if (class_exists(ApiRegistrar::class)) {
            (new ApiRegistrar())->register();
        }
    }

    public static function ensureStudyViewMaintenanceSchedule(): void
    {
        if (class_exists(StudyViewMaintenance::class)) {
            (new StudyViewMaintenance())->ensureSchedule();
        }
    }

    public static function runStudyViewMaintenance(): void
    {
        if (class_exists(StudyViewMaintenance::class)) {
            (new StudyViewMaintenance())->run();
        }
    }

    public static function registerSettings(): void
    {
        if (class_exists(SettingsRegistrar::class)) {
            (new SettingsRegistrar())->register();
        }
    }

    public static function registerAdminPages(): void
    {
        if (class_exists(CrossReferenceReviewPage::class)) {
            (new CrossReferenceReviewPage())->register();
        }
    }

    public static function enqueueAdminAssets(string $hookSuffix): void
    {
        if (class_exists(CrossReferenceReviewPage::class)) {
            (new CrossReferenceReviewPage())->enqueue($hookSuffix);
        }
    }

    public static function renderDatabaseHealthNotice(): void
    {
        if (! current_user_can('manage_options') || ! class_exists(DatabaseHealthCheck::class)) {
            return;
        }

        $result = (new DatabaseHealthCheck())->check();

        if ($result['ok']) {
            return;
        }

        $missingTables = implode(', ', array_map('esc_html', $result['missing']));

        echo '<div class="notice notice-error"><p>';
        echo esc_html__('WCM Core: Scripture database tables are missing:', 'wcm-core') . ' ' . $missingTables;
        echo '</p></div>';
    }

    /**
     * @param array<int, string> $origins
     * @return array<int, string>
     */
    public static function filterAllowedHttpOrigins(array $origins): array
    {
        $frontendOrigins = (new AuthFrontendUrlBuilder())->allowedOrigins();

        return array_values(
            array_unique(
                array_merge(
                    $origins,
                    array_values(array_filter($frontendOrigins))
                )
            )
        );
    }

    public static function filterMailFromAddress(string $fromAddress): string
    {
        $configuredFromAddress = trim((string) getenv('WCM_EMAIL_FROM_ADDRESS'));

        if ($configuredFromAddress === '' || ! is_email($configuredFromAddress)) {
            return $fromAddress;
        }

        return $configuredFromAddress;
    }

    public static function filterMailFromName(string $fromName): string
    {
        $configuredFromName = trim((string) getenv('WCM_EMAIL_FROM_NAME'));

        if ($configuredFromName === '') {
            return $fromName;
        }

        return sanitize_text_field($configuredFromName);
    }

    /**
     * @param int|false $userId
     * @return int|false
     */
    public static function determineAuthBridgeCurrentUser(int|false $userId): int|false
    {
        return (new AuthRestBridge())->determineCurrentUser($userId);
    }

    public static function bypassAuthBridgeNonceCheck(mixed $result): mixed
    {
        return (new AuthRestBridge())->bypassNonceCheckForBridgeRoutes($result);
    }
}
