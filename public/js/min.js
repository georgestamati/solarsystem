$(window).on("load",function(){var e=$("#universe"),a=$(".loader"),n=$(".loader__button");a.removeClass("hidden"),null===sessionStorage.getItem("loader")?(sessionStorage.setItem("loader","true"),a.addClass("loader__new-session"),n.removeClass("hidden"),e.addClass("universe__new-session"),n.on("click",function(){a.removeClass("loader__new-session").addClass("loader__new-session--clicked"),e.addClass("universe__new-session--clicked")})):(a.addClass("loader__same-session"),e.addClass("universe__same-session"))}),$(document).ready(function(){function e(e){var a=window.event||e,n=a.detail?a.detail:a.wheelDelta;n/=120,(r+=(n=s?n/3:n)/5)>0?o.css({transform:"rotateX(70deg) scale3d("+r+","+r+","+r+")"}):r=0}function a(e,a,o){var s=e.pageX-n.offset().left,t=e.pageY-n.offset().top;TweenMax.to(a,1,{x:(s-n.width()/2)/n.width()*o,y:(t-n.height()/2)/n.height()*o})}var n=$("#universe"),o=$('[class^="galaxy-"]'),s=/Firefox/i.test(navigator.userAgent),t=s?"DOMMouseScroll":"mousewheel",r=1;document.attachEvent?document.attachEvent("on"+t,e):document.addEventListener&&document.addEventListener(t,e,!1),n.on("mousemove",function(e){a(e,"#galaxy .planet-wrapper .planet",-20),$(".moons-wrapper .moon").each(function(n,o){a(e,o,-50-50*n)})}),function(e,a){var n="https://images-api.nasa.gov/search?q="+e+"&media_type="+a;$.ajax({url:n,success:function(e){$.each(e.collection.items,function(e,a){if(e>=10)return!1;$("<img />").attr("src",a.links[0].href).appendTo(".info-gallery")})},error:function(){console.log("error")}})}("galaxy","image");var i=["Sun","Mercury","Venus","Earth","Mars","Jupiter","Saturn","Uranus","Neptune"],l=navigator.userAgent;if(annyang){var c={"back (to) (main) (first) (page)":function(){window.location="/"},"(show) (me) (details) (about) (the) :word":function(e){$.each(i,function(a,n){e.toLowerCase()===n.toLowerCase()&&(/mobile/i.test(l)||(window.location=e.toLowerCase()))})},"image about *search":function(e){var a="https://images-api.nasa.gov/search?q="+e+"&title="+e+"&media_type=image&year_start=1900";$.ajax({url:a,success:function(e){$.each(e.collection.items,function(e,a){if(e>=10)return!1;$("<img />").attr("src",a.links[0].href).appendTo(".info-gallery")})},error:function(){console.log("error")}})}};annyang.addCommands(c),annyang.start({autoRestart:!0})}else console.log("Speech Recognition is not supported")});