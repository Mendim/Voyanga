var var_marginHowLong = 20;
var var_marginHowLongSmall = 5;
var var_paddingDateTime = 15;

var MAX_BIG_CITY_NAME_SMALL_TICKET = 16;
var MAX_BIG_CITY_NAME = 16;
var MAX_BIG_AIRPORT_NAME_SMALL_TICKET = 16;
var MAX_BIG_AIRPORT_NAME = 16;

var MIN_BIG_CITY_NAME_SMALL_TICKET = 12;
var MIN_BIG_CITY_NAME = 12;
var MIN_BIG_AIRPORT_NAME_SMALL_TICKET = 12;
var MIN_BIG_AIRPORT_NAME = 12;

function widthHowLong() {
	$('.recommended-ticket .ticket-items').each(function() {
		var var_dataTimeCity = $(this).find('.date-time-city');
		var var_start = var_dataTimeCity.find('.start');
		var var_howLong = var_dataTimeCity.find('.how-long');
		var var_finish = var_dataTimeCity.find('.finish');
		var var_smallTicketsRecIsset =  $(this).hasClass('small');
		var var_widthDataTimeCity = var_dataTimeCity.width();
		var var_widthStart;
		var var_heightStart = var_start.height();
		var var_widthFinish;

		if (! var_smallTicketsRecIsset) {
			var_dataTimeCity.css('min-height', var_heightStart+'px');
			var_widthStart = var_start.width();
			var_widthFinish = var_finish.width();
			var_dataTimeCity.css('padding-left', var_widthStart + 'px').css('padding-right', var_widthFinish + 'px');
			var_dataTimeCity.find('.how-long').css('width', var_dataTimeCity.width()+'px');
		}
		else {
			var_dataTimeCity.css('min-height', var_heightStart+'px');
			var_widthStart = var_start.width();
			var_widthFinish = var_finish.width();
			var_dataTimeCity.css('padding-left', var_widthStart + 'px').css('padding-right', var_widthFinish + 'px');
			var_dataTimeCity.find('.how-long').css('width', '100%');
		}
	});
	$('.ticket-content .ticket-items').each(function() {
		var var_dataTimeCity = $(this).find('.date-time-city');
		var var_start = var_dataTimeCity.find('.start');
		var var_howLong = var_dataTimeCity.find('.how-long');
		var var_finish = var_dataTimeCity.find('.finish');
		var var_smallTicketsIsset =  $(this).hasClass('small');
		var var_widthDataTimeCity = var_dataTimeCity.width();
		var var_widthStart;
		var var_heightStart = var_start.height();
		var var_widthFinish;

		if (! var_smallTicketsIsset) {
			var_dataTimeCity.css('min-height', var_heightStart+'px');
			var_widthStart = var_start.width();
			var_widthFinish = var_finish.width();
			var_dataTimeCity.css('padding-left', (var_widthStart + var_marginHowLong + var_paddingDateTime) + 'px').css('padding-right', (var_widthStart + var_marginHowLong + var_paddingDateTime) + 'px');
			var_dataTimeCity.find('.how-long').css('width', var_dataTimeCity.width()+'px');
		}
		else {
			var_dataTimeCity.css('min-height', var_heightStart+'px');
			var_widthStart = var_start.width();
			var_widthFinish = var_finish.width();
			var_dataTimeCity.css('padding-left', (var_widthStart+ var_paddingDateTime) + 'px').css('padding-right', (var_widthFinish+ var_paddingDateTime) + 'px');
			var_dataTimeCity.find('.how-long').css('width', '100%');
		}
	});

}
function centerBuyTikets() {
	$('.buy-ticket').each(function() {
		var var_heightAllBlock = $(this).parent().height();
		var var_buyTicket = $(this).find('.text');
		var var_heightText = var_buyTicket.height();
		var var_heightBuyTicket = $(this).height();
		var var_paddingTopTicket = ((var_heightBuyTicket - var_heightText) - 20) / 2;
		var_buyTicket.css('margin-top', var_paddingTopTicket+'px');
	});
	$('.airlines').each(function() {
		var var_heightAllBlock = $(this).parent().height();

		var var_airlines = $(this).find('div');
		var var_heightText = var_airlines.height();
		var var_heightBuyTicket = $(this).height();
		var var_paddingTopTicket = ((var_heightBuyTicket - var_heightText) ) / 2;
		var_airlines .css('margin-top', var_paddingTopTicket+'px');
	});
}
function minimizeListTime() {
	$('.btn-minimize').click(function(e) {
		e.preventDefault();
		var var_list = $(this).parent().find('ul');
		if(var_list.hasClass('minimize') == true) {
			var_list.removeClass('minimize').addClass('expand');
			$(this).find('a').text('Свернуть');
			$(this).addClass('up');
			centerBuyTikets();
		}
		else {
			var_list.removeClass('expand').addClass('minimize');
			$(this).find('a').text('Списком');
			$(this).removeClass('up');
			centerBuyTikets();
		}
	});
}

/*
function smallCityName() {
	var var_simbolMax = 11;
	var	var_simbolMaxBig = 16;
	if ($('.recommended-ticket .ticket-items').length > 0 && $('.recommended-ticket .ticket-items').is(':visible')) {
		if ($('.recommended-ticket .ticket-items').hasClass('small')) {
			$('.recommended-ticket .ticket-items.small').find('.city').each(function() {
				var var_smallName = $(this);
				var var_name = var_smallName.attr('rel');
				var_name = var_name.replace(/\s+/g,'');
				var var_lengthName = var_name.length;
				if (var_lengthName > var_simbolMax) {
					var_name = var_name.slice(0, var_simbolMax);
					$(this).text(var_name+'...');
				}
			});
		}
		else {
			$('.recommended-ticket .ticket-items').find('.city').each(function() {
				var var_smallName = $(this);
				var var_name = var_smallName.attr('rel');
				var_name = var_name.replace(/\s+/g,'');
				var var_lengthName = var_name.length;
				if (var_lengthName > var_simbolMaxBig) {
					var_name = var_name.slice(0, var_simbolMaxBig);
					$(this).text(var_name+'...');
				}
				else {
					$(this).text(var_name);
				}
			});
		}
	}
}
*/

/*
function smallCityNames(simMaxBig, obj) {
    return;
	var var_name = obj.attr('rel');
	var_name = var_name.replace(/\s+/g,'');
	var var_lengthName = var_name.length;
	if (var_lengthName > simMaxBig) {
		var_name = var_name.slice(0, simMaxBig);
		obj.text(var_name+'...');
	}
	else {
		obj.text(var_name);
	}
}
*/
function allRememberName(obj) {
	$(obj).each(function() {
		var var_smallName = $(this);
		var var_name = var_smallName.text();
			var_name = var_name.replace(/\s+/g,'');
		$(this).attr('rel', var_name);
	});
}
// ОТВЕЧАЕТ ЗА СЛАЙДЕР НА МАЛЕНЬКОМ БИЛЕТЕ!
function inTheTwoLines() {
	var var_otherTime = $('.recommended-ticket .ticket-items .other-time');
	var_otherTime.each(function() {
		var var_lengthLI = $(this).find('ul.minimize li').length;
		var var_heightUL = $(this).find('ul.minimize').height();
		if (var_heightUL > 30 && var_heightUL < 40) {
			$(this).find('.variation').css('margin-top', '0px');
		}
		else if (var_heightUL > 40) {
			$(this).find('.variation').css('margin-top', '0px');
			var var_paddingTop = ($(this).height() - 40) / 2;

			$(this).find('.left').css('top', var_paddingTop+'px');
			$(this).find('.right').css('top', var_paddingTop+'px');
		}
		else {
			$(this).find('.variation').css('margin-top', '10px');
		}
		for (i = 0; i < var_lengthLI; i++) {
			var var_LI = $(this).find('ul.minimize li').eq(i);
			if (var_LI.hasClass('active') == true && i == 1) {
				$(this).find('.left').addClass('none');
			}
			else if (var_LI.hasClass('active') == true && i == (var_lengthLI - 1)) {
				$(this).find('.right').addClass('none');
			}
		}
	});
}
function otherTimeSlide() {
	var var_otherTime = $('.recommended-ticket .ticket-items .other-time');
	var var_btnLeft = var_otherTime.find('.left');
	var_btnLeft.click(function(e) {
		e.preventDefault();
		var_otherTime2 = $(this).parent();
		if (! $(this).hasClass('none')) {
			var_otherTime2.find('.right').removeClass('none');
			var var_index = var_otherTime2.find('ul.minimize li[class="active"]').index();
			var_otherTime2.find('ul.minimize li').removeClass('active');
			var_otherTime2.find('ul.minimize li').find('input').removeAttr('checked');
			var_index -= 1;
			if (var_index == 1) {
				$(this).addClass('none');
			}
			if (var_index == 0) {
				var_index = 1;
			}
			var_otherTime2.find('ul.minimize li').eq(var_index).addClass('active').find('input').attr('checked', 'checked');
		}
	});
	var var_btnRight = var_otherTime.find('.right');
	var_btnRight.click(function(e) {
		e.preventDefault();
		var_otherTime2 = $(this).parent();
		var len = (var_otherTime2.find('ul.minimize li').length - 1);

		if (! $(this).hasClass('none')) {
			var_otherTime2.find('.left').removeClass('none');
			var var_index = var_otherTime2.find('ul.minimize li[class="active"]').index();
			var_otherTime2.find('ul.minimize li').removeClass('active');
			var_otherTime2.find('ul.minimize li').find('input').removeAttr('checked');
			var_index += 1;
			if (var_index == len) {
				$(this).addClass('none');
			}
			var_otherTime2.find('ul.minimize li').eq(var_index).addClass('active').find('input').attr('checked', 'checked');
		}
	});
	var var_btnLabel = var_otherTime.find('ul.minimize li').find('label');
	var_btnLabel.click(function() {
		var_otherTime2 = $(this).parent().parent().parent().parent();
		var len = (var_otherTime2.find('ul.minimize li').length - 1);
		var_otherTime2.find('ul.minimize li').removeClass('active');
		$(this).parent().addClass('active');
		var_otherTime2.find('.left').removeClass('none');
		var_otherTime2.find('.right').removeClass('none');
		var var_index = var_otherTime2.find('ul.minimize li[class="active"]').index();
		if (var_index == 1) {
			var_otherTime2.find('.left').addClass('none');
		}
		if (var_index == len) {
			var_otherTime2.find('.right').addClass('none');
		}
	});
}



function resizeAllWindow() {
	inTheTwoLines();
	widthHowLong();
}
$(window).resize(resizeAllWindow);
$(window).load(inTheTwoLines);
$(window).load(otherTimeSlide);
$(window).load(widthHowLong);
$(window).load(centerBuyTikets);
$(window).load(minimizeListTime);
function ResizeTicket() {
	$(window).resize(centerBuyTikets);
}
$(function() {
	allRememberName('.city');
	allRememberName('.airport');
});
