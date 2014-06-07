'use strict'
angular.module('game.browser').directive('gelisten',
    function() {
        var _scope,
            _element,
            _attr;
        // Runs during compile
        return {
            // name: '',
            // priority: 1,
            // terminal: true,
            // scope: {
            //     // do :'&',
            //     background: '@'
            // }, // {} = isolate, true = child, false/undefined = no change
            // controller: function($scope, $element, $attrs, $transclude) {},
            // require: '^getrigger', // Array = multiple requires, ? = optional, ^ = check parent elements
            // restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
            //template: '<img  src={{url}} ng-click="do({name:url})"></img>',
            // templateUrl: '',
            // replace: true,
            // transclude: true,
            // compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
            link: function($scope, iElm, iAttrs, controller) {

                $scope.$watch('background', function(newValue, oldValue) {

                    console.log(newValue, oldValue);
                })
            }
        };
    }
);
