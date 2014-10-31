'use strict';

var app = angular.module('ssid', ['ui.router', 'ngResource', 'angularFileUpload']);

app.config(function($stateProvider, $urlRouterProvider) {

  $urlRouterProvider.otherwise('/');

  $stateProvider
    .state('home', {
      url: '/',
      templateUrl: 'partials/home.html',
      controller: 'HomeController'
    });
 });

app.service('Shit', function($resource) {
  return $resource('/api/shit/:id', {id: '@_id'}, {upvote: {url: '/api/shit/:id/upvote', method: 'POST'}, downvote: {url: '/api/shit/:id/downvote', method: 'POST'}});
});

app.controller('HomeController', function($scope, Shit) {
  $scope.newShitMode = false;
  $scope.shits = Shit.query();

  $scope.newShit = new Shit();
  $scope.postShit = function() {
    $scope.newShit.$save();
    $scope.newShit = new Shit();
  };

  $scope.upvote = function(shit) {
    shit.$upvote();
  };

  $scope.downvote = function(shit) {
    shit.$downvote();
  };

});

app.filter('fromNow', function() {
  return function(date) {
    console.log(date);
    return moment(date).fromNow();
  };
});
