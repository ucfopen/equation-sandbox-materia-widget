describe('latex parser', function(){
	var fs = require("fs");
	var PEG = require("pegjs");
	var grammar, parser;

	beforeAll(() => {
		var data = fs.readFileSync('src/peg/latex.pegjs');

		grammar = data.toString();
		parser = PEG.buildParser(grammar);
	});

	it('correctly parses a lot of equations', function(){
		// test parser
		function tp(input, expected) {
			var output = parser.parse(input);
			var fnLines = output.fn.toString().split("\n")
			var actual = fnLines.slice(2, fnLines.length - 1).join("\n").replace("return ", "").replace(/;/, '');

			expect(expected).toEqual(actual);
		}

		tp(
			"Y=1+2",
			"1+2"
		);
		tp(
			"Y=A/B+C",
			"A/B+C"
		);
		tp(
			"Y=\\sin(3+\\cos(a-4+2))",
			"Math.sin(3+Math.cos(a-4+2))"
		);
		tp(
			"Y=\\frac{b-a}{4}",
			"(b-a)/(4)"
		);
		tp(
			"Y=2+(3+x)",
			"2+(3+x)"
		);
		tp(
			"Y=3+\\sin(\\beta \\times 2)",
			"3+Math.sin($backslash_beta*2)"
		);
		tp(
			"Y=3(x)",
			"3*(x)"
		);
		tp(
			"Y=\\sin(x)+3",
			"Math.sin(x)+3"
		);
		tp(
			"Y=1+\\sin(x + \\cos(\\sin(y + 2)))",
			"1+Math.sin(x+Math.cos(Math.sin(y+2)))"
		);
		tp(
			"Y=1+\\sin(x)+4",
			"1+Math.sin(x)+4"
		);
		tp(
			"Y=1+2+3+4+5",
			"1+2+3+4+5"
		);
		tp(
			"Y=1+2+3+4+5+6",
			"1+2+3+4+5+6"
		);
		tp(
			"Y=\\sin(x)",
			"Math.sin(x)"
		);
		tp(
			"Y=\\sin(x)+1",
			"Math.sin(x)+1"
		);
		tp(
			"Y=\\sin(a) + \\sin(a-b*2) * \\frac{1}{2} + \\frac{3}{4} - 2 * 3",
			"Math.sin(a)+Math.sin(a-b*2)*(1)/(2)+(3)/(4)-2*3"
		);
		tp(
			"Y=3.14159+6.02",
			"3.14159+6.02"
		);
		tp(
			"Y=5*-1+2",
			"5*-1+2"
		);
		tp(
			"Y=5-\\sin(-1+2)",
			"5-Math.sin(-1+2)"
		);
		tp(
			"Y=-4",
			"-4"
		);
		tp(
			"Y=\\pi * e + \\infty",
			"Math.PI*Math.E+Infinity"
		);
		tp(
			"Y=x_2",
			"x_2"
		);
		tp(
			"Y=x_{k+1}",
			"x_$leftBracket_k$plus_1$rightBracket_"
		);
		tp(
			"Y=x^2",
			"Math.pow(x,2)"
		);
		tp(
			"Y=x^{\\cos(x)}",
			"Math.pow(x,Math.cos(x))"
		);
		tp(
			"Y=x^{y^z}",
			"Math.pow(x,Math.pow(y,z))"
		);
		tp(
			"Y=k_n^2",
			"Math.pow(k_n,2)"
		);
		tp(
			"Y=k^{22}",
			"Math.pow(k,22)"
		);
		tp(
			"Y=a_x_i",
			"a_x_i"
		);
		tp(
			"Y=x_{t_{y^a}}",
			"x_$leftBracket_t_$leftBracket_y$caret_a$rightBracket_$rightBracket_"
		);
		tp(
			"Y=x_{t_{y^2}}",
			"x_$leftBracket_t_$leftBracket_y$caret_2$rightBracket_$rightBracket_"
		);
		tp(
			"Y=\\sqrt{2}",
			"Math.sqrt(2)"
		);
		tp(
			"Y=\\sqrt{d^x}",
			"Math.sqrt(Math.pow(d,x))"
		);
		tp(
			"Y=4*ac",
			"4*a*c"
		);
		tp(
			"Y=4ac",
			"4*a*c"
		);
		tp(
			"Y=22*44",
			"22*44"
		);
		tp(
			"Y=b^2-x",
			"Math.pow(b,2)-x"
		);
		tp(
			"Y=\\frac{-b+\\sqrt{b^2-4ac}}{2a}",
			"(-b+Math.sqrt(Math.pow(b,2)-4*a*c))/(2*a)"
		);
		tp(
			"Y=\\frac{a}{\\frac{b}{c}}",
			"(a)/((b)/(c))"
		);
		tp(
			"Y=5!",
			"Math.factorial(5)"
		);
		tp(
			"Y=-5!",
			"-Math.factorial(5)"
		);
		tp(
			"Y=a'+a''",
			"a$prime_+a$prime_$prime_"
		);
		tp(
			"Y=\\binom{10}{2}",
			"Math.binom(10,2)"
		);
		tp(
			"Y=\\binom{x^2+b}{\\cos(b)}",
			"Math.binom(Math.pow(x,2)+b,Math.cos(b))"
		);
		tp(
			"Y=\\sin5",
			"Math.sin(5)"
		);
		tp(
			"Y=\\sin x",
			"Math.sin(x)"
		);
		tp(
			"Y=\\sin 5-\\cos x+12",
			"Math.sin(5)-Math.cos(x)+12"
		);
		tp(
			"Y=3^{4+2}+6",
			"Math.pow(3,4+2)+6"
		);
		tp(
			"Y=\\sin 5-\\cos x^2+12",
			"Math.sin(5)-Math.cos(Math.pow(x,2))+12"
		);
		tp(
			"Y=\\sin\\frac{1}{2}",
			"Math.sin((1)/(2))"
		);
		tp(
			"Y=\\frac{A}{B}+A^2",
			"(A)/(B)+Math.pow(A,2)"
		);
		tp(
			"Y=4(3)",
			"4*(3)"
		);
		tp(
			"Y=(4)3",
			"(4)*3"
		);
		tp(
			"Y=(4)(3)",
			"(4)*(3)"
		);
		tp(
			"Y=4(3)(2)",
			"4*(3)*(2)"
		);
		tp(
			"Y=((3))",
			"((3))"
		);
		tp(
			"Y=((3)(2))(4)",
			"((3)*(2))*(4)"
		);
		tp(
			"Y=\\left(5\\right)",
			"(5)"
		);
		tp(
			"Y=x\\sin5",
			"x*Math.sin(5)"
		);
		tp(
			"Y=5\\frac{a}{b}",
			"5*(a)/(b)"
		);
		tp(
			"Y=\\sin5\\frac{a}{b}",
			"Math.sin(5*(a)/(b))"
		);
		tp(
			"Y=\\sin5x^2",
			"Math.pow(Math.sin(5*x),2)"
		);
		tp(
			"y=aa^{2a^3}",
			"Math.pow(a*a,Math.pow(2*a,3))"
		);
		tp(
			"y=aa^2 \\cdot a^3",
			"Math.pow(a*a,2)*Math.pow(a,3)"
		);
		tp(
			"Y=((3+x)(2-y))(4*z)",
			"((3+x)*(2-y))*(4*z)"
		);
		tp(
			"Y=1+\\left( 2 \\right)",
			"1+(2)"
		);
		tp(
			"Y=4xy(3)",
			"4*x*y*(3)"
		);
		tp(
			"y=2x_{k-1}+3",
			"2*x_$leftBracket_k$minus_1$rightBracket_+3"
		);
		tp(
			"Y=\\sin3-9+x'_{i'_{r^3}}*9",
			"Math.sin(3)-9+x$prime__$leftBracket_i$prime__$leftBracket_r$caret_3$rightBracket_$rightBracket_*9"
		);
	});

});