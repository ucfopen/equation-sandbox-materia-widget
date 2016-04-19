angular.module 'equationSandbox'
	.controller 'PlayerTemplateController', ['$scope', '$window', '$http', '$timeout', ($scope, $window, $http, $timeout) ->
		"use strict";

		class Variable
			constructor: ->
				@bounds =
					min: -10
					max: 10

				@val = 0

		Object.defineProperties Variable.prototype, {
			"_val":
				get: -> @val
				set: (newVal) ->
					@val = parseFloat newVal
				enumerable: true
				configurable: true
		}

		equationFn = -> return NaN
		bounds = [-10, 10, 10, -10]
		board = null
		lastLatex = null

		loaded = false

		$scope.mainVar = ''
		$scope.variables = []
		$scope.userInputs = {}
		$scope.equationResult = '?'

		$scope.$watch 'variables', (val) ->
			if loaded
				$timeout ->
					$('.variable-display').mathquill()
					$('main').removeClass('loading')

		# as a standalone player, these varaibles won't change so they won't overwrite qset
		# we can co-opt the qset var to store these variable changes when we include the player
		# in the creator as an interactive preview
		#  =======================================
		$scope.$watch "latex", ( ->
			$scope.safeApply(parseLatex())
			jQuery('#eq-demo-input').mathquill('latex', $scope.latex)
			jQuery('.main-var').mathquill('revert')
			jQuery('.main-var').text($scope.mainVar)
			jQuery('.main-var').mathquill()
			# jQuery('.main-var').mathquill('latex', $scope.mainVar)
			$scope.update() if loaded
		), true

		$scope.$watch "bounds", ( ->
			$scope.update() if loaded
		), true
		#  =======================================


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
				fnArgs = []
				for variable in $scope.variables
					if $scope.mode is 'graphX' and variable.js is 'x'
						fnArgs.push x
					else
						fnArgs.push parseFloat($scope.userInputs[variable.js].val)

				equationFn.apply this, fnArgs if equationFn?
			catch e
				console.log "graphFn error: ", e

		parseLatex = ->
			try
				o = latexParser.parse $scope.latex

				$scope.mainVar = o.mainVar
				$scope.variables = o.variables

				for variable in $scope.variables
					continue if $scope.mode is 'graphX' and variable.js is 'x'
					if !$scope.userInputs[variable.js]?
						$scope.userInputs[variable.js] = new Variable()

				# grandparent because ng-include adds new scope
				$scope.$parent.$parent.parseError = no
				lastLatex = $scope.latex

				equationFn = o.fn

			catch e
				$scope.$parent.$parent.parseError = yes
				# console.log "parseLatex error", e

		init = ->
			try
				$scope.safeApply(parseLatex())

				$timeout -> # render latex after template is done rendering
					$('.variable-display').mathquill()
					$('main').removeClass('loading')
					loaded = true

				_ = $scope.bounds
				bounds = [_.x.min, _.y.max, _.x.max, _.y.min]

				opts = {
					boundingbox: bounds,
					axis:true
				}

				board = JXG.JSXGraph.initBoard('jxgbox', opts);
				board.create 'functiongraph', [ graphFn ], { strokeColor: "#4DA3CE", strokeWidth: 3 }

				$scope.calculateResult()

			catch e
				console.log "init error: ", equationFn, e if console?.log?

		$scope.isValidInput = (input) ->
			try
				not isNaN(parseFloat(input))
			catch e
				console.log "isValidInput error: ", e

		$scope.update = ->
			$scope.updateBoard()
			$scope.calculateResult()

		$scope.updateBoard = ->
			return if $scope.mode isnt 'graphX'

			try
				_ = $scope.bounds
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

		$scope.calculateResult = ->
			return if $scope.mode isnt 'resultingY'

			fnArgs = []
			for variable in $scope.variables
				fnArgs.push parseFloat($scope.userInputs[variable.js]._val)

			result = equationFn.apply this, fnArgs
			$scope.equationResult = if !isNaN(result) then result else '?'

		$scope.$on "SendDown", ->
			init()

	]