/**
 * game.rooms Module
 *
 * Description
 */
'use strict';
angular.module('game.rooms').service('roomService', ['$http',
    function($http) {
        var rooms;
        this.getRooms = function(gameName) {

            return rooms = [{
                    name: 'pumpStomp',
                    id: 22,
                    players: [{
                        id: 1,
                        name: 'idan',
                        rank: 19009
                    }, {
                        id: 1,
                        name: 'avivit',
                        rank: 17009
                    }]
                }

            ];
        };
    }
]);
