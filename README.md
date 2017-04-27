# DatePaginator

## Demo:
> [https://dokweb.github.io/datepaginator/](https://dokweb.github.io/datepaginator/)

## Usage:
> &gt; git clone https://github.com/DoKWeB/datepaginator.git

Dependencies required:
```html
<link rel="stylesheet" href="datepaginator.css">
<script type="text/javascript" src="datepaginator.js"></script>
```

Create DatePaginator:
```javascript
var datepaginator = new DatePaginator({
	container: '#dp', // Required. Container for datepaginator
	year: '#year', // Optional. Container for year
	month: '#month', // Optional. Container for month
	//monthFormat: 'string', // Optional. Month format. Values: string, number | default: number
	day: '#day', // Optional. Container for day
	onClick: function(e){ // Optional. Custom onclick event handler for each element. this: item, e: event
		console.log(this);
	},
	//offDays: [5, 6, 7], // Optional. Off days. Value: array of days of the week numbers | default: [6, 7] (Sat, Sun)
	work: { // Optional. For working days mark
		days: 2, // Required. Number of the working days
		offset: 2, // Required. Number of the off days
			/* Result example (days: 2, offset: 2): Mon, Tue - working days; Wed, Thu - off days; Fri, Sat - working days; Sun, Mon - off days. And so on */
		date: new Date('2017-4-4'), // Required. Date of the last working day, preferably one week before the current day
		//withoutOffDays: true // Optional. If days off can not be working days. In this case, after the weekend, a shift will occur, if it exists
			/* Result example (days: 2, offset: 2, withoutOffDays: true): Mon, Tue - working days; Wed, Thu - off days; Fri - working day; Sat, Sun - off days; Mon - working day; Tue, Wed - off days. And so on */
	},
	// itemWidth: 37, // Optional. Width of the element (If you specify custom styles).
	// navWidth: 20 // Optional. Width of navigation element (If you specify custom styles).
});
```

## Features

> DatePaginator takes up the entire width of the container.  
> Allocation of workdays and public holidays.  
> A custom event handler for the onclick event on the element.  
> Change the size of the DatePaginator when you resize the window.