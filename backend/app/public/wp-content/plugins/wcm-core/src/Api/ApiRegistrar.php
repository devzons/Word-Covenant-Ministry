<?php

declare(strict_types=1);

namespace WCM\Api;

final class ApiRegistrar
{
    public function register(): void
    {
        (new BibleController())->registerRoutes();
    }
}
