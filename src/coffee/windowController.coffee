angular.module 'equationSandbox'
	.controller 'WindowController', ['$scope', '$window', '$http', ($scope, $window, $http) ->
		"use strict";

		$scope.start = (instance, qset, version = '1') ->
			try
				# Materia.Engine.setHeight()
				$scope.qset = $scope.variablesSet
				console.log $scope.qset
				# $scope.qset = qset
				init()
			catch e
				console.log "start error: ", e

		equationFn = -> return NaN
		bounds = [-10, 10, 10, -40]
		board = null
		lastLatex = null

		$scope.mainVar = ''
		$scope.variables = []
		$scope.userInputs = {}
		$scope.equationResult = '?'
		$scope.qset

		$scope.$watch 'variables', (val) ->
			setTimeout ->
				$('.mathquill-variable').mathquill();
				$('main').removeClass('loading');
			, 0

		$scope.$parent.$watch "variablesSet", ( ->
			$scope.qset = $scope.variablesSet
			
			parseLatex()
			
			console.log 'ugh', this
			$('#eq-demo-input').mathquill('latex', 'x^3')
			# $('#eq-demo-input').mathquill('latex', $scope.qset.latex)

			$scope.updateBoard()
		), true

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

		graphFn = (x) ->
			try
				fnArgs = [x]
				for variable in $scope.variables
					continue if variable.js is 'x'
					fnArgs.push parseFloat($scope.userInputs[variable.js].val)

				equationFn.apply this, fnArgs if equationFn? 
			catch e
				console.log "graphFn error: ", e

		parseLatex = ->
			try 
				o = latexParser.parse $scope.qset.latex

				$scope.mainVar = o.mainVar
				$scope.variables = o.variables

				for variable in $scope.variables
					continue if variable.js is 'x'
					if !$scope.userInputs[variable.js]?
						$scope.userInputs[variable.js] = {
							val: null
							bounds:
								min: -10
								max: 10
						}

						o = $scope.userInputs[variable.js]
						Object.defineProperty(o, '_val', {
							get: -> o.val
							set: (val) -> 
								o.val = parseFloat(val)
							enumerable: true
							configurable: true
						})

				$scope.$parent.parseError = no
				lastLatex = $scope.qset.latex
				equationFn = o.fn

			catch e
				$scope.$parent.parseError = yes
				console.log "parseLatex error", e

		init = ->
			try
				$scope.safeApply(parseLatex())

				bounds = [$scope.qset.bounds.x.min, $scope.qset.bounds.y.max, $scope.qset.bounds.x.max, $scope.qset.bounds.y.min]

				$('#eq-demo-input').mathquill('latex', $scope.qset.latex)

				opts = { 
					boundingbox: bounds,
					axis:true 
				}

				board = JXG.JSXGraph.initBoard('jxgbox', opts);
				board.create 'functiongraph', [ graphFn ], { strokeColor: "#4DA3CE", strokeWidth: 3 }

			catch e
				console.log "init error: ", equationFn, e if console?.log?

		$scope.isValidInput = (input) ->
			try
				not isNaN(parseFloat(input))
			catch e
				console.log "isValidInput error: ", e

		$scope.updateBoard = ->
			try
				_ = $scope.qset.bounds
				bounds = [_.x.min, _.y.max, _.x.max, _.y.min]
				board.setBoundingBox bounds

				board.update()
			catch e
				console.log "updateBoard error: ", e

		$scope.safeApply = (fn) ->
			phase = @$root.$$phase
			if phase is "$apply" or phase is "$digest"
				@$eval fn
			else
				@$apply fn
			return

		$scope.start()
		# Materia.Engine.start($scope)

	]