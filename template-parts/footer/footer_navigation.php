<?php
/**
 * Template part for displaying navigation menu in footer
 *
 * @package wp_rig
 */

namespace WP_Rig\WP_Rig;

if ( ! wp_rig()->is_footer_nav_menu_active() ) {
	return;
}
?>

<div id="footer-site-navigation" class="footer-site-navigation" aria-label="<?php esc_attr_e( 'Footer navigation menu', 'wp-rig' ); ?>">
		<?php wp_rig()->display_footer_nav_menu( [ 'menu_id' => 'primary-menu' ] ); ?>
	</div>
</nav><!-- #site-navigation -->
