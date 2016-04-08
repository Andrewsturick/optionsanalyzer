angular.module('optionsAnalyzer')
      .service('APIService', function($http){
          this.getData = function(){
              return $http.get('http://localhost:3000/2#/')
          }
      })
