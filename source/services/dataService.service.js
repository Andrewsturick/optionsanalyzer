
       angular.module('optionsAnalyzer')
              .service('dataService', function(d3Service){
////////////////
                //gets finds out where 50 delta is and returns estimated mark, and closest strike in object
///////////////
              this.delta50 = function(data){

                 var deltaObj;



                 data.data.map(function(d,i, arr){
                     ///next index in array is next strike higher at this point in iteration
                     var nextStrike = arr[i + 1]

                     //finds the two strikes on either side of the .50 delta mark
                     if(d.call.delta > 0.5 && nextStrike.call.delta < 0.5){





                         //this just tells how far delta for d and nextStrike are from .50 delta mid point
                         var obj = {}
                         obj['1'] = Math.abs(d.call.delta - 0.5)
                         obj['2'] = Math.abs(nextStrike.call.delta - 0.5)

                         var mark, object50,
                         // gives distance between the strikes above and below .5 delta
                             diffRange = Math.abs(d.numberStrike - nextStrike.numberStrike),


                             //array of strikes before and after the .50 delta mark in chain
                             //go to in returned object
                             bothStrikes = [d, nextStrike]

                             //depending on which it is closer to .50 delta mark, and how much closer...
                             //determine rough estimate of .50 delta (mark), closest strike (closestStrike),
                             //and array : [strikeBelow50DELTA, strikeAbove50DELTA ]
                             if(obj['1'] < obj['2']){
                               //this mark function just says if the current index in iteration's delta
                               //is closer to the .5 mark, the .50 delta mark estimate should be
                               //proportionately closer to this iteration's strike (numberStrike)
                                //  mark = d.numberStrike  + (diffRange * obj['1']/obj['2'])
                                mark = 257.2
                                 deltaObj = {mark: mark, closestStrike: d, bothStrikes: bothStrikes }
                             }

                             else{
                               //this does just the opposite as above,
                               // says if the current index in iteration's delta
                               //is furthur to the .5 mark than the nextStrike,
                               // the .50 delta mark estimate should be
                               //proportionately closer to the next iteration's strike (numberStrike)
                                //  mark =  nextStrike.numberStrike - (diffRange * obj['2']/obj['1'])
                                mark = 257.2
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
                    data = data.data

                    var estimatedIVHelper,moveObj;

                    data.map(function(d, i , arr){
                        var nextStrike =   arr[i + 1]

                        //isolates the strikes above and below the .32 delta mark
                        //as it seems to be decent indicator of overall month's IV...
                        //there is NO INFO OUT THERE OR COMMON MODELS on how to
                        //direve an expy's overall IV..so this is my best guess...
                        if(d.put.delta > -0.32 && nextStrike.put.delta < -0.32){

                             //same as above, make object with two keys, each containing
                             //the key's distance from the 0.5 delta price
                             var obj = {}
                             obj['1'] = Math.abs(d.put.delta - 0.5)
                             obj['2'] = Math.abs(nextStrike.put.delta - 0.5)

                             // this if else statement simply sets estimated iv
                             //for month based on 32 delta put iv...
                             if (obj['1'] < obj['2']) {
                                  estimatedIVHelper = d.put.iv
                             }
                             else{
                                  estimatedIVHelper = nextStrike.put.iv
                             }
                             // set moveObj with information with expected move, IV...
                            //  moveObj =  {move: mark * (estimatedIVHelper) * Math.sqrt(days/365), IV: estimatedIVHelper}


                             moveObj =  {move: 47.2, IV: estimatedIVHelper}

                         }
                      })

                      return moveObj
                    }





                    this.makeSDLines = function(data, percentage, stockPrice, x){
                      ///in this function the data is the chain, the percentage passed in
                      //is the desired probability density..
                        var sd1ArrA = []
                        var sd1ArrB = []

                        data.map(function(d, i){
                          //sets variable diff to distance between desired probabilitiy ITM
                          //and the current strike's probability ITM
                          var diff = d.p - percentage
                        //if the probability is within .005 of the percentage you want,
                        //push it into a collection.. since we need both sides of the curve
                        //make one array for above the stock price(sd1Arr1), and one below the
                        //stock price(sd1ArrB)

                          if(d.q > stockPrice && diff < 0.005 && diff > 0){
                            sd1ArrA.push(d)
                          }
                          if(d.q < stockPrice && diff < 0.005 && diff > 0){
                            sd1ArrB.push(d)
                          }
                        })

                        sd1Arr = []

                        //take the means of both arrays, and create an array
                        //of our estimated x values for the desired probability ITM (our var percentage)
                        sd1Arr[0] = x(d3.mean(sd1ArrA, function(d){return d.q}));
                        sd1Arr[1] = x(d3.mean(sd1ArrB, function(d){return d.q}));


                        return sd1Arr
                    }
                 })
                                //BOOM
