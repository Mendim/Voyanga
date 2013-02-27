window.hs = function () {
    function c() {
        var e = document.createElement("link");
        e.setAttribute("type", "text/css");
        e.setAttribute("rel", "stylesheet");
        e.setAttribute("href", f);
        e.setAttribute("class", l);
        document.body.appendChild(e)
    }
    function h() {
        var e = document.getElementsByClassName(l);
        for (var t = 0; t < e.length; t++) {
            document.body.removeChild(e[t])
        }
    }
    function p() {
        var e = document.createElement("div");
        e.setAttribute("class", a);
        document.body.appendChild(e);
        setTimeout(function () {
            document.body.removeChild(e)
        }, 100)
    }
    function d(e) {
        return {
            height: e.offsetHeight,
            width: e.offsetWidth
        }
    }
    function v(i) {
        var s = d(i);
        return s.height > e && s.height < n && s.width > t && s.width < r
    }
    function m(e) {
        var t = e;
        var n = 0;
        while ( !! t) {
            n += t.offsetTop;
            t = t.offsetParent
        }
        return n
    }
    function g() {
        var e = document.documentElement;
        if ( !! window.innerWidth) {
            return window.innerHeight
        } else if (e && !isNaN(e.clientHeight)) {
            return e.clientHeight
        }
        return 0
    }
    function y() {
        if (window.pageYOffset) {
            return window.pageYOffset
        }
        return Math.max(document.documentElement.scrollTop, document.body.scrollTop)
    }
    function E(e) {
        var t = m(e);
        return t >= w && t <= b + w
    }
    function S() {
        var e = document.createElement("audio");
        e.setAttribute("class", l);
        e.src = i;
        e.loop = false;
        e.addEventListener("canplay", function () {
            setTimeout(function () {
                x(k)
            }, 500);
            setTimeout(function () {
                N();
                p();
                for (var e = 0; e < O.length; e++) {
                    T(O[e])
                }
            }, 15500)
        }, true);
        e.addEventListener("ended", function () {
            N();
            h()
        }, true);
        e.innerHTML = " <p>If you are reading this, it is because your browser does not support the audio element. We recommend that you get a new browser.</p> <p>";
        document.body.appendChild(e);
        e.play()
    }
    function x(e) {
        e.className += " " + s + " " + o
    }
    function T(e) {
        e.className += " " + s + " " + u[Math.floor(Math.random() * u.length)]
    }
    function N() {
        var e = document.getElementsByClassName(s);
        var t = new RegExp("\\b" + s + "\\b");
        for (var n = 0; n < e.length;) {
            e[n].className = e[n].className.replace(t, "")
        }
    }
    var e = 30;
    var t = 30;
    var n = 350;
    var r = 350;
    var i = "//s3.amazonaws.com/moovweb-marketing/playground/harlem-shake.mp3";
    var s = "mw-harlem_shake_me";
    var o = "im_first";
    var u = ["im_drunk", "im_baked", "im_trippin", "im_blown"];
    var a = "mw-strobe_light";
    var f = "//s3.amazonaws.com/moovweb-marketing/playground/harlem-shake-style.css";
    var l = "mw_added_css";
    var b = g();
    var w = y();
    var C = document.getElementsByTagName("*");
    var k = null;
    for (var L = 0; L < C.length; L++) {
        var A = C[L];
        if (v(A)) {
            if (E(A)) {
                k = A;
                break
            }
        }
    }
    if (A === null) {
        console.warn("Could not find a node of the right size. Please try a different page.");
        return
    }
    c();
    S();
    var O = [];
    for (var L = 0; L < C.length; L++) {
        var A = C[L];
        if (v(A)) {
            O.push(A)
        }
    }
};

var var_widthMAX = 1390;
var var_widthMID = 1290;
var var_widthMIN = 1000;

var var_valueMAX = var_widthMAX - var_widthMID;
var var_valueMIN = var_widthMID - var_widthMIN;

var var_widthLeftBlockMAX = 295;
var var_widthLeftBlockMID = 295;
var var_widthLeftBlockMIN = 255;

var var_widthMiddleBlockOneMAX = 935;
var var_widthMiddleBlockMAX = 855;
var var_widthMiddleBlockMID = 755;
var var_widthMiddleBlockMIN = 585;

var var_widthFilterMAX = 240;
var var_widthFilterMID = 240;
var var_widthFilterMIN = 200;

var var_paddingLeftMAX = 12;
var var_paddingLeftMID = 12;
var var_paddingLeftMIN = 12;

var var_paddingRightSlideMAX = 305;
var var_paddingRightSlideMID = 305;
var var_paddingRightSlideMIN = 65;

var var_paddingLeftTelefonMAX = 250;
var var_paddingLeftTelefonMID = 250;
var var_paddingLeftTelefonMIN = 220;

var var_widthMainBlockMAX = 695;
var var_widthMainBlockMIN = 530;
var var_iphone = 0;

window.hotelsScrollCallback = function(){}

function ResizeCenterBlock() {
	var block = $('.center-block');
	var isset = block.length;
	if (isset) {
        //console.log('!!!==== 0 ====!!!');
		var var_leftBlock = $('.left-block');
		var var_head = $('.head');
		var var_mainBlock = block.find('.main-block');
		var var_content = block.find('.main-block').find('#content');
		var var_filterBlock = block.find('.filter-block');
		var var_logoBlock = block.find('.logo');
		var var_aboutBlock = block.find('.about');
		var var_slideBlock = $('.slide-turn-mode');
		var var_telefonBlock = $('.telefon');
		var var_ticketsItems = $('.ticket-content');
		var var_recomendedItems = $('.head-content');
		var var_hotelItems = $('.hotels-tickets');
		var var_calendarGridVoyanga = $('.calenderWindow');
		var var_allTripInfo = $('.allTrip .info');
		var var_descrItems = $('#descr');
		var widthLeftBlock,
			widthMainBlock,
			widthFilterBlock,
			paddingLeftLogo = 32,
			leftTopPadding,
			paddingRightSlide,
			paddingLeftTel,
			marginLeftMain,
			marginLeftFilter,
			marginLeftMainBlock,
			marginRightMainBlock,
			marginRightFilterBlock,
			marginLeftLeftBlock,
			var_margin,
			marginRightContent,
			marginLeftContent,
			widthContent,
			var_widthDescrLeft,
			var_widthStreet,
			widthAllTripInfo,
			paddingLeftInfo,
			widthLogin;

		var widthBlock = block.width();
		var var_leftBlockIsset = var_leftBlock.length > 0 && var_leftBlock.is(':visible');
		var var_mainBlockIsset = var_mainBlock.length > 0 && var_mainBlock.is(':visible');
		var var_filterBlockIsset = var_filterBlock.length > 0 && var_filterBlock.is(':visible');
		var var_calendarGridVoyangaIsset = var_calendarGridVoyanga.length > 0 && var_calendarGridVoyanga.is(':visible');

		var var_descrIsset = var_descrItems.length > 0 && var_descrItems.is(':visible');
		
		
		if (! var_leftBlockIsset &&  ! var_filterBlockIsset && var_mainBlockIsset) {
			if (widthBlock >= var_widthMAX) {
				widthMainBlock = var_widthMiddleBlockOneMAX;
				marginLeftMainBlock = 'auto';
				marginRightMainBlock = 'auto';

				paddingLeftLogo = var_paddingLeftMAX;
				paddingRightSlide = var_paddingRightSlideMAX;
				paddingLeftTel = var_paddingLeftTelefonMAX;
				
				widthContent = widthMainBlock;
				
				paddingRightSlide += 165;
			}
			else if (widthBlock < var_widthMAX && widthBlock >= var_widthMID) {
				widthMainBlock = var_widthMiddleBlockOneMAX;
				marginLeftMainBlock = 'auto';
				marginRightMainBlock = 'auto';

				paddingLeftLogo = var_paddingLeftMID;
				paddingRightSlide = var_paddingRightSlideMID;
				paddingLeftTel = var_paddingLeftTelefonMID;
				
				widthContent = widthMainBlock;
				
				paddingRightSlide += 165;
			}
			else if (widthBlock < var_widthMID && widthBlock >= var_widthMIN) {
				widthMainBlock = var_widthMiddleBlockOneMAX;
				marginLeftMainBlock = 'auto';
				marginRightMainBlock = 'auto';

				paddingLeftLogo = Math.floor(var_paddingLeftMIN + ((widthBlock - var_widthMIN) / (var_valueMIN / (var_paddingLeftMID - var_paddingLeftMIN))) );
				paddingRightSlide = Math.floor(var_paddingRightSlideMIN + ((widthBlock - var_widthMIN) / (var_valueMIN / (var_paddingRightSlideMID - var_paddingRightSlideMIN))) );
				paddingLeftTel = Math.floor(var_paddingLeftTelefonMIN + ((widthBlock - var_widthMIN) / (var_valueMIN / (var_paddingLeftTelefonMID - var_paddingLeftTelefonMIN))) );
				
				widthContent = widthMainBlock;
				
				paddingRightSlide += 100;
			}
		}
		else if (! var_leftBlockIsset &&  var_filterBlockIsset && var_mainBlockIsset) {
			if (widthBlock >= var_widthMAX) {
				widthMainBlock = var_widthMiddleBlockMAX;
				widthFilterBlock = var_widthFilterMAX;
				var_margin = Math.floor((widthBlock - (widthMainBlock + widthFilterBlock)) / 2)
				marginLeftMainBlock = var_margin;
				marginRightMainBlock = widthFilterBlock + var_margin;
				marginRightFilterBlock = var_margin;

				paddingLeftLogo = var_paddingLeftMAX;
				paddingRightSlide = var_paddingRightSlideMAX;
				paddingLeftTel = var_paddingLeftTelefonMAX;

				widthContent = var_widthMainBlockMAX;
				marginLeftContent = 'auto';
				marginRightContent = 'auto';
				
				paddingRightSlide += 165;
			}
			else if (widthBlock < var_widthMAX && widthBlock >= var_widthMID) {
				widthMainBlock = Math.floor(var_widthMiddleBlockMID + ((widthBlock - var_widthMID) / 1));
				widthFilterBlock = var_widthFilterMID;
				var_margin = Math.floor((widthBlock - (widthMainBlock + widthFilterBlock)) / 2)
				marginLeftMainBlock = var_margin;
				marginRightMainBlock = widthFilterBlock + var_margin;
				marginRightFilterBlock = var_margin;

				paddingLeftLogo = var_paddingLeftMID;
				paddingRightSlide = var_paddingRightSlideMID;
				paddingLeftTel = var_paddingLeftTelefonMID;

				widthContent = var_widthMainBlockMAX;
				marginLeftContent = 'auto';
				marginRightContent = 'auto';
				
				paddingRightSlide += 165;
			}
			else if (widthBlock < var_widthMID && widthBlock >= var_widthMIN) {
				widthFilterBlock = Math.floor(220 + ((widthBlock - var_widthMIN) / (var_valueMIN / (var_widthFilterMID - 220))) );
				var_margin = 20;
				widthMainBlock = Math.floor((widthBlock  - widthFilterBlock) - (var_margin * 2));
				if (widthMainBlock > var_widthMiddleBlockMID) {
					widthMainBlock = var_widthMiddleBlockMID
				}
				var_margin = Math.floor((widthBlock - (widthMainBlock + widthFilterBlock)) / 2)
				marginLeftMainBlock = var_margin;
				marginRightMainBlock = widthFilterBlock + var_margin;
				marginRightFilterBlock = var_margin;

				paddingLeftLogo = Math.floor(var_paddingLeftMIN + ((widthBlock - var_widthMIN) / (var_valueMIN / (var_paddingLeftMID - var_paddingLeftMIN))) );
				paddingRightSlide = Math.floor(var_paddingRightSlideMIN + ((widthBlock - var_widthMIN) / (var_valueMIN / (var_paddingRightSlideMID - var_paddingRightSlideMIN))) );
				paddingLeftTel = Math.floor(var_paddingLeftTelefonMIN + ((widthBlock - var_widthMIN) / (var_valueMIN / (var_paddingLeftTelefonMID - var_paddingLeftTelefonMIN))) );

				widthContent = var_widthMainBlockMAX;
				marginLeftContent = 'auto';
				marginRightContent = 'auto';
				
				paddingRightSlide += 100;
			}
		}

		else if (var_leftBlockIsset &&  var_filterBlockIsset && var_mainBlockIsset) {
			if (widthBlock >= var_widthMAX) {
				widthLeftBlock = var_widthLeftBlockMAX;
				widthMainBlock = var_widthMiddleBlockMAX;
				widthFilterBlock = var_widthFilterMAX;
				var_margin = Math.floor((widthBlock - (widthMainBlock + widthFilterBlock + widthLeftBlock)) / 2);
				marginLeftMainBlock = widthLeftBlock;
				marginRightMainBlock = widthFilterBlock;
				marginRightFilterBlock = 0;
				marginLeftLeftBlock = 0;

				paddingLeftLogo = var_paddingLeftMAX;
				paddingRightSlide = var_paddingRightSlideMAX;
				paddingLeftTel = var_paddingLeftTelefonMAX;

				widthContent = var_widthMainBlockMAX;
				
				paddingRightSlide += 165;
			}
			else if (widthBlock < var_widthMAX && widthBlock >= var_widthMID) {
				widthLeftBlock = var_widthLeftBlockMID;
				widthMainBlock = Math.floor(var_widthMiddleBlockMID + ((widthBlock - var_widthMID) / 1));
				widthFilterBlock = var_widthFilterMID;
				marginLeftMainBlock = widthLeftBlock;
				marginRightMainBlock = widthFilterBlock;
				marginRightFilterBlock = 0;
				marginLeftLeftBlock = 0;

				paddingLeftLogo = var_paddingLeftMID;
				paddingRightSlide = var_paddingRightSlideMID;
				paddingLeftTel = var_paddingLeftTelefonMID;

				widthContent = var_widthMainBlockMAX;
				
				paddingRightSlide += 165;
			}
			else if (widthBlock < var_widthMID && widthBlock >= var_widthMIN) {
				widthLeftBlock = Math.floor(220 + ( (widthBlock - var_widthMIN) / (var_valueMIN / (var_widthLeftBlockMID - 220))) );
				widthMainBlock = Math.floor(var_widthMiddleBlockMIN + ((widthBlock - var_widthMIN) / (var_valueMIN / (var_widthMiddleBlockMID - var_widthMiddleBlockMIN))) );
				widthFilterBlock = Math.floor(var_widthFilterMIN + ((widthBlock - var_widthMIN) / (var_valueMIN / (var_widthFilterMID - var_widthFilterMIN))) );

				paddingLeftLogo = Math.floor(var_paddingLeftMIN + ((widthBlock - var_widthMIN) / (var_valueMIN / (var_paddingLeftMID - var_paddingLeftMIN))) );
				paddingRightSlide = Math.floor(var_paddingRightSlideMIN + ((widthBlock - var_widthMIN) / (var_valueMIN / (var_paddingRightSlideMID - var_paddingRightSlideMIN))) );
				paddingLeftTel = Math.floor(var_paddingLeftTelefonMIN + ((widthBlock - var_widthMIN) / (var_valueMIN / (var_paddingLeftTelefonMID - var_paddingLeftTelefonMIN))) );

				marginLeftMainBlock = widthLeftBlock;
				marginRightMainBlock = widthFilterBlock;
				marginRightFilterBlock = 0;
				marginLeftLeftBlock = 0;

				widthContent = Math.floor(var_widthMainBlockMIN + ((widthBlock - var_widthMIN) / (var_valueMIN / (var_widthMainBlockMAX - var_widthMainBlockMIN))) );
				
				paddingRightSlide += 100;
			}
		}

		else if (var_leftBlockIsset && var_mainBlockIsset &&  ! var_filterBlockIsset ) {
			if (widthBlock >= var_widthMAX) {
				widthLeftBlock = var_widthLeftBlockMAX;
				widthMainBlock = var_widthMiddleBlockOneMAX;
				var_margin = 80;
				marginRightMainBlock = var_margin;
				marginLeftMainBlock = widthLeftBlock + var_margin;
				marginLeftLeftBlock = 0;

				paddingLeftLogo = var_paddingLeftMAX;
				paddingRightSlide = var_paddingRightSlideMAX;
				paddingLeftTel = var_paddingLeftTelefonMAX;

				marginLeftContent = 0;
				widthContent = widthMainBlock - marginLeftContent;
				marginRightContent = 0;
				var_widthDescrLeft = 587;
				var_widthStreet = 'auto'
				
				paddingRightSlide += 165;

				widthAllTripInfo = 'auto';
				paddingLeftInfo = '112px';
			}
			else if (widthBlock < var_widthMAX && widthBlock >= var_widthMID) {
				widthMainBlock = Math.floor(910 + ( (widthBlock - var_widthMID) / (var_valueMAX / (935 - 910))) );
				widthLeftBlock = var_widthLeftBlockMID;
				var_margin = Math.floor(30 + ( (widthBlock - var_widthMID) / (var_valueMAX / (80 - 30))) );
				marginRightMainBlock = var_margin;
				marginLeftMainBlock = widthLeftBlock + var_margin;
				marginLeftLeftBlock = 0;

				paddingLeftLogo = var_paddingLeftMID;
				paddingRightSlide = var_paddingRightSlideMID;
				paddingLeftTel = var_paddingLeftTelefonMID;

				marginLeftContent = 0;
				widthContent = widthMainBlock - marginLeftContent;

				marginRightContent = 0;
				var_widthDescrLeft = Math.floor(557 + ((widthBlock - var_widthMID) / (var_valueMAX / (587 - 557))) );
				var_widthStreet = 'auto'
				
				paddingRightSlide += 165;
				
				//=== THERE ===//
				//widthAllTripInfo = Math.floor(var_widthMiddleBlockMIN + ((widthBlock - var_widthMIN) / (var_valueMIN / (var_widthMiddleBlockMID - var_widthMiddleBlockMIN))) );
				widthAllTripInfo = 'auto';
				paddingLeftInfo = '112px';
			}
			else if (widthBlock < var_widthMID && widthBlock >= var_widthMIN) {
			
				widthLeftBlock = Math.floor( (220 + ( (widthBlock - var_widthMIN) / (var_valueMIN / (var_widthLeftBlockMID - 220)))) - 3 );

				widthMainBlock = Math.floor(685 + ( (widthBlock - var_widthMIN) / (var_valueMIN / (910 - 685))) );

				var_margin = 39;
				marginRightMainBlock = var_margin;
				marginLeftMainBlock = widthLeftBlock + var_margin;
				marginLeftLeftBlock = 0;

				paddingLeftLogo = Math.floor(var_paddingLeftMIN + ((widthBlock - var_widthMIN) / (var_valueMIN / (var_paddingLeftMID - var_paddingLeftMIN))) );
				paddingRightSlide = Math.floor(var_paddingRightSlideMIN + ((widthBlock - var_widthMIN) / (var_valueMIN / (var_paddingRightSlideMID - var_paddingRightSlideMIN))) );
				paddingLeftTel = Math.floor(var_paddingLeftTelefonMIN + ((widthBlock - var_widthMIN) / (var_valueMIN / (var_paddingLeftTelefonMID - var_paddingLeftTelefonMIN))) );

				marginLeftContent = 0;
				widthContent = widthMainBlock - marginLeftContent;
				marginRightContent = 0;

				var_widthDescrLeft = Math.floor(335 + ((widthBlock - var_widthMIN) / (var_valueMIN / (557 - 335))) );

				var_widthStreet = '210px';
				
				paddingRightSlide += 100;
				
				//=== THERE ===//
				widthAllTripInfo = Math.floor(585 + ((widthBlock - var_widthMIN) / (var_valueMIN / (734 - 585))) );
				widthAllTripInfo = widthAllTripInfo+'px';
				paddingLeftInfo = Math.floor(36 + ((widthBlock - var_widthMIN) / (var_valueMIN / (112 - 36))) );
			}
		}
		else {
			if (widthBlock >= var_widthMAX) {


				paddingLeftLogo = var_paddingLeftMAX;
				paddingRightSlide = var_paddingRightSlideMAX;
				paddingLeftTel = var_paddingLeftTelefonMAX;
				
				paddingRightSlide += 165;

			}
			else if (widthBlock < var_widthMAX && widthBlock >= var_widthMID) {


				paddingLeftLogo = var_paddingLeftMID;
				paddingRightSlide = var_paddingRightSlideMID;
				paddingLeftTel = var_paddingLeftTelefonMID;

				paddingRightSlide += 165;	
			}
			else if (widthBlock < var_widthMID && widthBlock >= var_widthMIN) {
				paddingLeftLogo = Math.floor(var_paddingLeftMIN + ((widthBlock - var_widthMIN) / (var_valueMIN / (var_paddingLeftMID - var_paddingLeftMIN))) );
				paddingRightSlide = Math.floor(var_paddingRightSlideMIN + ((widthBlock - var_widthMIN) / (var_valueMIN / (var_paddingRightSlideMID - var_paddingRightSlideMIN))) );
				paddingLeftTel = Math.floor(var_paddingLeftTelefonMIN + ((widthBlock - var_widthMIN) / (var_valueMIN / (var_paddingLeftTelefonMID - var_paddingLeftTelefonMIN))) );
				
				paddingRightSlide += 100;
			}
		}
		if (marginLeftMainBlock != 'auto') {
				marginLeftMainBlock = marginLeftMainBlock+'px';
		}
		if (marginRightMainBlock != 'auto') {
			marginRightMainBlock = marginRightMainBlock+'px';
		}
		if (marginLeftContent != 'auto') {
			marginLeftContent = marginLeftContent +'px';
		}
		if (marginRightContent != 'auto') {
			marginRightContent = marginRightContent +'px';
		}
		if (marginRightFilterBlock != 'auto') {
			marginRightFilterBlock = marginRightFilterBlock +'px';
		}
		if (marginLeftLeftBlock != 'auto') {
			marginLeftLeftBlock = marginLeftLeftBlock +'px';
		}
		/*===*/
		if (var_mainBlockIsset) {
			
			var_mainBlock.css('width', widthMainBlock+'px').css('margin-left', marginLeftMainBlock).css('margin-right', marginRightMainBlock);
			var_content.css('width', widthContent+'px').css('margin-left', marginLeftContent).css('margin-right', marginRightContent);
			var_allTripInfo.css('width', widthAllTripInfo);
			$('.costItAll').css('padding-right', paddingLeftInfo);	
			$('.calToursInner').css('padding-right', paddingLeftInfo);		
		}
		if (var_filterBlockIsset) {
			var_filterBlock.css('width', widthFilterBlock+'px').css('margin-right', marginRightFilterBlock);			
		}
		if (var_leftBlockIsset) {
			var_leftBlock.css('width', widthLeftBlock+'px').css('margin-left', marginLeftLeftBlock);
		}
		/* CALENDARE RESIZE */
		if (var_calendarGridVoyangaIsset) {
			$('.innerCalendar, #voyanga-calendar').css('width', widthBlock+'px')
			//var_calendarGridVoyanga.css('width', (widthBlock+16)+'px');
			//$('.weekDaysVoyangaInner').css('width', (widthBlock+16)+'px');
		}
		/* END CALENDARE RESIZE */
		if (var_descrIsset) {
			//$('#descr').find('.photo-slide-hotel').css('width', var_widthDescrLeft+'px');
			$('#descr').find('.left').find(".descr-text .text").dotdotdot({watch: 'window'});
			$('#content .place-buy .street').css('width', var_widthStreet);

		}
		if ($('.description .text').length > 0 && $('.description .text').is(':visible')) {
			$(".description .text").dotdotdot({watch: 'window'});
		}
		/*===*/
		var_logoBlock.css('left', paddingLeftLogo+'px');
		var_aboutBlock.css('left', (122 + paddingLeftLogo)+'px');
		var_slideBlock.css('right', paddingRightSlide +'px');
		var_leftBlock.find('.left-content').css('margin-left', paddingLeftLogo+'px');
		var_telefonBlock.css('left', paddingLeftTel+'px');

		if (widthContent < 690) {
			var mathWidthRicket = Math.floor(253 + ((widthBlock - var_widthMIN) / (var_valueMIN / (318 - 253))) );
			$('.recommended-ticket').css('width', mathWidthRicket+'px');
			$('.recommended-ticket').find('.ticket-items').addClass('small');
			var_content.find('h1').find('.hideTitle').hide();
			var_ticketsItems.find('.ticket-items').addClass('small');
			$('.block').find('.ticket-items').addClass('small');
			var_hotelItems.addClass('small');
		}
		else {
			$('.recommended-ticket').find('.ticket-items').removeClass('small');
			$('.recommended-ticket').css('width', '318px');
			var_ticketsItems.find('.ticket-items').removeClass('small');
			$('.block').find('.ticket-items').removeClass('small');
			var_hotelItems.removeClass('small');
			var_content.find('h1').find('.hideTitle').show();
		}
        if ($('body').width() < 1000) {
            $('body').addClass('scrollYes');
        }
        else {
            $('body').removeClass('scrollYes');
        }
		resizeLeftStage();
		resizeMainStage();
	}
	$(document).on('focus', ".second-path", function (e) {
        $(e.currentTarget).select();
    }).on('mouseup', ".second-path", function(e){
        e.preventDefault();
    });
    
    $('.voyasha td').hover(function() {
		$('.ico-voyasha').addClass('active');
	}, function() {
		$('.ico-voyasha').removeClass('active');
	});
}
function smallTicketHeight() {
    if ($('.recommended-ticket').length > 0 && $('.recommended-ticket').is(':visible')) {
        //console.log('!!!==== 4 ====!!!');
        var var_recomendedContent = $('.recomended-content');
        var var_recomendedItems = var_recomendedContent.find('.recommended-ticket .ticket-items .content');
        var var_oneHeight = var_recomendedItems.height();

        var heightTwoTicket= 0;
        if ($('.two-way').css('display')!=='none') {
            heightTwoTicket = (var_oneHeight - 24) / 2;
        } else {
            heightTwoTicket = (var_oneHeight - 24);
        }
        heightTwoTicket = Math.floor(heightTwoTicket);
        var_recomendedContent.find('.prices-of-3days .ticket .schedule-of-prices').css('height', heightTwoTicket +'px');
        var heightGraf = heightTwoTicket - 65;
        // fixme bzv this method itself called twice on avia result
        var scheduleElement = $('.prices-of-3days .ticket  .schedule-of-prices')[0];
        if(scheduleElement) {
            var siblings = ko.contextFor($('.prices-of-3days .ticket  .schedule-of-prices')[0]);

            siblings = siblings['$data'];
            if(siblings.graphHeight) {
            siblings.graphHeight(heightGraf);
            }
        }
    }
}

function resizeLeftStage() {
	var leftStage = $('.left-block');
	var leftWidth = leftStage.width();
	var leftDate = leftStage.find('.date');
	var startPosition = 170;
	var leftPaddingDate = 215;
	leftPaddingDate = (leftWidth - leftPaddingDate);
	if (leftPaddingDate < 75) {
		var leftPadding = leftPaddingDate / 1.3;
		leftPadding = leftPadding + 100;
	}
	else {
		leftPadding = startPosition;
	}
	if (leftPadding < 105) {
		leftStage.find('.path').css('width', '95px');
	}
	else {
		leftStage.find('.path').css('width', leftPadding+'px');
	}
	
	if (leftWidth < 250) {
		leftStage.addClass('smallBlock');	
	}
	else {
		leftStage.removeClass('smallBlock')
	}

}
function resizeMainStage() {
	var var_this = $('.prices-of-3days');

	var var_widthChange = $('.recommended-ticket').width();
	if (var_widthChange < 318) {
		var var_widthOneLi = var_widthChange / 7;
			var_widthOneLi = Math.floor(var_widthOneLi);
		var_widthChange = var_widthOneLi * 7;
		var_this.find('.schedule-of-prices').css('width', var_widthChange+'px');
		var_this.find('.schedule-of-prices li').css('width', var_widthOneLi+'px');
		var_this.css('width', var_widthChange+'px');
		var_this.find('.total-td .text').hide();
		var_this.find('.total-td').css('margin-left','-15px');
		var_this.find('.look-td').css('margin-right','-15px');
	}
	else {
		var_this.find('.schedule-of-prices').css('width', '318px');
		var_this.find('.schedule-of-prices li').css('width', '45px');
		var_this.css('width', '318px');
		var_this.find('.total-td').css('margin-left','0px');
		var_this.find('.look-td').css('margin-right','0px');
		var_this.find('.total-td .text').show();
	}

	if (var_widthChange < 290 && var_widthChange > 280) {
		var_this.find('.schedule-of-prices li').find('.price').css('left','-1px');
	}
	else if (var_widthChange < 280 && var_widthChange > 270) {
		var_this.find('.schedule-of-prices li').find('.price').css('left','-2px');
	}
	else if (var_widthChange < 270 && var_widthChange > 260) {
		var_this.find('.schedule-of-prices li').find('.price').css('left','-3px');
	}
	else if (var_widthChange < 260 && var_widthChange > 255) {
		var_this.find('.schedule-of-prices li').find('.price').css('left','-4px');
	}
	else if (var_widthChange < 255) {
		var_this.find('.schedule-of-prices li').find('.price').css('left','-5px');
	}
	else {
		var_this.find('.schedule-of-prices li').find('.price').css('left','0px');
	}
}

function ResizeAvia() {
    if(!window.lastResizeCall)
	window.lastResizeCall = 0;

    var dt = new Date().getTime() - window.lastResizeCall;

    if(window.resizeAviaThrottle) {
	clearTimeout(window.resizeAviaThrottle);
	window.resizeAviaThrottle = null;
    }
    if(dt < 100)
	window.resizeAviaThrottle = setTimeout(ResizeAviaClb, 1000/10);
    else {
	ResizeAviaClb();
    }
}

function ResizeAviaClb() {
    window.lastResizeCall = new Date().getTime();
    //    if (DetectMobileQuick() )
    ResizeCenterBlock();
    inTheTwoLines();
    smallTicketHeight();
    CenterIMGResize();
    slideToursSlide();
    smallIMGresizeIndex();
    mapAllPageView();
    gradientResize();
    resizePanel();
    jsPaneScrollHeight();
    startIE();
    ifIpadLoad();
    slideToursPanel();
}

function ResizeFun() {
    ResizeAvia();
}

$(window).load(function() {
	$(window).scroll(function(e) {
        scrollValue('avia', e);
        scrollValue('hotel', e);
        window.hotelsScrollCallback();
	});
});

function readMoreService(obj) {
	if (! $(obj).hasClass('active')) {
		$('.hideService').animate({'height':'100%'}, 300);
		$(obj).text('Свернуть');
		$(obj).addClass('active');
	}
	else {
		$('.hideService').animate({'height':'34px'}, 300);
		$(obj).text('Подробнее');
		$(obj).removeClass('active') 
	}
}

function mapAllPageView() {
	var _map = $('#all-hotels-map');

    if (_map.length > 0 && _map.is(':visible')) {
        //console.log('!!!==== 6 ====!!!');

        var _isset = _map.length > 0 && _map.is(':visible');
        if (_isset) {
            var _contentWidth = $('#content').width();
            var _contentHeight = $('#content').height();
            var _mainWidth = $('.main-block').width();
            var _leftBlockIsset = $('.left-block').length > 0 && $('.left-block').is(':visible');

            if (_leftBlockIsset) {
                var _marginLeftMap = ((_mainWidth - _contentWidth) / 2);

                if ($(window).height() < 670) {
                    var _windowWidth = 670;
                }
                else {
                    var _windowWidth = $(window).height();
                }
                var offset = $('#content').offset();
                $('#content').css('height', (_windowWidth - 70)+'px');
                _map.css('height', (_windowWidth - 123)+'px');
                _map.css('width', _mainWidth+'px').css('margin-left', '-'+ _marginLeftMap +'px');
            }
            else {
                if ($(window).height() < 670) {
                    var _windowWidth = 670;
                }
                else {
                    var _windowWidth = $(window).height();
                }
                var offset = $('#content').offset();
                $('#content').css('height', (_windowWidth - 70)+'px');
                _map.css('height', (_windowWidth - 123)+'px');
                _map.css('width', $(window).width()+'px').css('margin-left', '-'+ offset.left +'px');
            }

        }
    }
}

var _GoOnScroll = true;
var _jScrollingBootom = false;
var _jScrollNonBottomInitted = false;

function jsPaneScrollHeight() {
	
	var _issetMaps = $('#all-hotels-map').length > 0 && $('#all-hotels-map').is(':visible');
	var _issetLeftBlock = $('.left-block').length > 0 && $('.left-block').is(':visible');
	if (_issetMaps && ! _issetLeftBlock) {
	
	}
	else {
	
	var _content = $('#content');
	_content.css('height','auto');
	var _windowHeight = $(window).height();
	if (_windowHeight > 670) {
		_windowHeight = ($(window).height() - 132);
	}
	else {
		_windowHeight = (670 - 132);
	}
	var _contentHeight = _content.innerHeight();
	var _scrollPaneHeight = 0;
	$('.scrollBlock').find('.div-filter').each(function(e) {
		_scrollPaneHeight += $(this).innerHeight();
	});
	if (_scrollPaneHeight	> _contentHeight  &&
		_contentHeight		> _windowHeight && 
		_scrollPaneHeight 	> _windowHeight) {
		_content.css('height', _scrollPaneHeight + 'px');
		$('.filter-content').css('position','relative').css('top','auto').css('bottom','auto');
		$('.innerFilter').css('height', _scrollPaneHeight +'px');
		_GoOnScroll = false;
	}
	else if 
		(_scrollPaneHeight	< _contentHeight  && 
		_contentHeight		> _windowHeight && 
		_scrollPaneHeight 	> _windowHeight) {
		//console.log('=== 2 ===');
		_content.css('height', 'auto');
		$('.filter-content').css('position','relative').css('top','auto').css('bottom','auto');
		$('.innerFilter').css('height', _scrollPaneHeight +'px');
		_GoOnScroll = true;
	}
	else if 
		(_scrollPaneHeight	> _contentHeight  && 
		_contentHeight		< _windowHeight && 
		_scrollPaneHeight 	> _windowHeight) {
		//console.log('=== 3 ===');
		_content.css('height', _scrollPaneHeight + 'px');
		$('.filter-content').css('position','relative').css('top','auto').css('bottom','auto');
		$('.innerFilter').css('height', _scrollPaneHeight +'px');
		_GoOnScroll = false;
	}
	else if 
		(_scrollPaneHeight	> _contentHeight  && 
		_contentHeight		> _windowHeight && 
		_scrollPaneHeight 	< _windowHeight) {	
		//console.log('=== 4 ===');	
		_content.css('height', _scrollPaneHeight + 'px');
		$('.filter-content').css('position','relative').css('top','auto').css('bottom','auto');
		$('.innerFilter').css('height', _scrollPaneHeight +'px');
		_GoOnScroll = false;
	}
	else if 
		(_scrollPaneHeight	< _contentHeight  && 
		_contentHeight		< _windowHeight && 
		_scrollPaneHeight 	> _windowHeight) {	
		//console.log('=== 5 ===');
		_content.css('height', (_windowHeight - 70) + 'px');
		$('.filter-content').css('position','relative').css('top','auto').css('bottom','auto');
		$('.innerFilter').css('height', _scrollPaneHeight +'px');
		_GoOnScroll = false;
	}
	else if 
		(_scrollPaneHeight	> _contentHeight  && 
		_contentHeight		< _windowHeight && 
		_scrollPaneHeight 	< _windowHeight) {	
		//console.log('=== 6 ===');	
		_content.css('height', (_windowHeight - 70) + 'px');
		$('.filter-content').css('position','relative').css('top','auto').css('bottom','auto');
		$('.innerFilter').css('height', _scrollPaneHeight +'px');
		_GoOnScroll = false;
	}
	else if 
		(_scrollPaneHeight	< _contentHeight  && 
		_contentHeight		> _windowHeight && 
		_scrollPaneHeight 	< _windowHeight) {	
		//console.log('=== 7 ===');
		_content.css('height', 'auto');
		$('.filter-content').css('position','relative').css('top','auto').css('bottom','auto');
		$('.innerFilter').css('height', _scrollPaneHeight +'px');
		_GoOnScroll = true;
	}
	else if 
		(_scrollPaneHeight	< _contentHeight  && 
		_contentHeight		< _windowHeight && 
		_scrollPaneHeight 	< _windowHeight) {	
		//console.log('=== 8 ===');
		_content.css('height', (_windowHeight - 70) + 'px');
		$('.filter-content').css('position','relative').css('top','auto').css('bottom','auto');
		$('.innerFilter').css('height', _scrollPaneHeight +'px');
		_GoOnScroll = false;	
	}
	else {
		//console.log('=== 9 ===');
		$('.innerFilter').css('height', '100%');
		_GoOnScroll = true;
	}
	//console.log("==== * * * * ====");
	
	}
}

function scrollValue(what, event) {
    if (DetectMobileQuick() || DetectTierTablet()) {
        return;
    }
    else {
        var filterContent = $('.filter-content.'+ what);
        var isScrollPane;
        if(event.target == document)
            isScrollPane = false;
        else
            isScrollPane = $(event.target).is('#scroll-pane');
        if (filterContent.length > 0 && filterContent.is(':visible') && !isScrollPane) {
            var innerFilter = filterContent.find('.innerFilter');
            var var_marginTopSubHead = $('.sub-head').css('margin-top');
            var var_scrollValueTop = $(window).scrollTop();
            var var_heightWindow = $(window).height();
            var var_heightContent = $('#content').height();

            if (what == 'avia') {
                var var_topFilterContent = 73;
                if ($('.sub-head').css('margin-top') != '-67px') {
                    var diffrentScrollTop = 173;
                }
                else {
                    var diffrentScrollTop = 110;
                }
            }
            else {
                var var_topFilterContent = 23;
                if ($('.sub-head').css('margin-top') != '-67px') {
                    var diffrentScrollTop = 125;
                }
                else {
                    var diffrentScrollTop = 61 ;
                }
            }
            if (_GoOnScroll) {
                var needDel = false;
                if (var_scrollValueTop == 0) {
                    //is del
                    needDel = true;
                    filterContent.css('position','relative').css('top','auto').css('bottom','auto');
                }
                else if (var_scrollValueTop > 0 && var_scrollValueTop < diffrentScrollTop ) {
                    needDel = true;
                    filterContent.css('position','relative').css('top','auto').css('bottom','auto');
                }
                else if (var_scrollValueTop > diffrentScrollTop) {
                    if (var_scrollValueTop > (($('.wrapper').height() - var_heightWindow) - 30)) {
                        var var_minHeightBottom;
                        filterContent.css('position','fixed').css('top','-'+var_topFilterContent+'px').css('bottom','auto');
                        if ((var_scrollValueTop - (($('.wrapper').height() - var_heightWindow) - 30)) < 30) {
                            var_minHeightBottom = (var_scrollValueTop - (($('.wrapper').height() - var_heightWindow) - 30));
                        }
                        else {
                            var_minHeightBottom = 30;
                        }
                        innerFilter.css('height', (var_heightWindow - var_minHeightBottom) +'px');
                        if(!$('#scroll-pane').data('jsp')){
                            $('#scroll-pane').jScrollPane({contentWidth: innerFilter.width()});

                        }
                        $('#scroll-pane').jScrollPane({contentWidth: innerFilter.width()});
                        if(!_jScrollingBootom && var_scrollValueTop == ($('.wrapper').height() - $('body').height())){
                            _jScrollingBootom = true;
                            window.setTimeout(function(){
                                    $('#scroll-pane').data('jsp').scrollToBottom();
                                },
                                50
                            );

                            window.setTimeout(
                                function(){
                                    _jScrollingBootom = false;
                                    _jScrollNonBottomInitted = false;
                                    //scrollValue(what, event)
                                }
                                , 500
                            );

                        }
                        //
                    }
                    else {
                        filterContent.css('position','fixed').css('top','-'+var_topFilterContent+'px').css('bottom','auto');
                        innerFilter.css('height', var_heightWindow +'px');
                        if(!$('#scroll-pane').data('jsp')){
                            $('#scroll-pane').jScrollPane({contentWidth: innerFilter.width()});
                        }
                        if(!_jScrollNonBottomInitted){
                            _jScrollNonBottomInitted = true;
                            $('#scroll-pane').jScrollPane({contentWidth: innerFilter.width()});
                            //$('#scroll-pane').data('jsp').scrollToBottom();
                        }
                    }

                }
                if(needDel){
                    if($('#scroll-pane').data('jsp')){
                        $('#scroll-pane').data('jsp').destroy();
                    }
                }
            }
            else {
                var _issetMaps = $('#all-hotels-map').length > 0 && $('#all-hotels-map').is(':visible');
                var _issetLeftBlock = $('.left-block').length > 0 && $('.left-block').is(':visible');
                if (_issetMaps && ! _issetLeftBlock) {

                }
                else {
                    if($('#scroll-pane').data('jsp')){
                        $('#scroll-pane').data('jsp').destroy();
                    }

                }
                return false;
            }
        }
        else {
            return false;
        }
    }
}

function reInitJScrollPane(){
    if($('#scroll-pane').data('jsp')){
        $('#scroll-pane').data('jsp').reinitialise();
    }
}

function minimizeFilter() {
	var _issetMaps = $('#all-hotels-map').length > 0 && $('#all-hotels-map').is(':visible');
	var _issetLeftBlock = $('.left-block').length > 0 && $('.left-block').is(':visible');
	if (_issetMaps && ! _issetLeftBlock) {
		
		$('.innerFilter').find('.div-filter').each(function(index) {
			if (index > 1) {
				$(this).hide();
			}
		});
		$('.innerFilter').css('height', '162px');
		$('.filter-block').css('height','185px');
		if ($('.filter-minimize').length > 0 && $('.filter-minimize').is(':visible')) {
			$('.filter-minimize').removeClass('hide').attr('onclick','filterShow()');
			if($('#scroll-pane').data('jsp')){
				$('#scroll-pane').data('jsp').destroy();
			}
		}
		else {
			$('.filter-content').append('<div class="filter-minimize" onclick="filterShow()"></div>');
		}
		_GoOnScroll = false;
	}
	else {
		return false;
	}
}

function filterShow() {
	$('.filter-block').css('height','100%');
	$('.innerFilter').css('height', ($('.wrapper').height() - 175)+'px');
	$('.innerFilter').find('.div-filter').show();
	_GoOnScroll = false;
	if(!$('#scroll-pane').data('jsp')){
		$('#scroll-pane').jScrollPane({contentWidth: $('.innerFilter').width()});
	}
	$('.filter-minimize').addClass('hide').attr('onclick','minimizeFilter()');
}

function removeFilterShow() {
	$('.filter-minimize').remove();
	$('.filter-block').css('height','100%');
	$('.innerFilter').css('height','100%');
	$('.innerFilter').find('.div-filter').show();
	$(window).load(function(e) {
		scrollValue('hotel', e);
	});
}

function loadPayFly() {
	var _loadPayFly = $('#loadPayFly');
    if (_loadPayFly.length > 0 && _loadPayFly.is(':visible')) {
        var offsetPayBlock = _loadPayFly.offset();
        var _widthLoadPayFly = _loadPayFly.width() - (230 + 60);
        var _loadJet = $('.loadJet');
        var _Jet = _loadJet.find('.jetFly');

        _loadJet.css('margin-left', '-'+offsetPayBlock.left+'px').css('width', (offsetPayBlock.left + _widthLoadPayFly)+'px');
        _loadJet.find('.overflowBlock').css('width', (offsetPayBlock.left + _widthLoadPayFly)+'px');
        _loadJet.find('.pathBlock').clone().prependTo('.loadJet').addClass('blue');
        _loadJet.find('.pathBlock').eq(1).attr('id','grey');

        function startFlyJet() {
            _Jet.animate({'right' : '0%'}, 20000, 'linear', function() {
                $(this).animate({'right' : '-241px'}, 4000, 'linear', function() {
                    $(this).css('right', '100%');
                });
            });
            setTimeout(function() {
                _loadJet.find('#grey').animate({'width' : '0%'}, 20000, 'linear', function() {
                    _loadJet.find('#grey').css('opacity','0').css('width', '100%');
                    setTimeout(function() {
                        _loadJet.find('#grey').animate({'opacity':'1'}, 1000, function() {
                            startFlyJet();
                        });
                    }, 4500);
                });
            }, 500);

        }

        startFlyJet();
    }
}

var clickYes = false;

function closeAllPopup() {
    closePopUpProj();
    closePopUpContact();
}

function openPopUpProj() {
    clickYes = true;
    $('.mainWrapBg').show();
    $('body').css('overflow', 'hidden');
    var _textSlideProj = $('.textSlideProj');
    var _centerImg = $('.mainWrapBg').find('.centerImg');
    var _itemsProj = $('.mainWrapBg').find('.itemsProj');
    var lenSlideProj = _textSlideProj.find('li').length;
    _centerImg.empty();
    _textSlideProj.find('li').each(function(index) {
        _centerImg.append('<img src="'+ $(this).attr('rel') +'">');
    });
    var _imgProjEq0 = _textSlideProj.find('li').eq(0).attr('rel');
    var _textProjEq0 = _textSlideProj.find('li').eq(0).html();
    $('.bgCount').empty().append('<span>1</span>/'+lenSlideProj);
    $('.mainWrapBg').find('.centerImg').find('img').hide().eq(0).show();
    _itemsProj.empty().append(_textProjEq0);
    $('.naviProj').find('.left').addClass('inactive');
    // Проверка на закрытие вне области
    var mouseHover = true;
    $('.projectPopUp').hover(function() {
        mouseHover = false;
    },
        function() {
            mouseHover = true;
        }
    );
    $('.naviProj').hover(function() {
            mouseHover = false;
        },
        function() {
            mouseHover = true;
        }
    );
    $('.mainWrapBg').mouseup(function() {
        if (mouseHover) {
            closeAllPopup();
        }
        else {
            return;
        }
    });
    $(window).on('keydown', function(e){
        if (clickYes) {
            if (e.which == 27) {
                closeAllPopup();
            }
            else if (e.which == 39) {
                ClikRightProj();
            }
            else if (e.which == 37) {
                ClikLeftProj();
            }
            else {
                return true;
            }
        }
    });
    $('.mainWrapBg').find('.centerImg').unbind('click');
    $('.mainWrapBg').find('.centerImg').bind('click', function() {
        ClikRightProj();
    });
}

function closePopUpProj() {
    $('.mainWrapBg').hide();
    $('body').css('overflow', 'auto');
    clickYes = false;
}

function ClikRightProj() {

    var lenSlideProj = $('.textSlideProj').find('li').length;
    var _countSlide = $('.bgCount').find('span').text();
    if (_countSlide >= lenSlideProj) {
        return false;
    }
    else {
        _countSlide++;
        $('.naviProj').find('.left').removeClass('inactive');
        $('.naviProj').find('.right').removeClass('inactive');
    }
    $('.mainWrapBg').find('.centerImg').find('img').hide().eq(_countSlide - 1).show();
    var _textProjEq = $('.textSlideProj').find('li').eq(_countSlide - 1).html();
    $('.mainWrapBg').find('.itemsProj').empty().append(_textProjEq);
    $('.bgCount').find('span').text(_countSlide);
    if (_countSlide == lenSlideProj) {
        $('.naviProj').find('.right').addClass('inactive');
    }
}

function ClikLeftProj() {

    var _countSlide = $('.bgCount').find('span').text();
    if (_countSlide <= 1) {
        return false;
    }
    else {
        _countSlide--;
        $('.naviProj').find('.left').removeClass('inactive');
        $('.naviProj').find('.right').removeClass('inactive');
    }
    $('.mainWrapBg').find('.centerImg').find('img').hide().eq(_countSlide - 1).show();
    var _textProjEq = $('.textSlideProj').find('li').eq(_countSlide - 1).html();
    $('.mainWrapBg').find('.itemsProj').empty().append(_textProjEq);
    $('.bgCount').find('span').text(_countSlide);
    if (_countSlide == 1) {
        $('.naviProj').find('.left').addClass('inactive');
    }
}

function PopUpInfoPath() {
    $(document).on('mousemove', '.tooltip', function(e) {
        var _text = $(this).attr('rel');
        if ($('.PopUpInfoPath').length > 0 && $('.PopUpInfoPath').is(':visible')) {
            $('.PopUpInfoPath').css('left', (e.pageX+8)+'px').css('top', (e.pageY + 5)+'px');
        }
        else {
            $('body').prepend('<div class="PopUpInfoPath">'+ _text +'</div> ');
            $('.PopUpInfoPath').css('left', (e.pageX+8)+'px').css('top', (e.pageY + 5)+'px');
        }
    });
    $(document).on('mouseout', '.tooltip', function() {
        $('.PopUpInfoPath').remove();
    });
    $(document).on('mouseout', '.close', function() {
        $('.PopUpInfoPath').remove();
    });
}

$(window).load(PopUpInfoPath);

function PopUpInfo() {
    var _this = $('.tooltipClose');
    var _onHovePopUp = true;
    $(_this).click(function(e) {
        var _text = $(this).attr('rel');
        if ($('.PopUpInfo').length > 0 && $('.PopUpInfoPath').is(':visible')) {
            $('.PopUpInfo').remove();
            _onHovePopUp = true;
        }
        else {
            $('body').prepend('<div class="PopUpInfo">'+ _text +'<div class="close"></div></div> ');
            var _leftPadding;
            if (e.pageX < $('.PopUpInfo').width()) {
                _leftPadding = 5;
            }
            else {
                _leftPadding = e.pageX - 300;
            }
            $('.PopUpInfo').css('left', _leftPadding +'px').css('top', (e.pageY - 10)+'px');

        }
        $('.PopUpInfo').hover(function() {
            _onHovePopUp = false;
        }, function() {
            _onHovePopUp = true;
        });
        $('body').mouseup(function() {
            if (_onHovePopUp) {
                $('.PopUpInfo').remove();
                _onHovePopUp = true;
            }
            else {
                return false;
            }
        });
        $('.PopUpInfo').find('.close').click(function() {
            $('.PopUpInfo').remove();
            _onHovePopUp = true;
        });
        $(window).on('keydown', function(e){
            if (e.which == 27) {
                $('.PopUpInfo').remove();
                _onHovePopUp = true;
            }
        });
    });
}

$(window).load(PopUpInfo);

function openPopUpContact() {
    clickYes = true;
    $('.contentWrapBg').show();
    $('body').css('overflow', 'hidden');
    // Проверка на закрытие вне области
    var mouseHover = true;
    $('.wrapDiv').hover(function() {
            mouseHover = false;
        },
        function() {
            mouseHover = true;
        }
    );
    $('.contentWrapBg').mouseup(function() {
        if (mouseHover) {
            closeAllPopup();
        }
        else {
            return;
        }
    });
    var scrollTopCount = $('.contentWrapBg').scrollTop();
    var heightWinAll = $(window).height();
    var heightPopAll = $('.contentWrapBg .wrapDiv').innerHeight();
    var offset = $('.contentWrapBg .wrapDiv').offset();
    var scrollMean = (heightPopAll + offset.top) - heightWinAll;
    $(window).on('keydown', function(e){
        if (clickYes) {
            if (e.which == 27) {
                closeAllPopup();
            }
            else if (e.which == 38) {
                scrollTopCount -= 15;
                if (scrollTopCount > -14) {
                    $('.contentWrapBg').scrollTop(scrollTopCount);
                }
                else {
                    scrollTopCount = 0;
                    return;
                }
            }
            else if (e.which == 40) {
                scrollTopCount += 15;
                if ((scrollMean + 15) > scrollTopCount) {
                    $('.contentWrapBg').scrollTop(scrollTopCount);
                }
                else {
                    scrollTopCount = scrollMean;
                    return;
                }
            }
            else {
                return true;
            }
        }
    });
}

function closePopUpContact() {
    $('.contentWrapBg').hide();
    $('body').css('overflow', 'auto');
    clickYes = false;
}

var scrollTrue = true;

function resizeFAQ() {
    var _marginLeftWrapFAQ;
    if ($(window).width() <= 1000) {
        _marginLeftWrapFAQ = 10;
    }
    else if ($(window).width() > 1000) {
        _marginLeftWrapFAQ = ($(window).width() - 977) / 2.615;
    }
    $('.wrapFAQ').css('margin-left', _marginLeftWrapFAQ+'px');

    $('.tableFAQ').each(function(index) {
        $('.listFAQ').find('li').eq(index).attr('rel', $(this).offset().top);
    });
    scrollFAQ();
    $('.listFAQ').find('li').find('a').click(function() {
        scrollTrue = false;
        $('.listFAQ').find('li').removeClass('active');
        $(this).parent().addClass('active');
        setTimeout(function() { scrollTrue = true; }, 650);
    });
}

function scrollFAQ() {
    if ($(window).scrollTop() > 64) {
        $('.listFAQ').css('position', 'fixed').css('top', '4px');
    }
    else {
        $('.listFAQ').css('position','absolute');
    }

    // ScrollMenu
    $('.listFAQ').find('li').each(function(index) {
       if (scrollTrue && ($(window).scrollTop() + 68) >= $(this).attr('rel')) {
           $('.listFAQ').find('li').removeClass('active');
           $(this).addClass('active');
       }
    });
}

$(window).load(resizeFAQ);
$(window).resize(resizeFAQ);
$(window).scroll(scrollFAQ);

function gradientResize() {
    if (DetectMobileQuick() || DetectTierTablet()) {
        return
    }
    else {
        if ($('.wrapper .main-block').find('#content').length > 0 && $('.wrapper .main-block').find('#content').is(':visible')) {
            var _content = $('.wrapper .main-block').find('#content');
            var offset = _content.offset();
            var _leftContent = $(window).width() - offset.left;
            var _rightContent = offset.left + _content.width();
            $('.gShR').show().css('left', (_rightContent - 180) +'px').css('width', ($(window).width() - (_rightContent - 180)) +'px');;
            $('.gShL').show().css('right', (_leftContent - 40) +'px').css('width', (offset.left + 40) +'px');
        }
        else {
            return
        }
    }
}

function openPopUpLogIn(what) {
    var _this = what;

    clickYes = true;
    if ($('.loginWrapBg').length > 0 && $('.loginWrapBg').is(':visible')) {
        $('.loginWrapBg').find('.wrapContent > div:not(.boxClose)').hide();
        $('.loginWrapBg').find('.wrapContent > div.'+_this).show();

    }
    else {
        $('.loginWrapBg').show();
        $('body').css('overflow', 'hidden');
        $('.loginWrapBg').find('.wrapContent > div:not(.boxClose)').hide();
        $('.loginWrapBg').find('.wrapContent > div.'+_this).show();
    }
    // Проверка на закрытие вне области
    var mouseHover = true;
    $('.wrapDiv').hover(function() {
            mouseHover = false;
        },
        function() {
            mouseHover = true;
        }
    );
    $('.loginWrapBg').mouseup(function() {
        if (mouseHover) {
            closePopUpLogIn();
        }
        else {
            return;
        }
    });
    $('div.'+_this).find('input').eq(0).focus();
    var heightWinAll = $(window).height();
    var heightPopAll = $('.contentWrapBg .wrapDiv').innerHeight();
    var offset = $('.contentWrapBg .wrapDiv').offset();
    var scrollMean = (heightPopAll + offset.top) - heightWinAll;
    $(window).on('keydown', function(e){
        if (clickYes) {
            if (e.which == 27) {
                closePopUpLogIn();
            }
        }
    });

    $('.registerOpen').click(function() {
        $('.enter').fadeOut();
        $('.fogoten').fadeOut();
        $('.reapetPass').fadeOut();
        $('.registrate').fadeIn();
    });
    $('.enterOpen').click(function() {
        $('.registrate').fadeOut();
        $('.fogoten').fadeOut();
        $('.reapetPass').fadeOut();
        $('.enter').fadeIn();

    });
    $('.fogotenOpen').click(function() {
        $('.registrate').fadeOut();
        $('.enter').fadeOut();
        $('.reapetPass').fadeOut();
        $('.fogoten').fadeIn();
    });
}

function closePopUpLogIn() {
    $('.loginWrapBg').hide();
    $('body').css('overflow', 'auto');
    clickYes = false;
}

function hoverPayCard() {
    $('.paycard > div').hover(function() {
        $(this).find('.black').animate({'opacity': 0},400);
        $(this).find('.color').animate({'opacity': 1},400);
    }, function() {
        $(this).find('.black').animate({'opacity': 1},300);
        $(this).find('.color').animate({'opacity': 0},300);
    });
}

$(window).load(hoverPayCard);

//functions for private space popups
$(function(){
    $('.btnEnterLogin').on('click', function(){
        $('#login-errors').html('').hide();
        $.ajax({
            url: '/user/validate',
            dataType: 'json',
            data: $('#login-form').serialize(),
            type: 'POST'
        })
            .done(function(response){
                if (response.status != 'ok')
                {
                    $('#login-errors').html('Неверный логин/пароль').show();
                }
                else
                {
                    $('#login-form').submit();
                }
            })
            .error(function(){
                $('#login-errors').html('Ошибка при проверке логина/пароля.').show()
            });
        return false;
    });
});

$(function(){
    $('.btnFogLogin').on('click', function(){
        $('#forget-errors').html('').hide();
        $.ajax({
            url: '/user/validateForgetPassword',
            dataType: 'json',
            data: $('#forget-pwd-form').serialize(),
            type: 'POST'
        })
            .done(function(response){
                if (response.status != 'ok')
                {
                    $('#forget-errors').html(response.errors).show();
                }
                else
                {
                    $.ajax({
                        url: '/user/newPassword',
                        data: $('#forget-pwd-form').serialize(),
                        type: 'POST'
                    })
                        .done(function(){
                            $('#forget-pwd-form')
                                .html('Запрос на восстановление пароля выслан на указанный e-mail');
                        })
                        .error(function(){
                            $('#forget-errors').html('Ошибка при восстановлении пароля.').show()
                        });
                }
            })
            .error(function(){
                $('#forget-errors').html('Ошибка при восстановлении пароля.').show()
            });
        return false;
    });
})

$(function(){
    $('.btnRegLogin').on('click', function(){
        $('#signup-errors').html('').hide();
        $.ajax({
            url: '/user/signup',
            dataType: 'json',
            data: $('#signup-form').serialize(),
            type: 'POST'
        })
            .done(function(response){
                if (response.status != 'ok')
                {
                    $('#signup-errors').html(response.error).show();
                }
                else
                {
                    $('#signup-form')
                        .html('Вы зарегистрированы на сайте и можете авторизоваться используя ваш логин и пароль');
                }
            })
            .error(function(){
                $('#signup-errors').html('Ошибка при регистрации.').show()
            });
        return false;
    });
})

$(function(){
    $('.btnNewPwd').on('click', function(){
        $('#new-pwd-errors').html('').hide();
        $.ajax({
            url: '/user/newPassword/key/' + window.pwdKey,
            dataType: 'json',
            data: $('#new-pwd-form').serialize(),
            type: 'POST'
        })
            .done(function(response){
                if (response.status != 'ok')
                {
                    $('#new-pwd-errors').html(response.errors).show();
                }
                else
                {
                    $('#new-pwd-form')
                        .html('Новый пароль установлен');
                }
            })
            .error(function(){
                $('#new-pwd-form').html('Ошибка во время установки пароля').show()
            });
        return false;
    });
});

function resizePanel(arg) {

        $('.panelTable').each(function(index){
            var _panelTable = $(this);
            var _classThis;
            var _midWidth = 1130;
            var _minWidth = 1000;
            var _newMean;

            var _allWidthPanel;
            _panelTable.find('.tdCity').find('.data').css('width', 'auto');

            if (_panelTable.hasClass('avia')) {
                _classThis = 'avia';
                var _meanPanel = 850;
                var _standartData = 290;
                var _widthTdTumblr = _panelTable.find('.tdTumblr').innerWidth();
                var _widthTdPeople = _panelTable.find('.tdPeople').innerWidth();
                var _widthTdButton = _panelTable.find('.tdButton').innerWidth();
                var _widthTdCityStart = _panelTable.find('.tdCityStart').innerWidth();;
                var _widthTdAddTour = 0;
                var _howManyInput = 2;
            }  else if (_panelTable.hasClass('constructorTable')) {
                _classThis = 'constructorTable';
                if ($(this).find('.tdPeople').hasClass('notFinal')) {
                    $(this).find('.tdPeople.notFinal').css('width', $('.tdPeople.final').width()+'px');
                }
                else if ($(this).find('.tdPeople').hasClass('final')) {
                    //$(this).find('.tdPeople.final').css('width', 'auto');
                }
                var _meanPanel = 692;
                var _widthTdTumblr = 0;
                var _widthTdPeople = _panelTable.find('.tdPeople').innerWidth();
                var _widthTdButton = _panelTable.find('.tdButton').innerWidth();
                var _widthTdCityStart = _panelTable.find('.tdCityStart').innerWidth();
                var _widthTdAddTour = _panelTable.find('.tdAddTour').innerWidth();
                var _howManyInput = 1;
            }  else if (_panelTable.hasClass('hotel')) {
                _classThis = 'hotel';
                var _meanPanel = 692;
                var _widthTdTumblr = 0;
                var _widthTdPeople = _panelTable.find('.tdPeople').innerWidth();
                var _widthTdButton = _panelTable.find('.tdButton').innerWidth();
                var _widthTdCityStart = _panelTable.find('.tdCityStart').innerWidth();
                var _widthTdAddTour = 117;
                var _howManyInput = 1;
            }

            var _windowWidth = $(window).width();
            var _widthPanelTable = _panelTable.innerWidth();

            var _dataDiv = _panelTable.find('.tdCity').find('.data');
            var _dataInput = _panelTable.find('.tdCity').find('.data').find('input');

            if (_windowWidth <= _midWidth && _windowWidth >= _minWidth) {
                _allWidthPanel = _windowWidth - 230;
            }
            else if (_windowWidth < _minWidth) {
                _allWidthPanel = 1000 - 230;
            }
            else {
                _allWidthPanel = 900;
            }
            if (_widthPanelTable >= _allWidthPanel) {
                _newMean = (_allWidthPanel - _widthTdTumblr - _widthTdPeople - _widthTdButton - _widthTdCityStart - _widthTdAddTour) / _howManyInput;
            }
            else if (_widthPanelTable < _allWidthPanel) {
                _newMean = (_allWidthPanel - _widthTdTumblr - _widthTdPeople - _widthTdButton - _widthTdCityStart - _widthTdAddTour) / _howManyInput;
            }
            else {
                _newMean = (_widthPanelTable - _widthTdTumblr - _widthTdPeople - _widthTdButton - _widthTdCityStart - _widthTdAddTour) / _howManyInput;
            }

            _panelTable.find('.tdCity').find('.data').css('width', _newMean +'px');
            _panelTable.find('.tdCity').find('.data').find('input').css('width', (_newMean-20) +'px');
            _widthPanelTable = _panelTable.innerWidth();
        });
}

function startIE() {
    if($.browser.msie)
    {
        $(document).on('click', '.data', function() {
            $(this).find('.second-path').focus();
        });
    }
}

function ifIpadLoad() {
    if (DetectMobileQuick() || DetectTierTablet()) {
        if($('body').hasClass('fixed')) {
            $('body').css('width','100%');
        }
        else {
            $('body').css('width','111%');
        }
        if ($('.maps').length > 0 && $('.maps').is(':visible')) {
            if ($('.maps').find('.layers').length < 1) {
                $('.maps').append('<div class="layers" style="position: absolute; width: 100%; height: 100%; z-index: 500; top:0px; left: 0px;"></div>');
            }
            else { return }
        }
    }
}


function slideToursPanel() {
    if ($('.board').length > 0 && $('.board').is(':visible')) {
        var _topHeight = $('.board').offset().top;
        if (_topHeight < 40) {
            $('body').css('position','relative').css('height', ($('.board').height() + 404)+'px');
        }
        $(window).resize(function() {
            if ($(window).height() > $('body').height()) {
               $('body').css('position','fixed').css('height', '100%');
               //CenterIMGResize();
            }
        });
    }
}
