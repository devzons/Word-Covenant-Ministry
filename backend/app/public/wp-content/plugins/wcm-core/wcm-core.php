<?php

/**
 * Plugin Name: WCM Core
 * Description: Core plugin for Word Covenant Ministry.
 * Version: 1.0.0
 * Author: Word Covenant Ministry
 * Text Domain: wcm-core
 */

defined('ABSPATH') || exit;

$autoload = __DIR__ . '/vendor/autoload.php';

if (! file_exists($autoload)) {
    add_action('admin_notices', function () {
        echo '<div class="notice notice-error"><p>' . esc_html__('WCM Core: Composer autoload file is missing. Run composer install.', 'wcm-core') . '</p></div>';
    });

    return;
}

require_once $autoload;

if (class_exists(\WCM\Core\Plugin::class)) {
    register_activation_hook(__FILE__, [\WCM\Core\Plugin::class, 'activate']);

    \WCM\Core\Plugin::boot();
}
