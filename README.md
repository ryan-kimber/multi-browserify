Trying to build multi-deliverables with a browserify-based build
===================================================================================

It's becoming commonplace for AngularJS and other single-page-application-style frameworks to bundle their JavaScript up in few different ways, even within a single project.

The objective of this project is to produce/handle the following:

    - AngularJS and JQuery javascript files loaded via CDN
    - A vendor-concat.js containing all of the other 3rd-party javascript (not available via CDN)
    - A distributable .js file (our-ng-module.js & our-ng-module.min.js)
    - A single-page application demonstrating the use of our-ng-module.js (HTML & demo-app.js)

For simplification, we've removed the the minification/uglification - just trying to keep it barebones to get something working.

To build and run the project, clone this repo, then run the following commands:

    - npm install
    - npm install -g gulp
    - gulp

You'll then be able to access the application at http://localhost:4000

What we'd expect, is a page that says:
    
    Build with Browserify & Gulp
    A working version will display 'Hello World' to the right (not handlebars): Hello World
    A working version will also display 'JQuery' to the right: JQuery

Instead, we get the following:

    Build with Browserify & Gulp
    A working version will display 'Hello World' to the right (not handlebars): {{ variable }}
    A working version will also display 'JQuery' to the right: 

With the following errors in the console:

    Uncaught Error: Cannot find module 'angular'
    Uncaught Error: Cannot find module 'jquery'
    ...and an angular instantiation error related to not finding a dependency.
