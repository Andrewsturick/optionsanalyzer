angular.module('optionsAnalyzer')

      .directive('gaussianCurveChart', function(d3Service, dataService){
        return  {
          scope: {
            chartParams: "="
          },
          templateUrl: '/main/gaussian/gaussian-curve-chart.html',
          link: function(scope, el, attrs){
            //setting up empty data array
            var data = [];
            scope.sd3Arr;

            scope.$watch('chartParams', function(n,o){
              if(scope.chartParams){
                getData()
                renderChart()

              }
            })

            function renderChart(){


              // line chart based on http://bl.ocks.org/mbostock/3883245

              var margin = {
                top: 20,
                right: 0,
                bottom: 30,
                left: 0
              },
              width = window.innerWidth - margin.left - margin.right,
              height = 320 - margin.top - margin.bottom;

              var x = d3.scale.linear()
              .range([0, width]);

              var y = d3.scale.linear()
              .range([height, 0]);

              var sd3ArrA = []
              var sd3ArrB = []

              data.map(function(d, i){
                var diff = d.p - 0.01
                if(d.q < scope.chartParams.stockPrice && diff < 0.001 && diff > 0){
                  sd3ArrA.push(d)
                }
                if(d.q > scope.chartParams.stockPrice && diff < 0.001 && diff > 0){
                  sd3ArrB.push(d)
                }
              })
              scope.sd3Arr = []
              scope.sd3Arr[0] = d3.mean(sd3ArrA, function(d){return d.q});
              scope.sd3Arr[1] = d3.mean(sd3ArrB, function(d){return d.q});



              var xAxis = d3.svg.axis()
              .scale(x)
              .orient("bottom")
              .tickValues(d3.range(scope.sd3Arr[0] , scope.sd3Arr[1] , 10))


              var yAxis = d3.svg.axis()
              .scale(y)
              .orient("right")

              var line = d3.svg.line()
              .x(function(d) {
                return x(d.q);
              })
              .y(function(d) {
                return y(d.p);
              });

              var svg = d3.select("gaussian-curve-chart").append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .style('background-color', '#312A2A')
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

              x.domain(d3.extent(scope.sd3Arr, function(d) {
                return d
              }));
              y.domain(d3.extent(data, function(d) {
                return d.p;
              }));

              svg.append("g")
                  .attr("class", "x axis")
                  .attr("transform", "translate(0," + height + ")")
                  .call(xAxis);

              svg.append("g")
                  .attr("class", "y axis")
                  .attr("transform", "translate(5,0)")
                  .call(yAxis);

            var mainLine =  svg.append("path")
                  .datum(data)
                  .attr("class", "line")
                  .attr("d", line);


              ///these arrays expose x coordinates for the standard deviation lines below
              var sd1Arr = dataService.makeSDLines(data, 0.32, scope.chartParams.stockPrice, x)
              var sd2Arr = dataService.makeSDLines(data, 0.06, scope.chartParams.stockPrice, x)




              var SD1 = svg.selectAll('.sd1')
                  .data(sd1Arr)
                  .enter()
                  .append('line')
                      .attr('class', 'sd1')
                      .attr('x1', function(d){return d})
                      .attr('x2', function(d){return d})
                      .attr('y1', 0)
                      .attr('y2', height)
                      .attr('stroke','white')
                      .attr('stroke-width','2px')
                      .attr('stroke-dasharray', ('2,2'))
                      .attr('stroke-opacity', 0.6)


              var SD2 = svg.selectAll('.sd2')
                  .data(sd2Arr)
                  .enter()
                  .append('line')
                      .attr('class', 'sd2')
                      .attr('x1', function(d){return d})
                      .attr('x2', function(d){return d})
                      .attr('y1', 0)
                      .attr('y2', height)
                      .attr('stroke','white')
                      .attr('stroke-width','2px')
                      .attr('stroke-dasharray', ('2,2'))
                      .attr('stroke-opacity', 0.6)


              var halfMark = svg.append('g')
                  .attr('transform', "translate(" +width/2 + "," + 0 + ")")
                  .attr('y', 10)
                  .append('line')
                      .attr('y0', -5)
                      .attr('y1', 5)
                      .attr('stroke', '#aaa')
                      .attr('stroke-width', '2')
            }



            function getData() {


            // loop to populate data array with
            // probability - quantile pairs
            for (var i = 0; i < 10000; i++) {
                q = normal() // calc random draw from normal dist
                p = gaussian(q) // calc prob of rand draw
                el = {
                    "q": q,
                    "p": p
                }

                if(el['p'] > 0.0001 && el['q'] < scope.chartParams.stockPrice*2){  data.push(el)  };


            };



            // need to sort for plotting
            //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
            data.sort(function(x, y) {
                    return x.q - y.q;
            });



            scope.chartParams.chain = scope.chartParams.chain.map(function(d, i){
                    scope.chartParams.chain[i].probITM = gaussian(d.numberStrike)
                    return d
            })





            }

            // from http://bl.ocks.org/mbostock/4349187
            function normal() {
                var x = 0,
                    y = 0,
                    rds, c;
                do {
                    x = Math.random() * 2 - 1;
                    y = Math.random() * 2 - 1;
                    rds = x * x + y * y;
                } while (rds == 0 || rds > 1);
                c = Math.sqrt(-2 * Math.log(rds) / rds); // Box-Muller transform
                return scope.chartParams.stockPrice * (x * c); // throw away extra sample y * c
            }

            //taken from Jason Davies science library
            // https://github.com/jasondavies/science.js/
            function gaussian(x) {
            	var gaussianConstant = 1 / Math.sqrt(2 * Math.PI),

              ///again this is just a guess...as we can determine sigma (sd1 from
            //implied volatility, and the models seem to align with how brokers are modeling this

            		mean = scope.chartParams.stockPrice,
                sigma = scope.chartParams.standardDeviation1;

                x = (x - mean) / sigma;
                //changes radius from 1 in example to standardDeviation1

              //multiplied by 1.25 to amplify height of curve to .5 deltas....
              //as gaussian random walk states stocks have a 50/50 chance
              //(.5 probability density) of ending up above or below
              //the current price (scope.chartParams.stockPrice)
                return ((gaussianConstant * Math.exp(-.5 * x * x) / sigma) * 1.25 * scope.chartParams.standardDeviation1);
            };

          }
        }
      })
