/*
---
name: sg-parser-testing-tools
description: |
  SubtleGradient Parser Testing Tools
  help you write short, simple and implementation agnostic unit tests
  for syntax parsers of all sorts.
  
  Since each parser has its own API,
  we must convert their custom syntax object
  into something we can quickly write tests for.
  
  For SGPTT that standard format is an XML-like string.
  e.g. <root><paragraph><word>Hello</word>, <word>world</word>!</paragraph></root>

authors: Thomas Aylott <thomas@subtlegradient.com>
copyright: © 2011 Thomas Aylott
license: MIT
...
*/

/**
	ASTNode API
	  The specific properties that you expose on each ASTNode don't really matter
	since you can 'subclass' ParserMock and then override the default methods
	with custom methods that parse however you want.
	  But, if you stick to the default conventional ASTNode API defined in this file
	you won't have to implement anything yourself and stuff will 'Just Work.'
*/
exports.ASTNodeObjectInterfaceReference =
{
	/**
	REQUIRED
	The kind of node this is.
	e.g. paragraph, variable, punctuation definition string begin, etc...
	NOTE: The 'kind' property is currently used as-is in the 'XML' without any escaping
	
	In TextMate,
	scopes are vague on the left and more specific on the right.
	e.g.
	The scope "string.quoted.double.ruby"
	will match the selector "string.quoted" and "string.quoted.double"
	but won't match "quoted" or "quoted.string"
	
	In Espresso.app,
	scopes map more directly to the way CSS selectors work.
	e.g.
	The scope "string.quoted.double.ruby"
	will match the selector "string.quoted" and "string.quoted.double"
	as well as "quoted" and "quoted.string" and "ruby.string" and "string:not(.python)"
	*/
	kind: "my.fancy.scope.of.doom"

	/**
	REQUIRED
	Character offset from the beginning of the source text.
	NOTE: this offset is relative to the offset of the parentNode
	i.e. For "<p><w>Foo</w></p> <p><w>Bar</w></p>"
		both "w" nodes will have an offset of 0.
	*/
	,offset: 0

	/**
	REQUIRED
	The length of the text that this node is for.
	e.g. <node>Howdy</node> would have a length of 5 regardless of its offset
	*/
	,length: 5

	/**
	OPTIONAL
	The original text that this node describes.
	i.e. For the source "hi there", a node at {offset:0, length:2} would have the value "hi"
	NOTE: Since this is optional, the tests all need a source argument to be passed along
	so that they can lookup this value on the fly as needed.
	*/
	,value:"Howdy"

	/**
	OPTIONAL
	Fallback for the value property.
	If the value property doesn't exist
	and the getValue function does,
	its return value will be use as the value.
	*/
	,getValue: function(){return "Howdy"}

	/**
	OPTIONAL
	Your mom.
	The node whose childNodes collection contains this node.
	NOTE: This isn't currently used in SGPTT anywhere yet
	*/
	,parentNode:/*ASTNode*/{}

	/**
	OPTIONAL
	Your kids.
	The nodes whose parentNode is this node.
	NOTE: This can be an Array, but it doesn't have to be. You can also use a simple object with integer keys.
	Nothing in SGPTT relies on the childNodes object having a length or any methods at all.
	*/
	,childNodes:/*Object{Number:ASTNode}*/{}
}

// //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  // //

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
	var source, expected, actual
	if (t.expect instanceof Function) t.expect(5)
	t.ok(source = this.getSource())
	t.ok(this.getExpectedXML())
	t.equal
		(	actual = this.getActualTreeAsXML_withoutText()
		,	expected = this.getExpectedTreeAsXML_withoutText()
		,	this.Message.failedCompareWithoutText
			+	"\n\tSource: " + source
			// +	"\n\tActual: " + actual
			// +	"\n\tExpect: " + expected
		)
	t.equal
		(	actual = this.getActualTreeAsXML_withoutTextBetweenNodes()
		,	expected = this.getExpectedTreeAsXML_withoutTextBetweenNodes()
		,	this.Message.failedCompareWithoutTextBetweenNodes
			// +	"\n\tActual: " + actual
			// +	"\n\tExpect: " + expected
		)
	// FIXME: convertNodeToXML should include text that doesn't have any nodes
	// t.equal
	// 	(	actual = this.getActualTreeAsXML()
	// 	,	expected = this.getExpectedTreeAsXML()
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
	if (nodes) for (var i = -1, node; node = nodes[++i];)
		xml += this.convertNodeToXML(node, source)
	return xml
}

PMp.convertNodeToXML = function(node, source){
	// console.log(util.inspect(node,0,0))
	if (!node) throw new Error('missing node')
	if (!source) throw new Error('missing source')
	var xmlNodeName = node.kind || node.scope || node.nodeName
	if (!xmlNodeName) throw new Error('missing node name')
	var xml = ''
	xml += '<' + xmlNodeName + '>'
	
	if (node.childNodes)
		// The source for childNodes is restricted to the innards of the node.
		// Each node's offset is relative to the offset of its parent.
		xml += this.convertNodesToXML(node.childNodes, this.getValue_ofNode_withSource(node, source))
	else if (node.value != null)
		xml += node.value
	else if (node.getValue instanceof Function)
		xml += node.getValue()
	else
		xml += this.getValue_ofNode_withSource(node, source)
	
	xml += '</' + xmlNodeName + '>'
	return xml
}

PMp.getValue_ofNode_withSource = function(node, source){
	if (!node) throw new Error('missing node')
	if (!source) throw new Error('missing source')
	return source.substr
		(	node.offset
		,	node.length
		)
}

// //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  // //

function stripTextFromXMLString(xml){
	return String(xml).replace(/>[^><]+</g,'><')
}

function stripTextFromXMLStringBetweenTags(xml){
	return String(xml).replace(/(<\/[^>]+>)[^><]+(?=<)/g,'$1')
}
