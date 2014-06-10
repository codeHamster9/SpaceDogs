'use strict';
angular.module('game.rooms').controller('ctrl.rooms', ['$scope',
    '$route',
    'roomService',
    '$interval',
    '$window',
    'xsockets',
    function($scope, $route, roomService, $interval, $window, xsockets) {

        $scope.selectedRoom = null;
        $scope.rooms = roomService.getRooms($route.current.params.gameId);

        xsockets.subscribe('readySet', function() {
            console.log('Server confirms subscription!');
        }).delegate(function(data) {
            // attach the data to the $scope 
            $scope.selectedRoom.players[1].rdy = data;
        });

        $scope.roomEnter = function(room) {

            $scope.selectedRoom = room;

            var src = {
                rdy: false
            };
            var players = $scope.selectedRoom.players;

            angular.forEach(players, function(player, key) {
                angular.extend(player, src);
            });
        };

        $scope.roomExit = function(room) {


        };

        $scope.launchGame = function(roomId) {
            var counter = 10;

            function timer() {

                console.log(counter--);

                if (counter == 0) {
                    $window.location = 'http://localhost:52924/main.html';
                }
            }
            $interval(timer, 1000, 11);
        };

        $scope.onChange = function(player) {

            xsockets.publish('setReady', {
                    player: player
                },
                function() {
                    console.log('You just send some data to the contoller..');
                });
        };



        $scope.$on('$destroy', function() {
            // Make sure that the interval is destroyed too
            $interval.cancel();
        });

        $scope.$watch('selectedRoom.players', function(newVal, oldVal) {
            if (newVal) {
                var gameOn = true;

                angular.forEach(newVal, function(player, key) {
                    if (!player.rdy) {
                        gameOn = false;
                    }
                });

                if (gameOn) {

                    $scope.launchGame($scope.selectedRoom.id);
                }
            }
        }, true);

    }
]);
