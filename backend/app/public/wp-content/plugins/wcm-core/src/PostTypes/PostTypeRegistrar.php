<?php

declare(strict_types=1);

namespace WCM\PostTypes;

final class PostTypeRegistrar
{
    public function register(): void
    {
        $this->registerStudyPostType();
        $this->registerStudyCategoryTaxonomy();
        $this->registerStudyCommentDefaults();

        if (is_admin()) {
            $this->registerStudyAdminListHooks();
            $this->registerStudyDiscussionAdminHooks();
        }
    }

    private function registerStudyAdminListHooks(): void
    {
        add_filter('manage_edit-wcm_study_columns', [$this, 'filterStudyColumns']);
        add_action('manage_wcm_study_posts_custom_column', [$this, 'renderStudyColumn'], 10, 2);
        add_action('restrict_manage_posts', [$this, 'renderStudyCategoryFilter']);
        add_action('pre_get_posts', [$this, 'filterStudyListQuery']);
    }

    private function registerStudyPostType(): void
    {
        register_post_type('wcm_study', [
            'labels' => [
                'name' => __('Study Content', 'wcm-core'),
                'singular_name' => __('Study Content', 'wcm-core'),
                'add_new' => __('Add New Study Content', 'wcm-core'),
                'add_new_item' => __('Add New Study Content', 'wcm-core'),
                'edit_item' => __('Edit Study Content', 'wcm-core'),
                'new_item' => __('New Study Content', 'wcm-core'),
                'view_item' => __('View Study Content', 'wcm-core'),
                'view_items' => __('View Study Content', 'wcm-core'),
                'search_items' => __('Search Study Content', 'wcm-core'),
                'not_found' => __('No study content found.', 'wcm-core'),
                'not_found_in_trash' => __('No study content found in Trash.', 'wcm-core'),
                'all_items' => __('All Study Content', 'wcm-core'),
                'archives' => __('Study Content Archives', 'wcm-core'),
                'attributes' => __('Study Content Attributes', 'wcm-core'),
                'insert_into_item' => __('Insert into study content', 'wcm-core'),
                'uploaded_to_this_item' => __('Uploaded to this study content', 'wcm-core'),
                'featured_image' => __('Featured Image', 'wcm-core'),
                'set_featured_image' => __('Set featured image', 'wcm-core'),
                'remove_featured_image' => __('Remove featured image', 'wcm-core'),
                'use_featured_image' => __('Use as featured image', 'wcm-core'),
                'filter_items_list' => __('Filter study content list', 'wcm-core'),
                'items_list_navigation' => __('Study content list navigation', 'wcm-core'),
                'items_list' => __('Study content list', 'wcm-core'),
                'item_published' => __('Study content published.', 'wcm-core'),
                'item_updated' => __('Study content updated.', 'wcm-core'),
            ],
            'public' => true,
            'publicly_queryable' => true,
            'show_ui' => true,
            'show_in_rest' => true,
            'has_archive' => false,
            'rewrite' => [
                'slug' => 'study',
                'with_front' => false,
            ],
            'supports' => [
                'title',
                'editor',
                'excerpt',
                'thumbnail',
                'author',
                'revisions',
                'comments',
            ],
            'menu_position' => 20,
            'menu_icon' => 'dashicons-welcome-write-blog',
            'show_in_menu' => true,
        ]);
    }

    private function registerStudyCommentDefaults(): void
    {
        add_filter('wp_insert_post_data', [$this, 'defaultStudyCommentsClosed'], 10, 2);
        add_action('init', [$this, 'normalizeExistingStudyCommentStatus'], 20);
    }

    private function registerStudyDiscussionAdminHooks(): void
    {
        add_action('admin_menu', [$this, 'registerStudyDiscussionModerationMenu']);
        add_action('pre_get_comments', [$this, 'filterStudyDiscussionCommentsAdminQuery']);
        add_filter('admin_comment_types_dropdown', [$this, 'addStudyDiscussionCommentTypeFilter']);
    }

    /**
     * @param array<string, mixed> $data
     * @param array<string, mixed> $postarr
     * @return array<string, mixed>
     */
    public function defaultStudyCommentsClosed(array $data, array $postarr): array
    {
        if (($data['post_type'] ?? '') !== 'wcm_study') {
            return $data;
        }

        $postId = isset($postarr['ID']) ? (int) $postarr['ID'] : 0;

        if ($postId > 0) {
            return $data;
        }

        $data['comment_status'] = 'closed';

        return $data;
    }

    public function normalizeExistingStudyCommentStatus(): void
    {
        if (get_option('wcm_study_comments_normalized_closed') === '1') {
            return;
        }

        $posts = get_posts([
            'post_type' => 'wcm_study',
            'post_status' => 'any',
            'fields' => 'ids',
            'numberposts' => -1,
        ]);

        foreach ($posts as $postId) {
            wp_update_post([
                'ID' => (int) $postId,
                'comment_status' => 'closed',
            ]);
        }

        update_option('wcm_study_comments_normalized_closed', '1', false);
    }

    public function registerStudyDiscussionModerationMenu(): void
    {
        add_submenu_page(
            'edit.php?post_type=wcm_study',
            __('Study Discussions', 'wcm-core'),
            __('Discussion Moderation', 'wcm-core'),
            'moderate_comments',
            'wcm-study-discussions',
            [$this, 'redirectToStudyDiscussionModeration']
        );
    }

    public function redirectToStudyDiscussionModeration(): void
    {
        wp_safe_redirect(admin_url('edit-comments.php?comment_type=wcm_study_comment'));
        exit;
    }

    public function filterStudyDiscussionCommentsAdminQuery(\WP_Comment_Query $query): void
    {
        if (! is_admin()) {
            return;
        }

        $commentType = isset($_GET['comment_type'])
            ? sanitize_key((string) wp_unslash($_GET['comment_type']))
            : '';

        if ($commentType !== 'wcm_study_comment') {
            return;
        }

        $query->query_vars['type'] = 'wcm_study_comment';
        $query->query_vars['post_type'] = 'wcm_study';
    }

    /**
     * @param array<string, string> $commentTypes
     * @return array<string, string>
     */
    public function addStudyDiscussionCommentTypeFilter(array $commentTypes): array
    {
        $commentTypes['wcm_study_comment'] = __('Study Discussion', 'wcm-core');

        return $commentTypes;
    }

    private function registerStudyCategoryTaxonomy(): void
    {
        register_taxonomy('wcm_study_category', ['wcm_study'], [
            'labels' => [
                'name' => __('Study Categories', 'wcm-core'),
                'singular_name' => __('Study Category', 'wcm-core'),
                'search_items' => __('Search Study Categories', 'wcm-core'),
                'all_items' => __('All Study Categories', 'wcm-core'),
                'edit_item' => __('Edit Study Category', 'wcm-core'),
                'update_item' => __('Update Study Category', 'wcm-core'),
                'add_new_item' => __('Add New Study Category', 'wcm-core'),
                'new_item_name' => __('New Study Category Name', 'wcm-core'),
                'menu_name' => __('Study Categories', 'wcm-core'),
            ],
            'public' => true,
            'show_ui' => true,
            'show_in_rest' => true,
            'hierarchical' => true,
            'show_admin_column' => true,
            'rewrite' => [
                'slug' => 'study-category',
                'with_front' => false,
            ],
        ]);
    }

    /**
     * @param array<string, string> $columns
     * @return array<string, string>
     */
    public function filterStudyColumns(array $columns): array
    {
        $filtered = [];

        foreach ($columns as $key => $label) {
            $filtered[$key] = $label;

            if ($key === 'title') {
                $filtered['wcm_study_category'] = __('Study Category / 말씀연구 분류', 'wcm-core');
            }
        }

        if (! array_key_exists('wcm_study_category', $filtered)) {
            $filtered['wcm_study_category'] = __('Study Category / 말씀연구 분류', 'wcm-core');
        }

        return $filtered;
    }

    /**
     * @param string $column
     * @param int $postId
     */
    public function renderStudyColumn(string $column, int $postId): void
    {
        if ($column !== 'wcm_study_category') {
            return;
        }

        $terms = get_the_terms($postId, 'wcm_study_category');

        if (empty($terms) || is_wp_error($terms)) {
            echo '&mdash;';

            return;
        }

        $names = array_map(
            static fn (\WP_Term $term): string => esc_html($term->name),
            $terms
        );

        echo implode(', ', $names);
    }

    public function renderStudyCategoryFilter(): void
    {
        global $typenow;

        if ($typenow !== 'wcm_study') {
            return;
        }

        wp_dropdown_categories([
            'show_option_all' => __('All Study Categories / 모든 말씀연구 분류', 'wcm-core'),
            'taxonomy' => 'wcm_study_category',
            'name' => 'wcm_study_category',
            'orderby' => 'name',
            'selected' => $this->getSelectedStudyCategoryId(),
            'hierarchical' => true,
            'hide_empty' => false,
            'value_field' => 'term_id',
            'show_count' => false,
        ]);
    }

    public function filterStudyListQuery(\WP_Query $query): void
    {
        if (! is_admin() || ! $query->is_main_query()) {
            return;
        }

        $postType = $query->get('post_type');

        if ($postType !== 'wcm_study') {
            return;
        }

        $termId = $this->getSelectedStudyCategoryId();

        if ($termId < 1) {
            return;
        }

        $query->set('tax_query', [
            [
                'taxonomy' => 'wcm_study_category',
                'field' => 'term_id',
                'terms' => [$termId],
            ],
        ]);
    }

    private function getSelectedStudyCategoryId(): int
    {
        if (! isset($_GET['wcm_study_category'])) {
            return 0;
        }

        $selected = sanitize_text_field(wp_unslash($_GET['wcm_study_category']));

        if ($selected === '') {
            return 0;
        }

        return (int) $selected;
    }
}
