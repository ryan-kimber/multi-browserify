'use strict';
var $ = require('jquery');
var angular = require('angular'),
    ourNgModule = require('../src/our-ng-module');
console.log("Angular: ", angular);
console.log("Found ourNgModule: " + ourNgModule.name);
angular.module('thinkFormsDemo', [ourNgModule.name])
    .controller('testController', function($scope){
        $scope.variable = "hello world";
    });
