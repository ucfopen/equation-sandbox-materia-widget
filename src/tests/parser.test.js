describe('latex parser', function(){
	var fs = require("fs");
	var PEG = require("pegjs");
	var grammar, parser;

	function tp(input, expected) {
		var output = parser.parse(input);
		var fnLines = output.fn.toString().split("\n")
		var actual = fnLines.slice(2, fnLines.length - 1).join("\n").replace("return ", "").replace(/;/, '');

		expect(expected).toEqual(actual);
	}

	beforeAll(() => {
		var data = fs.readFileSync('src/peg/latex.pegjs');

		grammar = data.toString();
		parser = PEG.buildParser(grammar);
	});

	test('parses equation 1', function(){
		tp(
			"Y=1+2",
			"1+2"
		);
	})

	test('parses equation 2', function(){
		tp(
			"Y=A/B+C",
			"A/B+C"
		);
	})

	test('parses equation 3', function(){
		tp(
			"Y=\\sin(3+\\cos(a-4+2))",
			"Math.sin(3+Math.cos(a-4+2))"
		);
	})

	test('parses equation 4', function(){
		tp(
			"Y=\\frac{b-a}{4}",
			"(b-a)/(4)"
		);
	})

	test('parses equation 5', function(){
		tp(
			"Y=2+(3+x)",
			"2+(3+x)"
		);
	})

	test('parses equation 6', function(){
		tp(
			"Y=3+\\sin(\\beta \\times 2)",
			"3+Math.sin($backslash_beta*2)"
		);
	})

	test('parses equation 7', function(){
		tp(
			"Y=3(x)",
			"3*(x)"
		);
	})

	test('parses equation 8', function(){
		tp(
			"Y=\\sin(x)+3",
			"Math.sin(x)+3"
		);
	})

	test('parses equation 9', function(){
		tp(
			"Y=1+\\sin(x + \\cos(\\sin(y + 2)))",
			"1+Math.sin(x+Math.cos(Math.sin(y+2)))"
		);
	})

	test('parses equation 10', function(){
		tp(
			"Y=1+\\sin(x)+4",
			"1+Math.sin(x)+4"
		);
	})

	test('parses equation 11', function(){
		tp(
			"Y=1+2+3+4+5",
			"1+2+3+4+5"
		);
	})

	test('parses equation 12', function(){
		tp(
			"Y=1+2+3+4+5+6",
			"1+2+3+4+5+6"
		);
	})

	test('parses equation 13', function(){
		tp(
			"Y=\\sin(x)",
			"Math.sin(x)"
		);
	})

	test('parses equation 14', function(){
		tp(
			"Y=\\sin(x)+1",
			"Math.sin(x)+1"
		);
	})

	test('parses equation 15', function(){
		tp(
			"Y=\\sin(a) + \\sin(a-b*2) * \\frac{1}{2} + \\frac{3}{4} - 2 * 3",
			"Math.sin(a)+Math.sin(a-b*2)*(1)/(2)+(3)/(4)-2*3"
		);
	})

	test('parses equation 16', function(){
		tp(
			"Y=3.14159+6.02",
			"3.14159+6.02"
		);
	})

	test('parses equation 17', function(){
		tp(
			"Y=5*-1+2",
			"5*-1+2"
		);
	})

	test('parses equation 18', function(){
		tp(
			"Y=5-\\sin(-1+2)",
			"5-Math.sin(-1+2)"
		);
	})

	test('parses equation 19', function(){
		tp(
			"Y=-4",
			"-4"
		);
	})

	test('parses equation 20', function(){
		tp(
			"Y=\\pi * e + \\infty",
			"Math.PI*Math.E+Infinity"
		);
	})

	test('parses equation 21', function(){
		tp(
			"Y=x_2",
			"x_2"
		);
	})

	test('parses equation 22', function(){
		tp(
			"Y=x_{k+1}",
			"x_$leftBracket_k$plus_1$rightBracket_"
		);
	})

	test('parses equation 23', function(){
		tp(
			"Y=x^2",
			"Math.pow(x,2)"
		);
	})

	test('parses equation 24', function(){
		tp(
			"Y=x^{\\cos(x)}",
			"Math.pow(x,Math.cos(x))"
		);
	})

	test('parses equation 25', function(){
		tp(
			"Y=x^{y^z}",
			"Math.pow(x,Math.pow(y,z))"
		);
	})

	test('parses equation 26', function(){
		tp(
			"Y=k_n^2",
			"Math.pow(k_n,2)"
		);
	})

	test('parses equation 27', function(){
		tp(
			"Y=k^{22}",
			"Math.pow(k,22)"
		);
	})

	test('parses equation 28', function(){
		tp(
			"Y=a_x_i",
			"a_x_i"
		);
	})

	test('parses equation 29', function(){
		tp(
			"Y=x_{t_{y^a}}",
			"x_$leftBracket_t_$leftBracket_y$caret_a$rightBracket_$rightBracket_"
		);
	})

	test('parses equation 30', function(){
		tp(
			"Y=x_{t_{y^2}}",
			"x_$leftBracket_t_$leftBracket_y$caret_2$rightBracket_$rightBracket_"
		);
	})

	test('parses equation 31', function(){
		tp(
			"Y=\\sqrt{2}",
			"Math.sqrt(2)"
		);
	})

	test('parses equation 32', function(){
		tp(
			"Y=\\sqrt{d^x}",
			"Math.sqrt(Math.pow(d,x))"
		);
	})

	test('parses equation 33', function(){
		tp(
			"Y=4*ac",
			"4*a*c"
		);
	})

	test('parses equation 34', function(){
		tp(
			"Y=4ac",
			"4*a*c"
		);
	})

	test('parses equation 35', function(){
		tp(
			"Y=22*44",
			"22*44"
		);
	})

	test('parses equation 36', function(){
		tp(
			"Y=b^2-x",
			"Math.pow(b,2)-x"
		);
	})

	test('parses equation 37', function(){
		tp(
			"Y=\\frac{-b+\\sqrt{b^2-4ac}}{2a}",
			"(-b+Math.sqrt(Math.pow(b,2)-4*a*c))/(2*a)"
		);
	})

	test('parses equation 38', function(){
		tp(
			"Y=\\frac{a}{\\frac{b}{c}}",
			"(a)/((b)/(c))"
		);
	})

	test('parses equation 39', function(){
		tp(
			"Y=5!",
			"Math.factorial(5)"
		);
	})

	test('parses equation 40', function(){
		tp(
			"Y=-5!",
			"-Math.factorial(5)"
		);
	})

	test('parses equation 41', function(){
		tp(
			"Y=a'+a''",
			"a$prime_+a$prime_$prime_"
		);
	})

	test('parses equation 42', function(){
		tp(
			"Y=\\binom{10}{2}",
			"Math.binom(10,2)"
		);
	})

	test('parses equation 43', function(){
		tp(
			"Y=\\binom{x^2+b}{\\cos(b)}",
			"Math.binom(Math.pow(x,2)+b,Math.cos(b))"
		);
	})

	test('parses equation 44', function(){
		tp(
			"Y=\\sin5",
			"Math.sin(5)"
		);
	})

	test('parses equation 45', function(){
		tp(
			"Y=\\sin x",
			"Math.sin(x)"
		);
	})

	test('parses equation 46', function(){
		tp(
			"Y=\\sin 5-\\cos x+12",
			"Math.sin(5)-Math.cos(x)+12"
		);
	})

	test('parses equation 47', function(){
		tp(
			"Y=3^{4+2}+6",
			"Math.pow(3,4+2)+6"
		);
	})

	test('parses equation 48', function(){
		tp(
			"Y=\\sin 5-\\cos x^2+12",
			"Math.sin(5)-Math.cos(Math.pow(x,2))+12"
		);
	})

	test('parses equation 49', function(){
		tp(
			"Y=\\sin\\frac{1}{2}",
			"Math.sin((1)/(2))"
		);
	})

	test('parses equation 50', function(){
		tp(
			"Y=\\frac{A}{B}+A^2",
			"(A)/(B)+Math.pow(A,2)"
		);
	})

	test('parses equation 51', function(){
		tp(
			"Y=4(3)",
			"4*(3)"
		);
	})

	test('parses equation 52', function(){
		tp(
			"Y=(4)3",
			"(4)*3"
		);
	})

	test('parses equation 53', function(){
		tp(
			"Y=(4)(3)",
			"(4)*(3)"
		);
	})

	test('parses equation 54', function(){
		tp(
			"Y=4(3)(2)",
			"4*(3)*(2)"
		);
	})

	test('parses equation 55', function(){
		tp(
			"Y=((3))",
			"((3))"
		);
	})

	test('parses equation 56', function(){
		tp(
			"Y=((3)(2))(4)",
			"((3)*(2))*(4)"
		);
	})

	test('parses equation 57', function(){
		tp(
			"Y=\\left(5\\right)",
			"(5)"
		);
	})

	test('parses equation 58', function(){
		tp(
			"Y=x\\sin5",
			"x*Math.sin(5)"
		);
	})

	test('parses equation 59', function(){
		tp(
			"Y=5\\frac{a}{b}",
			"5*(a)/(b)"
		);
	})

	test('parses equation 60', function(){
		tp(
			"Y=\\sin5\\frac{a}{b}",
			"Math.sin(5*(a)/(b))"
		);
	})

	test('parses equation 61', function(){
		tp(
			"Y=\\sin5x^2",
			"Math.pow(Math.sin(5*x),2)"
		);
	})

	test('parses equation 62', function(){
		tp(
			"y=aa^{2a^3}",
			"Math.pow(a*a,Math.pow(2*a,3))"
		);
	})

	test('parses equation 63', function(){
		tp(
			"y=aa^2 \\cdot a^3",
			"Math.pow(a*a,2)*Math.pow(a,3)"
		);
	})

	test('parses equation 64', function(){
		tp(
			"Y=((3+x)(2-y))(4*z)",
			"((3+x)*(2-y))*(4*z)"
		);
	})

	test('parses equation 65', function(){
		tp(
			"Y=1+\\left( 2 \\right)",
			"1+(2)"
		);
	})

	test('parses equation 66', function(){
		tp(
			"Y=4xy(3)",
			"4*x*y*(3)"
		);
	})

	test('parses equation 67', function(){
		tp(
			"y=2x_{k-1}+3",
			"2*x_$leftBracket_k$minus_1$rightBracket_+3"
		);
	})

	test('parses equation 68', function(){
		tp(
			"Y=\\sin3-9+x'_{i'_{r^3}}*9",
			"Math.sin(3)-9+x$prime__$leftBracket_i$prime__$leftBracket_r$caret_3$rightBracket_$rightBracket_*9"
		);
	})

});
