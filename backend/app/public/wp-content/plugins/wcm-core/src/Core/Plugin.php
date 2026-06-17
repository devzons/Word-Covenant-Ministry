<?php

declare(strict_types=1);

namespace WCM\Core;

use WCM\Api\ApiRegistrar;
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
}
