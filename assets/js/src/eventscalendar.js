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
const eventDetailsSideBar = document.body.querySelector( '.events' );
const titleOfEventsDetails = '<h2 class="events-details__title"> Events list </h2> <p class="placeholder"> Click event date for details...</p>';

//Formatting current currentMonth variable to Internationalized naming

const currentMonthInt = new Intl.DateTimeFormat( 'en-US', { month: 'long' } ).format( currentDate );

//Declare variables with DOM elements that will be populated with content by the script

const calendarYearMonth = document.body.querySelector( '.calendar-month-year' );
const calendarDays = document.body.querySelector( '.calendar-days' );

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
nextMonthButton.addEventListener( 'click', function() {
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
	eventDetailsSideBar.innerHTML = titleOfEventsDetails;
	populateEventDates( fetchedAPIData );
} );

previousMonthButton.addEventListener( 'click', function( ) {
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
	eventDetailsSideBar.innerHTML = titleOfEventsDetails;
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

/* Generate HTML for individual events post. */
function populateEventDates( eventsArray ) {
	//array with all events for current month,year
	const calendarEvents = [];
	//Loop through API events data and populate events array with events for current month,year
	for ( let i = 0; i < eventsArray.length; i++ ) {
		const eventDate = new Date( eventsArray[ i ].meta.event_date[ 0 ] );
		if ( eventDate.getMonth() === currentMonth && eventDate.getFullYear() === currentYear ) {
			calendarEvents.push( eventsArray[ i ] );
		}
	}
	//select calendar html element to populate with events
	const calendarEventDayElement = document.querySelector( '.calendar-days' );
	//get all <p> nodes of calendar div into array by spreading nodes
	const calendarNodes = [ ...calendarEventDayElement.childNodes ];

	//loop through current events array
	for ( let k = 0; k < calendarEvents.length; k++ ) {
		//get date of event element in events array
		const calendarEventDay = new Date( calendarEvents[ k ].meta.event_date[ 0 ] );
		//	calendarEventDay = calendarEventDay.getDate();
		//Make new array by filtering days that equals to current event date
		const filteredDayElementArray = calendarNodes.filter( ( day ) => day.innerText == calendarEventDay.getDate() );
		//Add classes to that element for future purposes

		const eventDotSpan = document.createElement( 'span' );
		eventDotSpan.classList.add( `event-red-dot-${ k }` );

		filteredDayElementArray[ 0 ].classList.add( 'calendar-day-have-event' );
		filteredDayElementArray[ 0 ].style.fontWeight = ( 'bold' );
		filteredDayElementArray[ 0 ].append( eventDotSpan );

		//HTML template for the event.
		const divForEvent = document.createElement( 'div' );
		divForEvent.classList.add( `eventDay-${ calendarEventDay.getDate() }` );
		divForEvent.style.display = ( 'none' );
		const eventContent = `
					<h3 class="events-post__title">
					${ calendarEvents[ k ].title.rendered }
					</h3>
					${ getFeaturedImage( calendarEvents[ k ] ) }
					<div class="event-details">
					<p> Date: ${ new Intl.DateTimeFormat( 'en-GB' ).format( calendarEventDay ) } </p>
					<p> Time: ${ calendarEvents[ k ].meta.event_time[ 0 ] } </p>

				${ calendarEvents[ k ].content.rendered }`;
		divForEvent.innerHTML = eventContent;
		eventDetailsSideBar.append( divForEvent );
		//Put the HTML Event Detail template into the ".events" div.
		filteredDayElementArray[ 0 ].addEventListener( 'click', function() {
			const placeholderInTitle = document.querySelector( '.placeholder' );
			placeholderInTitle.style.display = ( 'none' );
			const allEventsElements = document.querySelectorAll( '[class^="eventDay-"]' );
			for ( const event of allEventsElements ) {
				event.style.display = ( 'none' );
			}

			const eventsToShow = document.getElementsByClassName( `eventDay-${ calendarEventDay.getDate() }` );
			for ( let i = 0; i < eventsToShow.length; i++ ) {
				eventsToShow[ i ].style.display = ( 'initial' );
			}
		} );
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

eventDetailsSideBar.innerHTML = titleOfEventsDetails;
sendRESTquery();
