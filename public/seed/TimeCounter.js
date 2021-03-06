/* private */
function __addDays(getDays) {
    return getDays * __addHours(24);
}
function __addHours(getHours) {
    return getHours * __addMinutes(60);
}
function __addMinutes(getMinutes) {
    return getMinutes * __addSeconds(60);
}
function __addSeconds(getSeconds) {
    return getSeconds * 1000;
}
function __formatMDHMS(getValue) {
    return (getValue < 10 ? '0' + getValue : getValue);
}
/* public */
function currentDateAddDays(addDays) {
    return new Date((new Date()).getTime() + __addDays(addDays));
}
function currentDateAddHours(addHours) {
    return new Date((new Date()).getTime() + __addHours(addHours));
}
function currentDateAddMinutes(addMinutes) {
    return new Date((new Date()).getTime() + __addMinutes(addMinutes));
}
function currentDateAddSeconds(addSeconds) {
    return new Date((new Date()).getTime() + __addSeconds(addSeconds));
}
function addDays(getDate, getDays) {
    return new Date(getDate.getTime() + __addDays(getDays));
}
function addHours(getDate, getHours) {
    return new Date(getDate.getTime() + __addHours(getHours));
}
function addMinutes(getDate, getMinutes) {
    return new Date(getDate.getTime() + __addMinutes(getMinutes));
}
function addSeconds(getDate, getSeconds) {
    return new Date(getDate.getTime() + __addSeconds(getSeconds));
}
function getCrtYear(getDate) {
    return getDate.getFullYear();
}
function getCrtMonth(getDate) {
    return __formatMDHMS(getDate.getMonth() + 1);
}
function getCrtDate(getDate) {
    return __formatMDHMS(getDate.getDate());
}
function getCrtHour(getDate) {
    return __formatMDHMS(getDate.getHours());
}
function getCrtMinute(getDate) {
    return __formatMDHMS(getDate.getMinutes());
}
function getCrtSecond(getDate) {
    return __formatMDHMS(getDate.getSeconds());
}
function getCrtDay(getDate) {
    return __formatMDHMS(getDate.getDay());
}
function getCrtAlphaDay(getDate) {
    var list = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return list[getDate.getDay()];
}
/**
 *
 * @param getDate : new Date()
 * @param getYMD : e.g. "2016-01-01"
 */
function setYearMonthDate(getDate, getYMD) {
    var ymdList = getYMD.split('-');
    var tmpDate = getDate;
    tmpDate.setFullYear(parseInt(ymdList[0]));
    tmpDate.setMonth(parseInt(ymdList[1]) - 1);
    tmpDate.setDate(parseInt(ymdList[2]));
    return tmpDate;
}
/**
 *
 * @param getDate : e.g new Date()
 * @param getHMS : e.g. 06:03:20
 */
function setHourMinuteSecond(getDate, getHMS) {
    var hmsList = getHMS.split(':');
    var tmpDate = getDate;
    tmpDate.setHours(parseInt(hmsList[0]));
    tmpDate.setMinutes(parseInt(hmsList[1]));
    tmpDate.setSeconds(parseInt(hmsList[2]));
    return tmpDate;
}

/*
 * desc : format seconds to DD:HH:MM:SS
 */
function formatSecond(second, format) {
	var rawSeconds = second;
	var days = Math.floor(rawSeconds / 86400);
	rawSeconds -= days * 86400;
	var hours = Math.floor(rawSeconds / 3600);
	rawSeconds -= hours * 3600;
	var minutes = Math.floor(rawSeconds / 60);
	rawSeconds -= minutes * 60;
	var seconds = parseInt(rawSeconds % 60);
	
	switch(format) {
		case "H":
			return hours;
		case "HH":
			return (hours < 10 ? '0' + hours : hours);
		case "M":
			return minutes;
		case "MM":
			return (minutes < 10 ? '0' + minutes : minutes);
		case "S":
			return seconds;
		case "SS":
			return (seconds < 10 ? '0' + seconds : seconds);			
		default:
		case "dd:HH:MM:SS":
			return days + ':' + (hours < 10 ? '0' + hours : hours) + ':' + (minutes < 10 ? '0' + minutes : minutes) + ':' + (seconds < 10 ? '0' + seconds : seconds);
		case "HH:MM:SS":
			return hours + ':' + (minutes < 10 ? '0' + minutes : minutes) + ':' + (seconds < 10 ? '0' + seconds : seconds);
		case "MM:SS":
			return minutes + ':' + (seconds < 10 ? '0' + seconds : seconds);
	}
}
 
exports.currentDateAddDays = currentDateAddDays;
exports.currentDateAddHours = currentDateAddHours;
exports.currentDateAddMinutes = currentDateAddMinutes;
exports.currentDateAddSeconds = currentDateAddSeconds;
exports.addDays = addDays;
exports.addHours = addHours;
exports.addMinutes = addMinutes;
exports.addSeconds = addSeconds;
exports.getCrtYear = getCrtYear;
exports.getCrtMonth = getCrtMonth;
exports.getCrtDate = getCrtDate;
exports.getCrtHour = getCrtHour;
exports.getCrtMinute = getCrtMinute;
exports.getCrtSecond = getCrtSecond;
exports.getCrtDay = getCrtDay;
exports.getCrtAlphaDay = getCrtAlphaDay;
exports.setYearMonthDate = setYearMonthDate;
exports.setHourMinuteSecond = setHourMinuteSecond;
exports.formatSecond = formatSecond;
 
 
 
 
 
 
 
 
