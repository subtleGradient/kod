/*
---
name: plaintext.test
description: tests plaintext AST parsing for Kod

authors: Thomas Aylott <thomas@subtlegradient.com>
copyright: © 2011 Thomas Aylott
license: MIT
...
*/

var ptt = require('./sg-parser-testing-tools-for-kod')
var testrunner = require('./testrunner')

// //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  // //
var mockTests = {}
var mock

// //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  // //
mock = new ptt.Mock('one word')
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
mock = new ptt.Mock('two words')
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
mock = new ptt.Mock('3 paragraphs of words')
mockTests['test ' + mock.name] = mock
mock.setSource
('\
paragraph1 word2 word3 word4\n\
paragraph2 word2 word3 word4\n\
paragraph3 word2 word3 word4\
')
mock.setExpectedXML
(	"<root>"
+		"<text.paragraph>"
+			"<text.word>paragraph1</text.word> "
+			" "
+			"<text.word>word2</text.word>"
+			" "
+			"<text.word>word3</text.word>"
+			" "
+			"<text.word>word4</text.word>"
+			"\n"
+		"</text.paragraph>"
+		"<text.paragraph>"
+			"<text.word>paragraph2</text.word> "
+			" "
+			"<text.word>word2</text.word>"
+			" "
+			"<text.word>word3</text.word>"
+			" "
+			"<text.word>word4</text.word>"
+			"\n"
+		"</text.paragraph>"
+		"<text.paragraph>"
+			"<text.word>paragraph3</text.word> "
+			" "
+			"<text.word>word2</text.word>"
+			" "
+			"<text.word>word3</text.word>"
+			" "
+			"<text.word>word4</text.word>"
+		"</text.paragraph>"
+	"</root>"
)
// //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  // //
exports.run = function(){
	ptt.setParser(require('./plaintext').Parser)
	testrunner.run(mockTests)
}
// //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  // //
if (module.id == '.') process.exit(exports.run());
