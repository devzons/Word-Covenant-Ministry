<?php

/**
 * Plugin Name: WCM Core
 * Plugin URI: https://wordcovenantministry.org
 * Description: Core functionality for Word Covenant Ministry.
 * Version: 1.0.0
 * Author: Word Covenant Ministry
 * Text Domain: wcm-core
 */

defined('ABSPATH') || exit;

require_once __DIR__ . '/src/Core/Plugin.php';

WCM\Core\Plugin::boot();