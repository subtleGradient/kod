/*
---
name: plaintext.test
description: tests plaintext parsing

authors: Thomas Aylott <thomas@subtlegradient.com>
copyright: © 2011 Thomas Aylott
license: MIT
...
*/

/**
	Each Editor has its own API for parsing stuff.
	This PLATFORM detection code allows you to pull in a different set of testing tools
	depending on the platform.
*/
var PLATFORM
// TODO: Improve the text editor playform detection. Is there a userAgent to sniff? ;)
if (function(){try{return global._kod || require('../').outsideOfKod }catch(e){}}()) PLATFORM = 'kod'
var ptt = require('./sg-parser-testing-tools' + (PLATFORM ? "-for-" + PLATFORM : ''))

// //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  // //

require('util').inherits(PlainTextMock, ptt.Mock)

function PlainTextMock(){
	ptt.Mock.apply(this, arguments)
}

var	Mock = PlainTextMock
,	mockTests = {}
,	mock

exports.run = function(){
	ptt.setParser(require('./plaintext').Parser)
	require('./testrunner').run(mockTests)
}


// //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  // //

mock = new Mock('one word')
mockTests['test ' + mock.name] = mock
mock.setSource("word")
mock.setExpectedXML
(	"<root>"
+		"<text.paragraph>"
+			"<text.word>word</text.word>"
+		"</text.paragraph>"
+	"</root>"
)


// //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  // //

mock = new Mock('two words')
mockTests['test ' + mock.name] = mock
mock.setSource("word1 word2")
mock.setExpectedXML
(	"<root>"
+		"<text.paragraph>"
+			"<text.word>word1</text.word>"
+			" "
+			"<text.word>word2</text.word>"
+		"</text.paragraph>"
+	"</root>"
)


// //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  // //

mock = new Mock('three paragraphs')
mockTests['test ' + mock.name] = mock
mock.setSource
('\
foo\n\
bar\n\
baz\
')
mock.setExpectedXML
(	"<root>"
+		"<text.paragraph>"
+			"<text.word>foo</text.word>"
+		"</text.paragraph>"
+		"\n"
+		"<text.paragraph>"
+			"<text.word>bar</text.word>"
+		"</text.paragraph>"
+		"\n"
+		"<text.paragraph>"
+			"<text.word>baz</text.word>"
+		"</text.paragraph>"
+	"</root>"
)


// //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  // //

mock = new Mock('three paragraphs of three words')
mockTests['test ' + mock.name] = mock
mock.setSource
('\
paragraph1 word2 word3\n\
paragraph2 word2 word3\n\
paragraph3 word2 word3\
')
mock.setExpectedXML
(	"<root>"
+		"<text.paragraph>"
+			"<text.word>paragraph1</text.word> "
+			" "
+			"<text.word>word2</text.word>"
+			" "
+			"<text.word>word3</text.word>"
+		"</text.paragraph>"
+		"\n"
+		"<text.paragraph>"
+			"<text.word>paragraph2</text.word> "
+			" "
+			"<text.word>word2</text.word>"
+			" "
+			"<text.word>word3</text.word>"
+		"</text.paragraph>"
+		"\n"
+		"<text.paragraph>"
+			"<text.word>paragraph3</text.word> "
+			" "
+			"<text.word>word2</text.word>"
+			" "
+			"<text.word>word3</text.word>"
+		"</text.paragraph>"
+	"</root>"
)


// //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  // //

if (module.id == '.') process.exit(exports.run());
