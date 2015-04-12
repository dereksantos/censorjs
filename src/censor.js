/*
CensorJS v1.0.0

The MIT License (MIT)

Copyright (c) 2015 dereksantos

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

/** @namespace */
var Censor = (function() {
	var utils = {
		toString : Object.prototype.toString,
		isString : function(obj) {
			return utils.toString.call(obj) == '[object String]';
		},
		isArray : Array.isArray || function(obj) {
    		return utils.toString.call(obj) === '[object Array]';
  		},
		unique : function(arr) {
			var o = {}, i, l = arr.length, r = [];
			for(i=0; i<l;i+=1){o[arr[i]] = arr[i];}
			for(i in o){r.push(o[i]);}
			return r;
		},
		each : function(arr, fn) {
			var i, l = arr.length;
			for(i = 0; i < l; i++) {
				fn(arr[i], i);
			}
		},
		eachChar : function(str, fn) {
			var i, l = str.length;
			for(i = 0; i < l; i++) {
				fn(str.charAt(i), i);
			}
		},
		warn : function(msg) {
			if (console && console.warn) {
				console.warn(msg);
			}
		}
	};

	var impl = {
		words : [],
		letterVariants : {
			'a' : ['4','@'],
			'b' : ['8'],
			'c' : ['(','{','[','<'],
			'd' : ['6'],
			'e' : ['3'],
			'f' : ['+','='],
			'g' : ['4'],
			'h' : ['4'],
			'i' : ['1','|','!'],
			'j' : ['7'],
			'k' : ['|<', '|(', ''],
			'l' : ['1', '!', '|'],
			'm' : [],
			'n' : [],
			'o' : ['0','+','@',''],
			'p' : ['9'],
			'q' : ['7','&'],
			'r' : [''],
			's' : ['5','$','&'],
			't' : ['+'],
			'u' : [],
			'v' : ['\\/'],
			'w' : ['\\/\\/'],
			'x' : ['+'],
			'y' : [],
			'z' : ['7']
		},
		leftMatcher : '(^|\\s)',
		rightMatcher : '($|\\s)',
		getVariants : function(word) {
			var output,variants;
			output = [];
			if (word && utils.isString(word)) {
				utils.eachChar(word, function(character) {
					variants = impl.letterVariants[character];
					if (variants && variants.length) {
						utils.each(variants, function(variant) {
							output.push(word.replace(character, variant));
						});
					}
				});
				if (output.length) {
					utils.each(output, function(item) {
						output = output.concat(impl.getVariants(item));
					});
					output = utils.unique(output);
				}
			} else {
				utils.warn("Censor.getVariants expected a string but got " + word);
			}
			return output;
		},
		setWords : function(words) {
			if (words && utils.isArray(words)) {
				var arr = [];
				utils.each(words, function(word) {
					arr.push(word);
					arr = arr.concat(impl.getVariants(word));
				});
				arr = utils.unique(words);
				impl.words = arr;
			} else {
				utils.warn("Censor.setWords expected an array but got " + words.toString() + ". This call will be ignored.");
			}
		},
		regex : function() {
			var joinString = [')',impl.rightMatcher, '|', impl.leftMatcher,'('].join('');
			var words = impl.words.join('sSPLITs');
			words = words.replace(/([\~\`\!\@\#\$\%\^\&\*\(\)\_\-\+\=\{\}\|\[\]\\\;\:\'\"\,\.\/\<\>\?])/gi, '\\$1');
			words = words.split('sSPLITs');
			words = words.join(joinString);
			var regexString = ['/',impl.leftMatcher,'(',words,')',impl.rightMatcher,'/'].join('');
			console.log(regexString);
			return new RegExp(regexString, 'gi');
		}
	};

	var api = {
		/**
		 * Instructs the library to use the specified array of strings as the words
		 * to validate or match against. Note that Censor.getVariants will be called on 
		 * each word.
		 *
		 * @param {array} words - The words desired for use when matching or validating.
		 * @memberof Censor
		 * @function
		 */
		setWords : impl.setWords,
		/**
		 * Returns a list of word variations spelt using symbols resembling it's characters.
		 * For example the word <b>test</b> can be spelt as <b>t3s+</b> or <b>te$t</b>.
		 * 
		 * This is used to generate a comprehensive array of strings to validate against without
		 * having to explicity provide every possible variation.
		 *
		 * @param {string} word - A single word to return variantions for.
		 * @memberof Censor
		 * @function
		 */
		getVariants : impl.getVariants,
		/**
		 * Returns true if the specified string contains any words that match
		 * the list of words set with setWords. 
		 * 
		 * @param {string} str - The string to test against
		 * @memberof Censor
		 */
		test : function(str) {
			return impl.regex().test(str);
		},
		match : function(str) {
			return str.match(impl.regex());
		}
	};

	return api;
}());

//Check if were in a CommonJS environment
if (module && module.exports) {
	module.exports = Censor;
}