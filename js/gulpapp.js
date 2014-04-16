'use strict';
var $ = require('jquery');
var angular = require('angular'),
    testModule = require('../src/test-ng-module');
console.log("Angular: ", angular);
console.log("Found testModule: " + testModule.name);
angular.module('thinkFormsDemo', [testModule.name])
    .controller('testController', function($scope){
        $scope.variable = "hello world";
    });
