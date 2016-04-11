angular.module 'equationSandbox'
	.controller 'PlayerController', ['$scope', '$window', '$http', ($scope, $window, $http) ->
		"use strict";

		$scope.start = (instance, qset, version = '1') ->
			try
				$scope.latex = qset.latex
				$scope.bounds = qset.bounds
				jQuery('#eq-demo-input').mathquill()
				$scope.$broadcast("SendDown")
			catch e
				console.log "start error: ", e

		Materia.Engine.start($scope)

	]