angular.module('optionsAnalyzer', ['ui.router','d3'])

       .config(function($stateProvider, $urlRouterProvider){

         $stateProvider

         .state('home', {
           url: '/chart',
           controller: 'HomeCtrl',
           templateUrl: '../main/home.html'
         })

         $urlRouterProvider.otherwise('/chart')
       })
