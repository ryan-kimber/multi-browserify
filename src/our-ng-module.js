'use strict';

console.log("Into our-ng-module...");

var angular = require('angular'),
    testDirectiveModule = require('./test-directive/test-directive');

console.log("Angular is: ", angular);

console.log("Loaded testDirective module as: " + testDirectiveModule.name);

module.exports = angular.module('ourNgModule',
    [
        testDirectiveModule.name
    ]
);


