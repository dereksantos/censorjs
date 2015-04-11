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

var Censor = (function() {
	var locals = {
		defaultWords : ['test'],
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
		isString : function(obj) {
			var toString = Object.prototype.toString;
			return toString.call(obj) == '[object String]';
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

	var exports = {
		getVariants : function(word) {
			var output,variants;
			output = [];
			if (word && locals.isString(word)) {
				locals.eachChar(word, function(character) {
					variants = locals.letterVariants[character];
					if (variants && variants.length) {
						locals.each(variants, function(variant) {
							output.push(word.replace(character, variant));
						});
					}
				});
				if (output.length) {
					locals.each(output, function(item) {
						output = output.concat(exports.getVariants(item));
					});
					output = locals.unique(output);
				}
			} else {
				locals.warn("Censor.getVariants expected a string but got "+word);
			}
			return output;
		}
	};

	return exports;
}());

//Check if were in a CommonJS environment
if (module && module.exports) {
	module.exports = Censor;
}