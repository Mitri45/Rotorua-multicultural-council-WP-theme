/**
 * Fetch up to 3 posts from News post category
 * via the WP REST API. Post are only fetched if and when the
 * user scrolls the viewport to the container.
 */

// Variables passed from the php component.
const catId = postdata.cat_id;
const restURL = postdata.rest_url;

// Create query URL for the REST API. Note &_embed=true at the end which brings in featured images.
const queryURL = `${ restURL }posts?per_page=2&categories=${ catId }&_embed=true`;

// Get the featured image if there is a featured image.
function getFeaturedImage( postObject ) {
	// If there is no featured image, exit the function returning nothing.
	if ( 0 === postObject.featured_media ) {
		return '';
	}
	const featuredObject = postObject._embedded[ 'wp:featuredmedia' ][ 0 ];
	const imgWidth = featuredObject.media_details.sizes.full.width;
	const imgHeight = featuredObject.media_details.sizes.full.height;

	return `
	<figure class="news-post__image">
		<img src="${ featuredObject.media_details.sizes.full.source_url }"
			 'width="${ imgWidth }"
			 'height="${ imgHeight }"
			 'alt="" ' +
		>
	</figure>`;
}

/* Generate HTML for individual news post. */
function thePost( postObject ) {
	// Create a div with class "news-post" to populate.
	const postElement = document.createElement( 'div' );
	postElement.className = 'news-post';
	// Turn the date into something meaningful.
	const date = new Date( postObject.date );

	// HTML template for the post.
	const postContent = `
	${ getFeaturedImage( postObject ) }
	<div class="news-post__meta">
	Published <time class="entry-date published" datetime="${ date }">${ date.toDateString() }</time>
</div>
	<h3 class="news-post__title">
		${ postObject.title.rendered }
	</h3>

	${ postObject.excerpt.rendered }
	<div class="wp-block-button alignright news-details"><a class="wp-block-button__link has-text-color has-theme-black-color has-background no-border-radius" href="${ postObject.link }">DETAILS</a></div>`;

	// Put the HTML template into the postElement div.
	postElement.innerHTML = postContent;

	return postElement;
}

// Find the .news-posts container and loop through the data to populate it.
function displayNewsPosts( data ) {
	const newsContainer = document.querySelector( '.news-posts' );
	data.forEach( function( postObject ) {
		newsContainer.append( thePost( postObject ) );
	} );
	const postButton = document.createElement( 'div' );
	postButton.className = 'wp-block-button all-news-button';
	const allEventsButton = `<a class="wp-block-button__link has-text-color has-theme-black-color has-background no-border-radius" href="/category/news/">SEE ALL NEWS</a>`;
	postButton.innerHTML = allEventsButton;
	newsContainer.append( postButton );
}

// Fetch the query results from WP REST API.
function sendRESTquery() {
	fetch( queryURL )
		.then( ( response ) => response.json() )
		.then( ( data ) => displayNewsPosts( data ) );
}

sendRESTquery();

