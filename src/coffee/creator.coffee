angular.module 'creator', []
	.controller 'CreatorController', ['$scope', ($scope) ->
		"use strict";

		DEFAULT_EQUATION = 'y=2^x'
		PLAYER_QUERY_URL = window.location.origin + '/player.html?eq='
		PLAYER_WIDTH = 700
		PLAYER_HEIGHT = 500

		$scope.latex = ''
		$scope.expression = ''
		$scope.playerUrl = ''


		update = ->
			$scope.latex = $('#eq-input').mathquill('latex')

			try
				parseLatex()
				$scope.parseError = no
				$scope.errorMsg = ''
			catch e
				$scope.parseError = yes
				$scope.errorMsg = e.toString()
				console.log('error', e)
				console.log(e.toString())

			generatePlayerCode()

		parseLatex = ->
			o = module.exports.parse $scope.latex
			console.log o

			$scope.expression = o.mainExpr

		generatePlayerCode = ->
			if $scope.parseError
				$scope.playerUrl = $scope.playerEmbed = ''
				return

			encodedLatex = encodeStr $scope.latex
			$scope.playerUrl = PLAYER_QUERY_URL + encodedLatex
			$scope.playerEmbed = '<iframe src="' + $scope.playerUrl + '" width="' + PLAYER_WIDTH + '" height="' + PLAYER_HEIGHT + '" style="margin:0;padding:0;border:0;"></iframe>'

		encodeStr = (s) -> window.btoa unescape(encodeURIComponent(s))

		init = ->
			$('#eq-input').mathquill('latex', DEFAULT_EQUATION)
			update()


		$scope.onKeyup = ->
			update()


		init()
	]