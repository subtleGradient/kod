/*
---
name: sg-parser-testing-tools-for-kod
description: |
  Parser Testing Tools for Kod.app by SubtleGradient
  Extends sg-parser-testing-tools to handle testing Kod.app specific syntaxes parsers.

authors: Thomas Aylott <thomas@subtlegradient.com>
copyright: © 2011 Thomas Aylott
license: MIT
...
*/
var util = require('util')
var ptt = require('./sg-parser-testing-tools')
var kod_text_parser = require('./') // FIXME: Fix this path when moving these tools out of this folder

// //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  // //

exports.Mock = KodSyntaxMock

util.inherits(KodSyntaxMock, ptt.Mock)

function KodSyntaxMock(){
	ptt.Mock.apply(this, arguments)
}

KodSyntaxMock.prototype.getActualTree =
function KodSyntaxMock$getActualTree(){
	var source = this.getSource()
	var root = kod_text_parser.Parser.simulate('public.text', source, 0, source.length)
	var xml = this.convertNodeToXML(root, source)
	return xml
}

KodSyntaxMock.prototype.getValue_ofNode_withSource =
function KodSyntaxMock$getValue_ofNode_withSource(node, source){
	return source.substr
		(	node.sourceLocation
		,	node.sourceLength
		)
}

// //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  // //

exports.setParser = function(Parser){
	/**
		Disables all parsers except the one you pass in.
		This helps you be sure that you are only testing the exact parser that you want.
	*/
	kod_text_parser.unregisterAllParsers()
	kod_text_parser.registerParser(new Parser)
}
