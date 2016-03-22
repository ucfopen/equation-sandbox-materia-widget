angular.module 'creator', []
	.controller 'CreatorController', ['$scope', ($scope) ->
		"use strict";

		DEFAULT_EQUATION = 'y=2^x+a'
		PLAYER_QUERY_URL = window.location.href.substr(0, window.location.href.lastIndexOf('/')) + '/player.html?eq='
		PLAYER_WIDTH = 700
		PLAYER_HEIGHT = 500
		UPDATE_DEBOUNCE_DELAY_MS = 500

		updateTimeoutId = -1

		$scope.latex = ''
		$scope.expression = ''
		$scope.playerUrl = ''

		$scope.parseError = no
		$scope.boundsError = no
		$scope.waiting = no

		$scope.bounds =
			x:
				min: -10
				max: 10
			y:
				min: -10
				max: 10


		update = ->
			try
				parseLatex()
				$scope.parseError = no
				$scope.errorMsg = ''
			catch e
				$scope.parseError = yes
				$scope.errorMsg = e.toString() + ' Latex: "' + $scope.latex + '"'
				console.log(e) if console?.log?

			generatePlayerCode()

		parseLatex = ->
			o = latexParser.parse $scope.latex

			$scope.expression = o.mainExpr

		validateBounds = ->
			bounds = [$scope.bounds.x.min,$scope.bounds.y.max,$scope.bounds.x.max,$scope.bounds.y.min]
			
			# non-numeric entry
			if bounds.some( (el) -> return (isNaN(el) or !el?))
				$scope.boundsError = yes
				$scope.bnds_errorMsg = 'One of the bounds is not a number.'
				return null

			[xmin, ymax, xmax, ymin] = bounds
	
			if xmin > xmax or ymin > ymax
				$scope.boundsError = yes
				$scope.bnds_errorMsg = 'The bounds are out of order.'
				return null

			if xmin is xmax or ymin is ymax
				$scope.boundsError = yes
				$scope.bnds_errorMsg = 'One interval represents a point.'
				return null

			$scope.boundsError = no
			$scope.bnds_errorMsg = ''
			bounds


		generatePlayerCode = ->
			if $scope.parseError
				$scope.playerUrl = $scope.playerEmbed = ''
				return

			bounds = validateBounds()
			if not bounds
				$scope.playerUrl = $scope.playerEmbed = ''
				return

			encodedLatex = encodeURIComponent $scope.latex
			encodedBounds = encodeURIComponent bounds
			$scope.playerUrl = PLAYER_QUERY_URL + encodedLatex + '&bnds=' + encodedBounds
			$scope.playerEmbed = '<iframe src="' + $scope.playerUrl + '" width="' + PLAYER_WIDTH + '" height="' + PLAYER_HEIGHT + '" style="margin:0;padding:0;border:0;"></iframe>'

		init = ->
			$('#eq-input').mathquill('latex', DEFAULT_EQUATION)
			$scope.latex = DEFAULT_EQUATION
			update()

		# we instantly update if there's a parse error so the user could
		# find a fix, but otherwise we wait a bit so we don't flash them
		# with error messages while they are composing the equation
		$scope.onKeyup = (e) ->
			if e.target.classList.contains 'graph-bounds-input'
				generatePlayerCode()
				return

			# grab the latex (and do nothing if it hasn't changed, i.e. user pressed <-)
			lastLatex = $scope.latex
			$scope.latex = $('#eq-input').mathquill('latex')
			return if lastLatex is $scope.latex

			if $scope.parseError
				update()
				$scope.waiting = no
				return

			$scope.waiting = yes

			clearTimeout updateTimeoutId
			updateTimeoutId = setTimeout ->
				update()
				$scope.waiting = no
				$scope.$apply()
			, UPDATE_DEBOUNCE_DELAY_MS


		init()
	]