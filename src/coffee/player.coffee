angular.module 'equationSandbox'
	.controller 'PlayerController', ['$scope', '$window', '$http', ($scope, $window, $http) ->
		"use strict";
		# $scope.$on "$includeContentLoaded", (evt, url) ->
		$scope.start = (instance, qset, version = '1') ->
			try
				$scope.latex = qset.latex
				$scope.bounds = qset.bounds
				$scope.mode = qset.mode
				# jQuery('#eq-demo-input').mathquill()
				$scope.$broadcast("SendDown")
			catch e
				console.log "start error: ", e

		Materia.Engine.start($scope)

	]