<?php

declare(strict_types=1);

namespace WCM\PostTypes;

final class PostTypeRegistrar
{
    public function register(): void
    {
        $this->registerStudyPostType();
        $this->registerStudyCategoryTaxonomy();
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
            ],
            'menu_position' => 20,
            'menu_icon' => 'dashicons-welcome-write-blog',
            'show_in_menu' => true,
        ]);
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
}
