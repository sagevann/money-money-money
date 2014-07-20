var s = new Simulation( { cashFlow: new CashFlow( { in: 12000.0, out: 7500.0, housing: 300.0 }) });
	s.newPurchase( new Purchase( 'house', 50000, 12, 2800))



var data = [4, 8, 15, 16, 23, 42];

var width = 420,
    barHeight = 20;

var x = d3.scale.linear()
    .domain([0, d3.max(data)])
    .range([0, width]);

var chart = d3.select(".chart")
    .attr("width", width)
    .attr("height", barHeight * data.length);

var bar = chart.selectAll("g")
    .data(data)
  .enter().append("g")
    .attr("transform", function(d, i) { return "translate(0," + i * barHeight + ")"; });

bar.append("rect")
    .attr("width", x)
    .attr("height", barHeight - 1);

bar.append("text")
    .attr("x", function(d) { return x(d) - 3; })
    .attr("y", barHeight / 2)
    .attr("dy", ".35em")
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