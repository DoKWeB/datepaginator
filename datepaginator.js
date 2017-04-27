function DatePaginator(options){
	this.options = options;
	this.container = document.querySelector(options.container);
	this.today = new Date();
	this.daysWeek = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];
	this.fullDaysWeek = ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"];
	this.REGULAR = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
	this.LEAP = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
	this.months = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];
	this.style = {
		itemWidth: 37,
		navWidth: 20,
		classes: {
			datepaginator: 'datepaginator',
			item: 'dp-item',
			offDay: 'dp-off',
			today: 'dp-today',
			workDay: 'dp-work',
			navItem: 'dp-nav',
			navLeft: 'dp-nav-left',
			navRight: 'dp-nav-right',
			navLeftArrow: 'dp-arrow dp-arrow-left dp-nav-left',
			navRightArrow: 'dp-arrow dp-arrow-right dp-nav-right',
			selected: 'dp-selected'
		}
	};
	
	this.container.addEventListener('click', this.onClick.bind(this));
	window.addEventListener('resize', this.reload.bind(this));
	
	this.getCountElements();
	
	this.createDatePaginator();
	
	this.showData(options);
}

/* The default handler for the onclick event */
DatePaginator.prototype.onClick = function(e){
	var elem = e.target.closest('.' + this.style.classes.item);
	
	if(elem){
		if(this.selected){
			this.selected.classList.remove(this.style.classes.selected);
		}
		
		elem.classList.add(this.style.classes.selected);
		this.selected = elem;
		
		if(this.options.onClick){
			/* If exists a custom handler, call the custom handler for the onclick event */
			this.options.onClick.call(elem, e);
		}
	}
}

/* If exists the containers for the year and/or month and/or day, insert relevant data */
DatePaginator.prototype.showData = function(options){
	if(options.year){
		document.querySelector(options.year).innerHTML = this.today.getFullYear();
	}
	if(options.month){
		/* Formats of the month: string (the name of the month), number (month number)  */
		if(options.monthFormat && options.monthFormat == 'string'){
			document.querySelector(options.month).innerHTML = this.months[this.today.getMonth()];
		}else{
			var month = this.today.getMonth() + 1;
			document.querySelector(options.month).innerHTML = month < 10 ? '0' + month : month;
		}
	}
	if(options.day){
		var day = this.today.getDate();
		document.querySelector(options.day).innerHTML = day < 10 ? '0' + day : day;
	}
}

/* Get the number of items that fit into the container  */
DatePaginator.prototype.getCountElements = function(){
	if(this.options.itemWidth) this.style.itemWidth = this.options.itemWidth;
	if(this.options.navWidth) this.style.navWidth = this.options.navWidth;
	
	this.countItemsInContainer = Math.floor((this.container.clientWidth - (this.style.navWidth * 2)) / this.style.itemWidth);
}

/* Reload a datepaginator when window resize */
DatePaginator.prototype.reload = function(){
	if(this.countItemsInContainer != this.getCountElements()){
		this.remove();
		this.createDatePaginator();
	}
}

/* Remove a datepaginator from the container */
DatePaginator.prototype.remove = function(){
	this.container.removeChild(this.paginator);
}

/* If the year is a leap return true, else false */
DatePaginator.prototype.isLeapYear = function(year){
	return year % 4 == 0 && year % 100 != 0 || year % 400 == 0;
}

/* Get the number of days in a month */
DatePaginator.prototype.getDaysInMonth = function(year, month){
	return this[this.isLeapYear(year) ? 'LEAP' : 'REGULAR'][month];
}

/* Create a node with the className */
DatePaginator.prototype.createNode = function(tag, className){
	var element = document.createElement(tag);
	if(className) element.className = className;
	
	return element;
}

/* Get the start offset for the working days */
DatePaginator.prototype.getOffsetOfWorkDays = function(end){
	var start = this.options.work.date;
	var end = new Date(end);
	
	if(start.getTime() > end.getTime()) return;
	
	var days = this.options.work.days;
	
	var year = start.getFullYear();
	var month = start.getMonth();
	var day = start.getDate();
	var daysInMonth = this.getDaysInMonth(year, month);
	
	var tOffset = -days + 1;
	
	while(true){
		if(year == end.getFullYear() && month == end.getMonth() && day == end.getDate()) break;
		
		if(++day > daysInMonth){
			if(++month == 12){
				daysInMonth = this.getDaysInMonth(++year, 0);
				month = 0;
				day = 1;
			}else{
				daysInMonth = this.getDaysInMonth(year, month);
				day = 1;
			}
		}
		
		if(--tOffset == -days) tOffset = this.options.work.offset;
	}
	
	/* Save the offset for the first item in paginator */
	this.leftOffset = tOffset;
	
	return tOffset;
}

/* Create a datepaginator */
DatePaginator.prototype.createDatePaginator = function(){
	var leftCount = this.countItemsInContainer%2 == 0 ? (this.countItemsInContainer - 2) / 2 : (this.countItemsInContainer - 1) / 2;
	var rightCount = this.countItemsInContainer%2 == 0 ? this.countItemsInContainer / 2 : (this.countItemsInContainer - 1) / 2;
	var leftItems = this.getElements(leftCount, 'left');
	var rightItems = this.getElements(rightCount, 'right');
	this.paginator = this.createNode('ul');
	this.paginator.className = this.style.classes.datepaginator;
	this.paginator.appendChild(this.createNavElement('left'));
	
	for(var i = leftItems.length - 1; i >= 0; i--){
		this.paginator.appendChild(leftItems[i]);
	}
	
	this.paginator.appendChild(this.createElement(this.today));
	
	for(var i = 0; i < rightItems.length; i++){
		this.paginator.appendChild(rightItems[i]);
	}
	
	this.paginator.appendChild(this.createNavElement('right'));
	
	/* If need to mark working days */
	if(this.options.work) this.offset = this.getOffsetOfWorkDays(leftItems[leftItems.length - 1].firstElementChild.getAttribute('data-date'));
	if(this.offset != undefined){
		for(var i = 1; i < this.paginator.children.length - 1; i++){
			if(this.options.work.withoutOffDays && this.paginator.children[i].firstElementChild.classList.contains('dp-off')) continue;
			if(this.offset <= 0){
				var elem = this.paginator.children[i].firstElementChild;
				elem.classList.add(this.style.classes.workDay);
			}
			
			if(--this.offset == -this.options.work.days) this.offset = this.options.work.offset;
		}
	}
	
	this.container.appendChild(this.paginator);
	
	/* To fix left offset */
	this.isFirstAction = true;
}

/* Create a navigation element */
DatePaginator.prototype.createNavElement = function(direction){
	var li = this.createNode('li');
	var a = this.createNode('a', this.style.classes.navItem);
	var i = this.createNode('i');
	
	if(direction == 'left'){
		a.classList.add(this.style.classes.navLeft);
		i.className = this.style.classes.navLeftArrow;
	}else{
		a.classList.add(this.style.classes.navRight);
		i.className = this.style.classes.navRightArrow;
	}
	
	a.appendChild(i);
	li.appendChild(a);
	
	a.addEventListener('click', this.move.bind(this));
	
	return li;
}

/* Note the working day and change the offsets */
DatePaginator.prototype.isWorkDay = function(offset, backOffset, newItem, backItem){
	if(this[offset] != undefined){
		if(this.isFirstAction){
			var leftOffset = offset == 'leftOffset' ? offset : backOffset;
			if(this[leftOffset] == 2){
				this[leftOffset] = 0;
			}else if(this[leftOffset] == 0){
				this[leftOffset] = 2;
			}
			
			/* When the left offset is corrected */
			this.isFirstAction = false;
		}
		
		return this.changeOffset(offset, backOffset, newItem, backItem);
	}
	
	return false;
}

/* Change offsets */
DatePaginator.prototype.changeOffset = function(offset, backOffset, newItem, backItem){ 
	if(!this.options.work.withoutOffDays || (this.options.work.withoutOffDays && !backItem.classList.contains('dp-off'))){ 
		if(++this[backOffset] == this.options.work.offset + 1){
			this[backOffset] = -1;
		}
	}
	
	if(!this.options.work.withoutOffDays || (this.options.work.withoutOffDays && !newItem.classList.contains('dp-off'))){ 
		var temp = this[offset];
		
		if(--this[offset] == -this.options.work.days){
			this[offset] = this.options.work.offset;
		}
		
		if(temp <= 0) return true;
	}
	
	return false;
}

/* Handler for navigation elements. Creating a new item and if a new item is the working day, note the working day and change the offsets */
DatePaginator.prototype.move = function(e){
	var firstEl = this.paginator.querySelector('.dp-item').parentNode;
	var lastEl = this.paginator.querySelector('li:last-child').previousElementSibling;
	
	if(e.target.classList.contains('dp-nav-left')){
		var newItem = this.getElements(1, 'left', this.startDate)[0];
		
		if(this.isWorkDay('leftOffset', 'offset', newItem.firstElementChild, lastEl.firstElementChild)){
			newItem.firstElementChild.classList.add(this.style.classes.workDay);
		}
		
		this.paginator.insertBefore(newItem, firstEl);
		var last = lastEl.previousElementSibling;
		this.paginator.removeChild(lastEl);
		this.endDate = new Date(last.firstElementChild.getAttribute('data-date'));
	}else{
		var newItem = this.getElements(1, 'right', this.endDate)[0];
		
		if(this.isWorkDay('offset', 'leftOffset', newItem.firstElementChild, firstEl.firstElementChild)){
			newItem.firstElementChild.classList.add(this.style.classes.workDay);
		}
		
		this.paginator.insertBefore(newItem, lastEl.nextElementSibling);
		var first = firstEl.nextElementSibling;
		this.paginator.removeChild(firstEl);
		this.startDate = new Date(first.firstElementChild.getAttribute('data-date'));
	}
	
}

/* Create a element */
DatePaginator.prototype.createElement = function(date){
	var li = this.createNode('li');
	var a = this.createNode('a', this.style.classes.item);
	
	if(this.options.offDays){
		for(var i = 0; i < this.options.offDays.length; i++){
			var day = this.options.offDays[i];
			
			if(day == 7) day = 0;
			
			if(date.getDay() == day){
				a.classList.add(this.style.classes.offDay);
				break;
			}
		}
	}else{
		if(date.getDay() == 0 || date.getDay() == 6){
			a.classList.add(this.style.classes.offDay);
		}
	}
	if(this.today.getFullYear == date.getFullYear && this.today.getMonth() == date.getMonth() && this.today.getDate() == date.getDate()){
		a.classList.add(this.style.classes.today);
	}
	
	a.setAttribute('data-date', date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate());
	a.setAttribute('title', this.fullDaysWeek[date.getDay()] + ' ' + date.getDate() + ' ' + this.months[date.getMonth()] + ' ' + date.getFullYear());
	
	var b = this.createNode('b');
	b.innerHTML = date.getDate();
	
	var i = this.createNode('i');
	i.innerHTML = this.daysWeek[date.getDay()];
	
	a.appendChild(b);
	a.appendChild(i);
	li.appendChild(a);
	
	this.lastDate = date;
	
	return li;
}

/* Creating and returning elements */
DatePaginator.prototype.getElements = function(count, direction, _date){
	var elements = [];
	
	var date = _date ? _date : this.today;
	var year = date.getFullYear();
	var month = date.getMonth();
	var day = date.getDate();
	var daysInMonth = this.getDaysInMonth(year, month);
	
	for(var i = 0; i < count; i++){
		if(direction == 'left'){
			if(--day == 0){
				if(--month == -1){
					daysInMonth = this.getDaysInMonth(--year, 11);
					date = new Date(year, 11, daysInMonth);
					month = 11;
					day = daysInMonth;
				}else{
					daysInMonth = this.getDaysInMonth(year, month);
					day = daysInMonth;
					date = new Date(year, month, day);
				}
			}else{
				date = new Date(year, month, day);
			}
			
			if(i == count-1){
				this.startDate = new Date(year, month, day);
			}
		}else{
			if(++day > daysInMonth){
				if(++month == 12){
					daysInMonth = this.getDaysInMonth(++year, 0);
					date = new Date(year, 0, daysInMonth);
					month = 0;
					day = 1;
				}else{
					daysInMonth = this.getDaysInMonth(year, month);
					day = 1;
					date = new Date(year, month, day);
				}
			}else{
				date = new Date(year, month, day);
			}
			
			if(i == count-1){
				this.endDate = new Date(year, month, day);
			}
		}
		
		elements.push(this.createElement(date));
	}
	
	return elements;
}