var angular = require('angular');
module.exports = angular.module('test.directive', [])
    .controller('TestDirectiveController', ['$scope', '$attrs', function($scope, $attrs){

    }])
    .directive('testDirective', function(){
        return {
            restrict: 'EA',
            scope: {
                text: '@'
            },
            controller: 'TestDirectiveController',
            templateUrl: 'src/test-directive/test-directive.tpl.html',
            replace: true,
            link: function(scope, element, attrs, ctrls){

            }
        };
    });