function sliderPhoto(that) {
	var var_this = $(that);
	var_this.find('ul').wrap('<div class="slide"></div>');
	var_this.find('ul li').length;
}
$(window).load(function() {
	sliderPhoto('.photo-slide-hotel');
});
function checkUlList() {
	$('.details').each(function() {
		console.log($(this).width());
		var var_this = $(this).find('ul li');
		var var_length = var_this.length;

			for (i = 0; i < var_length; i++) {
				if (i == 0 || i == 1) {
					var_this.eq(i).addClass('not-show');	
				}
				else {
					var_this.eq(i).hide();	
				}

		}
	});
	$('.tab-ul a').click(function() {
		var var_thisLink = $(this);
		var var_this = $(this).parent().parent();
		if (! $(this).hasClass('active')) {	
			var_thisLink.text('Свернуть все рузультаты');
			var_thisLink.addClass('active');
			var_this.find('ul li[class != "not-show"]').slideDown();
		}
		else {
			var_this.find('ul li[class != "not-show"]').slideUp(300, function() {
				var_thisLink.removeClass('active');
				var_thisLink.text('Посмотреть все результаты');
			});
		}
	});
	
}
$(window).load(checkUlList);
$(function() {
	
	$('.order-hide').click(function(e){ 
		e.preventDefault();
		$('.recomended-content').slideUp();
		$('.minimize-rcomended .btn-minimizeRecomended').animate({top : '0px'}, 500);
		$(this).fadeOut();
	});
	$('.minimize-rcomended .btn-minimizeRecomended').click(function() {
		$('.recomended-content').slideDown();
		$(this).animate({top : '-19px'}, 500);
		$(window).load(inTheTwoLines);
		smallCityName();
		otherTimeSlide();
		widthHowLong();
		setTimeout(smallTicketHeight, 100);
		$('.order-hide').fadeIn();
	});
	$('.order-show').click(function() {
		$('.recomended-content').slideDown();
		$('.minimize-rcomended .btn-minimizeRecomended').animate({top : '-19px'}, 500);
		$(window).load(inTheTwoLines);
		smallCityName();
		otherTimeSlide();
		widthHowLong();
		setTimeout(smallTicketHeight, 100);
	});
	
	$('.descr').eq(1).hide();
	$('.place-buy .tmblr li a').click(function(e) {
		e.preventDefault();
		if (! $(this).hasClass('active')) {
			var var_nameBlock = $(this).attr('href');
			var_nameBlock = var_nameBlock.slice(1);
			$('.place-buy .tmblr li').removeClass('active');
			$(this).parent().addClass('active');
			$('.descr').hide();
			$('#'+var_nameBlock).show();
		}
	});
	
	$('.read-more').click(function() {
		if (! $(this).hasClass('active')) {
			$(this).prev().css('height', 'auto');
			$('#descr').find('.left').find(".descr-text .text").dotdotdot({watch: 'window'});
			$(this).addClass('active').text('Свернуть');
		}
		else {
			$(this).prev().css('height', '54px');
			$('#descr').find('.left').find(".descr-text .text").dotdotdot({watch: 'window'});
			$(this).removeClass('active').text('Подробнее');
		}
		
		
	});
});