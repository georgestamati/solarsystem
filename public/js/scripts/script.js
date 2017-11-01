$(window).on('load',function() {
	var universe = $('#universe'),
		loader = $('.loader'),
		loaderButton = $('.loader__button'),
		cssHidden = {'opacity': 0, 'visibility': 'hidden'},
		cssVisible = {'opacity': 1, 'visibility': 'visible'};

	loader.removeClass('hidden');

	if( sessionStorage.getItem('loader') == null ) { // It doesn't exist any session
		loader.addClass('loader__new-session');
		universe.addClass('universe__new-session');
		sessionStorage.setItem('loader', 'true');
		loaderButton.removeClass('hidden');
		loaderButton.on('click', showPage);
	}
	else{ // It does exist a session
		loader.addClass('loader__same-session');
		universe.addClass('universe__same-session');
	}
	
	function showPage() {
		loader.removeClass('loader__new-session').addClass('loader__new-session--clicked');
		universe.addClass('universe__new-session--clicked');
	}
});

$(document).ready(function(){

	var $body = $('body'),
		bodyWidth = $body.width(),
		bodyHeight = $body.height(),
		universe = $('#universe'),
		container = $('[class^="galaxy-"]'),
		firefoxUserAgent = (/Firefox/i.test(navigator.userAgent));

	// Zoom effect
	var zoomEvent = firefoxUserAgent ? "DOMMouseScroll" : "mousewheel", //FF doesn't recognize mousewheel as of FF3.x
		incr = 1;
	
	if (document.attachEvent) //if IE (and Opera depending on user setting)
		document.attachEvent("on" + zoomEvent, zoomGalaxy)
	else if (document.addEventListener) //WC3 browsers
		document.addEventListener(zoomEvent, zoomGalaxy, false)

	// Parallax effect
	universe.on('mousemove', function(e) {
		// parallaxIt(e, '#galaxy', -1000);
	});


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
	function parallaxIt(e, target, movement){
		var relX = e.pageX - universe.offset().left,
			relY = e.pageY - universe.offset().top;

		TweenMax.to(target, 1, {
			x: (relX - universe.width()/2) / universe.width() * movement,
			y: (relY - universe.height()/2) / universe.height() * movement
		})
	}


	var stars = ['Sun', 'Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune'],
		ua = navigator.userAgent,
		socket = io.connect();

	// $('#galaxy').addClass('galaxy-view--3D');



	// NASA API images
	var api_key = '98oJMJodoPGnat7vL3xwzjDmN110U4jCwiKVzSJM',
		query = 'galaxy',
		media_type = 'image',
		nasa_url = 'https://images-api.nasa.gov/search?q='+query+'&media_type='+media_type;
	
	$.ajax({
		url: nasa_url,
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

	//Flickr API images
	function showFlickrImages(word, no){
		var flickr_url = "https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=6a970fbb976a06193676f88ef2722cc8&text="+ word +"&privacy_filter=1&safe_search=1&per_page="+ no +"&format=json&nojsoncallback=1&content_type=1&media=photos";
		
		$.ajax({
			url: flickr_url,
			success: function(res){
				$.each(res.photos.photo, function(i, item){
					$('<img src="https://farm'+item.farm+'.staticflickr.com/'+item.server+'/'+item.id+'_'+item.secret+'_n.jpg" />').appendTo('.info-gallery');  
				})
			}
		});
	}
	// showFlickrImages('jupiter planet', 10);

	
	if (annyang) {
		var commands = {
			'back (to) (main) (first) (page)': function(){
            	window.location = '/';
            },
            '(show) (me) (details) (about) (the) :word': function(word) {
				$.each(stars, function(index, element){
					if(word.toLowerCase() == element.toLowerCase()){
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
				var api_key = '98oJMJodoPGnat7vL3xwzjDmN110U4jCwiKVzSJM',
					media_type = 'image',
					nasa_url = 'https://images-api.nasa.gov/search?q='+search+'&title='+search+'&media_type='+media_type+'&year_start=1900';
				
				$.ajax({
					url: nasa_url,
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
})



  
