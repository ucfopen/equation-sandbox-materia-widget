require('../app')

angular.module('equationSandbox')
	.controller('PlayerController', ['$scope', '$window', '$http', '$rootScope', function($scope, $window, $http, $rootScope) {

		$scope.start = function(instance, qset, version) {
			if (version == null) { version = '1'; }
			try {
				$scope.latex = qset.latex;
				$scope.bounds = qset.bounds;
				$scope.mode = qset.mode;
				jQuery('#eq-demo-input').mathquill()
				$rootScope.$broadcast("SendDown");
			} catch (e) {
				console.log("start error: ", e);
			}
		};

		Materia.Engine.start($scope);
	}
]);