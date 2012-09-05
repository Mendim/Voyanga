function clickHowManyBtn() {
	$('.how-many-man .content').click(function(e) {
		if(! $(this).hasClass('active')) {
			$(this).addClass('active');
			$('.how-many-man .btn').addClass('active');
			$('.how-many-man').find('.popup').addClass('active');
		}
		else {
			$(this).removeClass('active');
			closeHowMany();
			closeHowMany();
		}
	});
	$('.how-many-man .btn').click(function(e) {
		if(! $(this).hasClass('active')) {
			$(this).addClass('active');
			$('.how-many-man .content').addClass('active');
			$('.how-many-man').find('.popup').addClass('active');
		}
		else {
			closeHowMany();
		}
	});
	var mouse_is_inside = false;
	$('.how-many-man .popup, .how-many-man .btn, .how-many-man .content').hover(function(){
			mouse_is_inside=true;
		},function(){
			mouse_is_inside=false;
    });
	$('body').mousedown(function(){
        if(! mouse_is_inside) {
			closeHowMany();
			$('.how-many-man .content').removeClass('active');
		}
    });
	$(window).keypress(function(e) {
            if (e.keyCode == 27) {
				closeHowMany();
				$('.how-many-man .content').removeClass('active');
			}
	});
}

/*
*/
$(window).load(clickHowManyBtn);
function closeHowMany() {
	$('.how-many-man').find('.popup').removeClass('active');
	$('.how-many-man .btn').removeClass('active');
}
