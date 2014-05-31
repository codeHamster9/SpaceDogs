//'use strict'
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
            // require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
            // restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
            //template: '<img  src={{url}} ng-click="do({name:url})"></img>',
            // templateUrl: '',
            // replace: true,
            // transclude: true,
            // compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
            link: function($scope, iElm, iAttrs, controller) {
                _scope = $scope;
                _element = iElm;
                _attr = iAttrs;
                $scope.$on("triggered", function(ev, text) {
                    var callback = _attr.gelisten;
                    _element[0].src = _scope[callback].call(_scope, text);
                });
            }
        };
    }
);
