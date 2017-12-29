var s, view;
var app = {
    _config: {
        body: $('body'),
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
        sidebar: ['profile', 'intro', 'description', 'facts'],
        slideIndex: 1,
        artyom: new Artyom()
    },
    bindEvents: function () {
        view.bindActions();
        view.bindEffects();
        view.voiceControl();
        view.showMoonsMobile();
        view.showTooltipFromMobile();
        view.showSidebarInfo();
        view.showMobileSidebarInfo();
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
        });

        view.modalPosition();
        view.sidebarPosition();

        $(window).on('resize', function () {
            view.modalPosition();
            view.sidebarPosition();
        });


        $('#myModal span.close').on('click', function () {
            view.closeModal();
        });

        $('#myModal a.prev').on('click', function () {
            view.plusSlides(-1);
        });

        $('#myModal a.next').on('click', function () {
            view.plusSlides(1);
        });

        s.body.on('click', '.column img', function () {
            view.openModal();
            view.currentSlide($(this).data('index'));
        });

    },
    sidebarPosition: function () {
        $('.info__controls').css('right', -$('.info-wrapper').width() / 2 - $('.info__controls').height() / 2)
    },
    modalPosition: function () {
        $('#myModal').width($(window).width())
            .height($(window).height())
            // .css();
    },
    bindEffects: function () {
        // view.zoomEffect();
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
            s.universe.find('#galaxy').on('mousemove', function(e) {
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
    parallaxGalaxy: function(e, target, movement){ // to be changed
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
    showSidebarInfo: function () {
        $('.wrapper .info__controls--button').on('click', function () {
            var $this = $(this),
                inputVal = $this.val();

            $('.info__contents > div').not('.info__contents--' + inputVal).removeClass('slide__left');

            if($('.info__contents--' + inputVal).hasClass('slide__left')){
                $('.info__contents--' + inputVal).removeClass('slide__left');
            }
            else{
                $('.info__contents--' + inputVal).addClass('slide__left');

                // s.artyom.simulateInstruction('images about sun'); // delete this on production mode
            }
        })
    },
    showMobileSidebarInfo: function () {
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
    openModal: function() {
        $('#myModal').show();
    },
    closeModal: function() {
        $('#myModal').hide();
    },
    plusSlides: function(n) {
        s.slideIndex += n;
        view.showSlides(s.slideIndex);
    },
    currentSlide: function(n) {
        s.slideIndex = n;
        view.showSlides(s.slideIndex);
    },
    showSlides: function(n) {
        var i,
            slides,
            dots = $('.demo');

        if($('.info__modal--content__hero').length > 0){
            slides = $('.info__modal--content__hero');

            if (n > slides.length) {
                s.slideIndex = 1;
            }
            if (n < 1) {
                s.slideIndex = slides.length
            }
            for (i = 0; i < slides.length; i++) {
                slides.eq(i).hide();
            }
            for (i = 0; i < dots.length; i++) {
                dots.eq(i).attr('class').replace("active", "");
            }
            slides.eq(slides.length - s.slideIndex - 1).show();
            dots.eq(slides.length - s.slideIndex - 1).addClass('active');
        }
    },
    voiceControl: function () {
        var commands = [
            {
                indexes: ['back to main page', 'back'],
                action: function(){
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
                }
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
                    var html = '';

                    $('.info__contents--gallery__column, .info__modal--content__hero, .info__modal--content__column').remove();

                    $.ajax({
                        url: url,
                        success: function(results){
                            $.each(results.collection.items, function(i, item){
                                if(i >= 10){
                                    return false;
                                }

                                html =  '<div class="info__contents--gallery__column column">' +
                                            '<img class="cursor" src="'+ item.links[0].href +'" data-index="'+ i +'" />' +
                                        '</div>';
                                $(html).hide()
                                    .appendTo('.slide__left .info__contents--gallery__row')
                                    .fadeIn(i*250);

                                html =  '<div class="info__modal--content__hero">' +
                                            '<img src="'+ item.links[0].href +'">' +
                                        '</div>';
                                $(html).prependTo('.info__modal--content');

                                html =  '<div class="info__modal--content__column column">' +
                                            '<img class="demo cursor" src="'+ item.links[0].href +'" data-index="'+ i +'" />' +
                                        '</div>';
                                $(html).appendTo('.info__modal--content__row');

                            });
                            view.showSlides(s.slideIndex);
                        },
                        error: function(){
                            console.log('error')
                        }
                    });
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

                    s.artyom.say(textToRead);
                }
            },
            {
                indexes: ['shut down yourself'],
                action: function (i) {
                    s.artyom.fatality().then(function () {
                        console.log("Artyom succesfully stopped");
                    });
                }
            }
        ];

        s.artyom.addCommands(commands);

        s.artyom.initialize({
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