angular.module('optionsAnalyzer', ['ui.router','d3'])

       .config(function($stateProvider, $urlRouterProvider){
         console.log('anythingggaaa')
         $stateProvider
         .state('main', {
           url: '/',
           controller: 'HomeCtrl',
           templateUrl: '../main/home.html'
         })
         $urlRouterProvider.otherwise('/1')
       })
