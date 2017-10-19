$(document).ready(function(){

	var universe = $('#universe');
	var loader = $('.loader');

	if(sessionStorage.getItem('loader')){
		universe.addClass('hidden')
		setTimeout(function(){
			universe.css({
				'opacity': 1,
				'visibility': 'visible',
				'transition': 'all 1s ease'
			});
		}, 3000)

		setTimeout(function(){
			loader.css({
				'opacity': 0,
				'visibility': 'hidden',
				'transition': 'all 1s ease'
			});
		}, 3000)

		loader.find('.loader__button').addClass('hidden');
	}
	else{
		if( sessionStorage.getItem('loader') == null ) { 
			loader.show();
			sessionStorage.setItem('loader', 'true');

			loader.find('.loader__button').on('click', loaderAnimation)
		}
		else{
			loader.hide();
			loaderAnimation();
		}		
	}




	var stars = ['Sun', 'Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune'];

	// $('#galaxy').addClass('galaxy-view--3D');

	if (annyang) {
	  	// Let's define our first command. First the text we expect, and then the function it should call
		var commands = {
			'back (to) (main) (first) (page)': function(){
            	window.location = '/';
            },
            '(show) (me) (details) (about) (the) :word': function(word) {
				$.each(stars, function(index, element){
					if(word.toLowerCase() == element.toLowerCase()){
						console.log(word, index, element);
						window.location = word.toLowerCase();
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
	
	function loaderAnimation(){
		loader.css({
			'margin-top': '-1000px',
			'transition': 'all 1.5s ease-in'
		}).addClass('hidden');
		$('#galaxy, .menu').css({
			'margin-top': 0,
			'transition': 'all 1.5s ease-in'
		});
	}
})
