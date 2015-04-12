var assert = require("assert");
var censor = require('../src/censor.js');

describe('Censor', function() {
	describe('#getVariants()', function() {
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
	describe('#test()', function() {
		var goodStrings = [
			'This should pass.',
			'Also pass this sentence.',
			'scone should pass',
			'Scone should pass'
		];
		var badStrings = [
			'one should fail',
			'fail 0ne',
			'fail 0n3',
			'fail one fail',
			'Should two fail.',
			'+w0 should fail',
			'one should one fail'
		];
		before(function() {
			censor.setWords(['one','two','three']);
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
});