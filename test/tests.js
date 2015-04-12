var assert = require("assert");
var censor = require('../src/censor.js');

var goodStrings = [
	'This should pass.',
	'Also pass this sentence.',
	'scone should pass',
	'Scone should pass'
];
var badStrings = [
	'one should fail',
	'one should one fail',
	'fail 0ne',
	'fail 0n3',
	'0n3 should fail',
	'fail one fail',
	'Should two fail.',
	'+w0 should fail',
	'two should fail',
	'fail two and two and +w0 and tw00wt tw0 two one'
];
var words = ['one', 'two', 'three'];

describe('Censor', function() {
	describe('getVariants()', function() {
		var tests = [
			{word: 'test', expected:["+est","t3st","te5t","te$t","te&t","+3st","+e5t","+e$t","+e&t","+es+","+35t","+3$t","+3&t","+3s+","+35+","+3$+","+3&+","+e5+","+e$+","+e&+","t35t","t3$t","t3&t"]}
		];
		tests.forEach(function(test) {
			it('should return an array of variantions for the word '+test.word, function() {
				var actual = censor.getVariants(test.word);
				var expected = test.expected;
				assert.equal(actual.length, expected.length);
				//sort and join results to facilitate comparison
				assert.equal(actual.sort().join(''), expected.sort().join(''));
			});
		});
	});
	
	describe('setWords()', function() {
		it('should set a list of words', function() {
			var expected = ["one","0ne","+ne","@ne","ne","on3","0n3","+n3","@n3","n3","two","+wo","t\\/\\/o","tw0","tw+","tw@","tw","+\\/\\/o","+w0","+w+","+w@","+w","+\\/\\/0","+\\/\\/+","+\\/\\/@","+\\/\\/","t\\/\\/0","t\\/\\/+","t\\/\\/@","t\\/\\/","three","+hree","t4ree","thee","thr3e","+4ree","+hee","+hr3e","+4ee","+4r3e","+43e","+433","+4r33","+h3e","+h33","+hr33","t4ee","t4r3e","t43e","t433","t4r33","th3e","th33","thr33"];
			censor.setWords(['one', 'two', 'three']);

			var actual = censor.getWords();
			assert.equal(actual.length, expected.length);
			assert.equal(actual.sort().join(''), expected.sort().join(''));
		});
	});

	describe('test()', function() {
		before(function() {
			censor.setWords(words);
		});
		goodStrings.forEach(function(str) {
			it('should return false for string: '+str, function() {
				assert.equal(censor.test(str), false);
			});
		});
		badStrings.forEach(function(str) {
			it('should return true for string: '+str, function() {
				assert.equal(censor.test(str), true);
			});
		});
	});

	describe('match()', function() {
		before(function() {
			censor.setWords(words);
		});
		goodStrings.forEach(function(str) {
			it('should return false for string: '+str, function() {
				assert.equal(censor.match(str), null);
			});
		});
		badStrings.forEach(function(str) {
			it('should return true for string: '+str, function() {
				assert.equal(censor.match(str), []);
			});
		});
	});


});