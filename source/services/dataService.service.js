
       angular.module('optionsAnalyzer')
              .service('dataService', function(d3Service){
////////////////
                //gets finds out where 50 delta is and returns estimated mark, and closest strike in object
///////////////
              this.delta50 = function(data){

                 var deltaObj;



                 data.data.map(function(d,i, arr){
                     ///next index in array is next strike higher at this point
                     var nextStrike = arr[i + 1]

                     //finds the two strikes on either side of the .50 delta mark
                     if(d.call.delta > 0.5 && nextStrike.call.delta < 0.5){


                         var obj = {}
                         obj['1'] = Math.abs(d.call.delta - 0.5)*10
                         obj['2'] = Math.abs(nextStrike.call.delta - 0.5)*10

                         var mark, object50,
                             diffRange = Math.abs(d.numberStrike - nextStrike.numberStrike),
                             bothStrikes = [d, nextStrike]

                             //depending on which it is closer to.and how much closer,
                             //determine rough estimate of 50 delta, closest strike,
                             //and array : [strikeBelow50DELTA, strikeAbove50DELTA ]
                             if(obj['1']< obj['2']){
                                 mark = nextStrike.numberStrike - (diffRange * obj['1']/obj['2'])
                                 deltaObj = {mark: mark, closestStrike: d, bothStrikes: bothStrikes }
                             }

                             else{
                                 mark = d.numberStrike +  (diffRange * obj['2']/obj['1'])
                                 deltaObj = {mark: mark, closestStrike: nextStrike, bothStrikes: bothStrikes}
                             }
                         }

                   })

                   return deltaObj
             }


////////////////
               //finds estimated 1sd move and IV
///////////////

             this.implied1SDMove = function (data, mark, days) {
                    var estimatedIVHelper,moveObj;
                    console.log(data.data);

                    data.data.map(function(d, i , arr){
                        var nextStrike =   arr[i + 1]

                        if(d.put.delta > -0.3 && nextStrike.put.delta < -0.3){

                             var obj = {}
                             obj['1'] = Math.abs(d.put.delta - 0.5)*10
                             obj['2'] = Math.abs(nextStrike.put.delta - 0.5)*10


                             if (obj['1'] < obj['2']) {
                                  estimatedIVHelper = d.put.iv
                             }
                             else{
                                  estimatedIVHelper = nextStrike.put.iv
                             }
                            moveObj =  {move: mark * (estimatedIVHelper) * Math.sqrt(days/365), IV: estimatedIVHelper}
                         }
                      })

                      return moveObj
                    }





                    this.makeSDLines = function(data, percentage, stockPrice, x){

                        var sd1ArrA = []
                        var sd1ArrB = []

                        data.map(function(d, i){
                          var diff = d.p - percentage
                          if(d.q > stockPrice && diff < 0.005 && diff > 0){
                            sd1ArrA.push(d)
                          }
                          if(d.q < stockPrice && diff < 0.005 && diff > 0){
                            sd1ArrB.push(d)
                          }
                        })

                        sd1Arr = []
                        sd1Arr[0] = x(d3.mean(sd1ArrA, function(d){return d.q}));
                        sd1Arr[1] = x(d3.mean(sd1ArrB, function(d){return d.q}));


                        return sd1Arr
                    }
                 })
            //    }
            // })
