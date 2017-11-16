var app={_config:{universe:$("#universe"),container:$('[class^="galaxy-"]'),loader:$(".loader"),loaderWrapper:$(".loader__wrapper"),loaderButton:$(".loader__local-button"),loaderRedirect:$(".loader__redirect"),loaderControlButton:$(".loader__control-button"),loaderText:"",mobileTest:/mobile/i.test(navigator.userAgent),firefoxTest:/Firefox/i.test(navigator.userAgent),stars:["Sun","Mercury","Venus","Earth","Mars","Jupiter","Saturn","Uranus","Neptune"]},bindEvents:function(){this.voiceControl(),this.bindActions()},loadAddClass:function(e){s.loader.addClass("loader__"+e+"-session"),s.universe.addClass("universe__"+e+"-session")},bindActions:function(){s.mobileTest&&(s.loaderButton.before('<input class="loader__text" type="text" placeholder=".  .  .  ." maxlength="4" />'),s.loaderButton.parent().addClass("row-flex")),$(".loader__text").length&&(loaderText=$(".loader__text"),setTimeout(function(){loaderText.width(s.loaderButton.width())},0)),loader.removeClass("hidden");var e=s.loaderWrapper.children().not(".loader__planet"),o="";null===sessionStorage.getItem("loader")?(sessionStorage.setItem("loader","true"),o="new",e.removeClass("hidden"),s.loaderControlButton.on("click",this.chooseControl),s.loaderButton.on("click",this.showPage)):(o="same",e.addClass("hidden")),this.loadAddClass(o);var t=s.firefoxTest?"DOMMouseScroll":"mousewheel";document.attachEvent?document.attachEvent("on"+t,zoomGalaxy):document.addEventListener&&document.addEventListener(t,zoomGalaxy,!1),s.universe.on("mousemove",function(e){this.parallaxIt(e,"#galaxy .planet-wrapper .planet",-20),$(".moons-wrapper .moon").each(function(o,t){this.parallaxIt(e,t,-50-50*o)})})},loaderDone:function(){s.loader.removeClass("loader__new-session").addClass("loader__new-session--clicked"),s.universe.addClass("universe__new-session--clicked")},showPage:function(){s.mobileTest?(socket.emit("load",{key:loaderText.val()}),socket.on("access",function(e){if("granted"===e.access&&""!==e.access)this.loaderDone(),socket.emit("mobileConnected",{clickButton:".loader__local-button"});else{loaderText.addClass("loader__text--error loader__text--animation"),loaderText.on("focus",function(){loaderText.removeClass("loader__text--error")});setTimeout(function(){loaderText.removeClass("loader__text--animation")},1e3)}})):this.loaderDone()},chooseControl:function(){var e=$(this).data("attr");s.loaderRedirect.addClass("hidden"),$("."+e).removeClass("hidden")},zoomGalaxy:function(e){var o=window.event||e,t=o.detail?o.detail:o.wheelDelta;t/=120,t=s.firefoxTest?t/3:t,incr+=t/5,incr>0?s.container.css({transform:"rotateX(70deg) scale3d("+incr+","+incr+","+incr+")"}):incr=0},parallaxIt:function(e,o,t){var a=e.pageX-s.universe.offset().left,n=e.pageY-s.universe.offset().top;TweenMax.to(o,1,{x:(a-s.universe.width()/2)/s.universe.width()*t,y:(n-s.universe.height()/2)/s.universe.height()*t})},toMainPage:function(){window.location="/"},showDetails:function(e){s.stars.each(function(o,t){e.toLowerCase()===t.toLowerCase()&&(s.mobileTest||(window.location=e.toLowerCase()))})},showImages:function(e){var o="https://images-api.nasa.gov/search?q="+e+"&title="+e+"&media_type=image&year_start=1900";$.ajax({url:o,success:function(e){e.collection.items.each(function(e,o){if(e>=10)return!1;$("<img />").attr("src",o.links[0].href).appendTo(".info-gallery")})},error:function(){console.log("error")}})},voiceControl:function(){if(annyang){var e={"back (to) (main) (first) (page)":this.toMainPage(),"(show) (me) (details) (about) (the) :word":this.showDetails(),"image about *search":this.showImages(search)};annyang.addCommands(e),annyang.addCallback("soundstart",function(){console.log("sound detected")}),annyang.addCallback("result",function(){console.log("sound stopped")}),annyang.start({autoRestart:!0})}else console.log("Speech Recognition is not supported")},init:function(){this._config;this.bindEvents()}},s,view,app={_config:{universe:$("#universe"),container:$('[class^="galaxy-"]'),loader:$(".loader"),loaderWrapper:$(".loader__wrapper"),loaderButton:$(".loader__local-button"),loaderRedirect:$(".loader__redirect"),loaderControlButton:$(".loader__control-button"),moon:$(".moons-wrapper .moon"),loaderText:"",mobileTest:/mobile/i.test(navigator.userAgent),firefoxTest:/Firefox/i.test(navigator.userAgent),stars:["Sun","Mercury","Venus","Earth","Mars","Jupiter","Saturn","Uranus","Neptune"]},bindEvents:function(){view.bindActions(),view.bindEffects(),view.voiceControl()},loadAddClass:function(e){s.loader.addClass("loader__"+e+"-session"),s.universe.addClass("universe__"+e+"-session")},bindActions:function(){s.mobileTest&&(s.loaderButton.before('<input class="loader__text" type="text" placeholder=".  .  .  ." maxlength="4" />'),s.loaderButton.parent().addClass("row-flex")),$(".loader__text").length&&(s.loaderText=$(".loader__text"),setTimeout(function(){s.loaderText.width(s.loaderButton.width())},0)),s.loader.removeClass("hidden");var e=s.loaderWrapper.children().not(".loader__planet"),o="";null===sessionStorage.getItem("loader")?(sessionStorage.setItem("loader","true"),o="new",e.removeClass("hidden"),s.loaderControlButton.on("click",view.chooseControl),s.loaderButton.on("click",view.showPage)):(o="same",e.addClass("hidden")),view.loadAddClass(o)},bindEffects:function(){view.zoomEffect(),view.parallaxEffect()},zoomEffect:function(){var e=s.firefoxTest?"DOMMouseScroll":"mousewheel";document.attachEvent?document.attachEvent("on"+e,view.zoomGalaxy):document.addEventListener&&document.addEventListener(e,view.zoomGalaxy,!1)},parallaxEffect:function(){s.universe.on("mousemove",function(e){view.parallaxGalaxy(e,"#galaxy .planet-wrapper .planet",-20),$.each(s.moon,function(o,t){view.parallaxGalaxy(e,t,-50-50*o)})})},zoomGalaxy:function(e){var o=window.event||e,t=o.detail?o.detail:o.wheelDelta;t/=120,t=s.firefoxTest?t/3:t,incr+=t/5,incr>0?s.container.css({transform:"rotateX(70deg) scale3d("+incr+","+incr+","+incr+")"}):incr=0},parallaxGalaxy:function(e,o,t){var a=e.pageX-s.universe.offset().left,n=e.pageY-s.universe.offset().top,r=s.universe.width(),i=s.universe.height();TweenMax.to(o,1,{x:(a-r/2)/r*t,y:(n-i/2)/i*t})},loaderDone:function(){s.loader.removeClass("loader__new-session").addClass("loader__new-session--clicked"),s.universe.addClass("universe__new-session--clicked")},showPage:function(){s.mobileTest?(socket.emit("load",{key:s.loaderText.val()}),socket.on("access",function(e){"granted"===e.access&&""!==e.access?(view.loaderDone(),socket.emit("mobileConnected",{clickButton:".loader__local-button"})):(s.loaderText.addClass("loader__text--error loader__text--animation"),s.loaderText.on("focus",function(){$(this).removeClass("loader__text--error")}),setTimeout(function(){s.loaderText.removeClass("loader__text--animation")},1e3))})):view.loaderDone()},chooseControl:function(){var e=$(this).data("attr");s.loaderRedirect.addClass("hidden"),$("."+e).removeClass("hidden")},toMainPage:function(){window.location="/"},showDetails:function(e){$.each(s.stars,function(o,t){e.toLowerCase()===t.toLowerCase()&&(s.mobileTest||(window.location=e.toLowerCase()))})},showImages:function(e){var o="https://images-api.nasa.gov/search?q="+e+"&title="+e+"&media_type=image&year_start=1900";$.ajax({url:o,success:function(e){$.each(e.collection.items,function(e,o){if(e>=10)return!1;$("<img />").attr("src",o.links[0].href).appendTo(".info-gallery")})},error:function(){console.log("error")}})},voiceControl:function(){if(annyang){var e={"back (to) (main) (first) (page)":view.toMainPage,"(show) (me) (details) (about) (the) :word":view.showDetails,"image about *search":view.showImages};annyang.addCommands(e),annyang.addCallback("soundstart",function(){console.log("sound detected")}),annyang.addCallback("result",function(){console.log("sound stopped")}),annyang.start({autoRestart:!0})}else console.log("Speech Recognition is not supported")},init:function(){s=(view=this)._config,view.bindEvents()}};$(function(){app.init()});