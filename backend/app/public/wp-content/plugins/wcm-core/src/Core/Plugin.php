<?php

declare(strict_types=1);

namespace WCM\Core;

use WCM\Api\ApiRegistrar;
use WCM\Database\BibleBooksSeeder;
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

        add_action('init', [self::class, 'registerPostTypes']);
        add_action('rest_api_init', [self::class, 'registerApi']);
        add_action('admin_init', [self::class, 'registerSettings']);
        add_action('admin_notices', [self::class, 'renderDatabaseHealthNotice']);
    }

    public static function activate(): void
    {
        if (class_exists(SchemaInstaller::class)) {
            (new SchemaInstaller())->install();
        }

        if (class_exists(BibleBooksSeeder::class)) {
            (new BibleBooksSeeder())->seed();
        }
    }

    public static function registerPostTypes(): void
    {
        if (class_exists(PostTypeRegistrar::class)) {
            (new PostTypeRegistrar())->register();
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
}
