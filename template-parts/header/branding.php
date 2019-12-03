<?php
/**
 * Template part for displaying the header branding
 *
 * @package wp_rig
 */

namespace WP_Rig\WP_Rig;

?>


	<?php the_custom_logo(); ?>
	<h1 class="site-title"><a href="<?php echo esc_url( home_url( '/' ) ); ?>" rel="home"><?php bloginfo( 'name' ); ?></a></h1>


	<?php
	$wp_rig_description = get_bloginfo( 'description', 'display' );
	if ( $wp_rig_description || is_customize_preview() ) {
		?>
		<p class="site-description">
			<?php echo $wp_rig_description; /* phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped */ ?>
		</p>
		<?php
	}
	?><!-- .site-branding -->
