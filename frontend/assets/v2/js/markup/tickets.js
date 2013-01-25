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

function minimizeListTime() {

}

// ОТВЕЧАЕТ ЗА СЛАЙДЕР НА МАЛЕНЬКОМ БИЛЕТЕ!
function inTheTwoLines() {
	var var_otherTime = $('.recommended-ticket .ticket-items .other-time');

    if (var_otherTime.length > 0 && var_otherTime.is(':visible')) {
        if (DetectMobileQuick() && var_iphone < 3) {
            //console.log('!!!==== 1 ====!!!');
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
            var_iphone++;
        }
    }
}


