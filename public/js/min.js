$(function(){function e(){r.removeClass("loader__new-session").addClass("loader__new-session--clicked"),a.addClass("universe__new-session--clicked")}function t(e){var t=window.event||e,o=t.detail?t.detail:t.wheelDelta;o/=120,(g+=(o=f?o/3:o)/5)>0?n.css({transform:"rotateX(70deg) scale3d("+g+","+g+","+g+")"}):g=0}function o(e,t,o){var n=e.pageX-a.offset().left,s=e.pageY-a.offset().top;TweenMax.to(t,1,{x:(n-a.width()/2)/a.width()*o,y:(s-a.height()/2)/a.height()*o})}var a=$("#universe"),n=$('[class^="galaxy-"]'),r=$(".loader"),i=$(".loader__wrapper"),l=$(".loader__local-button"),d=$(".loader__redirect"),c=$(".loader__control-button"),u=i.children().not(".loader__planet"),m="",_=/mobile/i.test(navigator.userAgent),f=/Firefox/i.test(navigator.userAgent);_&&(l.before('<input class="loader__text" type="text" placeholder=".  .  .  ." maxlength="4" />'),l.parent().addClass("row-flex")),$(".loader__text").length&&(m=$(".loader__text"),setTimeout(function(){m.width(l.width())},0)),r.removeClass("hidden"),null===sessionStorage.getItem("loader")?(sessionStorage.setItem("loader","true"),state="new",u.removeClass("hidden"),c.on("click",function(){var e=$(this).data("attr");d.addClass("hidden"),$("."+e).removeClass("hidden")}),l.on("click",function(){_?(socket.emit("load",{key:m.val()}),socket.on("access",function(t){"granted"===t.access&&""!==t.access?e():(m.addClass("loader__text--error loader__text--animation"),m.on("focus",function(){m.removeClass("loader__text--error")}),setTimeout(function(){m.removeClass("loader__text--animation")},1e3))})):e()}),socket.on("key",function(e){$(".loader__remote-button").val(e.code)})):(state="same",u.addClass("hidden")),function(e){r.addClass("loader__"+e+"-session"),a.addClass("universe__"+e+"-session")}(state);var h=f?"DOMMouseScroll":"mousewheel",g=1;if(document.attachEvent?document.attachEvent("on"+h,t):document.addEventListener&&document.addEventListener(h,t,!1),a.on("mousemove",function(e){o(e,"#galaxy .planet-wrapper .planet",-20),$(".moons-wrapper .moon").each(function(t,a){o(e,a,-50-50*t)})}),annyang){var v={"back (to) (main) (first) (page)":function(){window.location="/"},"(show) (me) (details) (about) (the) :word":function(e){s.stars.each(function(t,o){e.toLowerCase()===o.toLowerCase()&&(s.mobileTest||(window.location=e.toLowerCase()))})},"image about *search":function(e){var t="https://images-api.nasa.gov/search?q="+e+"&title="+e+"&media_type=image&year_start=1900";$.ajax({url:t,success:function(e){e.collection.items.each(function(e,t){if(e>=10)return!1;$("<img />").attr("src",t.links[0].href).appendTo(".info-gallery")})},error:function(){console.log("error")}})}};annyang.addCommands(v),annyang.start({autoRestart:!0})}else console.log("Speech Recognition is not supported")});