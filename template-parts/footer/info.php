<?php
/**
 * Template part for displaying the footer info
 *
 * @package wp_rig
 */

namespace WP_Rig\WP_Rig;

?>

<div class="site-info">
	<a href="<?php echo esc_url( 'https://dmitrii.website/' ); ?>">
		<?php
		/* translators: %s: CMS name, i.e. WordPress. */
		printf( esc_html__( 'Made by %s', 'wp-rig' ), 'Dmitrii Bludov' );
		?>
	</a>
	<span class="sep"> | </span>
	<?php
	/* translators: Theme name. */
	printf( esc_html__( 'Theme: %s ', 'wp-rig' ), 'RMC' );

	if ( function_exists( 'the_privacy_policy_link' ) ) {
		the_privacy_policy_link( '<span class="sep"> | </span>' );
	}
	?>
</div><!-- .site-info -->
