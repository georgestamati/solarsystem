var s, view;
var app = {
    _config: {
        universe: $('#universe'),
        container: $('[class^="galaxy-"]'),
        loader: $('.loader'),
        loaderWrapper: $('.loader__wrapper'),
        loaderButton: $('.loader__local-button'),
        loaderRedirect: $('.loader__redirect'),
        loaderControlButton: $('.loader__control-button'),
        moon: $('.moons-wrapper .moon'),
        loaderText: '',
        mobileTest: /mobile/i.test(navigator.userAgent),
        firefoxTest: /Firefox/i.test(navigator.userAgent),
        stars: ['Sun', 'Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune']
    },
    bindEvents: function () {
        view.bindActions();
        view.bindEffects();
        view.voiceControl();
        view.showMoonsMobile();
    },
    loadAddClass: function (state) {
        s.loader.addClass('loader__'+state+'-session');
        s.universe.addClass('universe__'+state+'-session');
    },
    bindActions: function () {
        if(s.mobileTest){
            s.loaderButton.before('<input class="loader__text" type="text" placeholder=".  .  .  ." maxlength="4" />');
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
        if (localStorage.getItem('loader') === null) { // If session doesn't exist
            localStorage.setItem('loader', 'true');

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
            s.container.css({'transform': 'rotateX(70deg) scale3d(' + incr + ',' + incr + ',' + incr + ')'});
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
    chooseControl: function() {
        var $this = $(this),
            attr = $this.data('attr');

        s.loaderRedirect.addClass('hidden');
        $('.'+attr).removeClass('hidden');
    },
    showMoonsMobile: function () {
        $('.menu-item > a').on('click', function () {
            $('.moons-wrapper').addClass('hidden');
            $(this).siblings().find('.moons-wrapper').removeClass('hidden');
        })
    },
    toMainPage: function(){
        window.location = '/';
    },
    showDetails: function(word) {
        $.each(s.stars, function(index, element){
            if(word.toLowerCase() === element.toLowerCase()){
                if(s.mobileTest){

                }
                else{
                    // console.log(word, index, element);
                    window.location = word.toLowerCase();
                }
            }
        })
    },
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
        if (annyang) {
            var commands = {
                'back (to) (main) (first) (page)': view.toMainPage,
                '(show) (me) (details) (about) (the) :word': view.showDetails,
                'image about *search': view.showImages
            };

            // Add our commands to annyang
            annyang.addCommands(commands);

            annyang.addCallback('soundstart', function() {
                console.log('sound detected');
            });

            annyang.addCallback('result', function() {
                console.log('sound stopped');
            });

            // Start listening. You can call this here, or attach this call to an event, button, etc.
            annyang.start({
                autoRestart: true
            });
        }
        else {
            console.log('Speech Recognition is not supported');
        }
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