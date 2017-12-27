var s,view,app={_config:{universe:$("#universe"),container:$(".container"),galaxy:$('[class^="galaxy-"]'),loader:$(".loader"),loaderWrapper:$(".loader__wrapper"),loaderButton:$(".loader__local-button"),loaderRedirect:$(".loader__redirect"),loaderControlButton:$(".loader__control-button"),moon:$(".moons-wrapper .moon"),loaderText:"",mobileTest:/mobile/i.test(navigator.userAgent),firefoxTest:/Firefox/i.test(navigator.userAgent),stars:["Sun","Mercury","Venus","Earth","Mars","Jupiter","Saturn","Uranus","Neptune"],sidebar:["profile","intro","description","facts"]},bindEvents:function(){view.bindActions(),view.bindEffects(),view.scaleResponsive(),view.voiceControl(),view.showMoonsMobile(),view.showTooltipFromMobile(),view.showInfo(),view.showMobileInfo()},scaleResponsive:function(){var e,o,n={width:1366,height:768,scale:1,scaleX:1,scaleY:1};$(function(){function t(){o=$(".container").height(),e=$(".container").width()}function a(e,o,t){var a,i;a=o/n.width,i=t/n.height,n.scaleX=a,n.scaleY=i,n.scale=a>i?i:a;Math.abs(Math.floor((n.width*n.scale-o)/2));var s=Math.abs(Math.floor((n.height*n.scale-t)/2));e.attr("style","-webkit-transform:scale("+n.scale+");left: 0; right: 0; top:"+s+"px;")}var i=$(".page-planet #galaxy");s.mobileTest||(t(),a(i,e,o),$(window).resize(function(){console.log("resize"),t(),a(i,e,o)}))})},loadAddClass:function(e){s.loader.addClass("loader__"+e+"-session"),s.universe.appendTo(".container").addClass("universe__"+e+"-session")},bindActions:function(){s.mobileTest&&(s.loaderButton.before('<input class="loader__text loader__wrapper--input" type="text" placeholder=".  .  .  ." maxlength="4" />'),s.loaderButton.parent().addClass("row-flex")),$(".loader__text").length&&(s.loaderText=$(".loader__text"),setTimeout(function(){s.loaderText.width(s.loaderButton.width())},0)),s.loader.removeClass("hidden");var e=s.loaderWrapper.children().not(".loader__planet"),o="";null===sessionStorage.getItem("loader")?(sessionStorage.setItem("loader","true"),o="new",e.removeClass("hidden"),s.loaderControlButton.on("click",view.chooseControl),s.loaderButton.on("click",view.showPage)):(o="same",e.addClass("hidden")),view.loadAddClass(o),$(".menu__button").on("click",function(){$(this).toggleClass("active"),$(".menu__overlay").toggleClass("open")}),$(".desktop-menu a").on("click",function(e){e.preventDefault(),$(this).parents(".menu__overlay").removeClass("open"),s.universe.css({animation:"scaleDownOnMenuClick 1s ease"}),setTimeout(function(){window.location=e.target.pathname},1e3)}),$(".info__contents a").on("click",function(e){e.preventDefault()})},bindEffects:function(){view.zoomEffect(),view.parallaxEffect()},zoomEffect:function(){var e=s.firefoxTest?"DOMMouseScroll":"mousewheel";document.attachEvent?document.attachEvent("on"+e,view.zoomGalaxy):document.addEventListener&&document.addEventListener(e,view.zoomGalaxy,!1)},parallaxEffect:function(){s.mobileTest||s.universe.on("mousemove",function(e){view.parallaxGalaxy(e,"#galaxy .planet-wrapper .planet",-20),$.each(s.moon,function(o,n){view.parallaxGalaxy(e,n,-50-50*o)})})},zoomGalaxy:function(e){var o=window.event||e,n=o.detail?o.detail:o.wheelDelta,t=0;n/=120,(t+=(n=s.firefoxTest?n/3:n)/5)>0?s.galaxy.css({transform:"rotateX(70deg) scale3d("+t+","+t+","+t+")"}):t=0},parallaxGalaxy:function(e,o,n){var t=e.pageX-s.universe.offset().left,a=e.pageY-s.universe.offset().top,i=s.universe.width(),l=s.universe.height();TweenMax.to(o,1,{x:(t-i/2)/i*n,y:(a-l/2)/l*n})},loaderDone:function(){s.loader.removeClass("loader__new-session").addClass("loader__new-session--clicked"),s.universe.addClass("universe__new-session--clicked")},showPage:function(){s.mobileTest?(socket.emit("load",{key:s.loaderText.val()}),socket.on("access",function(e){"granted"===e.access&&""!==e.access?(view.loaderDone(),socket.emit("mobileConnected",{clickButton:".loader__local-button"})):(s.loaderText.addClass("loader__text--error loader__text--animation"),s.loaderText.on("focus",function(){$(this).removeClass("loader__text--error")}),setTimeout(function(){s.loaderText.removeClass("loader__text--animation")},1e3))})):view.loaderDone()},showInfo:function(){$(".wrapper .info__controls--button").on("click",function(){var e=$(this).val();$(".info__contents > div").not(".info__contents--"+e).removeClass("slide__left"),$(".info__contents--"+e).hasClass("slide__left")?$(".info__contents--"+e).removeClass("slide__left"):$(".info__contents--"+e).addClass("slide__left")})},showMobileInfo:function(){$(".mobile-menu .info__controls--button").on("click",function(){var e=$(this);socket.emit("showMobileInfo",{value:e.val()})}),socket.on("showMobileInfoOnDesktop",function(e){$('.info__controls--button[value="'+e.value+'"]').click()})},chooseControl:function(){var e=$(this).data("attr");s.loaderRedirect.addClass("hidden"),$("."+e).removeClass("hidden")},showMoonsMobile:function(){$(".mobile-menu").find(".moons-wrapper").hide(),$(".menu-item > a").on("click",function(){var e=$(this).siblings();$(".moons-wrapper, .info__controls").addClass("hidden"),e.find(".moons-wrapper").removeClass("hidden").show(),e.find(".info__controls").removeClass("hidden")})},showTooltipFromMobile:function(){$(".menu-item .moons-wrapper .planet").on("click",function(){moonWrapper=$(this).parents(".moons-wrapper"),socket.emit("showTooltipFromMobile",{id:$(this).parent().attr("id"),click:moonWrapper.data("lastClick")}),moonWrapper.data("lastClick")&&(dataClick=moonWrapper.data("lastClick")),moonWrapper.data("lastClick",$(this).parent().attr("id"))}),socket.on("showTooltipOnDesktop",function(e){$(".moon.hovered").removeClass("hovered"),e.id===e.click?$("#"+e.id).removeClass("hovered"):$("#"+e.id).addClass("hovered")})},toMainPage:function(){window.location="/"},showImages:function(e){var o="https://images-api.nasa.gov/search?q="+e+"&title="+e+"&media_type=image&year_start=1900";$.ajax({url:o,success:function(e){$.each(e.collection.items,function(e,o){if(e>=10)return!1;$("<img />").attr("src",o.links[0].href).appendTo(".info-gallery")})},error:function(){console.log("error")}})},voiceControl:function(){var e=[{indexes:["back to main page","back"],action:view.toMainPage},{indexes:["go to *"],smart:!0,action:function(e,o){$.each(s.stars,function(e,n){o.toLowerCase()===n.toLowerCase()&&(s.mobileTest||(window.location=o.toLowerCase()))})}},{indexes:["display *"],smart:!0,action:function(e,o){$('[value="'+o+'"]').click()}},{indexes:["images about *"],smart:!0,action:function(e,o){var n="https://images-api.nasa.gov/search?q="+o+"&title="+o+"&media_type=image&year_start=1900";$(".slide__left .info__contents--gallery").children().remove(),$.ajax({url:n,success:function(e){$.each(e.collection.items,function(e,o){if(e>=10)return!1;$("<img />").attr("src",o.links[0].href).appendTo(".slide__left .info__contents--gallery")})},error:function(){console.log("error")}})}},{indexes:["view title","view content"],action:function(e){var n="";n=0===e?$(".slide__left .info__contents--title").text():$(".slide__left .info__contents--content").text(),o.say(n)}},{indexes:["shut down yourself"],action:function(e){o.fatality().then(function(){console.log("Artyom succesfully stopped")})}}],o=new Artyom;o.addCommands(e),o.initialize({lang:"en-US",continuous:!0,soundex:!0,debug:!0,executionKeyword:"and do it now",listen:!0}).then(function(){console.log("Artyom has been succesfully initialized")}).catch(function(e){console.error("Artyom couldn't be initialized: ",e)})},init:function(){s=(view=this)._config,view.bindEvents()}};$(window).on("load",function(){app.init()});