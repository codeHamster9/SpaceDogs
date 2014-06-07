'use strict'
angular.module('game.browser').directive('getrigger', ['$rootScope',
    function($rootScope) {
        // Runs during compile
        return {
            // name: '',
            // priority: 1,
            // terminal: true,
            // scope: {
            //     background: '='
            // }, // {} = isolate, true = child, false/undefined = no change
            // controller: function($scope, $element, $attrs, $transclude) {
            //     this.background = "";
            // },
            // require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
            // restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
            // template: '',
            // templateUrl: '',
            // replace: true,
            // transclude: true,
            // compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
            link: function($scope, iElm, iAttrs, controller) {
                var ev = iAttrs.getrigger;

                iElm.bind(ev, handler.bind($scope));

                function handler(event) {
                    // body...
                    this.$parent.background = event.toElement.innerText;
                }
            }
        };
    }
]);
