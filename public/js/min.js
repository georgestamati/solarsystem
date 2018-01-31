var s, view;
var App = {
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
        desktopMenu: $('.desktop-menu'),
        mobileMenu: $('.mobile-menu'),
        mobileMenuItem: $('.menu-item'),
        infoControls: $('.info__controls'),
        infoContent: $('.info__contents'),
        myModal: $('.info__modal'),
        slidePageNumber: 1,
        artyom: new Artyom()
    },
    bindActions: function () {
        view.showContentBySession();

        view.showMoonsFromMobile();
        view.setMobileLoaderInputs();
        view.showTooltipFromMobile();
        view.showMobileSidebarInfo();

        view.parallaxEffect();

        if(!s.mobileTest){
            view.voiceControl();
        }

        view.modalPosition();
        view.sidebarPosition();

        $(window).on('resize', function () {
            view.modalPosition();
            view.sidebarPosition();
        });
    },
    bindUIEvents: function () {
        s.infoContent.find('a').on('click', view.disableSidebarAnchors);
        s.desktopMenu.find('a').on('click', view.desktopMenuRedirectAfterAnimation);
        $('.menu__button').on('click', view.openOverlay);
        s.desktopMenu.find('li').on('mouseover', view.desktopSubMenuControl);
        s.myModal.find('span.close').on('click', view.closeModal);
        s.myModal.find('a.prev').on('click', view.prevSlide);
        s.myModal.find('a.next').on('click', view.nextSlide);
        s.body.on('click', '.column img', view.galleryModal);
        $('.wrapper .info__controls--button').on('click', view.showSidebarInfo);
        s.body.on('click', '.slide__left .info__contents--read__link', view.readTextFromSlideOnClick);
        $('.info__contents--display__gallery--link').on('click', view.displayImagesOnClick);
    },
    loadAddClass: function (state) {
        s.loader.addClass('loader__'+state+'-session');
        s.universe.appendTo('.container').addClass('universe__'+state+'-session');
    },
    showContentBySession: function () {
        s.loader.removeClass('hidden');
        s.loaderControlButton.on('click', view.chooseControl);
        s.loaderButton.on('click', view.showPage);
        // view.loaderDone();

        //Check if exists cookie then stay to welcome screen else redirect to galaxy page
        if(window.location.pathname === '/'){
            if(s.mobileTest){
                view.cookieHandler('mobile');
            }
            else{
                view.cookieHandler('');
            }
        }
    },
    cookieHandler: function (type) {
        var cookieName = 'welcome' + type;
        var readCookie = $.cookie(cookieName);
        if (!readCookie) {
            $.cookie(cookieName, 'welcome' + type, { path: '/', expires: 3 });
        }
        else {
            window.location = type + '/galaxy';
        }
    },
    setMobileLoaderInputs: function () {
        if($('.loader__text').length){
            s.loaderText = $('.loader__text');
            setTimeout(function(){
                s.loaderText.width(s.loaderButton.width());
            }, 0);
        }
    },
    disableSidebarAnchors: function (ev) {
        ev.preventDefault();
    },
    desktopMenuRedirectAfterAnimation: function (ev) {
        ev.preventDefault();
        $(this).parents('.menu__overlay').removeClass('open');
        s.universe.css({
            'animation': 'scaleDownOnMenuClick 1s ease'
        });
        setTimeout(function () {
            window.location = ev.target.pathname;
        }, 1000)
    },
    openOverlay: function () {
        $(this).toggleClass('active');
        $('.menu__overlay').toggleClass('open');
    },
    desktopSubMenuControl: function () {
        var listItemDropdown = $(this).find('.dropdown');
        if(listItemDropdown.length > 0) {
            if (listItemDropdown.offset().top + listItemDropdown.height() > $('.menu__overlay').height()) {
                listItemDropdown.addClass('dropdown__bottom');
            }
        }
    },
    galleryModal: function () {
        view.openModal();
        view.thisSlide($(this).data('index'));
    },
    sidebarPosition: function () {
        s.infoControls.css('right', -$('.info-wrapper').width() / 2 - s.infoControls.height() / 2)
    },
    modalPosition: function () {
        s.myModal.width($(window).width()).height($(window).height())
    },
    parallaxEffect: function () {
        if(!s.mobileTest){
            s.universe.find('#galaxy').on('mousemove', function (e) {
                view.parallaxGalaxy(e, '#galaxy .planet-wrapper .planet', -20);
                $.each(s.moon, function(i, item){
                    view.parallaxGalaxy(e, item, -50-(i*50));
                })
            })
        }
    },
    parallaxGalaxy: function(e, target, move){
        var x = e.pageX - s.universe.offset().left,
            y = e.pageY - s.universe.offset().top,
            width = s.universe.width(),
            height = s.universe.height();

        TweenMax.to(target, 1, {
            x: (x - width/2) / width * move,
            y: (y - height/2) / height * move
        })
    },
    loaderDone: function () {
        s.loader.removeClass('loader__new-session').addClass('loader__new-session--clicked');
        s.universe.addClass('universe__new-session--clicked');
    },
    showPage: function () {
        if(s.mobileTest){
            socket.emit('loadKey', {
                key: s.loaderText.val()
            });
            socket.on('accessKey', function (data) {
                if (data.access === "granted" && data.access !== "") {
                    // view.loaderDone();

                    socket.emit('mobileConnected', {
                        clickButton: '.loader__local-button'
                    });

                    window.location = "/galaxy";
                }
                else {
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
            setTimeout(function () {
                window.location = '/galaxy';
            }, 1000);
        }
    },
    showSidebarInfo: function () {
        var $this = $(this),
            inputVal = $this.val();

        $('.info__contents > div').not('.info__contents--' + inputVal).removeClass('slide__left');

        if($('.info__contents--' + inputVal).hasClass('slide__left')){
            $('.info__contents--' + inputVal).removeClass('slide__left');
        }
        else{
            $('.info__contents--' + inputVal).addClass('slide__left');
            // if(inputVal === 'description'){
            //     s.artyom.simulateInstruction('view title'); // delete this on production mode
            // }
        }
    },
    showMobileSidebarInfo: function () {
        s.mobileMenu.find('.info__contents--read__text').hide();
        s.mobileMenu.find('.info__controls--button').on('click', function () {
            var $this = $(this);
            $this.siblings('.info__contents--read__text').show();
            socket.emit('showMobileInfo', {
                value: $this.val()
            });
        });

        socket.on('showMobileInfoOnDesktop', function (data) {
            if(data.value === 'read text'){
                $('.slide__left .info__contents--read__link').click();
            }
            else{
                $('.info__controls--button[value="' + data.value + '"]').click();
            }
        })
    },
    chooseControl: function() {
        var $this = $(this),
            attr = $this.data('attr');

        s.loaderRedirect.addClass('hidden');
        $('.'+attr).removeClass('hidden');
    },
    showMoonsFromMobile: function () {
        s.mobileMenu.find('.moons-wrapper').hide();

        s.mobileMenuItem.children('a').on('click', function () {
            var siblings = $(this).siblings();
            $('.moons-wrapper, .info__controls').addClass('hidden');
            siblings.find('.moons-wrapper').removeClass('hidden').show();
            siblings.find('.info__controls').removeClass('hidden');
        })
    },
    showTooltipFromMobile: function () {
        s.mobileMenuItem.find('.moons-wrapper .planet').on('click', function () {
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
        s.myModal.show();
    },
    closeModal: function() {
        s.myModal.hide();
    },
    changeSlide: function(n) {
        s.slidePageNumber += n;
        view.playSlides(s.slidePageNumber);
    },
    nextSlide: function () {
        view.changeSlide(1);
    },
    prevSlide: function () {
        view.changeSlide(-1);
    },
    thisSlide: function(n) {
        s.slidePageNumber = n;
        view.playSlides(s.slidePageNumber);
    },
    playSlides: function(n) {
        var i,
        heroImage = $('.info__modal--content__hero');

        if(heroImage.length > 0){
            if (n > heroImage.length) {
                s.slidePageNumber = 1;
            }
            if (n < 1) {
                s.slidePageNumber = heroImage.length
            }
            for (i = 0; i < heroImage.length; i++) {
                heroImage.eq(i).hide();
            }
            heroImage.eq(heroImage.length - s.slidePageNumber - 1).show();
        }
    },
    toMainPage: function () {
        window.location = '/';
    },
    changePage: function (i, word) {
        // Use indexOf instead array iteration
        $.each(s.stars, function(index, element){
            if(word.toLowerCase() === element.toLowerCase()){
                if(s.mobileTest){

                }
                else{
                    window.location = word.toLowerCase();
                }
            }
        });
    },
    displaySidebarItem: function (i, word) {
        $('[value="'+ word +'"]').click();
    },
    displayImagesOnClick: function () {
        var path = window.location.pathname.slice(1);
        view.displayImages(1, path);
    },
    displayImages: function (i, search) {
        var url = 'https://images-api.nasa.gov/search?q='+search+'&title='+search+'&media_type=image&year_start=1900';
        var html = '';

        $('.info__contents--gallery__column, .info__modal--content__hero, .info__modal--content__column').remove();

        $.ajax({
            url: url,
            success: function(results){
                var arr = [],
                    resultItems = results.collection.items,
                    resultItemsLength = resultItems.length;

                while(arr.length < 10){
                    var random = Math.round(Math.random() * resultItemsLength);
                    if(arr.indexOf(random) > -1){
                        return false;
                    }
                    arr[arr.length] = random;
                }

                var dataIndex = 0;
                $.each(resultItems, function(i, item){
                    if($.inArray(i, arr) > -1){
                        html =  '<div class="info__contents--gallery__column column">' +
                            '<img class="info__img" src="'+ item.links[0].href +'" data-index="'+ dataIndex +'" />' +
                            '</div>';
                        $(html).hide()
                            .appendTo('.slide__left .info__contents--gallery__row')
                            .fadeIn(i*100);

                        html =  '<div class="info__modal--content__hero">' +
                            '<img src="'+ item.links[0].href +'">' +
                            '</div>';
                        $(html).prependTo('.info__modal--content');

                        html =  '<div class="info__modal--content__column column">' +
                            '<img class="info__img" src="'+ item.links[0].href +'" data-index="'+ dataIndex +'" />' +
                            '</div>';
                        $(html).appendTo('.info__modal--content__row');

                        dataIndex++;
                    }
                });
                view.playSlides(s.slidePageNumber);
            },
            error: function(){
                console.log('error')
            }
        });
    },
    readTextFromSlideOnClick: function () {
        var textToRead = $('.slide__left .info__contents--title').text() + ',' + $('.slide__left .info__contents--content').text();
        s.artyom.say(textToRead);
    },
    readTextFromSlideOnVoice: function (i) {
        var textToRead = '';

        if (i === 0){
            textToRead = $('.slide__left .info__contents--title').text();
        }
        else{
            textToRead = $('.slide__left .info__contents--content').text();
        }

        s.artyom.say(textToRead);
    },
    shutDownVoiceControl: function (i) {
        s.artyom.fatality().then(function () {
            console.log("Artyom successfully stopped");
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
                action: view.changePage
            },
            {
                indexes: ['display *'],
                smart: true,
                action: view.displaySidebarItem
            },
            {
                indexes: ['images about *'],
                smart: true,
                action: view.displayImages
            },
            {
                indexes: ['view title', 'view content'],
                action: view.readTextFromSlideOnVoice
            },
            {
                indexes: ['shut down yourself'],
                action: view.shutDownVoiceControl
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
        view.bindActions();
        view.bindUIEvents();
    }
};

// $(function() {
//     server.init();
// });


$(window).on('load', function () {
    App.init();
});