<?php

declare(strict_types=1);

namespace WCM\Admin;

final class CrossReferenceReviewPage
{
    private const PAGE_SLUG = 'wcm-cross-reference-review';
    private const SCRIPT_HANDLE = 'wcm-cross-reference-review';

    public function register(): void
    {
        add_management_page(
            __('WCM Cross Reference Review', 'wcm-core'),
            __('WCM Cross References', 'wcm-core'),
            'manage_options',
            self::PAGE_SLUG,
            [$this, 'render']
        );
    }

    public function enqueue(string $hookSuffix): void
    {
        if ($hookSuffix !== 'tools_page_' . self::PAGE_SLUG) {
            return;
        }

        $pluginRoot = dirname(__DIR__, 2);
        $scriptPath = $pluginRoot . '/assets/admin/cross-reference-review.js';
        $scriptUrl = plugins_url('assets/admin/cross-reference-review.js', $pluginRoot . '/wcm-core.php');

        wp_enqueue_script(
            self::SCRIPT_HANDLE,
            $scriptUrl,
            [],
            file_exists($scriptPath) ? (string) filemtime($scriptPath) : '1.0.0',
            true
        );

        wp_localize_script(
            self::SCRIPT_HANDLE,
            'wcmCrossReferenceReview',
            [
                'root' => esc_url_raw(rest_url('wcm/v1/cross-references/review')),
                'nonce' => wp_create_nonce('wp_rest'),
                'statuses' => [
                    'unreviewed',
                    'approved',
                    'rejected',
                    'suppressed',
                ],
                'writeStatuses' => [
                    'approved',
                    'rejected',
                    'suppressed',
                ],
                'reasons' => [
                    'accepted',
                    'not_relevant',
                    'too_broad',
                    'duplicate_like',
                    'confusing',
                    'pastorally_unhelpful',
                    'source_quality',
                    'other',
                ],
                'labels' => [
                    'loading' => __('Loading...', 'wcm-core'),
                    'loadError' => __('Unable to load cross references.', 'wcm-core'),
                    'saveError' => __('Unable to save review.', 'wcm-core'),
                    'saved' => __('Review saved.', 'wcm-core'),
                    'review' => __('Review', 'wcm-core'),
                    'previous' => __('Previous', 'wcm-core'),
                    'next' => __('Next', 'wcm-core'),
                    'source' => __('Source', 'wcm-core'),
                    'target' => __('Target', 'wcm-core'),
                    'notReviewed' => __('Not reviewed yet', 'wcm-core'),
                    'reasonRequired' => __('Rejected and suppressed reviews require a reason.', 'wcm-core'),
                    'notesRequired' => __('Internal notes are required when reason is other.', 'wcm-core'),
                    'selectRelationship' => __('Select a relationship to review.', 'wcm-core'),
                    'noResults' => __('No cross references match these filters.', 'wcm-core'),
                ],
            ]
        );
    }

    public function render(): void
    {
        if (! current_user_can('manage_options')) {
            wp_die(esc_html__('You do not have permission to review cross references.', 'wcm-core'));
        }

        echo '<div class="wrap wcm-cross-reference-review">';
        echo '<h1>' . esc_html__('WCM Cross Reference Review', 'wcm-core') . '</h1>';
        echo '<p class="description">' . esc_html__('Review imported OpenBible cross references. This tool changes review status only; it does not edit relationship types, source data, or public visibility.', 'wcm-core') . '</p>';
        echo '<div id="wcm-cross-reference-review-root">';
        echo '<p>' . esc_html__('Loading review tool...', 'wcm-core') . '</p>';
        echo '</div>';
        echo '</div>';

        $this->renderStyles();
    }

    private function renderStyles(): void
    {
        ?>
        <style>
            .wcm-cross-reference-review .wcm-review-layout {
                display: grid;
                grid-template-columns: minmax(0, 1fr) minmax(320px, 420px);
                gap: 20px;
                align-items: start;
                margin-top: 20px;
            }

            .wcm-cross-reference-review .wcm-review-panel {
                background: #fff;
                border: 1px solid #dcdcde;
                border-radius: 4px;
                padding: 16px;
            }

            .wcm-cross-reference-review .wcm-review-filters {
                display: grid;
                grid-template-columns: repeat(6, minmax(0, 1fr));
                gap: 8px;
                margin-bottom: 12px;
            }

            .wcm-cross-reference-review .wcm-review-filters label,
            .wcm-cross-reference-review .wcm-review-field label {
                display: block;
                font-weight: 600;
                margin-bottom: 4px;
            }

            .wcm-cross-reference-review .wcm-review-filters input,
            .wcm-cross-reference-review .wcm-review-filters select,
            .wcm-cross-reference-review .wcm-review-field select,
            .wcm-cross-reference-review .wcm-review-field textarea {
                width: 100%;
            }

            .wcm-cross-reference-review .wcm-review-table {
                width: 100%;
                border-collapse: collapse;
            }

            .wcm-cross-reference-review .wcm-review-table th,
            .wcm-cross-reference-review .wcm-review-table td {
                padding: 8px;
                border-bottom: 1px solid #dcdcde;
                text-align: left;
                vertical-align: top;
            }

            .wcm-cross-reference-review .wcm-review-meta {
                color: #646970;
                font-size: 12px;
            }

            .wcm-cross-reference-review .wcm-review-detail-list {
                display: grid;
                grid-template-columns: 130px minmax(0, 1fr);
                gap: 8px 12px;
                margin: 0 0 16px;
            }

            .wcm-cross-reference-review .wcm-review-detail-list dt {
                font-weight: 600;
            }

            .wcm-cross-reference-review .wcm-review-detail-list dd {
                margin: 0;
                overflow-wrap: anywhere;
            }

            .wcm-cross-reference-review .wcm-review-actions {
                display: flex;
                gap: 8px;
                align-items: center;
                justify-content: space-between;
                margin-top: 12px;
            }

            .wcm-cross-reference-review .wcm-review-notice {
                margin: 12px 0 0;
                padding: 8px 10px;
                border-left: 4px solid #2271b1;
                background: #f6f7f7;
            }

            .wcm-cross-reference-review .wcm-review-notice.is-error {
                border-left-color: #d63638;
            }

            @media (max-width: 960px) {
                .wcm-cross-reference-review .wcm-review-layout {
                    grid-template-columns: 1fr;
                }

                .wcm-cross-reference-review .wcm-review-filters {
                    grid-template-columns: repeat(2, minmax(0, 1fr));
                }
            }
        </style>
        <?php
    }
}
