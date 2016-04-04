angular.module 'equationSandbox'
	.controller 'PlayerController', ['$scope', '$window', '$http', ($scope, $window, $http) ->
		"use strict";

		$scope.start = (instance, qset, version = '1') ->
			try
				Materia.Engine.setHeight()
				$scope.qset = qset
				init()
			catch e
				console.log "start error: ", e

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
			try
				Materia.Engine.setHeight()
				$scope.qset = qset
				init()
			catch e
				console.log "start error: ", e

		# Required extensions to Math
		Math.factorial = (n) ->
			try
				return NaN if isNaN(n) or n < 0
				return 1 if n <= 1
				n * Math.factorial(n - 1)
			catch e
				console.log "Match.factorial error: ", e

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
				parseLatex()

				bounds = []

				bounds.push $scope.qset.bounds.x.min
				bounds.push $scope.qset.bounds.y.max
				bounds.push $scope.qset.bounds.x.max
				bounds.push $scope.qset.bounds.y.min

				$('#eq-input').mathquill('latex', $scope.qset.latex)
				opts = { 
					boundingbox: bounds,
					axis:true 
				}

				board = JXG.JSXGraph.initBoard('jxgbox', opts);
				board.create 'functiongraph', [ graphFn ], { strokeColor: "#4DA3CE", strokeWidth: 3 }

				$scope.calculateResult()
			catch e
				$scope.parseError = yes
				console.log "init error: ", equationFn, e if console?.log?

		graphFn = (x) ->
			try
				fnArgs = [x]
				for variable in $scope.variables
					continue if variable.js is 'x'
					fnArgs.push parseFloat($scope.userInputs[variable.js].val)

				equationFn.apply this, fnArgs
			catch e
				console.log "graphFn error: ", e

		parseLatex = ->
			try 
				o = latexParser.parse $scope.qset.latex

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
			catch e
				console.log "parseLatex error", e

			$scope.$apply()
			equationFn = o.fn


		$scope.isValidInput = (input) ->
			try
				not isNaN(parseFloat(input))
			catch e
				console.log "isValidInput error: ", e

		$scope.calculateResult = ->
			try
				board.update()
			catch e
				console.log "calculateResult error: ", e

		Materia.Engine.start($scope)
	]