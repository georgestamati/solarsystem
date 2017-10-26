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
	// $('body').mousemove(function(e){
	//   	parallaxFunc(e, '#galaxy', -150);
	// });

	// function parallaxFunc(e, target, movement){
	//   var $this = $('body');
	//   var relX = e.pageX - $this.offset().left;
	//   var relY = e.pageY - $this.offset().top;
	  
	//   TweenMax.to(target, 1, {
	//     x: (relX - $this.width()/2) / $this.width() * movement,
	//     y: (relY - $this.height()/2) / $this.height() * movement
	//   })
	// }

	// $('body').parallax();

	var stars = ['Sun', 'Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune'];
	var ua = navigator.userAgent;
	var socket = io.connect();

	// $('#galaxy').addClass('galaxy-view--3D');
	
	console.log(socket);
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
							console.log(word, index, element);
							window.location = word.toLowerCase();
						}
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



  
