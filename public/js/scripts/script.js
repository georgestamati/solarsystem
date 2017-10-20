$(window).on('load',function() {
	var universe = $('#universe'),
		loader = $('.loader'),
		loaderButton = $('.loader__button'),
		cssHidden = {'opacity': 0, 'visibility': 'hidden'},
		cssVisible = {'opacity': 1, 'visibility': 'visible'};

	if( sessionStorage.getItem('loader') == null ) { // It doesn't exist any session
		sessionStorage.setItem('loader', 'true');
		loaderButton.removeClass('hidden').addClass('visible');
		loaderButton.on('click', showPage);
		// Add class if storage is null for showing the button
	}
	else{ // It does exist a session
		loader.addClass('loader__new-session');
	}
	
	function showPage() {
		loader.css({
			// 'opacity': 0, 
			// 'visibility': 'hidden', 
			'transform': 'scale(0,0)'});
		universe.css({
			// 'opacity': 1, 
			// 'visibility': 'visible', 
			'transform': 'scale(1,1)'});
	}
});

$(document).ready(function(){

	var stars = ['Sun', 'Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune'];

	// $('#galaxy').addClass('galaxy-view--3D');

	if (annyang) {
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
