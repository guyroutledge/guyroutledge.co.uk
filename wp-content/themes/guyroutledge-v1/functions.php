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
?>