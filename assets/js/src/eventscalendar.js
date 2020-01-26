// Get ready calendar net with proper dates for current Month, Year
//
//
// Initial variables, pick two current dates.
// One will be changed during script loading, other will remain the same

const initialDate = new Date();
const currentDate = new Date();
let fetchedAPIData = {};
let currentYear = currentDate.getFullYear();
let currentMonth = currentDate.getMonth();

//Formatting current currentMonth variable to Internationalized naming

const currentMonthInt = new Intl.DateTimeFormat( 'en-US', { month: 'long' } ).format( currentDate );

//Declare variables with DOM elements that will be populated with content by the script

const calendarYearMonth = document.body.querySelector( '.calendar-month-year' );
const calendarDays = document.body.querySelector( '.calendar-days' );
const eventDetailsSideBar = document.body.querySelector( '.events' );

//Place current Year and Internationalized Month name in the title of the calendar

calendarYearMonth.innerHTML = `<strong>${ currentMonthInt }</strong> ${ currentYear }`;

//Start function that will fill calendar with dates according to given month
//when document loaded. Function arguments are same Year and Month that
//pass into calendar title

document.body.onload = fillCalendarCurrentMonth( currentYear, currentMonth );

function fillCalendarCurrentMonth( year, month ) {
	const firstDayOfMonth = new Date( year, month, 1 );
	const firstDayOfMonthWeekday = firstDayOfMonth.getDay(); //define the week day of the first day given month (0-6)
	const lastDayOfMonth = new Date( year, month + 1, 0 ); //define last day of given month (this will be a day number 0 of next month)

	// For each day of given month create <p> DOM element and fill it with text (number of a day)

	for ( let i = 1; i <= lastDayOfMonth.getDate(); i++ ) {
		const dateElement = document.createElement( 'p' );
		const dateContent = document.createTextNode( i );
		dateElement.appendChild( dateContent );
		calendarDays.appendChild( dateElement );
	}

	//Shift first <p> with the first day of the given month in our Grid layout. Date method getDay() return number from 0(Sunday) to 6(Saturday),
	// but according to our grid layout first column of our grid is number 1 and it represents Monday, so I implemented little hack for Sundays(0)

	const calendarFirstDay = document.body.querySelector( '.calendar-days p:first-child' );
	if ( firstDayOfMonthWeekday == 0 ) {
		calendarFirstDay.style.gridColumn = '7';
	} else {
		calendarFirstDay.style.gridColumn = firstDayOfMonthWeekday;
	}
}

//Initialize two buttons for next and prev month

const nextMonthButton = document.getElementById( 'calendar-next-month' );
const previousMonthButton = document.getElementById( 'calendar-previous-month' );

//Next month click event listener
nextMonthButton.addEventListener( 'click', function( event ) {
	//Activate previous month button
	previousMonthButton.removeAttribute( 'disabled' );

	//When currentMonth equals 11 (December) reset currentMonth to 0 (January) and Add Year
	if ( currentMonth === 11 ) {
		currentMonth = 0;
		currentYear++;
	} else {
		currentMonth++;
	}

	const alteredMonth = currentDate.setMonth( currentMonth );
	//Remove all child Nodes from calendarDays and fill with new dates for next month
	calendarDays.innerHTML = '';
	fillCalendarCurrentMonth( currentYear, currentMonth );

	//Set new Year/Month in title of calendar
	const currentMonthInt = new Intl.DateTimeFormat( 'en-US', { month: 'long' } ).format( alteredMonth );
	calendarYearMonth.innerHTML = `<strong>${ currentMonthInt }</strong> ${ currentYear }`;
	populateEventDates( fetchedAPIData );
} );

previousMonthButton.addEventListener( 'click', function( event ) {
	if ( currentMonth === 0 ) {
		currentMonth = 11;
		currentYear--;
	} else {
		currentMonth--;
	}

	const alteredMonth = currentDate.setMonth( currentMonth );
	calendarDays.innerHTML = '';
	fillCalendarCurrentMonth( currentYear, currentMonth );
	const currentMonthInt = new Intl.DateTimeFormat( 'en-US', { month: 'long' } ).format( alteredMonth );
	calendarYearMonth.innerHTML = `<strong>${ currentMonthInt }</strong> ${ currentYear }`;

	//When we back to the month and year of initial Date - disable previous month button
	if ( initialDate.getMonth() == currentMonth && initialDate.getFullYear() == currentYear ) {
		previousMonthButton.setAttribute( 'disabled', '' );
	}
	populateEventDates( fetchedAPIData );
} );

/**
 * Fetch all events for current Month, Year from Events post category
 * via the WP REST API.
 */

// Variables passed from the php component.
const catName = postdata.cat_name;
const restURL = postdata.rest_url;

// Create query URL for the REST API. Note &_embed=true at the end which brings in featured images.
const queryURL = `${ restURL }${ catName }?_embed=true`;

// Get the featured image of Event if there is a featured image.
function getFeaturedImage( eventObject ) {
	// If there is no featured image, exit the function returning nothing.
	if ( 0 === eventObject.featured_media ) {
		return '';
	}
	const featuredObject = eventObject._embedded[ 'wp:featuredmedia' ][ 0 ];

	return `<img class="event-details__image" src="${ featuredObject.media_details.sizes.full.source_url }">`;
}

function compareMonthYear() {
	if ( eventDate.getMonth() == currentMonth && eventDate.getFullYear() == currentYear ) {
		return true;
	}
}

/* Generate HTML for individual news post. */
function populateEventDates( eventsArray ) {
	const calendarEvents = [];
	// Create a div with class "news-post" to populate.
	//const postElement = document.createElement( 'div' );
	//postElement.className = 'news-post';
	// Turn the date into something meaningful.
	for ( let i = 0; i < eventsArray.length; i++ ) {
		const eventDate = new Date( eventsArray[ i ].meta.event_date[ 0 ] );
		if ( eventDate.getMonth() == currentMonth && eventDate.getFullYear() == currentYear ) {
			calendarEvents.push( eventsArray[ i ] );
		}
	}
	const calendarEventDayElement = document.querySelector( '.calendar-days' );
	for ( let i = 0; i < calendarEvents.length; i++ ) {
		let calendarEventDay = new Date( calendarEvents[ i ].meta.event_date[ 0 ] );
		calendarEventDay = calendarEventDay.getDate();
		const calendarNodes = calendarEventDayElement.childNodes;
		for ( const eachNode in calendarNodes ) {
			const calendarNode = calendarNodes[ eachNode ];
			if ( ( calendarNode.innerText ) == calendarEventDay ) {
				calendarNode.classList.add( 'calendar-day-have-event' );
				calendarNode.addEventListener( 'click', function() {
					calendarNode.style.backgroundColor = 'blue';

					//	HTML template for the event.
					const eventContent = `
						${ getFeaturedImage( calendarEvents[ i ] ) }
						<div class="event-details">
						<p> Day ${ calendarEventDay } </p>
						<h3 class="news-post__title">
							${ calendarEvents[ i ].title.rendered }
						</h3>
					${ calendarEvents[ i ].content.rendered }`;

					//	Put the HTML Event Detail template into the ".events" div.
					eventDetailsSideBar.innerHTML = eventContent;
				} );
			}
		}
	}
}

// Fetch the query results from WP REST API.
function sendRESTquery() {
	fetch( queryURL )
		.then( ( response ) => response.json() )
		.then( ( data ) => {
			fetchedAPIData = data;
			populateEventDates( fetchedAPIData );
		}
		);
}

sendRESTquery();
