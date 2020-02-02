<?php
/**
 * WP_Rig\WP_Rig\Events_Calendar\Component class
 *
 * @package wp_rig
 */

namespace WP_Rig\WP_Rig\Events_Calendar;

use WP_Rig\WP_Rig\Component_Interface;
use WP_Rig\WP_Rig\Templating_Component_Interface;
use function WP_Rig\WP_Rig\wp_rig;
use function add_action;
use function wp_enqueue_script;
use function get_theme_file_uri;
use function get_theme_file_path;
use function wp_script_add_data;
use function wp_localize_script;
use function rest_url;
use function esc_html;


/**
 * Class for Events Calendar .
 *
 * Exposes template tags:
 * * `wp_rig()->display_events_calendar( array $args = [] )`
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
		return 'events_calendar';
	}

	/**
	 * Adds the action and filter hooks to integrate with WordPress.
	 */
	public function initialize() {
		add_action( 'wp_enqueue_scripts', [ $this, 'action_enqueue_events_calendar_script' ] );
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
			'display_events_calendar' => [ $this, 'display_events_calendar' ],
		];
	}

/**
	 * Enqueues a script that shows news posts.
	 */
	public function action_enqueue_events_calendar_script() {

		// If the AMP plugin is active, return early.
		if ( wp_rig()->is_amp() || is_front_page() ) {
			return;
		}

		// Enqueue the navigation script.

		wp_enqueue_script(
			'wp-rig-events-calendar',
			get_theme_file_uri( '/assets/js/eventscalendar.min.js' ),
			[],
			wp_rig()->get_asset_version( get_theme_file_path( '/assets/js/eventscalendar.min.js' ) ),
			false
		);
		wp_script_add_data( 'wp-rig-events-calendar', 'defer', true );
		wp_localize_script(
			'wp-rig-events-calendar',
			'postdata',
			[
				'cat_name'   =>  'rmceventslists',
				'rest_url'   => rest_url( 'wp/v2/' ),
			]
		);
	}
/**
* Display News category posts
*/

	public function display_events_calendar() {
		printf(
			'
			<h2 class="events-calendar-header">%s</h2>
			<div class="calendar-wrapper">
			<div class="calendar">
			<div class="calendar-month-year-wrapper">
			  <button type="button" id="calendar-previous-month" disabled="true">
				Previous Month
			  </button>
			  <div class="calendar-month-year"></div>
			  <button type="button" id="calendar-next-month">Next Month</button>
			</div>
			<div class="calendar-week-days">
			  <div>Mo</div>
			  <div>Tu</div>
			  <div>We</div>
			  <div>Th</div>
			  <div>Fr</div>
			  <div>Sa</div>
			  <div>Su</div>
			</div>
			<div class="calendar-days"></div>
			</div>
			<div class="events">
			</div>
		  </div>' , esc_html( 'Events calendar ', 'wp-rig' )
		);

	}
}
