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

get_template_part ('template-parts/content/entry_calendar');

get_footer();
