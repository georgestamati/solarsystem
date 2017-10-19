// $(window).on('load',function(){

// 	var universe = $('#universe');
// 	var loader = $('.loader');
// 	var loaderButton = $('<input type="button" class="loader__button" value="Go to app" />')

// 	if( sessionStorage.getItem('loader') == null ) { // It doesn't exist any session
// 		// loader.show();
// 		sessionStorage.setItem('loader', 'true');

// 		loader.append(loaderbutton);

// 		loader.find('input').on('click', showPage);

// 		console.log('not exist')
// 	}
// 	else{ // It does exist a session
// 		setTimeout(showPage, 3000);
// 		// loader.find('input').hide();

// 		console.log('exist')
// 	}

// 	function showPage() {
// 		loader.css({
// 			'opacity': 0,
// 			'visibility': 'hidden'
// 		})
// 		universe.css({
// 			'opacity': 1,
// 			'visibility': 'visible'
// 		})
// 	}
// });

$(document).ready(function(){

	var loader = $('.loader');
	var loaderButton = $('.loader__button');

	if( sessionStorage.getItem('loader') == null ) { // It doesn't exist any session
		// loader.show();
		sessionStorage.setItem('loader', 'true');

		loaderButton.on('click', showPage);
	}
	else{ // It does exist a session
		setTimeout(showPage, 3000);
		loader.find('.loader__button').hide();
	}

	function showPage() {
		$('.loader').css({
			'opacity': 0,
			'visibility': 'hidden'
		})
		$('#universe').css({
			'opacity': 1,
			'visibility': 'visible'
		})
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
})
