'use strict';

angular.module('gameEmpariumlobbyApp', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute',
    'game.browser',
    'game.rooms'

])
    .config(function($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'views/browse.html',
                controller: 'ctrl.browser'
            })
            .when('/rooms', {
                templateUrl: 'views/rooms.html',
                controller: 'ctrl.rooms'
            })

        .otherwise({
            redirectTo: '/'
        });
    });
