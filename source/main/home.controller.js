angular.module('optionsAnalyzer')
       .controller('HomeCtrl', function($scope, APIService,dataService){
         console.log('doing anything a');
         APIService.getData().then(function(data, err){
            // var stranglePrice = dataService.stranglePrice(data)
            // var IV  =  dataService.getIV(data, stranglePrice);
            var delta50 = dataService.delta50(data)
            var sd1 =  dataService.implied1SDMove(data, delta50.mark, 10) ;
            $scope.chartParams = {chain : data.data, stock : "GOOG", standardDeviation1 : sd1.move, IV : sd1.IV, stockPrice : delta50.mark, daysLeft : 10 }
         })
       })
