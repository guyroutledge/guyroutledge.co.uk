<?php
/*
Plugin Name: Big Fish Simple Twitter Feed
Plugin URI: http://www.bigfish.co.uk
Description: One function to show a users latest tweets. Works with twitters new oAuth only API
Author: Scott Cariss
Version: 0.1
Author URI: http://l3rady.com
*/

// Not WordPress? Stop!
!defined( 'ABSPATH' ) and exit;

define( 'BFSTF_PLUGIN_FILE', __FILE__ );
define( 'BFSTF_PLUGIN_FOLDER', dirname( BFSTF_PLUGIN_FILE ) );

define( 'BFSTF_TWITTER_CONSUMER_KEY', 'TqYOldPgF9DNfwpcW3vufw' );
define( 'BFSTF_TWITTER_CONSUMER_SECRET', 'chYfCPdTgw9CVVPrK2weHIsIeUrkbyVJ5UEFOH8gus' );
define( 'BFSTF_TWITTER_OAUTH_TOKEN', '306258597-Q6VGD137nI4lEKwge2iZ7vmYGsEIOEBpXaPk2J38' );
define( 'BFSTF_TWITTER_OAUTH_SECRET', 'OHgsi5Hln3a1qQQQBzgL2bdGi05wB5MoQZSC0qWLyE' );

require_once( BFSTF_PLUGIN_FOLDER . '/includes/twitteroauth.php' );

if ( !function_exists( 'bfstf_get_tweets' ) ) {
	function bfstf_get_tweets( $user = "bigfishlondon", $count = 3, $cache_length = 3600 ) {
		$params = array(
			'screen_name'      => $user,
			'trim_user'        => true,
			'include_entities' => true,
			'exclude_replies'  => true,
			'include_rts'      => false,
			'count'            => min( ( $count * 3 ), 200 )
		);

		$cache_key = "bfstf_" . substr( md5( $user . " - " . $count . " - " . $cache_length ), 0, 10 );
		$cache     = get_transient( $cache_key );

		if ( false !== $cache ) {
			return $cache;
		}

		$twitter      = new TwitterOAuth( BFSTF_TWITTER_CONSUMER_KEY, BFSTF_TWITTER_CONSUMER_SECRET, BFSTF_TWITTER_OAUTH_TOKEN, BFSTF_TWITTER_OAUTH_SECRET );
		$tweets       = $twitter->get( "https://api.twitter.com/1.1/statuses/user_timeline.json", $params );
		$tweets_ready = array();

		if ( !is_array( $tweets ) || ( isset( $tweets ) && isset( $tweets['error'] ) ) ) {
			$tweets_ready = false;
			set_transient( $cache_key, $tweets_ready, $cache_length );
			return $tweets_ready;
		}

		array_splice( $tweets, $count );

		foreach ( $tweets as $tweet ) {
			$description    = preg_replace( '/^\w+: /', '', $tweet->text );
			$description    = preg_replace( '/(http)+(s)?:(\/\/)((\w|\.)+)(\/)?(\S+)?/i', '<a href="\0">\0</a>', $description );
			$description    = preg_replace( '/@([\S]+)\b/', '<a href="http://www.twitter.com/\1">\0</a>', $description );
			$tweets_ready[] = $description;
		}

		set_transient( $cache_key, $tweets_ready, $cache_length );
		return $tweets_ready;
	}
}
