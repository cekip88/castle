import G_G from "./libs/G_G.js";
import { G_Bus } from "./libs/G_Control.js";
class Front extends G_G{
	constructor(){
		super();
		const _ = this;
		G_Bus
			.on(_,[
				'calendarShow',
				'calendarNext',
				'calendarPrev',
				'chooseDate',
			])
	}
	define(){
		const _ = this;
		_.componentName = 'calendar';
		_.months = ['Jan','Feb','Mar','Apr','May','June','July','Aug','Sept','Oct','Nov','Dec'];
		_.init();
	}

	getMonth(date){
		return date.getMonth() + 1;
	}
	getYear(date){
		return date.getFullYear();
	}
	getMonthLength(month,year){
		const _ = this;
		let lengths = [31,28,31,30,31,30,31,31,30,31,30,31];
		if (!year % 4) lengths[1] = 29;
		return lengths[month - 1]
	}
	dateToFormat(date){
		const _ = this;
		let month = _.getMonth(date),
			year = _.getYear(date),
			day = date.getDate();

		let tpl = `${_.months[month - 1]} ${day},${year}`;
		return tpl;
	}
	dateToFormatForValue(date){
		const _ = this;
		let
			month = _.getMonth(date),
			year = _.getYear(date),
			day = date.getDate(),
			tpl = `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
		return tpl;
	}
	setStartDate(){
		const _ = this;
		let input = _.cont.querySelector(`INPUT[name="${_.name}_from"]`);
		input.value = _.dateToFormatForValue(_.dates[_.name]['start']);
		_.head.querySelector('.calendar-head-start').textContent = _.dateToFormat(_.dates[_.name]['start']);
	}
	setEndDate(){
		const _ = this;
		let input = _.cont.querySelector(`INPUT[name="${_.name}_to"]`);

		if (!_.dates[_.name]['end']) {
			_.head.querySelector('.calendar-head-end').textContent = '';
			input.value = '';
			return;
		}
		input.value = _.dateToFormatForValue(_.dates[_.name]['end']);
		_.head.querySelector('.calendar-head-end').textContent = _.dateToFormat(_.dates[_.name]['end']);
	}
	clearCalendar(){
		const _ = this;
		_.body.querySelectorAll('.cal-body-days .active').forEach(day=>{
			day.classList.remove('active');
		});
		_.body.querySelectorAll('.cal-body-days .middle').forEach(day=>{
			day.classList.remove('middle');
		});
	}
	isEqualMonth(date,date2){
		const _ = this;
		if (date.getFullYear() == date2.getFullYear()) {
			if (date.getMonth() == date2.getMonth()) {
				return true;
			}
		}
		return false;
	}
	isBetween(date){
		const _ = this;
		let dates = _.dates[_.name];
		if (!dates['start'] || !dates['end']) return false;

		let startTime = new Date(`${dates['start'].getFullYear()}-${dates['start'].getMonth() + 1}`).getTime();
		let
			endMonth = dates['end'].getMonth() + 1,
			endYear = dates['end'].getFullYear(),
			endTime = new Date(`${endYear}-${endMonth}-${_.getMonthLength(endMonth,endYear)}`).getTime();
		let curTime = date.getTime();

		return startTime <= curTime && endTime >= curTime;
	}

	calendarShow({item,event}){
		const _ = this;
		_.head = item;
		if (_.body) {
			_.close();
			return;
		}

		_.firstClick = true;
		item.classList.add('active');
		_.cont = item.closest('.calendar');
		_.body = _.markupElement(_.calendarTpl());
		_.name = item.name;
		_.cont.append(_.body);
		_.curDate = _.dates[_.name]['start'] ?? new Date();

		_.fillCalendar(_.curDate);
		_.navDate = _.curDate;
	}
	close(){
		const _ = this;
		if (!_.dates[_.name]['end']) return;
		_.head.classList.remove('active');
		_.body.remove();
		_.body = null;

		if (!_.firstClick) G_Bus.trigger(_.componentName,'changeDates',_.dates[_.name])
	};
	calendarNext(){
		const _ = this;
		let
			month = _.getMonth(_.navDate),
			year = _.getYear(_.navDate);

		month += 1;
		if (month > 12) {
			month = 1;
			year += 1;
		}

		_.navDate = new Date(`${year}-${month}`);
		_.fillCalendar(new Date(`${year}-${month}`))
	}
	calendarPrev(){
		const _ = this;
		let
			month = _.getMonth(_.navDate),
			year = _.getYear(_.navDate);

		month -= 1;
		if (month < 1) {
			month = 12;
			year -= 1;
		}

		_.navDate = new Date(`${year}-${month}`);
		_.fillCalendar(new Date(`${year}-${month}`))
	}
	calendarTpl(){
		const _ = this;
		let tpl = `
			<div class="cal-body">
				<div class="cal-body-header">
					<div class="cal-body-header-month"></div>
					<div class="cal-body-header-year"></div>
					<div class="cal-body-header-buttons">
						<button class="cal-body-header-btn prev" data-click="${_.componentName}:calendarPrev">
							<svg width="9" height="17" viewBox="0 0 9 17" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path fill-rule="evenodd" clip-rule="evenodd" d="M7.54282 0.173279L8.95703 1.76427L3.16414 8.28127L8.95703 14.7983L7.54282 16.3893L0.33571 8.28127L7.54282 0.173279Z"/>
							</svg>
						</button>
						<button class="cal-body-header-btn next" data-click="${_.componentName}:calendarNext">
							<svg width="9" height="17" viewBox="0 0 9 17" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path fill-rule="evenodd" clip-rule="evenodd" d="M1.45718 16.3892L0.0429689 14.7982L5.83586 8.28122L0.0429699 1.76422L1.45718 0.173227L8.66429 8.28122L1.45718 16.3892Z"/>
							</svg>
						</button>
					</div>
				</div>
				<div class="cal-body-titles">
					<span>Mo</span>
					<span>Tu</span>
					<span>We</span>
					<span>Th</span>
					<span>Fr</span>
					<span>Sa</span>
					<span>Su</span>
				</div>
				<div class="cal-body-days"></div>
			</div>
		`;
		return tpl;
	}
	fillCalendar(date){
		const _ = this;
		let
			year = _.getYear(date),
			month = _.getMonth(date),
			offset = new Date(`${year} ${month}`).getDay() - 1,
			count = _.getMonthLength(month,year),
			tpl = '';

		let activeDays = {};
		if (_.dates[_.name]['start'] && _.isEqualMonth(date,_.dates[_.name]['start'])) {
			activeDays.start = _.dates[_.name]['start'].getDate()
		}
		if (_.dates[_.name]['end'] && _.isEqualMonth(date,_.dates[_.name]['end'])) {
			activeDays.end = _.dates[_.name]['end'].getDate()
		}

		let between = _.isBetween(date);

		if (offset < 0) offset = 6;
		for (let i = 0; i < offset + count; i++) {
			if (i < offset) tpl += '<span class="day"></span>';
			else {
				let dayNumber = i - offset + 1;
				let cls = '';
				if (activeDays.start && activeDays.start == dayNumber) cls = ' active';
				else if (activeDays.end && activeDays.end == dayNumber) cls = ' active';
				else if (between) {
					if (!activeDays.start || dayNumber > activeDays.start) {
						cls = ' middle';
					}
					if (activeDays.end && dayNumber > activeDays.end) cls = '';
				}
				tpl += `
					<button class="day${cls}" data-click="${_.componentName}:chooseDate">
						${dayNumber}
					</button>
				`;
			}
		}

		_.body.querySelector('.cal-body-header-month').textContent = _.months[month - 1];
		_.body.querySelector('.cal-body-header-year').textContent = year;
		_.body.querySelector('.cal-body-days').innerHTML = tpl;
	}
	chooseDate({item}){
		const _ = this;
		let
			year = _.getYear(_.navDate),
			month = _.getMonth(_.navDate),
			day = item.textContent;

		if (_.firstClick) {
			_.clearCalendar();
			item.classList.add('active');
			_.dates[_.name]['start'] = new Date(`${year}-${month}-${day}`);
			_.setStartDate(_.dates[_.name]['start']);

			_.dates[_.name]['end'] = null;
			_.setEndDate();

			_.firstClick = false;
		} else {
			let endDate = new Date(`${year}-${month}-${day}`);

			if (endDate.getTime() > _.dates[_.name]['start'].getTime()) {
				_.dates[_.name]['end'] = endDate;
				_.setEndDate(_.dates[_.name]['end']);
			} else {
				_.dates[_.name]['end'] = _.dates[_.name]['start'];
				_.dates[_.name]['start'] = endDate;
				_.setStartDate(_.dates[_.name]['start']);
				_.setEndDate(_.dates[_.name]['end']);
			}

			_.close();
		}
	}
	calendarInit(calendar) {
		const _ = this;
		let
			btn = calendar.querySelector('.calendar-head'),
			name = btn.getAttribute('name');

		if (!name) {
			name = `calendar-${Math.ceil(Math.random() * 1000)}`;
		}

		let
			fromInput = calendar.querySelector(`INPUT[name="${name}_from"]`),
			toInput = calendar.querySelector(`INPUT[name="${name}_to"]`);

		if (!fromInput) {
			fromInput = _.markupElement(`<input type="hidden" name="${name}_from">`);
			calendar.prepend(fromInput);
		}
		if (!toInput) {
			toInput = _.markupElement(`<input type="hidden" name="${name}_to">`);
			calendar.prepend(toInput);
		}

		if (!_.dates) {
			_.dates = {};
			_.dates[name] = {};
		}


		if (!fromInput.value || !toInput.value) {
			fromInput.value = '';
			toInput.value = '';
		}

		if (!fromInput.value) {
			let
				startDay = _.curDate.getDate() - 6,
				month = _.getMonth(_.curDate),
				year = _.getYear(_.curDate);
			if (startDay <= 0) {
				month--;
				if (month <= 0) year--;
			}
			let startDate = new Date(`${year}-${month}-${startDay}`);
			fromInput.value = _.dateToFormatForValue(startDate);
			_.dates[name]['start'] = startDate;
		} else {
			_.dates[name]['start'] = new Date(fromInput.value);
		}

		if (!toInput.value) {
			toInput.value = _.dateToFormatForValue(_.curDate);
			_.dates[name]['end'] = _.curDate;
		} else {
			_.dates[name]['end'] = new Date(toInput.value);
		}

		calendar.querySelector('.calendar-head-start').textContent = _.dateToFormat(_.dates[name]['start']);
		calendar.querySelector('.calendar-head-end').textContent = _.dateToFormat(_.dates[name]['end']);
	}

	init(){
		const _ = this;
		_.curDate = new Date();
		document.querySelectorAll('.calendar').forEach(calendar=>{
			_.calendarInit(calendar);
		})
	}
}
new Front();