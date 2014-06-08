'use strict';

angular.module('gameEmpariumlobbyApp', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute',
    'game.browser',
    'game.rooms',
    'game.common',
    'xsockets.angular'

])
    .config(['$locationProvider', '$routeProvider', 'xsocketsProvider',
        function($locationProvider, $routeProvider, $xsocketsProvider) {

            $xsocketsProvider.setUrl("ws://localhost:4502/LobbyController");

            $routeProvider
                .when('/', {
                    templateUrl: 'views/browse.html',
                    controller: 'ctrl.browser'
                })
                .when('/rooms/:gameId', {
                    templateUrl: 'views/rooms.html',
                    controller: 'ctrl.rooms'
                })
                .otherwise({
                    redirectTo: '/'
                });
        }
    ]);
