<?php
/**
 * Plugin Name: NextTax Custom Theme Settings
 * Description: Registers ACF Options Pages and GraphQL mapping for Header/Footer. (Field groups moved to DB)
 * Version: 1.6
 */

// 1. Register Options Pages (Keep menus active)
add_action('acf/init', function() {
    if (function_exists('acf_add_options_page')) {
        acf_add_options_page([
            'page_title' => 'Header Settings',
            'menu_title' => 'Header Settings',
            'menu_slug'  => 'header-settings',
            'capability' => 'edit_posts',
            'icon_url'   => 'dashicons-welcome-widgets-menus',
            'redirect'   => false,
        ]);

        acf_add_options_page([
            'page_title' => 'Footer Settings',
            'menu_title' => 'Footer Settings',
            'menu_slug'  => 'footer-settings',
            'capability' => 'edit_posts',
            'icon_url'   => 'dashicons-editor-insertmore',
            'redirect'   => false,
        ]);
    }
});

// 2. Field groups managed via WordPress Admin > ACF > Field Groups.

// Helper: normalize an ACF Link field (returns array|false from ACF)
function nexttax_normalize_acf_link($value): ?array {
    if (empty($value) || !is_array($value)) return null;
    return [
        'target' => $value['target'] ?? '',
        'title'  => $value['title']  ?? '',
        'url'    => $value['url']    ?? '',
    ];
}

// Helper: normalize a subitem row from ACF repeater
function nexttax_normalize_subitem(array $row): array {
    return [
        'label' => $row['label'] ?? '',
        'url'   => nexttax_normalize_acf_link($row['url'] ?? null),
    ];
}

// Helper: normalize a navItem row
// KEY FIX: ACF returns false (not null/[]) for empty repeater fields
// WPGraphQL cannot handle false for list_of types -> Internal server error
function nexttax_normalize_nav_item(array $row): array {
    $subitems_raw = $row['subitem'] ?? [];
    if (!is_array($subitems_raw)) $subitems_raw = []; // coerce false -> []

    return [
        'label'   => $row['label'] ?? '',
        'url'     => is_string($row['url'] ?? '') ? ($row['url'] ?? '') : '', // Return string
        'subitem' => array_map('nexttax_normalize_subitem', $subitems_raw),
    ];
}

// 3. GraphQL Registration
add_action('graphql_register_types', function() {

    // Shared: Simple link (used by footer)
    register_graphql_object_type('CustomLink', [
        'fields' => [
            'label' => ['type' => 'String'],
            'url'   => ['type' => 'String'],
        ],
    ]);

    // NavItem: ACF Link field object (target/title/url)
    register_graphql_object_type('NavLinkField', [
        'description' => 'ACF Link field object with target/title/url',
        'fields' => [
            'target' => ['type' => 'String'],
            'title'  => ['type' => 'String'],
            'url'    => ['type' => 'String'],
        ],
    ]);

    register_graphql_object_type('NavSubItem', [
        'description' => 'A dropdown sub-navigation item',
        'fields' => [
            'label' => ['type' => 'String'],
            'url'   => ['type' => 'NavLinkField'],
        ],
    ]);

    register_graphql_object_type('NavItem', [
        'description' => 'Top-level navigation item with optional dropdown subitems',
        'fields' => [
            'label'   => ['type' => 'String'],
            'url'     => ['type' => 'String'],
            'subitem' => ['type' => ['list_of' => 'NavSubItem']],
        ],
    ]);

    // Footer types
    register_graphql_object_type('FooterNewsletter', [
        'fields' => [
            'title'      => ['type' => 'String'],
            'buttonText' => ['type' => 'String'],
            'buttonUrl'  => ['type' => 'String'],
        ],
    ]);

    register_graphql_object_type('FooterColumn', [
        'fields' => [
            'title' => ['type' => 'String'],
            'links' => ['type' => ['list_of' => 'CustomLink']],
        ],
    ]);

    register_graphql_object_type('FooterSocial', [
        'fields' => [
            'platform' => ['type' => 'String'],
            'url'      => ['type' => 'String'],
        ],
    ]);

    register_graphql_object_type('FooterContacts', [
        'fields' => [
            'email'   => ['type' => 'String'],
            'phone'   => ['type' => 'String'],
            'socials' => ['type' => ['list_of' => 'FooterSocial']],
        ],
    ]);

    register_graphql_object_type('FooterBanner', [
        'fields' => [
            'text' => ['type' => 'String'],
            'url'  => ['type' => 'String'],
        ],
    ]);

    register_graphql_object_type('FooterSettings', [
        'fields' => [
            'newsletter' => ['type' => 'FooterNewsletter', 'resolve' => fn() => get_field('newsletter', 'options')],
            'columns'    => ['type' => ['list_of' => 'FooterColumn'], 'resolve' => fn() => get_field('columns', 'options') ?: []],
            'contacts'   => ['type' => 'FooterContacts', 'resolve' => fn() => get_field('contacts', 'options')],
            'banner'     => ['type' => 'FooterBanner', 'resolve' => fn() => get_field('banner', 'options')],
            'copyright'  => ['type' => 'String', 'resolve' => fn() => get_field('copyright', 'options')],
            'legalLinks' => ['type' => ['list_of' => 'CustomLink'], 'resolve' => fn() => get_field('legal_links', 'options') ?: []],
        ],
    ]);

    // Header type
    register_graphql_object_type('HeaderSettings', [
        'fields' => [
            'logoText'     => [
                'type'    => 'String',
                'resolve' => fn() => get_field('header_logo_text', 'options') ?: 'NextTax',
            ],
            'logoIconText' => [
                'type'    => 'String',
                'resolve' => fn() => get_field('header_logo_icon_text', 'options') ?: 'N',
            ],
            'navItems' => [
                'type'    => ['list_of' => 'NavItem'],
                'resolve' => function() {
                    $rows = get_field('header_nav_items', 'options');
                    if (!is_array($rows)) return [];
                    return array_map('nexttax_normalize_nav_item', $rows);
                },
            ],
            'ctaButton' => [
                'type'    => 'CustomLink',
                'resolve' => function() {
                    $btn = get_field('header_cta_button', 'options');
                    if (!$btn || !is_array($btn)) return null;
                    return ['label' => $btn['title'] ?? '', 'url' => $btn['url'] ?? ''];
                },
            ],
        ],
    ]);

    register_graphql_field('RootQuery', 'footerSettings', ['type' => 'FooterSettings', 'resolve' => fn() => ['__source' => 'acf_options']]);
    register_graphql_field('RootQuery', 'headerSettings', ['type' => 'HeaderSettings', 'resolve' => fn() => ['__source' => 'acf_options']]);
});
