$(window).on("load",function(){var e=$("#universe"),n=$(".loader"),s=$(".loader__button");n.removeClass("hidden"),null==sessionStorage.getItem("loader")?(n.addClass("loader__new-session"),e.addClass("universe__new-session"),sessionStorage.setItem("loader","true"),s.removeClass("hidden"),s.on("click",function(){n.removeClass("loader__new-session").addClass("loader__new-session--clicked"),e.addClass("universe__new-session--clicked")})):(n.addClass("loader__same-session"),e.addClass("universe__same-session"))}),$(document).ready(function(){function e(e){var n=window.event||e,s=n.detail?n.detail:n.wheelDelta;s/=120,(i+=(s=a?s/3:s)/5)>0?o.css({transform:"rotateX(70deg) scale3d("+i+","+i+","+i+")"}):i=0}var n=$("body"),s=(n.width(),n.height(),$("#universe")),o=$('[class^="galaxy-"]'),a=/Firefox/i.test(navigator.userAgent);console.log(o.css("transform"));var t=a?"DOMMouseScroll":"mousewheel",i=1;document.attachEvent?document.attachEvent("on"+t,e):document.addEventListener&&document.addEventListener(t,e,!1),s.on("mousemove",function(e){});var r=["Sun","Mercury","Venus","Earth","Mars","Jupiter","Saturn","Uranus","Neptune"],d=navigator.userAgent;io.connect();if(annyang){var l={"back (to) (main) (first) (page)":function(){window.location="/"},"(show) (me) (details) (about) (the) :word":function(e){$.each(r,function(n,s){e.toLowerCase()==s.toLowerCase()&&(/mobile/i.test(d)||(window.location=e.toLowerCase()))})}};annyang.addCommands(l),annyang.start({autoRestart:!0})}else console.log("Speech Recognition is not supported")});