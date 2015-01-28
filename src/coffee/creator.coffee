angular.module 'creator', []
	.controller 'CreatorController', ['$scope', ($scope) ->
		"use strict";

		DEFAULT_EQUATION = 'y=2^x'
		PLAYER_QUERY_URL = window.location.origin + '/player.html?eq='
		PLAYER_WIDTH = 700
		PLAYER_HEIGHT = 500
		UPDATE_DEBOUNCE_DELAY_MS = 350

		updateTimeoutId = -1

		$scope.latex = ''
		$scope.expression = ''
		$scope.playerUrl = ''

		$scope.parseError = no
		$scope.waiting = no

		update = ->
			try
				parseLatex()
				$scope.parseError = no
				$scope.errorMsg = ''
			catch e
				$scope.parseError = yes
				$scope.errorMsg = e.toString()
				console.log(e) if console?.log?

			generatePlayerCode()

		parseLatex = ->
			o = module.exports.parse $scope.latex

			$scope.expression = o.mainExpr

		generatePlayerCode = ->
			if $scope.parseError
				$scope.playerUrl = $scope.playerEmbed = ''
				return

			encodedLatex = encodeURIComponent $scope.latex
			$scope.playerUrl = PLAYER_QUERY_URL + encodedLatex
			$scope.playerEmbed = '<iframe src="' + $scope.playerUrl + '" width="' + PLAYER_WIDTH + '" height="' + PLAYER_HEIGHT + '" style="margin:0;padding:0;border:0;"></iframe>'

		init = ->
			$('#eq-input').mathquill('latex', DEFAULT_EQUATION)
			$scope.latex = DEFAULT_EQUATION
			update()

		# we instantly update if there's a parse error so the user could
		# find a fix, but otherwise we wait a bit so we don't flash them
		# with error messages while they are composing the equation
		$scope.onKeyup = ->
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