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
	 $args = array(
		'posts_per_page'   => 3,
		'category_name'	   => 'news',
		'orderby'          => 'date',
		'order'            => 'DESC',
		'post_type'        => 'post',
	);
	$news_posts = get_posts( $args );

	if ( $news_posts ) {
		while ( have_posts() )
		{
			the_post();
		    the_content();
		}
	}

	if ( have_posts() ) {
		while ( have_posts() )
		{
			the_post();
		    the_content();
		}
	}
?>
	</main><!-- #primary -->
<?php
get_footer();
