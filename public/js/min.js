$(document).ready(function(){setTimeout(function(){$(".loader").css({opacity:0,visibility:"hidden",transition:"all 2s ease"})},6e3);var n=["Sun","Mercury","Venus","Earth","Mars","Jupiter","Saturn","Uranus","Neptune"];if(annyang){var o={"back (to) (main) (first) (page)":function(){window.location="/"},"(show) (me) (details) (about) (the) :word":function(o){$.each(n,function(n,a){o.toLowerCase()==a.toLowerCase()&&(console.log(o,n,a),window.location=o.toLowerCase())})}};annyang.addCommands(o),annyang.start({autoRestart:!0})}else console.log("Speech Recognition is not supported")});