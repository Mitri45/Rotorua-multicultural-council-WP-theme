<?php
/**
 * WP_Rig\WP_Rig\News_posts\Component class
 *
 * @package wp_rig
 */

namespace WP_Rig\WP_Rig\News_Posts;

use WP_Rig\WP_Rig\Component_Interface;
use WP_Rig\WP_Rig\Templating_Component_Interface;
use function WP_Rig\WP_Rig\wp_rig;
use function add_action;
use function get_cat_ID;
use function wp_enqueue_script;
use function get_theme_file_uri;
use function get_theme_file_path;
use function wp_script_add_data;
use function wp_localize_script;
use function rest_url;
use function esc_html;


/**
 * Class for News posts.
 *
 * Exposes template tags:
 * * `wp_rig()->display_news_posts( array $args = [] )`
 *
 * @link https://wordpress.org/plugins/amp/
 */
class Component implements Component_Interface, Templating_Component_Interface {

	/**
	 * Gets the unique identifier for the theme component.
	 *
	 * @return string Component slug.
	 */
	public function get_slug() : string {
		return 'news_posts';
	}

	/**
	 * Adds the action and filter hooks to integrate with WordPress.
	 */
	public function initialize() {
		add_action( 'wp_enqueue_scripts', [ $this, 'action_enqueue_news_posts_script' ] );
	}

	/**
	 * Gets template tags to expose as methods on the Template_Tags class instance, accessible through `wp_rig()`.
	 *
	 * @return array Associative array of $method_name => $callback_info pairs. Each $callback_info must either be
	 *               a callable or an array with key 'callable'. This approach is used to reserve the possibility of
	 *               adding support for further arguments in the future.
	 */
	public function template_tags() : array {
		return [
			'display_news_posts' => [ $this, 'display_news_posts' ],
		];
	}

/**
	 * Enqueues a script that shows news posts.
	 */
	public function action_enqueue_news_posts_script() {

		// If the AMP plugin is active, return early.
		if ( wp_rig()->is_amp() ) {
			return;
		}

		// Enqueue the navigation script.

		wp_enqueue_script(
			'wp-rig-news-posts',
			get_theme_file_uri( '/assets/js/newsposts.min.js' ),
			[],
			wp_rig()->get_asset_version( get_theme_file_path( '/assets/js/newsposts.min.js' ) ),
			false
		);
		wp_script_add_data( 'wp-rig-news-posts', 'defer', true );
		wp_localize_script(
			'wp-rig-news-posts',
			'postdata',
			[
				'cat_id'   => get_cat_ID( 'News' ),
				'rest_url'   => rest_url( 'wp/v2/' ),
			]
		);
	}
/**
* Display News category posts
*/

	public function display_news_posts() {
		printf(
			'<h2 class="news-posts-header">%s</h2>
			<aside class="news-posts">
			<div class="news-posts-spinner">
			</div>
			</aside>', esc_html( 'Latest news: ', 'wp-rig' )
		);

	}
}
