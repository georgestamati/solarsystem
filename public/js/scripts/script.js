// $(window).load(function() {
// 	console.log('loaded')
//     $(".loader").hide();
// })

$(document).ready(function(){
	// var body = $('body');
	// var removeLoading = function() {
	// 	setTimeout(function() {
	// 		body.removeClass('loading');
	// 	}, 3000);
	// };
	// removeLoading();

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
		console.log("Speech Recognition is not supported");
	}
})