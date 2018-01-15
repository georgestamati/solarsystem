var commonStart = '<div class="loader hidden">' +
    '<div class="loader__wrapper">' +
    '<div class="loader__welcome welcome__message">Welcome to SolSys 3D</div>' +
    '<div class="loader__planet"></div>',
    commonEnd = '</div>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>',
    desktopLoader =
        '<div class="loader__welcome control__message">Control the app'+
        '<div class="loader__control-buttons">'+
        '<button type="button" name="local" data-attr="redirect__local" class="loader__control-button loader__local-control loader__wrapper--input">Local</button>'+
        '<button type="button" name="remote" data-attr="redirect__remote" class="loader__control-button loader__remote-control loader__wrapper--input">Remote</button>'+
        '</div>'+
        '<div class="loader__redirect redirect__local hidden">'+
        '<div class="loader__control-buttons">'+
        '<button type="button" name="" class="loader__local-button loader__wrapper--input">Go to app</button>'+
        '</div>'+
        '</div>'+
        '<div class="loader__redirect redirect__remote hidden">Insert the code in mobile browser'+
        '<div class="loader__control-buttons">'+
        '<button type="button" name="code" class="loader__remote-button loader__wrapper--input"></button>',
    mobileLoader =
        '<div class="loader__welcome control__message">'+
        '<div class="loader__redirect redirect__remote">Insert the code'+
        '<div class="loader__control-buttons">'+
        '<button type="button" name="" class="loader__local-button loader__wrapper--input">Go to app</button>'+
        '</div>',
    loader = {};

loader.desktopLoader = commonStart + desktopLoader + commonEnd;
loader.mobileLoader = commonStart + mobileLoader + commonEnd;

module.exports = loader;