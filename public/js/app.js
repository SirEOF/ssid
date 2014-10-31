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
  return $resource('/api/shit/:id', {id: '@_id'}, {
    upvote: {url: '/api/shit/:id/upvote', method: 'POST'},
    downvote: {url: '/api/shit/:id/downvote', method: 'POST'},
    new: {url: '/api/shit/new', method: 'GET', isArray: true },
    top: {url: '/api/shit/top', method: 'GET', isArray: true},
    controversial: {url: '/api/shit/controversial', method: 'GET', isArray: true}});
});

app.controller('HomeController', function($scope, Shit) {

  $scope.shitMode = 'new';
  $scope.newShitMode = false;

  $scope.$watch('shitMode', function() {
    loadShits();
  });

  function loadShits() {
    if ($scope.shitMode === 'new') {
      $scope.shits = Shit.new();
    } else if ($scope.shitMode === 'top') {
      $scope.shits = Shit.top();
    } else if ($scope.shitMode === 'controversial') {
      $scope.shits = Shit.controversial();
    }
  }

  $scope.newShit = new Shit();
  $scope.postShit = function() {
    $scope.newShit.$save();
    $scope.newShit = new Shit();
  };

  $scope.upvote = function(shit) {
    shit.$upvote();
    //loadShits();
  };

  $scope.downvote = function(shit) {
    shit.$downvote();
    //loadShits();
  };

});

app.filter('fromNow', function() {
  return function(date) {
    console.log(date);
    return moment(date).fromNow();
  };
});
