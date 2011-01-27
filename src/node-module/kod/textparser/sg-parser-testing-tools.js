/*
---
name: sg-parser-testing-tools
description: Parser Testing Tools help you write short and simple unit tests for syntax parsers

authors: Thomas Aylott <thomas@subtlegradient.com>
copyright: © 2011 Thomas Aylott
license: MIT
...
*/

exports.Mock = ParserMock
function ParserMock(name){
	if (!(this instanceof ParserMock)) throw new Error("Usage: `new ParserMock(name)`");
	this.name = name
	this.call = this.call.bind(this)
}

var PMp = ParserMock.prototype

PMp.Message =
	{	failedCompare: "Must match unstripped mock"
	,	failedCompareWithoutText: "Must match stripped mock"
	,	failedCompareWithoutTextBetweenNodes: "Must match partially stripped mock"
	}

PMp.run = function ParserMock$run(t){
	var expected, actual
	if (t.expect instanceof Function) t.expect(5)
	t.ok(this.getSource())
	t.ok(this.getExpectedXML())
	t.equal
		(	expected = this.getExpectedTreeAsXML_withoutText()
		,	actual = this.getActualTreeAsXML_withoutText()
		,	this.Message.failedCompareWithoutText
			// +	"\n\tActual: " + actual
			// +	"\n\tExpect: " + expected
		)
	t.equal
		(	expected = this.getExpectedTreeAsXML_withoutTextBetweenNodes()
		,	actual = this.getActualTreeAsXML_withoutTextBetweenNodes()
		,	this.Message.failedCompareWithoutTextBetweenNodes
			// +	"\n\tActual: " + actual
			// +	"\n\tExpect: " + expected
		)
	// FIXME: convertNodeToXML should include unscoped text from the source
	// t.equal
	// 	(	expected = this.getExpectedTreeAsXML()
	// 	,	actual = this.getActualTreeAsXML()
	// 	,	this.Message.failedCompare
	// 		+	"\n\tActual: " + actual
	// 		+	"\n\tExpect: " + expected
	// 	)
	if (t.done instanceof Function) t.done()
}

PMp.call = function(thisArg, testApi){ return this.run(testApi) }

PMp.setSource = function(source){this.source = source}
PMp.getSource = function(){return this.source}

PMp.setExpectedXML = function(expectedXML){this.expectedXML = expectedXML}
PMp.getExpectedXML = function(){return this.expectedXML}

PMp.getExpectedTreeAsXML = function(){return this.expectedXML}
PMp.getExpectedTreeAsXML_withoutText = function(){return stripTextFromXMLString(this.getExpectedTreeAsXML())}
PMp.getExpectedTreeAsXML_withoutTextBetweenNodes = function(){return stripTextFromXMLStringBetweenTags(this.getExpectedTreeAsXML())}

// PMp.setActual = function(actual){this.actual = actual}
// PMp.getActual = function(){return this.actual}

PMp.getActualTree = function(){throw new Error('Not Implemented')}
PMp.getActualTreeAsXML = function(){return this.getActualTree()}
PMp.getActualTreeAsXML_withoutText = function(){return stripTextFromXMLString(this.getActualTreeAsXML())}
PMp.getActualTreeAsXML_withoutTextBetweenNodes = function(){return stripTextFromXMLStringBetweenTags(this.getActualTreeAsXML())}

// //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  // //

PMp.convertNodesToXML = function(nodes, source){
	if (!nodes) throw new Error('missing nodes')
	if (!source) throw new Error('missing source')
	var xml = ''
	if (nodes) for (var i = -1, node; node = nodes[++i];){
		xml += this.convertNodeToXML(node, source)
	}
	return xml
}

PMp.convertNodeToXML = function(node, source){
	// console.log(util.inspect(node,0,0))
	if (!node) throw new Error('missing node')
	if (!source) throw new Error('missing source')
	var xml = ''
	xml += '<' + node.kind + '>'

	if (node.childNodes)
		xml += this.convertNodesToXML(node.childNodes, source)
	else if (node.nodeValue != null)
		xml += node.nodeValue
	else if (node.getValue instanceof Function)
		xml += node.getValue()
	else
		xml += this.getValue_ofNode_withSource(node, source)

	xml += '</' + node.kind + '>'
	return xml
}

PMp.getValue_ofNode_withSource = function(node, source){
	if (!node) throw new Error('missing node')
	if (!source) throw new Error('missing source')
	return source.substr
		(	/*Espresso.app*/ node.offset	|| /*Kod.app*/ node.sourceLocation
		,	/*Espresso.app*/ node.length	|| /*Kod.app*/ node.sourceLength
		)
}

// //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  // //

function stripTextFromXMLString(xml){
	return String(xml).replace(/>[^><]+</g,'><')
}

function stripTextFromXMLStringBetweenTags(xml){
	return String(xml).replace(/(<\/[^>]+>)[^><]+(?=<)/g,'$1')
}
