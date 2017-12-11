var s,view,app={_config:{universe:$("#universe"),container:$('[class^="galaxy-"]'),loader:$(".loader"),loaderWrapper:$(".loader__wrapper"),loaderButton:$(".loader__local-button"),loaderRedirect:$(".loader__redirect"),loaderControlButton:$(".loader__control-button"),moon:$(".moons-wrapper .moon"),loaderText:"",mobileTest:/mobile/i.test(navigator.userAgent),firefoxTest:/Firefox/i.test(navigator.userAgent),stars:["Sun","Mercury","Venus","Earth","Mars","Jupiter","Saturn","Uranus","Neptune"]},bindEvents:function(){view.bindActions(),view.bindEffects(),view.voiceControl(),view.showMoonsMobile()},loadAddClass:function(e){s.loader.addClass("loader__"+e+"-session"),s.universe.addClass("universe__"+e+"-session")},bindActions:function(){s.mobileTest&&(s.loaderButton.before('<input class="loader__text" type="text" placeholder=".  .  .  ." maxlength="4" />'),s.loaderButton.parent().addClass("row-flex")),$(".loader__text").length&&(s.loaderText=$(".loader__text"),setTimeout(function(){s.loaderText.width(s.loaderButton.width())},0)),s.loader.removeClass("hidden");var e=s.loaderWrapper.children().not(".loader__planet"),o="";null===sessionStorage.getItem("loader")?(sessionStorage.setItem("loader","true"),o="new",e.removeClass("hidden"),s.loaderControlButton.on("click",view.chooseControl),s.loaderButton.on("click",view.showPage)):(o="same",e.addClass("hidden")),view.loadAddClass(o),$(".menu__button").on("click",function(){$(this).toggleClass("active"),$(".menu__overlay").toggleClass("open")}),$(".desktop-menu a").on("click",function(e){e.preventDefault(),$(this).parents(".menu__overlay").removeClass("open"),s.universe.css({animation:"scaleDownOnMenuClick 1s ease"}),setTimeout(function(){window.location=e.target.pathname},1e3)})},bindEffects:function(){view.zoomEffect(),view.parallaxEffect()},zoomEffect:function(){var e=s.firefoxTest?"DOMMouseScroll":"mousewheel";document.attachEvent?document.attachEvent("on"+e,view.zoomGalaxy):document.addEventListener&&document.addEventListener(e,view.zoomGalaxy,!1)},parallaxEffect:function(){s.mobileTest||s.universe.on("mousemove",function(e){view.parallaxGalaxy(e,"#galaxy .planet-wrapper .planet",-20),$.each(s.moon,function(o,a){view.parallaxGalaxy(e,a,-50-50*o)})})},zoomGalaxy:function(e){var o=window.event||e,a=o.detail?o.detail:o.wheelDelta,n=0;a/=120,(n+=(a=s.firefoxTest?a/3:a)/5)>0?s.container.css({transform:"rotateX(70deg) scale3d("+n+","+n+","+n+")"}):n=0},parallaxGalaxy:function(e,o,a){var n=e.pageX-s.universe.offset().left,t=e.pageY-s.universe.offset().top,i=s.universe.width(),r=s.universe.height();TweenMax.to(o,1,{x:(n-i/2)/i*a,y:(t-r/2)/r*a})},loaderDone:function(){s.loader.removeClass("loader__new-session").addClass("loader__new-session--clicked"),s.universe.addClass("universe__new-session--clicked")},showPage:function(){s.mobileTest?(socket.emit("load",{key:s.loaderText.val()}),socket.on("access",function(e){"granted"===e.access&&""!==e.access?(view.loaderDone(),socket.emit("mobileConnected",{clickButton:".loader__local-button"})):(s.loaderText.addClass("loader__text--error loader__text--animation"),s.loaderText.on("focus",function(){$(this).removeClass("loader__text--error")}),setTimeout(function(){s.loaderText.removeClass("loader__text--animation")},1e3))})):view.loaderDone()},chooseControl:function(){var e=$(this).data("attr");s.loaderRedirect.addClass("hidden"),$("."+e).removeClass("hidden")},showMoonsMobile:function(){$(".menu-item > a").on("click",function(){$(".moons-wrapper").addClass("hidden"),$(this).siblings().find(".moons-wrapper").removeClass("hidden")})},toMainPage:function(){window.location="/"},showDetails:function(e){$.each(s.stars,function(o,a){e.toLowerCase()===a.toLowerCase()&&(s.mobileTest||(window.location=e.toLowerCase()))})},showImages:function(e){var o="https://images-api.nasa.gov/search?q="+e+"&title="+e+"&media_type=image&year_start=1900";$.ajax({url:o,success:function(e){$.each(e.collection.items,function(e,o){if(e>=10)return!1;$("<img />").attr("src",o.links[0].href).appendTo(".info-gallery")})},error:function(){console.log("error")}})},voiceControl:function(){if(annyang){var e={"back (to) (main) (first) (page)":view.toMainPage,"(show) (me) (details) (about) (the) :word":view.showDetails,"image about *search":view.showImages};annyang.addCommands(e),annyang.addCallback("soundstart",function(){console.log("sound detected")}),annyang.addCallback("result",function(){console.log("sound stopped")}),annyang.start({autoRestart:!0})}else console.log("Speech Recognition is not supported")},init:function(){s=(view=this)._config,view.bindEvents()}};$(window).on("load",function(){app.init()});