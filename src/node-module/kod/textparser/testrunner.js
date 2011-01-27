// TODO: Use an async test framework. Vows?
// You should be able to run a single file that requires and runs all the tests from all tests

exports.run = function(tests){
	if (tests == null) throw new Error('no tests to run')
	var assert = require('assert')
	var testState
	var errors = []
	var passed = []
	
	for (var testName in tests) if (testName.indexOf('test') != -1){
		testState = {}
		console.log("\nBegin: "+testName)
		try {
			if (tests.setup) tests.setup.call(testState)
			tests[testName].call(testState, assert)
			passed.push(testName)
		}
		catch(e){
			console.error(e)
			errors.push(e)
		}
		finally {
			if (tests.teardown) tests.teardown.call(testState)
			testState = null
		}
		console.log("End: "+testName+"\n")
	}
	console.log
		(	"Passed: " + passed.length
		,	"Failed: " + errors.length
		)
	return errors.length
}
