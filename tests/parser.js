var fs = require("fs");
var PEG = require("pegjs");

Math.factorial = function(n)
{
	if(n < 0) return 0;

	switch(n)
	{
		case 0: return 0
		case 1: return 1
	}

	return n * Math.factorial(n - 1);
}

Math.binom = function(top, bottom)
{
	return Math.factorial(top) / (Math.factorial(bottom) * Math.factorial(top - bottom));
}


fs.readFile('../src/peg/latex.peg', function(err, data) {
	var grammar = data.toString();

	//console.log(grammar);

	var parser = PEG.buildParser(grammar);

	//var input = "\\sin #A + \\sin(#A-#B*2) * \\frac{1}{2} + \\frac{3}{4} - 2 * 3";
	//var input = "\\frac{#B}{\\sqrt{\\frac{#A}{4.9}}}";
	//var input = "\\frac{#B}{\\sqrt{2}}";
	//var input = "\\frac{%A}{%B}";

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
	// tp(
	// 	"\\funtime(3)",
	// 	"__unknown_function['\\funtime'](3)"
	// );
	tp(
		"Y=2+(3+x)",
		"2+(3+x)"
	);
	tp(
		"Y=3+\\sin(\\beta \\times 2)",
		"3+Math.sin(_beta*2)"
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
		"x_k_plus_1"
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
		"k_n_exponent_2"
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
		"Y=a_{2_{33}}",
		"a_2_33"
	);
	tp(
		"Y=x_{t_{y^a}}",
		"x_t_y_exponent_a"
	);
	tp(
		"Y=x_{t_{y^2}}",
		"x_t_y_exponent_2"
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
		"a_prime+a_prime_prime"
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
		"Y=\\sin3-9+x'_{i'_{2^3}}*9",
		"Math.sin(3)-9+x_prime_i_prime_2_exponent_3*9"
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
		"Y=x\\sin5",
		"x*Math.sin(5)"
	);
	tp(
		"Y=\\frac{a}{b}\\sin5",
		"(a)/(b)*Math.sin(5)"
	);
	tp(
		"Y=x^2\\sin5",
		"Math.pow(x,2)*Math.sin(5)"
	);
	tp(
		"y=aa^{2a^3}",
		"y=a*Math.pow(2*Math.pow(a,3),2)"
	);
	tp(
		"y=aa^2a^3",
		"y=a*Math.pow(a,2)*Math.pow(a,3)"
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
		"2*x_k_minus_1+3"
	);

	// test parser
	function tp(input, expected)
	{
		// try
		// {
			console.log(input);
			console.log('---------------');
			var output = parser.parse(input);
			helpers = output.helpers;

			expected = "function anonymous(" + output.variables.join(",") + ") {\nreturn " + expected + ";\n}";

			if(output.fn.toString() == expected)
			{
				console.log('PASS');
			}
			else
			{
				console.log(output);
				console.log('actual=');
				console.log(output.fn.toString());
				console.log('expected=');
				console.log(expected);
				console.log('FAIL!');
			}

			console.log("=" + output.fn(1,2,3,4,5,6,7,8,9,10));
			console.log('');
			console.log('');
		// }
		// catch(e)
		// {
		// 	console.log('FAIL - Error!');
		// 	console.log(e);
		// }
	}
});