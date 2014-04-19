var angular = require('angular');
module.exports = angular.module('test.directive', [])
    .controller('TestDirectiveController', ['$scope', '$attrs', function($scope, $attrs){

    }])
    .directive('testDirective', function(){
        return {
            restrict: 'EA',
            controller: 'TestDirectiveController',
            template: '<div style="border: thin solid black; background-color: #AADDAA">This is the sample directive!</div>',
            replace: true,
            link: function(scope, element, attrs, ctrls){

            }
        };
    });