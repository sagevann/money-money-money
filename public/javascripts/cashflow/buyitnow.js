var s = new Simulation( { cashFlow: new CashFlow( { in: 12000.0, out: 7500.0, housing: 300.0 }) });
	s.newPurchase( new Purchase( 'house', 50000, 12, 2800))



var data = s.cumulativeCashflow()
   

var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

var y = d3.scale.linear()
    .rangeRound([height, 0]);

var color = d3.scale.ordinal()
    .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .tickFormat(d3.format(".2s"));

var svg = d3.select(".jumbotron").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


  color.domain(d3.keys(data[0]).filter(function(key) { return key !== "State"; }));

  console.log('data = ' +data)
  data.forEach(function(d) {
    var y0 = 0;
    d.content = color.domain().map(function(name) { return {name: name, y0: y0, y1: y0 += +d[name]}; });
    d.total = d.savings + d.in + d.expenses;
  });

  console.log ('data now is ')
  console.log(data)
  data.sort(function(a, b) { return a.total - b.total; });

  x.domain(data.map(function(d, i) { return i; }));
  y.domain([0, d3.max(data, function(d) { return d.total; })]);

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("$");

  var state = svg.selectAll(".total")
      .data(data)
    .enter().append("g")
      .attr("class", "g")
      .attr("transform", function(d,i) { return "translate(" + x(i) + ",0)"; });

  state.selectAll("rect")
      .data(function(d) { return d.content; })
    .enter().append("rect")
      .attr("width", x.rangeBand())
      .attr("y", function(d) {return y(d.y0); })
      .attr("height", function(d) {  return y(d.y0) - y(d.y1); })
      .style("fill", function(d) { return color(d.name); });

  var legend = svg.selectAll(".legend")
      .data(color.domain().slice().reverse())
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  legend.append("rect")
      .attr("x", width - 18)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", color);

  legend.append("text")
      .attr("x", width - 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) { return d; });





$(function(){
	
	
	//var c = s.cumulative(12)
	var cf0 = new CashFlow( { in: 12000.0, out: 7500.0, housing: 300.0 });

	makeButtonBar()
	$('.make-cashflow').click(function(){  makeCashFlowTable( cf0 ) })
	$('.add-purchase').click(function(){ addPurchase() })


	var makeCashFlowTable =function(cf){
		makePeriodsRow(periods)
		makeCashFlowRow(s.cashflow.base, 'in', '.income')
		makeCashFlowRow(cf0, 'expenses', '.expenses')
		makeCashFlowRow(cf0, 'savings', '.savings')
		for(var i = 0; i < purchases.length; i++){

			//sim.newPurchase( purchases[i].p, purchases[i].purch)
		}
		makePurchasesRow(purchases)
		makeNetRow(cf0)
	}

	makeCashFlowTable()
});