angular.module 'player', []
	.controller 'PlayerController', ['$scope', '$window', ($scope, $window) ->
		"use strict";

		equationFn = -> return NaN
		latex = ''
		bounds = [-10, 10, 10, -40]
		board = null

		$scope.mainVar = ''
		$scope.variables = []
		$scope.userInputs = {}
		$scope.equationResult = '?'
		$scope.parseError = no

		$scope.$watch 'variables', (val) ->
			setTimeout ->
				$('.mathquill-variable').mathquill();
				$('main').removeClass('loading');
			, 0

		Namespace('EquationSandbox').Engine = do ->
			# Called by Materia.Engine when your widget Engine should start the user experience.
			start = (instance, qset, version = '1') ->
				# once everything is drawn, set the height of the player
				Materia.Engine.setHeight()
				console.log 'qset', qset

			start: start

		$window.EquationSandbox = EquationSandbox

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
				decodeParams()
				parseLatex()

				$('#eq-input').mathquill('latex', latex)
				opts = { 
					boundingbox: bounds,
					axis:true 
				}
				board = JXG.JSXGraph.initBoard('jxgbox', opts);
				board.create 'functiongraph', [ graphFn ], { strokeColor: "#4DA3CE", strokeWidth: 3 }

				$scope.calculateResult()
			catch e
				$scope.parseError = yes
				console.log equationFn, e if console?.log?

		graphFn = (x) ->
			fnArgs = [x]
			for variable in $scope.variables
				continue if variable.js is 'x'
				fnArgs.push parseFloat($scope.userInputs[variable.js].val)

			equationFn.apply this, fnArgs

		decodeParams = ->
			URL_PARAMS  = window.location.search.split '&'
			equationStr = URL_PARAMS[0]
			boundsStr   = URL_PARAMS[1]
			encodedLatex = equationStr.substr equationStr.indexOf('=') + 1
			encodedBounds = boundsStr.substr boundsStr.indexOf('=') + 1
			bounds = decodeURIComponent encodedBounds
			bounds = (parseFloat b for b in bounds.split(','))
			latex = decodeURIComponent encodedLatex

		parseLatex = ->
			o = latexParser.parse latex

			$scope.mainVar = o.mainVar
			$scope.variables = o.variables

			for variable in $scope.variables
				continue if variable.js is 'x'
				$scope.userInputs[variable.js] = {
					val: null
					bounds:
						min: -10
						max: 10
				}

				Object.defineProperty($scope.userInputs[variable.js], '_val', {
					get: -> $scope.userInputs[variable.js].val
					set: (val) -> $scope.userInputs[variable.js].val = parseFloat(val)
					enumerable: true
					configurable: true
				})

			equationFn = o.fn


		$scope.isValidInput = (input) ->
			not isNaN(parseFloat(input))

		$scope.calculateResult = ->
			board.update()

		init()
	]