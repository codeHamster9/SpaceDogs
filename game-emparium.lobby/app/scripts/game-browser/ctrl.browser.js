'use strict';
angular.module('game.browser').controller('ctrl.browser',
    function($scope, $modal, $location, xsockets) {
        $scope.games = [{
            name: 'SpaceMadness',
            url: ''
        }, {
            name: 'Pac Man',
            url: 'mm'

        }, {
            name: 'Super Mario',
            url: 'http://upload.wikimedia.org/wikipedia/en/5/50/NES_Super_Mario_Bros.png'
        }, {
            name: 'Mega Man',
            url: 'https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcTBpsUrSWL3GFQyLeddw5nLpkQVxcFMBCP8vKY-tcsNvX4tbhV-'
        }];

        xsockets.onopen.then(function(data) {
            console.log("Connected", data);
        });

        $scope.background = {
            name: 'null',
            url: 'null'
        };

        $scope.setBackground = function(event) {
            var name = event.toElement.innerText;
            for (var i = $scope.games.length - 1; i >= 0; i--) {
                if ($scope.games[i].name === name) {
                    $scope.background = $scope.games[i];
                    $scope.$digest();
                }
            }
        };

        $scope.clickImage = function() {
            $location.path('/rooms/' + $scope.background.name);
        };


        var ModalInstanceCtrl = function($scope, $modalInstance, items, $interval) {

            $scope.ok = function() {
                $modalInstance.close();
            };

            $scope.cancel = function() {
                $modalInstance.dismiss('cancel');
            };
        };

        $scope.open = function(image) {

            var modalInstance = $modal.open({
                templateUrl: '/template/popup-login.html',
                controller: ModalInstanceCtrl,
                backdrop: true,
                resolve: {
                    items: function() {
                        return {
                            name: ''
                        };
                    }
                }
            });
        };
    }
);
