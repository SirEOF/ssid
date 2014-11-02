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
    query: {url: '/api/shit/:mode', method: 'GET', isArray: true},
    upvote: {url: '/api/shit/:id/upvote', method: 'POST'},
    downvote: {url: '/api/shit/:id/downvote', method: 'POST'},
    new: {url: '/api/shit/new', method: 'GET', isArray: true },
    top: {url: '/api/shit/top', method: 'GET', isArray: true},
    controversial: {url: '/api/shit/controversial', method: 'GET', isArray: true},
    comments: {url: '/api/shit/:id/comment', method: 'GET', isArray: true },
    addComment: {url: '/api/shit/:id/comment', method: 'POST' }});
});

app.service('Comment', function($resource) {
  return $resource('/api/shit/:shitId/comment/:id', {id: '@_id', shitId: '@shit'});
});

app.controller('HomeController', function($scope, Shit, Comment) {

  $scope.shitMode = 'new';
  $scope.newShitMode = false;

  Shit.query({mode: 'top'});
  $scope.$watch('shitMode', function() {
    loadShits();
  });

  function loadShits() {
    Shit.query({mode: $scope.shitMode}, function(shits) {
      var out = [];
      for (var i = 0; i < shits.length; ++i) {
        var shit = shits[i];
        shit.comments = Comment.query({ shitId: shit._id});
        shit.comment = new Comment({shitId: shit._id});
        out.push(shit);
      }
      $scope.shits = out;
    });
  }

  $scope.newShit = new Shit();
  $scope.postShit = function() {
    $scope.newShit.$save();
    $scope.newShit = new Shit();
    $scope.shitMode = 'new';
    $scope.newShitMode = false;
    loadShits();
  };

  $scope.upvote = function(shit) {
    shit.$upvote();
    //loadShits();
  };

  $scope.downvote = function(shit) {
    shit.$downvote();
    //loadShits();
  };

  $scope.addComment = function(shit) {
    shit.comment.$save({shitId: shit._id}, function() {
      shit.comments = Comment.query({ shitId: shit._id});
      shit.comment = new Comment({shitId: shit._id});
    });
  };

  $scope.progress = 0;
  $scope.setProgress = function(p) {
    console.log("PROGRESS", p);
    $scope.$apply(function() {
      $scope.progress = p;
    });
  };

  $scope.addPicture = function(url) {
    console.log("ADD PICTURE", url);
    $scope.progress = 0;
    $scope.newShit.img = url;
    $scope.$apply();
  };

});

app.filter('fromNow', function() {
  return function(date) {
    return moment(date).fromNow();
  };
});
