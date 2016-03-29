angular.module 'player', []
	.controller 'PlayerController', ['$scope', '$window', ($scope, $window) ->
		"use strict";

		equationFn = -> return NaN
		bounds = [-10, 10, 10, -40]
		board = null

		$scope.mainVar = ''
		$scope.variables = []
		$scope.userInputs = {}
		$scope.equationResult = '?'
		$scope.parseError = no
		$scope.qset

		$scope.$watch 'variables', (val) ->
			setTimeout ->
				$('.mathquill-variable').mathquill();
				$('main').removeClass('loading');
			, 0

		$scope.start = (instance, qset, version = '1') ->
			Materia.Engine.setHeight()
			$scope.qset = qset
			init()

		# $window.EquationSandbox = EquationSandbox

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
			console.log "starting init"
			try
				parseLatex()

				$('#eq-input').mathquill('latex', $scope.qset.latex)
				opts = { 
					boundingbox: bounds,
					axis:true 
				}

				console.log "setting up board"

				board = JXG.JSXGraph.initBoard('jxgbox', opts);
				board.create 'functiongraph', [ graphFn ], { strokeColor: "#4DA3CE", strokeWidth: 3 }

				console.log "about to do calculateResult"
				
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

		parseLatex = ->
			try 
				console.log $scope.qset
				o = latexParser.parse $scope.qset.latex

				$scope.mainVar = o.mainVar
				$scope.variables = o.variables

				console.log "for statement", $scope.variables
				for variable in $scope.variables
					continue if variable.js is 'x'
					$scope.userInputs[variable.js] = {
						val: null
						bounds:
							min: -10
							max: 10
					}

					console.log "Object.defineProperty"
					Object.defineProperty($scope.userInputs[variable.js], '_val', {
						get: -> $scope.userInputs[variable.js].val
						set: (val) -> $scope.userInputs[variable.js].val = parseFloat(val)
						enumerable: true
						configurable: true
					})
			catch e
				console.log "parseLatex error", e

			equationFn = o.fn


		$scope.isValidInput = (input) ->
			not isNaN(parseFloat(input))
			console.log "end of isValidInput"

		$scope.calculateResult = ->
			board.update()
			console.log "end of calculateResult"

		Materia.Engine.start($scope)
	]