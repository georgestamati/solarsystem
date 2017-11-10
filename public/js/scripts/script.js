$(window).on('load',function() {
	var universe = $('#universe'),
		loader = $('.loader'),
        loaderWrapper = $('.loader__wrapper'),
		loaderButton = $('.loader__local-button'),
        loaderRedirect = $('.loader__redirect'),
        loaderControlButton = $('.loader__control-button'),
		loaderText = '',
		mobileTest = /mobile/i.test(navigator.userAgent);

	if(mobileTest){
        $('<input class="loader__text" type="text" placeholder=".  .  .  ." maxlength="4" />').insertBefore(loaderButton);
        loaderButton.parent().addClass('row-flex');
    }

    if($('.loader__text').length){
        loaderText = $('.loader__text');
        setTimeout(function(){
        	loaderText.width(loaderButton.width());
        }, 0);
    }

	loader.removeClass('hidden');

	// sessionStorage will be changed to localStorage
    if (sessionStorage.getItem('loader') === null) { // It doesn't exist any session
        sessionStorage.setItem('loader', 'true');

        loader.addClass('loader__new-session');
        loaderWrapper.children().not('.loader__planet').removeClass('hidden');
        universe.addClass('universe__new-session');

        loaderControlButton.on('click', chooseControl);
		loaderButton.on('click', showPage);

		socket.on('key', function (data) {
			$('.loader__remote-button').val(data.code);
		});

    } else { // It does exist a session
        loader.addClass('loader__same-session');
        universe.addClass('universe__same-session');
        loaderWrapper.children().not('.loader__planet').addClass('hidden');
    }

	function showPage() {
        if(mobileTest){
            // If there is a key, send it to the server-side
            // through the socket.io channel with a 'load' event.
            socket.emit('load', {
               key: $('.loader__text').val()
            });

			socket.on('access', function (data) {
				// Check if we have "granted" access.
				// If we do, we can continue with the presentation.
				if (data.access === "granted" && data.access !== "") {
					loader.removeClass('loader__new-session').addClass('loader__new-session--clicked');
					universe.addClass('universe__new-session--clicked');
				}
				else {
					// Wrong secret key
					// clearTimeout(animationTimeout);
					loaderText.addClass('loader__text--error loader__text--animation');

					$('.loader__text').on('focus', function () {
						loaderText.removeClass('loader__text--error');
					});

					var animationTimeout = setTimeout(function(){
						loaderText.removeClass('loader__text--animation');
					}, 1000);
				}
			});
		}
		else{
            loader.removeClass('loader__new-session').addClass('loader__new-session--clicked');
            universe.addClass('universe__new-session--clicked');
		}
	}

	function chooseControl(){
    	var $this = $(this),
			attr = $this.data('attr');

        loaderRedirect.addClass('hidden');
    	$('.'+attr).removeClass('hidden');
	}
});

$(document).ready(function(){

	var universe = $('#universe'),
		container = $('[class^="galaxy-"]'),
		mobileTest = /mobile/i.test(navigator.userAgent),
		firefoxTest = (/Firefox/i.test(navigator.userAgent)),
		stars = ['Sun', 'Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune'];


    // Zoom effect
    var zoomEvent = firefoxTest ? "DOMMouseScroll" : "mousewheel",
    	incr = 1;

	if (document.attachEvent){ //if IE (and Opera depending on user setting)
		document.attachEvent("on" + zoomEvent, zoomGalaxy);
	}
	else {
		if (document.addEventListener){ //WC3 browsers
			document.addEventListener(zoomEvent, zoomGalaxy, false);
		}
	}

	function zoomGalaxy(e){
		var ev = window.event || e, //equalize event object
			delta = ev.detail ? ev.detail : ev.wheelDelta; //check for detail first so Opera uses that instead of wheelDelta
		delta = delta / 120;
		delta = firefoxTest ? delta / 3 : delta;
		incr += delta / 5;
		if(incr > 0){
			container.css({'transform': 'rotateX(70deg) scale3d(' + incr + ',' + incr + ',' + incr + ')'});
		}
		else{
			incr = 0;
		}
	}

	// Parallax effect
	universe.on('mousemove', function(e) {
		parallaxIt(e, '#galaxy .planet-wrapper .planet', -20);
        // parallaxIt(e, '#galaxy .moons-wrapper', -100);
        $('.moons-wrapper .moon').each(function(i, item){
        	parallaxIt(e, item, -50-(i*50))
		})
    });

	function parallaxIt(e, target, movement){
		var relX = e.pageX - universe.offset().left,
			relY = e.pageY - universe.offset().top;

		TweenMax.to(target, 1, {
			x: (relX - universe.width()/2) / universe.width() * movement,
			y: (relY - universe.height()/2) / universe.height() * movement
		})
	}

	// NASA API images
	function showNasaImages(query, media_type){
		var url = 'https://images-api.nasa.gov/search?q='+query+'&media_type='+media_type;

		$.ajax({
			url: url,
			success: function(results){
				$.each(results.collection.items, function(i, item){
					if(i >= 10){
						return false;
					}
					$('<img src="'+item.links[0].href+'"/>').appendTo('.info-gallery')
				})
			},
			error: function(){
				console.log('error')
			}
		})
	}
	// showNasaImages('galaxy', 'image');

	if (annyang) {
		var commands = {
			'back (to) (main) (first) (page)': function(){
            	window.location = '/';
            },
            '(show) (me) (details) (about) (the) :word': function(word) {
				$.each(stars, function(index, element){
					if(word.toLowerCase() === element.toLowerCase()){
						if(mobileTest){

						}
						else{
							// console.log(word, index, element);
							window.location = word.toLowerCase();
						}
					}
				})
            },
            'image about *search': function(search){
				var url = 'https://images-api.nasa.gov/search?q='+search+'&title='+search+'&media_type=image&year_start=1900';

				$.ajax({
					url: url,
					success: function(results){
						$.each(results.collection.items, function(i, item){
							if(i >= 10){
								return false;
							}
							$('<img />').attr('src', item.links[0].href).appendTo('.info-gallery')
						})
					},
					error: function(){
						console.log('error')
					}
				})
			}
        };


		// Add our commands to annyang
		annyang.addCommands(commands);

		// annyang.addCallback('soundstart', function() {
		//   console.log('sound detected');
		// });

		// annyang.addCallback('result', function() {
		//   console.log('sound stopped');
		// });

		// Start listening. You can call this here, or attach this call to an event, button, etc.
		annyang.start({
			autoRestart: true
		});
	}
	else {
		console.log('Speech Recognition is not supported');
	}
});
