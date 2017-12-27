var s, view;
var app = {
    _config: {
        universe: $('#universe'),
        container: $('.container'),
        galaxy: $('[class^="galaxy-"]'),
        loader: $('.loader'),
        loaderWrapper: $('.loader__wrapper'),
        loaderButton: $('.loader__local-button'),
        loaderRedirect: $('.loader__redirect'),
        loaderControlButton: $('.loader__control-button'),
        moon: $('.moons-wrapper .moon'),
        loaderText: '',
        mobileTest: /mobile/i.test(navigator.userAgent),
        firefoxTest: /Firefox/i.test(navigator.userAgent),
        stars: ['Sun', 'Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune'],
        sidebar: ['profile', 'intro', 'description', 'facts']
    },
    bindEvents: function () {
        view.bindActions();
        view.bindEffects();
        view.scaleResponsive();
        view.voiceControl();
        view.showMoonsMobile();
        view.showTooltipFromMobile();
        view.showInfo();
        view.showMobileInfo();
    },
    scaleResponsive: function () {
        var pageWidth, pageHeight;

        var basePage = {
            width: 1366,
            height: 768,
            scale: 1,
            scaleX: 1,
            scaleY: 1
        };

        $(function(){
            var $page = $('.page-planet #galaxy');

            if(!s.mobileTest){
                getPageSize();
                scalePages($page, pageWidth, pageHeight);

                $(window).resize(function () {
                    console.log('resize');
                    getPageSize();
                    scalePages($page, pageWidth, pageHeight);
                });
            }

            function getPageSize() {
                pageHeight = $('.container').height();
                pageWidth = $('.container').width();
            }

            function scalePages(page, maxWidth, maxHeight) {
                var scaleX, scaleY;
                scaleX = maxWidth / basePage.width;
                scaleY = maxHeight / basePage.height;
                basePage.scaleX = scaleX;
                basePage.scaleY = scaleY;
                basePage.scale = (scaleX > scaleY) ? scaleY : scaleX;

                var newLeftPos = Math.abs(Math.floor(((basePage.width * basePage.scale) - maxWidth)/2));
                var newTopPos = Math.abs(Math.floor(((basePage.height * basePage.scale) - maxHeight)/2));

                page.attr('style', '-webkit-transform:scale(' + basePage.scale + ');left: 0; right: 0; top:' + newTopPos + 'px;');
            }
        });
    },
    loadAddClass: function (state) {
        s.loader.addClass('loader__'+state+'-session');
        s.universe.appendTo('.container').addClass('universe__'+state+'-session');
    },
    bindActions: function () {
        if(s.mobileTest){
            s.loaderButton.before('<input class="loader__text loader__wrapper--input" type="text" placeholder=".  .  .  ." maxlength="4" />');
            s.loaderButton.parent().addClass('row-flex');
        }

        if($('.loader__text').length){
            s.loaderText = $('.loader__text');
            setTimeout(function(){
                s.loaderText.width(s.loaderButton.width());
            }, 0);
        }

        s.loader.removeClass('hidden');

        var loaderWrapperButPlanet = s.loaderWrapper.children().not('.loader__planet'),
            state = '';

        // sessionStorage will be changed to localStorage
        if (sessionStorage.getItem('loader') === null) { // If session doesn't exist
            sessionStorage.setItem('loader', 'true');

            state = 'new';
            loaderWrapperButPlanet.removeClass('hidden');

            s.loaderControlButton.on('click', view.chooseControl);
            s.loaderButton.on('click', view.showPage);

        } else { // It does exist a session
            state = 'same';
            loaderWrapperButPlanet.addClass('hidden');
        }

        view.loadAddClass(state);

        $('.menu__button').on('click', function () {
            $(this).toggleClass('active');
            $('.menu__overlay').toggleClass('open');
        });

        $('.desktop-menu a').on('click', function (ev) {
            ev.preventDefault();
            $(this).parents('.menu__overlay').removeClass('open');
            s.universe.css({
                'animation': 'scaleDownOnMenuClick 1s ease'
            });
            setTimeout(function () {
                window.location = ev.target.pathname;
            }, 1000)

        });

        $('.info__contents a').on('click', function (e) {
            e.preventDefault();
        })
    },
    bindEffects: function () {
        view.zoomEffect();
        view.parallaxEffect();
    },
    zoomEffect: function () {
        var zoomEvent = s.firefoxTest ? "DOMMouseScroll" : "mousewheel";

        if (document.attachEvent){ //if IE (and Opera depending on user setting)
            document.attachEvent("on" + zoomEvent, view.zoomGalaxy);
        }
        else {
            if (document.addEventListener){ //WC3 browsers
                document.addEventListener(zoomEvent, view.zoomGalaxy, false);
            }
        }
    },
    parallaxEffect: function () {
        if(!s.mobileTest){
            s.universe.on('mousemove', function(e) {
                view.parallaxGalaxy(e, '#galaxy .planet-wrapper .planet', -20);
                $.each(s.moon, function(i, item){
                    view.parallaxGalaxy(e, item, -50-(i*50))
                })
            });
        }
    },
    zoomGalaxy: function(e){
        var ev = window.event || e, //equalize event object
            delta = ev.detail ? ev.detail : ev.wheelDelta,
            incr = 0; //check for detail first so Opera uses that instead of wheelDelta

        delta = delta / 120;
        delta = s.firefoxTest ? delta / 3 : delta;
        incr += delta / 5;

        if(incr > 0){
            s.galaxy.css({'transform': 'rotateX(70deg) scale3d(' + incr + ',' + incr + ',' + incr + ')'});
        }
        else{
            incr = 0;
        }
    },
    parallaxGalaxy: function(e, target, movement){
        var relX = e.pageX - s.universe.offset().left,
            relY = e.pageY - s.universe.offset().top,
            width = s.universe.width(),
            height = s.universe.height();

        TweenMax.to(target, 1, {
            x: (relX - width/2) / width * movement,
            y: (relY - height/2) / height * movement
        })
    },
    loaderDone: function () {
        s.loader.removeClass('loader__new-session').addClass('loader__new-session--clicked');
        s.universe.addClass('universe__new-session--clicked');
    },
    showPage: function () {
        if(s.mobileTest){
            // If there is a key, send it to the server-side
            // through the socket.io channel with a 'load' event.
            socket.emit('load', {
                key: s.loaderText.val()
            });

            socket.on('access', function (data) {
                // Check if we have "granted" access.
                // If we do, we can continue with the presentation.
                if (data.access === "granted" && data.access !== "") {
                    view.loaderDone();

                    socket.emit('mobileConnected', {
                        clickButton: '.loader__local-button'
                    })
                }
                else {
                    // Wrong secret key
                    s.loaderText.addClass('loader__text--error loader__text--animation');

                    s.loaderText.on('focus', function () {
                        $(this).removeClass('loader__text--error');
                    });

                    setTimeout(function(){
                        s.loaderText.removeClass('loader__text--animation');
                    }, 1000);
                }
            });
        }
        else{
            view.loaderDone();
        }
    },
    showInfo: function () {
        $('.wrapper .info__controls--button').on('click', function () {
            var $this = $(this),
                inputVal = $this.val();

            $('.info__contents > div').not('.info__contents--' + inputVal).removeClass('slide__left');

            if($('.info__contents--' + inputVal).hasClass('slide__left')){
                $('.info__contents--' + inputVal).removeClass('slide__left');
            }
            else{
                $('.info__contents--' + inputVal).addClass('slide__left');
            }
        })
    },
    showMobileInfo: function () {
        $('.mobile-menu .info__controls--button').on('click', function () {
            var $this = $(this);
            socket.emit('showMobileInfo', {
                value: $this.val()
            });
        });

        socket.on('showMobileInfoOnDesktop', function (data) {
            $('.info__controls--button[value="' + data.value + '"]').click();
        })
    },
    chooseControl: function() {
        var $this = $(this),
            attr = $this.data('attr');

        s.loaderRedirect.addClass('hidden');
        $('.'+attr).removeClass('hidden');
    },
    showMoonsMobile: function () {
        $('.mobile-menu').find('.moons-wrapper').hide();

        $('.menu-item > a').on('click', function () {
            var siblings = $(this).siblings();
            $('.moons-wrapper, .info__controls').addClass('hidden');
            siblings.find('.moons-wrapper').removeClass('hidden').show();
            siblings.find('.info__controls').removeClass('hidden');
        })
    },
    showTooltipFromMobile: function () {
        $('.menu-item .moons-wrapper .planet').on('click', function () {
            moonWrapper = $(this).parents('.moons-wrapper');
            socket.emit('showTooltipFromMobile', {
                id: $(this).parent().attr('id'),
                click: moonWrapper.data('lastClick')
            });
            if(moonWrapper.data('lastClick')){
                dataClick = moonWrapper.data('lastClick')
            }
            moonWrapper.data('lastClick', $(this).parent().attr('id'));
        });

        socket.on('showTooltipOnDesktop', function (data) {
            $('.moon.hovered').removeClass('hovered');

            if(data.id === data.click){
                $('#' + data.id).removeClass('hovered');
            }
            else{
                $('#' + data.id).addClass('hovered');
            }

        })
    },
    toMainPage: function(){
        // if(!mobileTest){
            window.location = '/';
        // }
        // else {
        //     socket.emit('urlControl');
        // }
        //
        // socket.on('urlControl', function () {
        //     window.location = '/';
        // });
    },
    // showSidebarTab: function (word) {
    //     $('[value="'+ word +'"]').click();
    // },
    // showDetails: function(word) {
    //     $.each(s.stars, function(index, element){
    //         if(word.toLowerCase() === element.toLowerCase()){
    //             if(s.mobileTest){
    //
    //             }
    //             else{
    //                 // console.log(word, index, element);
    //                 window.location = word.toLowerCase();
    //             }
    //         }
    //     })
    // },
    showImages: function(search){
        var url = 'https://images-api.nasa.gov/search?q='+search+'&title='+search+'&media_type=image&year_start=1900';

        $.ajax({
            url: url,
            success: function(results){
                $.each(results.collection.items, function(i, item){
                    if(i >= 10){
                        return false;
                    }
                    $('<img />').attr('src', item.links[0].href).appendTo('.info-gallery')
                })
            },
            error: function(){
                console.log('error')
            }
        })
    },
    voiceControl: function () {
        var commands = [
            {
                indexes: ['back to main page', 'back'],
                action: view.toMainPage
            },
            {
                indexes: ['go to *'],
                smart: true,
                action: function (i, word) {
                    // Use indexOf instead array iteration
                    $.each(s.stars, function(index, element){
                        if(word.toLowerCase() === element.toLowerCase()){
                            if(s.mobileTest){

                            }
                            else{
                                window.location = word.toLowerCase();
                            }
                        }
                    })
                }
            },
            {
                indexes: ['display *'],
                smart: true,
                action: function (i, word) {
                    $('[value="'+ word +'"]').click();
                }
            },
            {
                indexes: ['images about *'],
                smart: true,
                action: function (i, search) {
                    var url = 'https://images-api.nasa.gov/search?q='+search+'&title='+search+'&media_type=image&year_start=1900';

                    $('.slide__left .info__contents--gallery').children().remove();

                    $.ajax({
                        url: url,
                        success: function(results){
                            $.each(results.collection.items, function(i, item){
                                if(i >= 10){
                                    return false;
                                }
                                $('<img />').attr('src', item.links[0].href).appendTo('.slide__left .info__contents--gallery')
                            })
                        },
                        error: function(){
                            console.log('error')
                        }
                    })
                }
            },
            {
                indexes: ['view title', 'view content'],
                action: function (i) {
                    var textToRead = '';

                    if (i === 0){
                        textToRead = $('.slide__left .info__contents--title').text();
                    }
                    else{
                        textToRead = $('.slide__left .info__contents--content').text();
                    }

                    artyom.say(textToRead);
                }
            },
            {
                indexes: ['shut down yourself'],
                action: function (i) {
                    artyom.fatality().then(function () {
                        console.log("Artyom succesfully stopped");
                    });
                }
            }
        ];

        var artyom = new Artyom();
        artyom.addCommands(commands);

        artyom.initialize({
            lang: "en-US",
            continuous: true,
            soundex: true,
            debug: true,
            executionKeyword: "and do it now",
            listen: true
        }).then(function () {
            console.log("Artyom has been succesfully initialized");
        }).catch(function (err) {
            console.error("Artyom couldn't be initialized: ", err);
        });
    },
    init: function(){
        view = this;
        s = view._config;
        view.bindEvents();
    }
};

// $(function() {
//     app.init();
// });

$(window).on('load', function () {
    // setTimeout(function() {
    //     $('body').addClass('page-loaded');
        app.init();
    // }, 1500);
});