require('../app')

angular.module('equationSandbox')

	.controller('CreatorController', ['$scope', '$http', function($scope, $http) {
		"use strict";

		let _qset;

		/* Initialize class variables */

		let _title = (_qset = null);

		const DEFAULT_EQUATION = 'y=2^x+a';
		const UPDATE_DEBOUNCE_DELAY_MS = 500;
		const DEFAULT_TAN_LINE_OPTION = 'none';

		let updateTimeoutId = -1;

		$scope.latex = '';
		$scope.expression = '';

		$scope.parseError = false;
		$scope.boundsError = false;
		$scope.waiting = false;

		$scope.mode = 'resultingY'; // resultingY | graphX
		$scope.tanLineOption = DEFAULT_TAN_LINE_OPTION;

		$scope.bounds = {
			x: {
				min: -10,
				max: 10
			},
			y: {
				min: -10,
				max: 10
			}
		};

		/* Materia Interface Methods */

		$scope.initNewWidget = (widget, baseUrl) => true;

		$scope.onSaveComplete = (title, widget, qset, version) => true;

		$scope.onQuestionImportComplete = items => true;

		$scope.onMediaImportComplete  = media => null;

		$scope.initExistingWidget = function(title, widget, qset, version, baseUrl) {
			try {
				let _latex;
				_qset = qset;
				return _latex = qset.data;

			} catch (e) {
				return console.log("initExistingWidget error: ", e);
			}
		};

		$scope.onSaveClicked = function(mode) {
			if (mode == null) { mode = 'save'; }
			try {
				if (!_buildSaveData()) {
					console.log('Fix errors before saving');
					return;
				}

				return Materia.CreatorCore.save(_title, _qset);
			} catch (e) {
				return console.log("onSaveClicked error: ", e);
			}
		};

		$scope.onChangeSettings = function(setting) {
			$scope.$broadcast("SettingsUpdated", setting);
		}

		/* Private methods */

		var _buildSaveData = function() {
			try {
				if ((_qset == null)) { _qset = {}; }

				_title = 'Equation Sandbox';

				_validateBounds();
				if ($scope.parseError) { return null; }

				_qset.version = 2;
				return _qset = {
					latex: $scope.latex,
					bounds: $scope.bounds,
					mode: $scope.mode,
					tanLineOption: (typeof $scope.tanLineOption === 'undefined') ? DEFAULT_TAN_LINE_OPTION : $scope.tanLineOption
				};
			} catch (e) {
				console.log("_buildSaveData error: ", e);
				return null;
			}
		};

		var _validateBounds = function() {
			try {
				const xmin = $scope.bounds.x.min
				const xmax = $scope.bounds.x.max
				const ymin = $scope.bounds.y.min
				const ymax = $scope.bounds.y.max

				const bounds = [xmin, ymax, xmax, ymin]

				// non-numeric entry
				if (bounds.some( el => isNaN(el) || (el == null))) {
					$scope.boundsError = true;
					$scope.bnds_errorMsg = 'One of the bounds is not a number.';
					return null;
				}

				// out of order
				if ((xmin > xmax) || (ymin > ymax)) {
					$scope.boundsError = true;
					$scope.bnds_errorMsg = 'The bounds are out of order.';
					return null;
				}

				// equality
				if ((xmin === xmax) || (ymin === ymax)) {
					$scope.boundsError = true;
					$scope.bnds_errorMsg = 'One interval represents a point.';
					return null;
				}

				$scope.boundsError = false;
				$scope.bnds_errorMsg = '';
				return $scope.bounds;

			} catch (e) {
				return console.log("_validateBounds error: ", e);
			}
		};

		/* Scope Methods */

		$scope.onBoundsChange = function() {
			const bounds = _validateBounds(); // bounds are null if invalid
			if ((bounds == null)) { return; }
			return $scope.bounds = bounds;
		};

		// we instantly update if there's a parse error so the user could
		// find a fix, but otherwise we wait a bit so we don't flash them
		// with error messages while they are composing the equation
		$scope.onKeyup = function(e) {
			try {
				if (e.target.classList.contains('graph-bounds-input')) {
					return;
				}

				// grab the latex (and do nothing if it hasn't changed, i.e. user pressed <-)
				if($scope.latexFocus){
					$('#eq-input').mathquill('latex', $scope.latex);
				} else {
					const lastLatex = $scope.latex;
					$scope.latex = $('#eq-input').mathquill('latex');
					if (lastLatex === $scope.latex) { return; }
				}

				if ($scope.parseError) {
					$scope.waiting = false;
					return;
				}

				$scope.waiting = true;

				clearTimeout(updateTimeoutId);
				return updateTimeoutId = setTimeout(function() {
					$scope.waiting = false;
					return $scope.$apply();
				}
				, UPDATE_DEBOUNCE_DELAY_MS);

			} catch (error) {
				e = error;
				return console.log("onKeyup error: ", e);
			}
		};

		$scope.$on("$includeContentLoaded", function(evt, url) {
			try {
				jQuery('#eq-demo-input').mathquill();
				$scope.latex = DEFAULT_EQUATION;
				$('#eq-input').mathquill('latex', $scope.latex);
				return $scope.$broadcast("SendDown");
			} catch (e) {
				return console.log("init error: ", e);
			}
		});

		return Materia.CreatorCore.start($scope);
	}
	]);
