require(['jasmine', 'jasmineRequire', 'jasmine-html', 'jquery'],
function (jasmine, jasmineRequire, jasmineHtml, $) {
    jasmineRequire.html(jasmine);

    var env = jasmine.getEnv();
    env.updateInterval = 1000;

    window.jasmine = jasmine;
    jasmine.addMatchers = function () {
        return env.addMatchers.apply(env, arguments);
    }

    /**
    * ## Runner Parameters
    *
    * More browser specific code - wrap the query string in an object and to allow for getting/setting parameters from the runner user interface.
    */

    var queryString = new jasmine.QueryString({
        getWindowLocation: function() { return window.location; }
    });

    var catchingExceptions = queryString.getParam("catch");
    env.catchExceptions(typeof catchingExceptions === "undefined" ? true : catchingExceptions);

    var throwingExpectationFailures = queryString.getParam("throwFailures");
    env.throwOnExpectationFailure(throwingExpectationFailures);


    // HTMLReporter
    var htmlReporter = new jasmine.HtmlReporter({
        env: env,
        onRaiseExceptionsClick: function() { queryString.navigateWithNewParam("catch", !env.catchingExceptions()); },
        onThrowExpectationsClick: function() { queryString.navigateWithNewParam("throwFailures", !env.throwingExpectationFailures()); },
        addToExistingQueryString: function(key, value) { return queryString.fullStringWithNewParam(key, value); },
        getContainer: function() { return document.body; },
        createElement: function() { return document.createElement.apply(document, arguments); },
        createTextNode: function() { return document.createTextNode.apply(document, arguments); },
        timer: new jasmine.Timer()
    });
	env.addReporter(htmlReporter);

    /**
    * Filter which specs will be run by matching the start of the full name against the `spec` query param.
    */
    var specFilter = new jasmine.HtmlSpecFilter({
        filterString: function() { return queryString.getParam("spec"); }
    });

    env.specFilter = function(spec) {
        return specFilter.matches(spec.getFullName());
    };

    /**
    * ## The Global Interface
    *
    * Build up the functions that will be exposed as the Jasmine public interface. A project can customize, rename or alias any of these functions as desired, provided the implementation remains unchanged.
    */
    var jasmineInterface = jasmineRequire.interface(jasmine, env);

    /**
    * Add all of the Jasmine global/public interface to the global scope, so a project can use the public interface directly. For example, calling `describe` in specs instead of `jasmine.getEnv().describe`.
    */
    extend(window, jasmineInterface);

    require([
        'tests/spec/wall-view',
        'tests/spec/wall-component',
        'tests/spec/main',
        'tests/spec/wall-header-view'
    ], function(){
        $(function(){
            htmlReporter.initialize()
            env.execute();
        });
    });

    /**
     * Helper function for readability above.
     */
    function extend(destination, source) {
        for (var property in source) destination[property] = source[property];
        return destination;
    }

});
