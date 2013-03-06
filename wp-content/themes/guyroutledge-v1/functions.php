<?php

    // make sure we can use post thumbnails
    add_theme_support('post-thumbnails');

    // Replace the [...] at the end of the_excerpt() with read more link
    function replace_excerpt($content) {
     return str_replace('[...]',
       '&hellip; <p><a href="'. get_permalink() .'">&gt; read more</a></p>',
       $content
     );
    }
    add_filter('the_excerpt', 'replace_excerpt');


    // return the ID of a post or page from the slug
    if (!function_exists('get_ID_by_slug')) :

        function get_ID_by_slug( $slug ) {
            global $wpdb;

            $cache_key = "get_ID_by_slug:$slug";

            $cache = wp_cache_get($cache_key);
            if ( $cache !== false ) {
                return $cache;
            }

            $id = $wpdb->get_var("SELECT ID FROM {$wpdb->posts} WHERE post_status = 'publish' AND post_name = '" . $wpdb->escape($slug) . "'");

            wp_cache_set($cache_key, $id);

            return $id;
        }

    endif;

	// A CPT for Portfolio

	add_action( 'init', 'register_cpt_portfolio' );

	function register_cpt_portfolio() {

		$labels = array(
			'name' => _x( 'Portfolio', 'portfolio' ),
			'singular_name' => _x( 'Portfolio Item', 'portfolio' ),
			'add_new' => _x( 'Add Portfolio Item', 'portfolio' ),
			'add_new_item' => _x( 'Add New Portfolio Item', 'portfolio' ),
			'edit_item' => _x( 'Edit Portfolio Item', 'portfolio' ),
			'new_item' => _x( 'New Portfolio Item', 'portfolio' ),
			'view_item' => _x( 'View Portfolio Item', 'portfolio' ),
			'search_items' => _x( 'Search Portfolio', 'portfolio' ),
			'not_found' => _x( 'No Portfolio Item found', 'portfolio' ),
			'not_found_in_trash' => _x( 'No Portfolio Item found in Trash', 'portfolio' ),
			'parent_item_colon' => _x( 'Parent Portfolio:', 'portfolio' ),
			'menu_name' => _x( 'Portfolio', 'portfolio' ),
		);

		$args = array(
			'labels' => $labels,
			'hierarchical' => false,
			'description' => 'Samples from my Portfolio',
			'supports' => array( 'title', 'editor' ),
			'taxonomies' => array( 'portfolio-type' ),
			'public' => true,
			'show_ui' => true,
			'show_in_menu' => true,


			'show_in_nav_menus' => true,
			'publicly_queryable' => true,
			'exclude_from_search' => false,
			'has_archive' => true,
			'query_var' => true,
			'can_export' => true,
			'rewrite' => true,
			'capability_type' => 'post'
		);

		register_post_type( 'portfolio', $args );
	}


?>
