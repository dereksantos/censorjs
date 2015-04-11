var assert = require("assert");
var profanity = require('../src/profanity.js');

describe('Profanity', function() {
	describe('#getVariants()', function() {
		var tests = [
			{word: 'test', expected:["+est","t3st","te5t","te$t","te&t","+3st","+e5t","+e$t","+e&t","+es+","+35t","+3$t","+3&t","+3s+","+35+","+3$+","+3&+","+e5+","+e$+","+e&+","t35t","t3$t","t3&t"]}
		];
		tests.forEach(function(test) {
			it('should return an array of variantions for the word '+test.word, function() {
				var actual = profanity.getVariants(test.word);
				var expected = test.expected;
				assert.equal(actual.length, expected.length);
				//sort and join results to facilitate comparison
				assert.equal(actual.sort().join(''), expected.sort().join(''));
			});
		});
	});
});