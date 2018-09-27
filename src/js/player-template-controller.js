import latexParser from './latex-parser'

angular.module('equationSandbox')
	.controller('PlayerTemplateController', ['$scope', '$window', '$http', '$timeout', function($scope, $window, $http, $timeout) {
		"use strict";

		class Variable {
			constructor() {
				this.bounds = {
					min: -10,
					max: 10
				};

				this.val = 0;
			}
		}

		Object.defineProperties(Variable.prototype, {
			"_val": {
				get() { return this.val; },
				set(newVal) {
					return this.val = parseFloat(newVal);
				},
				enumerable: true,
				configurable: true
			}
		});

		let equationFn = () => NaN;
		let bounds = [-10, 10, 10, -10];
		let board = null;
		let tanPt = null;
		let tanLine = null;
		let lastLatex = null;

		let loaded = false;

		$scope.mainVar = '';
		$scope.variables = [];
		$scope.userInputs = {};
		$scope.equationResult = '?';

		$scope.$watch('variables', function(val) {
			if (loaded) {
				return $timeout(function() {
					$('.variable-display').mathquill();
					return $('main').removeClass('loading');
				});
			}
		});

		// as a standalone player, these varaibles won't change so they won't overwrite qset
		// we can co-opt the qset var to store these variable changes when we include the player
		// in the creator as an interactive preview
		//  =======================================
		$scope.$watch("latex", ( function() {
			if(!$scope.latex) return

			$scope.safeApply(parseLatex());
			jQuery('#eq-demo-input').mathquill('latex', $scope.latex);
			jQuery('.main-var').mathquill('revert');
			jQuery('.main-var').text($scope.mainVar);
			setTimeout(() => jQuery('.main-var').mathquill());

			if (loaded) { return $scope.update(); }
		}), true);

		$scope.$watch("bounds", ( function() {
			if (loaded) { return $scope.update(); }
		}), true);
		//  =======================================

		// Required extensions to Math
		Math.factorial = function(n) {
			try {
				if (isNaN(n) || (n < 0)) { return NaN; }
				if (n <= 1) { return 1; }
				return n * Math.factorial(n - 1);
			} catch (e) {
				return console.log("Math.factorial error: ", e);
			}
		};

		Math.binom = (top, bottom) => Math.factorial(top) / (Math.factorial(bottom) * Math.factorial(top - bottom));

		Math.cot = a => Math.cos(a) / Math.sin(a);

		Math.sec = a => 1 / Math.cos(a);

		Math.csc = a => 1 / Math.sin(a);

		if ((Math.sinh == null)) {
			Math.sinh = x => (Math.exp(x) - Math.exp(-x)) / 2;
		}

		if ((Math.cosh == null)) {
			Math.cosh = x => (Math.exp(x) + Math.exp(-x)) / 2;
		}

		if ((Math.tanh == null)) {
			Math.tanh = function(x) {
				if (x === Infinity) { return 1; }
				if (x === -Infinity) { return -1; }
				return (Math.exp(x) - Math.exp(-x)) / (Math.exp(x) + Math.exp(-x));
			};
		}

		const graphFn = function(x) {
			try {
				const fnArgs = [];
				for (let variable of $scope.variables) {
					if (($scope.mode === 'graphX') && (variable.js === 'x')) {
						fnArgs.push(x);
					} else {
						fnArgs.push(parseFloat($scope.userInputs[variable.js].val));
					}
				}

				if (equationFn != null) { return equationFn.apply(this, fnArgs); }
			} catch (e) {
				console.log("graphFn error: ", e);
				return null;
			}
		};

		var parseLatex = function() {
			try {
				const o = latexParser.parse($scope.latex);

				$scope.mainVar = o.mainVar;
				$scope.variables = o.variables;

				for (let variable of $scope.variables) {
					if (($scope.mode === 'graphX') && (variable.js === 'x')) { continue; }
					if (($scope.userInputs[variable.js] == null)) {
						$scope.userInputs[variable.js] = new Variable();
					}
				}

				// grandparent because ng-include adds new scope
				$scope.$parent.$parent.parseError = false;
				lastLatex = $scope.latex;

				return equationFn = o.fn;

			} catch (e) {
				return $scope.$parent.$parent.parseError = true;
			}
		};

		$scope.init = function() {
			try {
				$scope.safeApply(parseLatex());
				$timeout(function() { // render latex after template is done rendering
					$('.variable-display').mathquill();
					$('main').removeClass('loading');
					return loaded = true;
				});

				const _ = $scope.bounds;
				bounds = [_.x.min, _.y.max, _.x.max, _.y.min];

				const opts = {
					boundingbox: bounds,
					axis:true,
					showCopyright: false
				};

				board = JXG.JSXGraph.initBoard('jxgbox', opts);
				var curve = board.create('functiongraph', [ graphFn ], { strokeColor: "#4DA3CE", strokeWidth: 3, highlight: false });

				tanPt = board.create('glider', [ curve ]);

				tanLine = board.create('tangent', [ tanPt ]);
				tanPt.setAttribute({fillColor: "orange", strokeColor: "orange", withLabel: false, strokeWidth: 8 });
				tanLine.setAttribute({strokeColor: "orange", highlight: false});
				tanPt.hideElement();
				tanLine.hideElement();

				return $scope.calculateResult();

			} catch (e) {
				if ((typeof console !== 'undefined' && console !== null ? console.log : undefined) != null) { return console.log("init error: ", equationFn, e); }
			}
		};

		$scope.isValidInput = function(input) {
			try {
				return !isNaN(parseFloat(input));
			} catch (e) {
				return console.log("isValidInput error: ", e);
			}
		};

		$scope.update = function() {
			$scope.updateBoard();
			return $scope.calculateResult();
		};

		$scope.toggleTan = function() {
			$scope.showTan = !$scope.showTan;
			$scope.updateBoard();
		}
		$scope.updateBoard = function() {
			if ($scope.mode !== 'graphX') return;

			try {
				const _ = $scope.bounds;
				bounds = [_.x.min, _.y.max, _.x.max, _.y.min];
				board.setBoundingBox(bounds);

				if($scope.showTan){
					tanPt.showElement();
					tanLine.showElement();
				} else {
					tanPt.hideElement();
					tanLine.hideElement();
				}

				return board.update();
			} catch (e) {
				return console.log("updateBoard error: ", e);
			}
		};

		$scope.safeApply = function(fn) {
			const phase = this.$root.$$phase;
			if ((phase === "$apply") || (phase === "$digest")) {
				this.$eval(fn);
			} else {
				this.$apply(fn);
			}
		};

		$scope.calculateResult = function() {
			if ($scope.mode !== 'resultingY') { return; }

			const fnArgs = [];
			for (let variable of $scope.variables) {
				fnArgs.push(parseFloat($scope.userInputs[variable.js]._val));
			}

			const result = equationFn.apply(this, fnArgs);
			$scope.equationResult = !isNaN(result) ? result : '?';
		};

		$scope.$on("SendDown", $scope.init);

		$scope.$on("SettingsUpdated", (event, setting) => {
			if(setting === 'tanLineOption') {
				switch($scope.tanLineOption) {
					case 'always':
						$scope.showTan = true;
						break;

					default:
						$scope.showTan = false;
						break;
				}
			}

			setTimeout(() => {
				$scope.update();
			})
		})
	}

	]);
