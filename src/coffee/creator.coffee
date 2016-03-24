angular.module 'creator', []
	.controller 'CreatorController', ['$scope', ($scope) ->
		"use strict";

		### Initialize class variables ###

		_title = _qset = null

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

		### Materia Interface Methods ###

		materiaInterface =
			initNewWidget: (widget, baseUrl) ->
				$scope.$apply ->
					console.log 'missing initNewWidget'

			initExistingWidget: (title,widget,qset,version,baseUrl) ->
				console.log 'qset', qset
				_qset = qset
				_latex = qset.data.latex
				console.log 'latex', _latex

				$scope.$apply ->
					console.log 'missing initExistingWidget'

			onSaveClicked: (mode = 'save') ->
				# if not _buildSaveData()
				# 	return Materia.CreatorCore.cancelSave 'Required fields not filled out'
				# 	
				_buildSaveData()
				Materia.CreatorCore.save _title, _qset

			onSaveComplete: (title, widget, qset, version) -> true

			onQuestionImportComplete: (items) ->
				$scope.$apply ->
					console.log 'missing onQuestionImportComplete'

			onMediaImportComplete : (media) -> null


		### Private methods ###

		_buildSaveData = ->
			if !_qset? then _qset = {}

			_title = 'TITLE PLACEHOLDER'

			_qset.version = 1
			console.log 'test', $scope.latex
			_qset.data =
				latex = $scope.latex

		_update = ->
			try
				_parseLatex()
				$scope.parseError = no
				$scope.errorMsg = ''
			catch e
				$scope.parseError = yes
				$scope.errorMsg = e.toString() + ' Latex: "' + $scope.latex + '"'
				console.log(e) if console?.log?

			_generatePlayerCode()

		_parseLatex = ->
			o = latexParser.parse $scope.latex

			$scope.expression = o.mainExpr

		_validateBounds = ->
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


		_generatePlayerCode = ->
			if $scope.parseError
				$scope.playerUrl = $scope.playerEmbed = ''
				return

			bounds = _validateBounds()
			if not bounds
				$scope.playerUrl = $scope.playerEmbed = ''
				return

			encodedLatex = encodeURIComponent $scope.latex
			encodedBounds = encodeURIComponent bounds
			$scope.playerUrl = PLAYER_QUERY_URL + encodedLatex + '&bnds=' + encodedBounds
			$scope.playerEmbed = '<iframe src="' + $scope.playerUrl + '" width="' + PLAYER_WIDTH + '" height="' + PLAYER_HEIGHT + '" style="margin:0;padding:0;border:0;"></iframe>'

		_init = ->
			$('#eq-input').mathquill('latex', DEFAULT_EQUATION)
			$scope.latex = DEFAULT_EQUATION
			_update()

		### Scope Methods ###

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
				_update()
				$scope.waiting = no
				return

			$scope.waiting = yes

			clearTimeout updateTimeoutId
			updateTimeoutId = setTimeout ->
				_update()
				$scope.waiting = no
				$scope.$apply()
			, UPDATE_DEBOUNCE_DELAY_MS


		_init()

		Materia.CreatorCore.start materiaInterface
	]