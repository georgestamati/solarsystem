$(window).on('load',function() {
	var universe = $('#universe'),
		loader = $('.loader'),
		loaderButton = $('.loader__button');

	loader.removeClass('hidden');

    if (sessionStorage.getItem('loader') === null) { // It doesn't exist any session
        sessionStorage.setItem('loader', 'true');

        loader.addClass('loader__new-session');
        loaderButton.removeClass('hidden');
        universe.addClass('universe__new-session');

        loaderButton.on('click', showPage);
    } else { // It does exist a session
        loader.addClass('loader__same-session');
        universe.addClass('universe__same-session');
    }
	
	function showPage() {
		loader.removeClass('loader__new-session').addClass('loader__new-session--clicked');
		universe.addClass('universe__new-session--clicked');
	}
});

$(document).ready(function(){

	var universe = $('#universe'),
		container = $('[class^="galaxy-"]'),
		firefoxUserAgent = (/Firefox/i.test(navigator.userAgent));

    // Zoom effect
    var zoomEvent = firefoxUserAgent ? "DOMMouseScroll" : "mousewheel",
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
		delta = firefoxUserAgent ? delta / 3 : delta;
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
		// parallaxIt(e, '#galaxy', -1000);
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
					$('<img />').attr('src', item.links[0].href).appendTo('.info-gallery')
				})
			},
			error: function(){
				console.log('error')
			}
		})
	}
	showNasaImages('galaxy', 'image');


	var stars = ['Sun', 'Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune'],
		ua = navigator.userAgent;

	if (annyang) {
		var commands = {
			'back (to) (main) (first) (page)': function(){
            	window.location = '/';
            },
            '(show) (me) (details) (about) (the) :word': function(word) {
				$.each(stars, function(index, element){
					if(word.toLowerCase() === element.toLowerCase()){
						if(/mobile/i.test(ua)){

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
