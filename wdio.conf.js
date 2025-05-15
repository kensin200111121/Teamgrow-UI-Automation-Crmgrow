const { addContext, removeContext } = require('wdio-mochawesome-reporter').default;
const testStepDescriptions = require('./test/specs/setup/guide').testStepDescriptions;
const path = require('path');

const isVortex = require('./test/test-data/testdata').isVortex;

const suiteName = {
    "automation.js": "Automation",
    "bulkEmail.js": "Bulk Email",
    "calendar.js": "Calendar",
    "community.js": "Community",
    "contacts.js": "Contacts",
    "profileDashboard.js": "Profile & Dashboard",
    "leadHub.js": "Leadhub",
    "settings.js": "Settings",
    "dashboardTask.js": "Tasks Page",
    "templates.js": "Templates",
    "material.js": "Material",
    "pipeline.js": "Pipeline",
}

exports.config = {
    //
    // ====================
    // Runner Configuration
    // ====================
    // WebdriverIO supports running e2e tests as well as unit and component tests.
    runner: 'local',
    
    //
    // ==================
    // Specify Test Files
    // ==================
    // Define which test specs should run. The pattern is relative to the directory
    // of the configuration file being run.
    //
    // The specs are defined as an array of spec files (optionally using wildcards
    // that will be expanded). The test for each spec file will be run in a separate
    // worker process. In order to have a group of spec files run in the same worker
    // process simply enclose them in an array within the specs array.
    //
    // If you are calling `wdio` from an NPM script (see https://docs.npmjs.com/cli/run-script),
    // then the current working directory is where your `package.json` resides, so `wdio`
    // will be called from there.
    //
    specs: [
        './test/specs/**/*.js'
    ],
    suites: {
        loginout: [
            [
                './test/specs/login.js',
                './test/specs/logout.js'
            ]
        ],
        profileDashboard: [
            [
                './test/specs/login.js',
                './test/specs/setup/initData.js',
                './test/specs/profileDashboard.js',
                './test/specs/logout.js'
            ]
        ],
        dashboardTask: [
            [
                './test/specs/login.js',
                './test/specs/setup/initData.js',
                './test/specs/dashboardTask.js',
                './test/specs/logout.js'
            ]
        ],
        pipeline: [
            [
                './test/specs/login.js',
                './test/specs/setup/initData.js',
                './test/specs/pipeline.js',
                './test/specs/logout.js'
            ]
        ],
        material: [
            [
                './test/specs/login.js',
                './test/specs/setup/initData.js',
                './test/specs/material.js',
                './test/specs/logout.js'
            ]
        ],
        leadHub: [
            [
                './test/specs/login.js',
                './test/specs/setup/initData.js',
                './test/specs/leadHub.js',
                './test/specs/logout.js'
            ]
        ],
        contacts: [
            [
                './test/specs/login.js',
                './test/specs/setup/initData.js',
                './test/specs/contacts.js',
                './test/specs/logout.js'
            ]
        ],
        automation: [
            [
                './test/specs/login.js',
                './test/specs/setup/initData.js',
                './test/specs/automation.js',
                './test/specs/logout.js'
            ]
        ],
        bulkEmail: [
            [
                './test/specs/login.js',
                './test/specs/setup/initData.js',
                './test/specs/bulkEmail.js',
                './test/specs/logout.js'
            ]
        ],
        calendar: [
            [
                './test/specs/login.js',
                './test/specs/setup/initData.js',
                './test/specs/calendar.js',
                './test/specs/logout.js'
            ]
        ],
        community: [
            [
                './test/specs/login.js',
                './test/specs/setup/initData.js',
                './test/specs/community.js',
                './test/specs/logout.js'
            ]
        ],
        templates: [
            [
                './test/specs/login.js',
                './test/specs/setup/initData.js',
                './test/specs/templates.js',
                './test/specs/logout.js'
            ]
        ],
        settings: [
            [
                './test/specs/login.js',
                './test/specs/setup/initData.js',
                './test/specs/settings.js',
                './test/specs/logout.js'
            ]
        ],
        contact_list: [
            [
                './test/specs/login.js',
                './test/specs/contact_preference.js',
                './test/specs/contact_list.js',
                './test/specs/logout.js'
            ]
        ],
        contact_detail: [
            [
                './test/specs/login.js',
                './test/specs/contact_detail.js',
                './test/specs/logout.js'
            ]
        ],
        e2e: [
            !isVortex ? [
                './test/specs/login.js',
                './test/specs/setup/initData.js',
                './test/specs/profileDashboard.js',
                './test/specs/dashboardTask.js',
                './test/specs/pipeline.js',
                './test/specs/material.js',
                './test/specs/leadHub.js',
                './test/specs/contacts.js',
                './test/specs/automation.js',
                './test/specs/bulkEmail.js',
                './test/specs/calendar.js',
                './test/specs/community.js',
                './test/specs/templates.js',
                './test/specs/settings.js',
                './test/specs/logout.js'
            ] :
            [
                './test/specs/login.js',
                './test/specs/setup/initData.js',
                './test/specs/dashboardTask.js',
                './test/specs/pipeline.js',
                './test/specs/material.js',
                //'./test/specs/leadHub.js',
                './test/specs/contacts.js',
                './test/specs/automation.js',
                './test/specs/calendar.js',
                './test/specs/community.js',
                './test/specs/templates.js',
                './test/specs/settings.js',
                './test/specs/logout.js'
            ]
        ]
    },
    // Patterns to exclude.
    exclude: [
        // 'path/to/excluded/files'
    ],
    //
    // ============
    // Capabilities
    // ============
    // Define your capabilities here. WebdriverIO can run multiple capabilities at the same
    // time. Depending on the number of capabilities, WebdriverIO launches several test
    // sessions. Within your capabilities you can overwrite the spec and exclude options in
    // order to group specific specs to a specific capability.
    //
    // First, you can define how many instances should be started at the same time. Let's
    // say you have 3 different capabilities (Chrome, Firefox, and Safari) and you have
    // set maxInstances to 1; wdio will spawn 3 processes. Therefore, if you have 10 spec
    // files and you set maxInstances to 10, all spec files will get tested at the same time
    // and 30 processes will get spawned. The property handles how many capabilities
    // from the same test should run tests.
    //
    maxInstances: 10,
    //
    // If you have trouble getting all important capabilities together, check out the
    // Sauce Labs platform configurator - a great tool to configure your capabilities:
    // https://saucelabs.com/platform/platform-configurator
    //
    
    // services: ['chromedriver'], 

    capabilities: [{
        // capabilities for local browser web tests
        maxInstances: 10,
        browserName: 'chrome',
        'goog:chromeOptions': {
            args: [
                // '--headless=true',
                // '--disable-gpu',
                '--no-sandbox',
                '--disable-web-security',
                '--window-size=1920,1280',
                '--ignore-autocomplete-off-autofill'
            ],
            // extensions: [chromeModHeader.getEncodedExtension()]
        },
        acceptInsecureCerts: true
    }],

    // ===================
    // Test Configurations
    // ===================
    // Define all options that are relevant for the WebdriverIO instance here
    //
    // Level of logging verbosity: trace | debug | info | warn | error | silent
    logLevel: 'error',
    //
    // Set specific log levels per logger
    // loggers:
    // - webdriver, webdriverio
    // - @wdio/browserstack-service, @wdio/devtools-service, @wdio/sauce-service
    // - @wdio/mocha-framework, @wdio/jasmine-framework
    // - @wdio/local-runner
    // - @wdio/sumologic-reporter
    // - @wdio/cli, @wdio/config, @wdio/utils
    // Level of logging verbosity: trace | debug | info | warn | error | silent
    // logLevels: {
    //     webdriver: 'info',
    //     '@wdio/appium-service': 'info'
    // },
    //
    // If you only want to run your tests until a specific amount of tests have failed use
    // bail (default is 0 - don't bail, run all tests).

    bail: 0,

    //
    // Set a base URL in order to shorten url command calls. If your `url` parameter starts
    // with `/`, the base url gets prepended, not including the path portion of your baseUrl.
    // If your `url` parameter starts without a scheme or `/` (like `some/path`), the base url
    // gets prepended directly.
    // baseUrl: 'http://localhost',
    //
    // Default timeout for all waitFor* commands.
    waitforTimeout: 20000,
    //
    // Default timeout in milliseconds for request
    // if browser driver or grid doesn't send response
    connectionRetryTimeout: 120000,
    //
    // Default request retries count
    connectionRetryCount: 3,
    //
    // Test runner services
    // Services take over a specific job you don't want to take care of. They enhance
    // your test setup with almost no effort. Unlike plugins, they don't add new
    // commands. Instead, they hook themselves up into the test process.
    
    // Framework you want to run your specs with.
    // The following are supported: Mocha, Jasmine, and Cucumber
    // see also: https://webdriver.io/docs/frameworks
    //
    // Make sure you have the wdio adapter package for the specific framework installed
    // before running any tests.
    framework: 'mocha',
    //
    // The number of times to retry the entire specfile when it fails as a whole
    // specFileRetries: 1,
    //
    // Delay in seconds between the spec file retry attempts
    // specFileRetriesDelay: 0,
    //
    // Whether or not retried spec files should be retried immediately or deferred to the end of the queue
    // specFileRetriesDeferred: false,
    //
    // Test reporter for stdout.
    // The only one supported by default is 'dot'
    // see also: https://webdriver.io/docs/dot-reporter

    reporters: [
        [
            'spec',
            {
                // symbols: { passed: '[PASS]', failed: '[FAIL]' },
                realtimeReporting: true,
                addConsoleLogs: true,
            }
        ],
        [
            'mochawesome',
            {
                outputDir: './report/mochawesome',
                outputFileFormat: (opts) => {
                    return `results.json`
                }
            }
        ]
    ],

    //
    // Options to be passed to Mocha.
    // See the full list at http://mochajs.org/
    mochaOpts: {
        ui: 'bdd',
        timeout: 600000,
        bail: 0
    },
    //
    // =====
    // Hooks
    // =====
    // WebdriverIO provides several hooks you can use to interfere with the test process in order to enhance
    // it and to build services around it. You can either apply a single function or an array of
    // methods to it. If one of them returns with a promise, WebdriverIO will wait until that promise got
    // resolved to continue.
    /**
     * Gets executed once before all workers get launched.
     * @param {object} config wdio configuration object
     * @param {Array.<Object>} capabilities list of capabilities details
     */
    onPrepare: function (config, capabilities) {

    },
    /**
     * Gets executed before a worker process is spawned and can be used to initialise specific service
     * for that worker as well as modify runtime environments in an async fashion.
     * @param  {string} cid      capability id (e.g 0-0)
     * @param  {object} caps     object containing capabilities for session that will be spawn in the worker
     * @param  {object} specs    specs to be run in the worker process
     * @param  {object} args     object that will be merged with the main configuration once worker is initialized
     * @param  {object} execArgv list of string arguments passed to the worker process
     */
    // onWorkerStart: function (cid, caps, specs, args, execArgv) {
    // },
    /**
     * Gets executed just after a worker process has exited.
     * @param  {string} cid      capability id (e.g 0-0)
     * @param  {number} exitCode 0 - success, 1 - fail
     * @param  {object} specs    specs to be run in the worker process
     * @param  {number} retries  number of retries used
     */
    // onWorkerEnd: function (cid, exitCode, specs, retries) {
    // },
    /**
     * Gets executed just before initialising the webdriver session and test framework. It allows you
     * to manipulate configurations depending on the capability or spec.
     * @param {object} config wdio configuration object
     * @param {Array.<Object>} capabilities list of capabilities details
     * @param {Array.<String>} specs List of spec file paths that are to be run
     * @param {string} cid worker id (e.g. 0-0)
     */
    // beforeSession: function (config, capabilities, specs, cid) {
    // },
    /**
     * Gets executed before test execution begins. At this point you can access to all global
     * variables like `browser`. It is the perfect place to define custom commands.
     * @param {Array.<Object>} capabilities list of capabilities details
     * @param {Array.<String>} specs        List of spec file paths that are to be run
     * @param {object}         browser      instance of created browser/device session
     */
    before: function (capabilities, specs) {
        // const { $ } = require('webdriverio/build/commands/browser');
        browser.addLocatorStrategy('closest', dom => {
            return dom.closest('tr');
        })
        browser.addLocatorStrategy('closest_checkbox', dom => {
            return dom.closest('div.custom-checkbox');
        })
        browser.addLocatorStrategy('closest_tag-item', dom => {
            return dom.closest('div.tag-item');
        })
        browser.addLocatorStrategy('closest_label-item', dom => {
            return dom.closest('div.label-item');
        })
        browser.addLocatorStrategy('closest_field-item', dom => {
            return dom.closest('div.field-item');
        })
        browser.addLocatorStrategy('closest_form', dom => {
            return dom.closest('div.form-detail');
        })
        browser.addLocatorStrategy('closest_event', dom => {
            return dom.closest('div.event-type');
        })
    },
    /**
     * Runs before a WebdriverIO command gets executed.
     * @param {string} commandName hook command name
     * @param {Array} args arguments that command would receive
     */
    // beforeCommand: function (commandName, args) {
    // },
    /**
     * Hook that gets executed before the suite starts
     * @param {object} suite suite details
     */
    // beforeSuite: function (suite) {
    // },
    /**
     * Function to be executed before a test (in Mocha/Jasmine) starts.
     */
    // beforeTest: function (test, context) {
    // },
    /**
     * Hook that gets executed _before_ a hook within the suite starts (e.g. runs before calling
     * beforeEach in Mocha)
     */
    // beforeHook: function (test, context) {
    // },
    /**
     * Hook that gets executed _after_ a hook within the suite starts (e.g. runs after calling
     * afterEach in Mocha)
     */
    // afterHook: function (test, context, { error, result, duration, passed, retries }) {
    // },
    /**
     * Function to be executed after a test (in Mocha/Jasmine only)
     * @param {object}  test             test object
     * @param {object}  context          scope object the test was executed with
     * @param {Error}   result.error     error object in case the test fails, otherwise `undefined`
     * @param {*}       result.result    return object of test function
     * @param {number}  result.duration  duration of test
     * @param {boolean} result.passed    true if test has passed, otherwise false
     * @param {object}  result.retries   informations to spec related retries, e.g. `{ attempts: 0, limit: 0 }`
     */
    afterTest: async function(test, context, { error, result, duration, passed, retries }) {
       const fileName = Date.now() + '.png'
       await browser.saveScreenshot('./mochawesome-report/screenshots/' + fileName);
       
       removeContext();

       let testFileName = path.basename(test.file).toString();
       testFileNamePattern = testFileName.split('/');
       testFileName = testFileNamePattern[testFileNamePattern.length - 1];
       if(!passed) {
            addContext(`Test Suite: ${suiteName[testFileName]}`);
       }

       addContext('screenshots/' + fileName);

       title = test.title;
       const digitPattern = /^\d+$/;
       
       if(digitPattern.test(title)) {
            title = test.parent + " " + title;
       }

       if(testStepDescriptions[title]) {
            const steps = testStepDescriptions[title];
            addContext("Test Step for: " + title + "\n");
            steps.forEach(step => {
                addContext(step + "\n");
            });
       }
    },

    /**
     * Hook that gets executed after the suite has ended
     * @param {object} suite suite details
     */
    // afterSuite: function (suite) {
    // },
    /**
     * Runs after a WebdriverIO command gets executed
     * @param {string} commandName hook command name
     * @param {Array} args arguments that command would receive
     * @param {number} result 0 - command success, 1 - command error
     * @param {object} error error object if any
     */
    // afterCommand: function (commandName, args, result, error) {
    // },
    /**
     * Gets executed after all tests are done. You still have access to all global variables from
     * the test.
     * @param {number} result 0 - test pass, 1 - test fail
     * @param {Array.<Object>} capabilities list of capabilities details
     * @param {Array.<String>} specs List of spec file paths that ran
     */
    // after: function (result, capabilities, specs) {
    // },
    /**
     * Gets executed right after terminating the webdriver session.
     * @param {object} config wdio configuration object
     * @param {Array.<Object>} capabilities list of capabilities details
     * @param {Array.<String>} specs List of spec file paths that ran
     */
    // afterSession: function (config, capabilities, specs) {
    // },
    /**
     * Gets executed after all workers got shut down and the process is about to exit. An error
     * thrown in the onComplete hook will result in the test run failing.
     * @param {object} exitCode 0 - success, 1 - fail
     * @param {object} config wdio configuration object
     * @param {Array.<Object>} capabilities list of capabilities details
     * @param {<Object>} results object containing test results
     */
    onComplete: function(exitCode, config, capabilities, results) {
        // console.log('completed');
        // const mergeResults = require('wdio-mochawesome-reporter/mergeResults');
        // mergeResults('./report/mochawesome', 'results-*');
    },
    /**
    * Gets executed when a refresh happens.
    * @param {string} oldSessionId session ID of the old session
    * @param {string} newSessionId session ID of the new session
    */
    // onReload: function(oldSessionId, newSessionId) {
    // }
}
