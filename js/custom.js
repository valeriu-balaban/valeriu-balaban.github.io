$(document).ready(function(){

	body = $("body");

	/*
	 * Append dynamic content to the skill list and portfolio
	*/ 

	$(".skill-list-2").append('<div class="label-beginner">Beginner</div><div class="label-inter">Intermediate</div><div class="label-adv">Advanced</div><div class="label-guru">Guru</div><div class="line-beginner"></div><div class="line-inter"></div><div class="line-adv"></div><div class="line-guru"></div>');

	$(".portfolio__grid__item__img").append('<div class="portfolio__grid__item__mask"></div>');
	$(".portfolio__detail").append('<div class="portfolio__detail__close"><span class="icon-cross"></span></div>');

    /* ================== Navigation ================== */

	$(".navigation-icon").click(function(){
		if ( body.hasClass("nav-active") ) {
			body.removeClass("nav-active");
			setTimeout(function(){
				$(".navigation-icon").css({"position":"fixed", "top":"0", "margin":"0.35em 0.6em"});
			},500);
		} else {
			$(this).css({"position":"absolute", "top":"100%", "margin":"0 0.6em"});
			body.addClass("nav-active");
		}
	});

	setTimeout(function(){
		$(".navigation-icon").addClass("animated fadeInRight");
	},1000);

	$('a:not(.more-link)[href*="#"]').bind("click", function(event) {
		event.preventDefault();
		var target = $(this).attr("href");
		var targetPos = $('[id='+target.replace(/#/g, "")+']').offset().top;

		$('html,body').animate({
			scrollTop: targetPos
		}, 1600, 'swing', function (){
			if(history.pushState) {
			    history.pushState(null, null, target);
			}
			else {
			    location.hash = target;
			}
		});
	});	

	/* ================== Portfolio ================== */

	/**
	 * Scroll effect 
	*/ 

	posPortfolio = $(".page__portfolio").offset();
	portfolioDetail = $(".portfolio__detail");

	scrollEffect();

	function scrollEffect() {
		posViewport = $(window).scrollTop();

		if ( posViewport > posPortfolio.top-300 && $(window).width() > 1000 ) {
			body.addClass("wide-view");
		} else if (posViewport < posPortfolio.top) {
			body.removeClass("wide-view");
		}
	}

	$(document).scroll(function(){
		scrollEffect();
	});

	/*
	 * Detail mode for the portfolio
	*/ 

	$(".portfolio__grid__item__desc__link").click(function(event) {
		event.preventDefault();

		if( body.hasClass("portfolio__detail-active") ) {
			body.removeClass("portfolio__detail-active");
		} else {
			// Apply Desc to DOM
			var activeItem = $(this).parent().parent(".portfolio__grid__item__img");
			var activeItemImg = activeItem.children("img").attr("src");
			activeItem.find(".portfolio__detail__desc img:eq(0)").attr("src", activeItemImg);
			var activeItemDesc = activeItem.children(".portfolio__detail__container").html();

			$(".portfolio__detail .portfolio__detail__desc").remove();
			portfolioDetail.append(activeItemDesc);

			body.addClass("portfolio__detail-active");

			$(".portfolio__detail__desc").show();
		}
	});

	$(".portfolio__detail__close").click(function(){
		body.removeClass("portfolio__detail-active");
		setTimeout(function(){
			$(".portfolio__detail__desc").slideUp(500);
		},800);
	});

	/* ================== Google Maps ================== */

	var styleMinimalGrey={"Minimal Grey":[{featureType:"poi",elementType:"all",stylers:[{hue:"#000000"},{saturation:-100},{lightness:-100},{visibility:"off"}]},{featureType:"administrative",elementType:"all",stylers:[{hue:"#000000"},{saturation:0},{lightness:-100},{visibility:"off"}]},{featureType:"water",elementType:"labels",stylers:[{hue:"#000000"},{saturation:-100},{lightness:-100},{visibility:"on"}]},{featureType:"water",elementType:"labels.text.stroke",stylers:[{hue:"#000000"},{visibility:"off"}]},{featureType:"road.local",elementType:"all",stylers:[{hue:"#ffffff"},{saturation:-100},{lightness:100},{visibility:"on"}]},{featureType:"water",elementType:"geometry",stylers:[{hue:"#fafafa"},{saturation:-100},{lightness:100},{visibility:"on"}]},{featureType:"transit",elementType:"labels",stylers:[{hue:"#000000"},{saturation:0},{lightness:-100},{visibility:"off"}]},{featureType:"transit",elementType:"geometry",stylers:[{visibility:"off"}]},{featureType:"landscape",elementType:"labels",stylers:[{hue:"#000000"},{saturation:-100},{lightness:-100},{visibility:"off"}]},{featureType:"road",elementType:"geometry",stylers:[{hue:"#bbbbbb"},{saturation:-100},{lightness:26},{visibility:"on"}]},{featureType:"landscape",elementType:"geometry",stylers:[{hue:"#dddddd"},{saturation:-100},{lightness:-3},{visibility:"on"}]}]};

	var map = new Maplace({
		locations: [{lat: mapLatitude,lon: mapLongitude}],
		map_div: '#google-maps',
		controls_on_map: true,
		generate_controls: false,
		show_infowindow: false,
		map_options: {
			scrollwheel: false,
			zoom: mapZoom
		},
		styles: styleMinimalGrey
	}).Load();

	/* ================== Contact Form ================== */

	/**
	 * Variables for the contact form
	 */

	form = $("#form");
	contactName = $(".form__name");
	contactEmail = $(".form__email");
	contactMessage = $(".form__message");

	validationCont = $(".form__invalid");
	notification = $(".form__notification");

	/**
	 * Trigger function on form submit
	 */

	form.on("submit", function(event){
		event.preventDefault();

		// If any fiedl unvalid
		if ( contactName.val() == "" || contactEmail.val() == "" || validateEmail(contactEmail.val()) != true || contactMessage.val() == "" ) {
			// Show validation message
			validationCont.empty().append( validationText ).slideDown(600, function(){
				$(this).fadeTo(400,1);
			});
		}

		contactName.add(contactEmail).add(contactMessage).keypress(function(){
			formValidation();
		});

		// Check if any field is empty
		if ( formValidation() ) {
			// Hide container
			if ( $(validationCont).is(":visible") ) {
				$(validationCont).fadeTo(250,0, function(){
					$(this).slideUp(600);
				});
			}	
		
			// Create data object
			var formData = {
				name: contactName.val(),
				email: contactEmail.val(),
				message: contactMessage.val()
			};

			// Do ajax request
			ajaxRequest( formData );
		}	
	});

	/**
	 * Validation Function
	 * 
	 * Returns true if all fields != empty and email is valid
	*/

	function formValidation() {
		// Check for empty fields
		if ( contactName.val() == "" || contactEmail.val() == "" || validateEmail(contactEmail.val()) != true || contactMessage.val() == "" ) {
			// Check for ever field if empty -> apply border
			if ( contactName.val() == "" ) { contactName.addClass("form__invalid__border"); } else { contactName.removeClass("form__invalid__border"); }
			if ( contactEmail.val() == "" ) { contactEmail.addClass("form__invalid__border"); } else { 
				if ( validateEmail(contactEmail.val()) ) {
					contactEmail.removeClass("form__invalid__border"); 
				}
			}
			if ( contactMessage.val() == "" ) { contactMessage.addClass("form__invalid__border"); } else { contactMessage.removeClass("form__invalid__border"); } 
		} 
		// If fields aren't empty and email valid
		else {
			// Remove all validation borders
			contactName.add(contactEmail).add(contactMessage).removeClass("form__invalid__border");
		
			return true;
		}
	}

	/**
	 * Ajax Function
	 * 
	 * Function takes the data and does an ajax request
	*/

	function ajaxRequest(data) {

		$.ajax({
			type: 'POST',
			url: 'inc/contact_form.php',
			data: data,
			error: function(){
				notification.addClass("error").append("Unable to sent the email! Until this is fixed please try to contact my via my social media profiles!").slideDown(300);
			},
			success: function(){
				notification.addClass("success").append(sendSuccessText).slideDown(500, function(){
					notification.fadeTo(400,1);
				});
				setTimeout(function(){
					notification.fadeTo(400, 0, function(){
						notification.slideUp(600, function(){
							contactName.val("");
							contactEmail.val("");
							contactMessage.val("");
							notification.empty();
						});
					})
				},2500);
			}
		});
	}

	/**
	 * Email Validation
	 * 
	 * Returns true if provided email is valid
	*/

	function validateEmail(elementValue){        
		var pattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;  
		return pattern.test(elementValue);   
	}  
});