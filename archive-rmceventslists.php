<?php
/**
 * Template Name: Events Template
 *
 * When active, by adding the heading above and providing a custom name
 * this template becomes available in a drop-down panel in the editor.
 *
 * Filename can be anything.
 *
 * @link https://developer.wordpress.org/themes/template-files-section/page-template-files/#creating-custom-page-templates-for-global-use
 *
 * @package wp_rig
 */
namespace WP_Rig\WP_Rig;

get_header();

get_template_part ('template-parts/content/entry_calendar');

get_footer();
