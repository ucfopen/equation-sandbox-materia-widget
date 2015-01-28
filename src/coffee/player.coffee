angular.module 'player', []
	.controller 'PlayerController', ['$scope', ($scope) ->
		"use strict";

		equationFn = -> return NaN
		latex = ''

		$scope.mainVar = ''
		$scope.variables = []
		$scope.userInputs = {}
		$scope.equationResult = '?'
		$scope.parseError = no


		# Required extensions to Math
		Math.factorial = (n) ->
			return NaN if isNaN(n) or n < 0
			return 1 if n <= 1
			n * Math.factorial(n - 1)

		Math.binom = (top, bottom) ->
			Math.factorial(top) / (Math.factorial(bottom) * Math.factorial(top - bottom))

		Math.cot = (a) ->
			Math.cos(a) / Math.sin(a)

		Math.sec = (a) ->
			1 / Math.cos(a)

		Math.csc = (a) ->
			1 / Math.sin(a)

		if not Math.sinh?
			Math.sinh = (x) ->
				(Math.exp(x) - Math.exp(-x)) / 2

		if not Math.cosh?
			Math.cosh = (x) ->
				(Math.exp(x) + Math.exp(-x)) / 2

		if not Math.tanh?
			Math.tanh = (x) ->
				return 1 if x is Infinity
				return -1 if x is -Infinity
				(Math.exp(x) - Math.exp(-x)) / (Math.exp(x) + Math.exp(-x))


		init = ->
			try
				decodeLatex()
				parseLatex()

				$('#eq-input').mathquill('latex', latex)

				$scope.calculateResult()
			catch e
				$scope.parseError = yes
				console.log equationFn, e if console?.log?

		decodeStr = (s) -> decodeURIComponent escape(window.atob(s))

		decodeLatex = ->
			encodedLatex = window.location.search.substr window.location.search.indexOf('=') + 1
			latex = decodeStr encodedLatex

		parseLatex = ->
			o = module.exports.parse latex

			$scope.mainVar = o.mainVar
			$scope.variables = o.variables

			equationFn = o.fn


		$scope.isValidInput = (input) ->
			not isNaN(parseFloat(input))


		$scope.calculateResult = ->
			fnArgs = []
			for variable in $scope.variables
				fnArgs.push parseFloat($scope.userInputs[variable])

			result = equationFn.apply this, fnArgs
			$scope.equationResult = if !isNaN(result) then result else '?'


		init()
	]