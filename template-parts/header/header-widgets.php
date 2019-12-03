<?php
/**
 * Template part for displaying the header navigation menu
 *
 * @package wp_rig
 */

namespace WP_Rig\WP_Rig;

if ( ! wp_rig()->is_header_widgets_active() ) {
	return;
}

wp_rig()->print_styles( 'wp-rig-header-widgets', 'wp-rig-widgets' );

?>
<aside id="header-widgets" class="header-widgets-area widget-area">
	<?php wp_rig()->display_header_widgets() ?>
</aside><!-- #secondary -->
