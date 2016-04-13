angular.module('optionsAnalyzer')
       .controller('HomeCtrl', function($scope, APIService,dataService){
         APIService.getData().then(function(data, err){
            // var stranglePrice = dataService.stranglePrice(data)
            // var IV  =  dataService.getIV(data, stranglePrice);
            var delta50 = dataService.delta50(data)
            var sd1 =  dataService.implied1SDMove(data, delta50.mark, 29) ;

            $scope.chartParams = {chain : data.data, stock : "GOOG", standardDeviation1 : sd1.move, IV : sd1.IV, stockPrice : delta50.mark, daysLeft : 29 }
         })
       })
