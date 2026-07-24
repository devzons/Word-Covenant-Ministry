<?php

declare(strict_types=1);

namespace WCM\Core;

use WCM\Admin\CrossReferenceReviewPage;
use WCM\Api\ApiRegistrar;
use WCM\Api\AuthRestBridge;
use WCM\Database\BibleBooksSeeder;
use WCM\Database\BibleVersionSeeder;
use WCM\Database\DatabaseHealthCheck;
use WCM\Database\SchemaInstaller;
use WCM\PostTypes\PostTypeRegistrar;
use WCM\Settings\SettingsRegistrar;

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
        add_action('rest_api_init', [self::class, 'registerApi']);
        add_action('admin_init', [self::class, 'registerSettings']);
        add_action('admin_menu', [self::class, 'registerAdminPages']);
        add_action('admin_enqueue_scripts', [self::class, 'enqueueAdminAssets']);
        add_action('admin_notices', [self::class, 'renderDatabaseHealthNotice']);
        add_filter('allowed_http_origins', [self::class, 'filterAllowedHttpOrigins']);
        add_filter('determine_current_user', [self::class, 'determineAuthBridgeCurrentUser'], 5);
        add_filter('rest_authentication_errors', [self::class, 'bypassAuthBridgeNonceCheck'], 90);
    }

    public static function activate(): void
    {
        if (class_exists(SchemaInstaller::class)) {
            (new SchemaInstaller())->install();
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
        $frontendOrigins = [];
        $environmentOrigin = self::normalizeOrigin((string) getenv('WCM_FRONTEND_URL'));

        if ($environmentOrigin !== null) {
            $frontendOrigins[] = $environmentOrigin;
        }

        $homeHost = (string) wp_parse_url(home_url(), PHP_URL_HOST);
        $isLocalEnvironment =
            str_contains($homeHost, '.local') ||
            str_contains($homeHost, 'localhost') ||
            wp_get_environment_type() !== 'production';

        if ($isLocalEnvironment) {
            $frontendOrigins[] = 'http://wordcovenantministry.local:3030';
        } else {
            $frontendOrigins[] = 'https://wordcovenantministry.org';
        }

        return array_values(
            array_unique(
                array_merge(
                    $origins,
                    array_values(array_filter($frontendOrigins))
                )
            )
        );
    }

    private static function normalizeOrigin(string $origin): ?string
    {
        $origin = trim($origin);

        if ($origin === '') {
            return null;
        }

        $scheme = wp_parse_url($origin, PHP_URL_SCHEME);
        $host = wp_parse_url($origin, PHP_URL_HOST);
        $port = wp_parse_url($origin, PHP_URL_PORT);

        if (! is_string($scheme) || ! is_string($host) || $scheme === '' || $host === '') {
            return null;
        }

        $normalized = strtolower($scheme) . '://' . strtolower($host);

        if (is_int($port)) {
            $normalized .= ':' . $port;
        }

        return $normalized;
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
