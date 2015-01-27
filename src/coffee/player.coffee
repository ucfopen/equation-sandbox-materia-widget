angular.module 'player', []
	.controller 'PlayerController', ['$scope', ($scope) ->
		"use strict";

		equationFn = -> return NaN
		latex = ''

		$scope.mainVar = ''
		$scope.variables = []
		$scope.userInputs = {}
		$scope.equationResult = '?'


		init = ->
			try
				decodeLatex()
				parseLatex()

				$('#eq-input').mathquill('latex', latex)

				$scope.calculateResult()
			catch e
				alert 'Unable to read equation - perhaps you got a bad link?'

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
			console.log 'isValidInput', input, parseFloat(input)
			not isNaN(parseFloat(input))


		$scope.calculateResult = ->
			fnArgs = []
			for variable in $scope.variables
				fnArgs.push parseFloat($scope.userInputs[variable])

			result = equationFn.apply this, fnArgs
			$scope.equationResult = if !isNaN(result) then result else '?'


		init()
	]