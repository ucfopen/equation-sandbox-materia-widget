require('../app')
require('./player-template-controller')

angular.module('equationSandbox')
	.controller('PlayerController', ['$scope', '$window', '$http', '$rootScope', function($scope, $window, $http, $rootScope) {
		$scope.start = function(instance, qset, version) {
			if (version == null) { version = '1'; }
			try {
				$scope.latex = qset.latex;
				$scope.bounds = qset.bounds;
				$scope.mode = qset.mode;
				$scope.tanLineOption = qset.tanLineOption;

				jQuery('#eq-demo-input').mathquill()

				$rootScope.$broadcast("SendDown");

			} catch (e) {
				console.log("start error: ", e);
			}
		};

		$scope.$on("Ready", function() {
			Materia.Engine.start($scope);
		})

	}
]);

angular.bootstrap(document, ['equationSandbox'])
