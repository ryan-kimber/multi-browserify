'use strict';

console.log("Into test-ng-module...");

var angular = require('angular'),
    testDirectiveModule = require('./test-directive/test-directive');

console.log("Angular is: ", angular);

console.log("Loaded testDirective module as: " + testDirectiveModule.name);

module.exports = angular.module('testNgModule',
    [
        'ui.bootstrap',
        testDirectiveModule.name
    ]
);


