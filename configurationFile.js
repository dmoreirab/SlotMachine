exports.config = {
	//Selenium Server port		
	seleniumAdress: 'http://localhost:4444/wd/hub',
	
	//Suites to be executed
	suites: {
	//setup: './AutomatedTests/testSuiteSetup.js',
	specs: './AutomatedTests/SanityTestSuite.js'
	},

	//Testing framework used
	framework: 'jasmine',

	//SELENIUM_PROMISE_MANAGER: false,

	// Options to be passed to Jasmine-node.
	jasmineNodeOpts: {
		showColors: true,
		defaultTimeoutInterval: 100000,
		isVerbose: true
	}
};