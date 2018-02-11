var s,view,App={_config:{body:$("body"),universe:$("#universe"),container:$(".container"),galaxy:$('[class^="galaxy-"]'),loader:$(".loader"),loaderWrapper:$(".loader__wrapper"),loaderButton:$(".loader__local-button"),loaderRedirect:$(".loader__redirect"),loaderControlButton:$(".loader__control-button"),moon:$(".moons-wrapper .moon"),loaderText:"",mobileTest:/mobile/i.test(navigator.userAgent),firefoxTest:/Firefox/i.test(navigator.userAgent),stars:["Sun","Mercury","Venus","Earth","Mars","Jupiter","Saturn","Uranus","Neptune"],sidebar:["profile","intro","description","facts"],desktopMenu:$(".desktop-menu"),mobileMenu:$(".mobile-menu"),mobileMenuItem:$(".menu-item"),infoControls:$(".info__controls"),infoContent:$(".info__contents"),myModal:$(".info__modal"),slidePageNumber:1,artyom:new Artyom},bindActions:function(){view.showContentBySession(),view.showMoonsFromMobile(),view.setMobileLoaderInputs(),view.showTooltipFromMobile(),view.showMobileSidebarInfo(),view.parallaxEffect(),view.shutDownVoiceControl(),s.mobileTest||view.voiceControl(),view.modalPosition(),view.sidebarPosition(),$(window).on("resize",function(){view.modalPosition(),view.sidebarPosition()})},bindUIEvents:function(){s.infoContent.find("a").on("click",view.disableAnchors),s.desktopMenu.find("li > a").on("click",view.desktopMenuRedirectAfterAnimation),s.desktopMenu.find(".dropdown > a").on("click",view.disableAnchors),$(".menu__button").on("click",view.openOverlay),s.desktopMenu.find("li").on("mouseover",view.desktopSubMenuControl),s.myModal.find("span.close").on("click",view.closeModal),s.myModal.find("a.prev").on("click",view.prevSlide),s.myModal.find("a.next").on("click",view.nextSlide),s.body.on("click",".column img",view.galleryModal),$(".wrapper .info__controls--button").on("click",view.showSidebarInfo),s.body.on("click",".slide__left .info__contents--read__link",view.readTextFromSlideOnClick),$(".info__contents--display__gallery--link").on("click",view.displayImagesOnClick)},loadAddClass:function(){s.loader.addClass("loader__session"),s.universe.appendTo(".container").addClass("universe__session")},showContentBySession:function(){s.loader.removeClass("hidden"),s.loaderControlButton.on("click",view.chooseControl),s.loaderButton.on("click",view.showPage),view.loadAddClass(),"/"===window.location.pathname&&(s.mobileTest?view.cookieHandler("mobile"):view.cookieHandler(""))},cookieHandler:function(e){var o="welcome"+e;Cookies.get(o)?window.location="mobile"===e?"/mobile/galaxy":"/galaxy":Cookies.set(o,"welcome"+e,{path:"/",expires:3})},setMobileLoaderInputs:function(){$(".loader__text").length&&(s.loaderText=$(".loader__text"),setTimeout(function(){s.loaderText.width(s.loaderButton.width())},0))},disableAnchors:function(e){e.preventDefault()},desktopMenuRedirectAfterAnimation:function(e){e.preventDefault(),$(this).parents(".menu__overlay").removeClass("open"),s.universe.css({animation:"scaleDownOnMenuClick 1s ease"}),setTimeout(function(){window.location=e.target.pathname},1e3)},openOverlay:function(){$(this).toggleClass("active"),$(".menu__overlay").toggleClass("open")},desktopSubMenuControl:function(){var e=$(this).find(".dropdown");e.length>0&&e.offset().top+e.height()>$(".menu__overlay").height()&&e.addClass("dropdown__bottom")},galleryModal:function(){view.openModal(),view.thisSlide($(this).data("index"))},sidebarPosition:function(){s.infoControls.css("right",-$(".info-wrapper").width()/2-s.infoControls.height()/2)},modalPosition:function(){s.myModal.width($(window).width()).height($(window).height())},parallaxEffect:function(){s.mobileTest||s.universe.find("#galaxy").on("mousemove",function(e){view.parallaxGalaxy(e,"#galaxy .planet-wrapper .planet",-20),$.each(s.moon,function(o,n){view.parallaxGalaxy(e,n,-50-50*o)})})},parallaxGalaxy:function(e,o,n){var i=e.pageX-s.universe.offset().left,t=e.pageY-s.universe.offset().top,a=s.universe.width(),l=s.universe.height();TweenMax.to(o,1,{x:(i-a/2)/a*n,y:(t-l/2)/l*n})},loaderDone:function(){s.loader.removeClass("loader__new-session").addClass("loader__new-session--clicked"),s.universe.addClass("universe__new-session--clicked")},showPage:function(){s.mobileTest?(socket.emit("loadKey",{key:s.loaderText.val()}),socket.on("accessKey",function(e){"granted"===e.access&&""!==e.access?(socket.emit("mobileConnected",{clickButton:".loader__local-button"}),window.location="/mobile/galaxy"):(s.loaderText.addClass("loader__text--error loader__text--animation"),s.loaderText.on("focus",function(){$(this).removeClass("loader__text--error")}),setTimeout(function(){s.loaderText.removeClass("loader__text--animation")},1e3))})):(view.loaderDone(),setTimeout(function(){window.location="/galaxy"},1e3))},showSidebarInfo:function(){var e=$(this).val();$(".info__contents > div").not(".info__contents--"+e).removeClass("slide__left"),s.artyom.shutUp(),$(".info__contents--"+e).hasClass("slide__left")?$(".info__contents--"+e).removeClass("slide__left"):$(".info__contents--"+e).addClass("slide__left")},showMobileSidebarInfo:function(){s.mobileMenu.find(".info__contents--read__text").hide(),s.mobileMenu.find(".info__controls--button").on("click",function(){var e=$(this);e.siblings(".info__contents--read__text").show(),socket.emit("showMobileInfo",{value:e.val()})}),socket.on("showMobileInfoOnDesktop",function(e){"read text"===e.value?$(".slide__left .info__contents--read__link").click():"display images"===e.value?$(".slide__left .info__contents--display__gallery--link").click():$('.info__controls--button[value="'+e.value+'"]').click()})},chooseControl:function(){var e=$(this).data("attr");s.loaderRedirect.addClass("hidden"),$("."+e).removeClass("hidden")},showMoonsFromMobile:function(){s.mobileMenu.find(".moons-wrapper").hide(),s.mobileMenuItem.children("a").on("click",function(){var e=$(this).siblings();$(".moons-wrapper, .info__controls").addClass("hidden"),e.find(".moons-wrapper").removeClass("hidden").show(),e.find(".info__controls").removeClass("hidden")})},showTooltipFromMobile:function(){function e(e){e.preventDefault(),console.log($(this)),moonWrapper=$(this).parents(".moons-wrapper"),socket.emit("showTooltipFromMobile",{id:$(this).parent().attr("id"),click:moonWrapper.data("lastClick")}),moonWrapper.data("lastClick")&&(dataClick=moonWrapper.data("lastClick")),moonWrapper.data("lastClick",$(this).parent().attr("id"))}s.mobileMenuItem.find(".moons-wrapper .planet").on("click",e),s.mobileMenuItem.find(".moons-wrapper a").on("click",e),socket.on("showTooltipOnDesktop",function(e){$(".moon.hovered").removeClass("hovered"),e.id===e.click?$("#"+e.id).removeClass("hovered"):$("#"+e.id).addClass("hovered")})},openModal:function(){s.myModal.show()},closeModal:function(){s.myModal.hide()},changeSlide:function(e){s.slidePageNumber+=e,view.playSlides(s.slidePageNumber)},nextSlide:function(){view.changeSlide(1)},prevSlide:function(){view.changeSlide(-1)},thisSlide:function(e){s.slidePageNumber=e,view.playSlides(s.slidePageNumber)},playSlides:function(e){var o,n=$(".info__modal--content__hero");if(n.length>0){for(e>n.length&&(s.slidePageNumber=1),e<1&&(s.slidePageNumber=n.length),o=0;o<n.length;o++)n.eq(o).hide();n.eq(n.length-s.slidePageNumber-1).show()}},toMainPage:function(){window.location="/"},changePage:function(e,o){$.each(s.stars,function(e,n){o.toLowerCase()===n.toLowerCase()&&(s.mobileTest||(window.location=o.toLowerCase()))})},displaySidebarItem:function(e,o){$('[value="'+o+'"]').click()},displayImagesOnClick:function(){var e=window.location.pathname.slice(1);view.displayImages(1,e)},displayImages:function(e,o){var n="https://images-api.nasa.gov/search?q="+o+"&title="+o+"&media_type=image&year_start=2000",i="";$(".info__contents--gallery__column, .info__modal--content__hero, .info__modal--content__column").remove(),$.ajax({url:n,success:function(e){for(var o=[],n=e.collection.items,t=n.length;o.length<10;){var a=Math.round(Math.random()*t);if(o.indexOf(a)>-1)return!1;o[o.length]=a}var l=0;$.each(n,function(e,n){$.inArray(e,o)>-1&&(i='<div class="info__contents--gallery__column column"><img class="info__img" src="'+n.links[0].href+'" data-index="'+l+'" /></div>',$(i).hide().appendTo(".slide__left .info__contents--gallery__row").fadeIn(100*e),i='<div class="info__modal--content__hero"><img src="'+n.links[0].href+'"></div>',$(i).prependTo(".info__modal--content"),i='<div class="info__modal--content__column column"><img class="info__img" src="'+n.links[0].href+'" data-index="'+l+'" /></div>',$(i).appendTo(".info__modal--content__row"),l++)}),view.playSlides(s.slidePageNumber)},error:function(){console.log("error")}})},readTextFromSlideOnClick:function(){var e=$(".slide__left .info__contents--title").text()+","+$(".slide__left .info__contents--content").text();s.artyom.say(e)},readTextFromSlideOnVoice:function(e){var o="";o=0===e?$(".slide__left .info__contents--title").text():$(".slide__left .info__contents--content").text(),s.artyom.say(o)},shutDownVoiceControl:function(e){s.artyom.fatality().then(function(){console.log("Artyom successfully stopped")})},voiceControl:function(){var e=[{indexes:["back to main page","back"],action:view.toMainPage},{indexes:["go to *"],smart:!0,action:view.changePage},{indexes:["display *"],smart:!0,action:view.displaySidebarItem},{indexes:["images about *"],smart:!0,action:view.displayImages},{indexes:["view title","view content"],action:view.readTextFromSlideOnVoice},{indexes:["shut down yourself"],action:view.shutDownVoiceControl}];s.artyom.addCommands(e),s.artyom.initialize({lang:"en-US",continuous:!0,soundex:!0,debug:!0,executionKeyword:"and do it now",listen:!0}).then(function(){console.log("Artyom has been succesfully initialized")}).catch(function(e){console.error("Artyom couldn't be initialized: ",e)})},init:function(){s=(view=this)._config,view.bindActions(),view.bindUIEvents()}};$(window).on("load",function(){App.init()});