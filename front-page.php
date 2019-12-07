<?php
/**
 * Render your site front page, whether the front page displays the blog posts index or a static page.
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/#front-page-display
 *
 * @package wp_rig
 */

namespace WP_Rig\WP_Rig;

get_header();

wp_rig()->print_styles( 'wp-rig-front-page' );

?>
	<main id="primary" class="site-main">
	<section id="main-hero-image">
<?php
	get_template_part ('template-parts/content/entry_news');
?>
	</main><!-- #primary -->
<?php
get_footer();
