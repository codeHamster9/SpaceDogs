angular.module('game.rooms').controller('ctrl.rooms', ['$scope',
    function($scope) {
        $scope.rooms = [{
            id: 22,
            players: [{
                name: 'idan',
                id: 1,
                scoe: 0
            }]
        }];
        $scope.selectedRoom = null;


    }
])
