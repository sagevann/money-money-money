var mintExpenses0 = [ 467, 5755, 5379, 3432, 8023, 5013,
					 4234, 2922, 2952, 2649, 2346, 3274,
					 
					 4084, 2687, 7026, 2571, 4966, 5253, 
					 10026, 7009, 9078, 14524, 8264, 12603,
					 
					 15138, 12701, 12213, 12441, 9535, 13778, 
					 10063, 9426, 12538, 13593, 7498, 8455,
					 
					 7951, 7420, 8428, 17749, 6778, 4267]

var mintIncomeOld= [	 2090,4050,3986,12812,4230,3946,
					 9166,6034,4546,6938,431,63,

					 26,6096,10321,202,140,3378,
					 5857,6617,4383,6811,12237,26486,
					 
					 23417,39166,254,30973,4726,10890,
					 6106,1185,11748,8346,7724,16025,
					 
					 3891,6193,5326,21150,12717,9995
]

var mintIncome = [12811.89, 4230.22, 3931.80, 9166.50, 6033.65, 4546.02, 6938.41, 6096.16, 10321.02, 3377.54, 5718.03, 6413.12, 3862.87, 3410.32, 9196.66, 25833.85, 18851.94, 38987.00, 30475.56, 4725.66, 10673.62, 6105.52, 1124.40, 11748.22, 8302.32, 7182.95, 16024.20, 3890.71, 5887.67, 5325.65, 21149.34, 12589.97, 13780.97, 18940.41 ]
var mintExpenses = [5352.88, 3431.86, 8022.97, 4998.71, 4233.98, 2922.49, 2951.60, 2649.15, 2345.70, 3274.09, 4058.73, 2686.81, 9005.72, 2570.76, 4846.87, 5252.93, 9526.73, 6170.92, 8558.66, 12823.73,6429.63, 11950.61, 13868.34,10619.37,11374.72,11943.35,9535.41, 12655.09,8756.46, 9365.86, 12537.45,11452.04,9567.09, 8455.03, 7771.48, 7114.28, 8428.48, 17748.37,6650.58, 6722.91, 4937.41]

function compound( principal, apr, periods ){
	var periodic_apr = 1.0 + apr / periods

	return principal * Math.pow(  periodic_apr , periods )
}


function sd(x) {
  var n = x.length, variance = 1
  if (n < 1) return NaN;
  if (n === 1) return 0;
  var mean = d3.mean(x),
      i = -1,
      s = 0;
  while (++i < n) {
    var v = x[i] - mean;
    s += v * v;
  }
  variance = s / (n - 1);

  return Math.pow( variance, 0.5 )
};

function makeRnorm( values ){
	var m = d3.mean(values),
		s = sd(values)

	return d3.random.normal(m,s)
}

function randomYears( input, years ){

	var i = 0, v =[],
		generator = makeRnorm( input )

	for(i; i < years * 12; i++){
		var g = generator()
		v.push( Math.abs(g) )
	}

	return v
}

var rIncome = [], 
	rExpenses = [],
	rSavings = []

function makeMinExpenses( expenses, min ){

	return expenses.map( function(a){ return a > min ? a : min })
}

function randomFromMint(years){
	var a = { income:   randomYears( mintIncome, years),
			  expenses: makeMinExpenses( randomYears( mintExpenses, years), d3.min( mintExpenses )  )
			 }
		a.savings = a.income.map(function(b,i){ return b - a.expenses[i]})

	return a;
}

function randomMintGraphs( years, invest){
	var m = randomFromMint( years)
		
	if( invest !== false ){
		invest = 'invest'
	}


	makeBarGraphs( m.income, m.expenses, m.savings, invest )

}
function overYears(values, years, up ){

	up = up ? up : 0;

	var arr = []
	for( var i = 0; i < years * 12; i++){
		var it = i >= values.length ? i % values.length : i;

		arr.push(  values[it] * ( 1 + ( up / 12 * i ))  )
	}

	return arr
}
var rawSavings = 1000;
var mintSavings = mintIncome.map( function(inc,i){ return inc - mintExpenses[i]})
var cumSavings = runningTotal(mintSavings),
	cumIncome = runningTotal(mintIncome)
	cumExpense = runningTotal(mintExpenses)

var tyIncome,
	tyExpenses,
	tySavings,
	tyCumSavings,
	investedSavings,
	tyRawSavings,
	tyRawInvestedSavings

function compoundSavings( cf, apr ){
	var savings = [], 
		i = 1,
		daily = 360,
		apm = apr / 12.0

	savings[0] = cf[0]

	for( i; i < cf.length; i++ ){
		if( cf[i] > 0 ){
			savings[i] = compound( savings[i - 1], apm, daily ) + cf[i]
		} else {
			savings[i] = savings[i -1] + cf[i]
		}
	}

	return savings.map( function(x){ return Math.round( x, 0)})
}

function makeAllYears( years, apr, savings){
	 apr = apr ? apr : 0.08
	rawSavings = savings ? savings : rawSavings;

    tyIncome = overYears( mintIncome, years)
	tyExpenses = overYears( mintExpenses, years)
	tySavings = overYears( mintSavings, years)
	tyCumSavings = runningTotal( tySavings )
	investedSavings = compoundSavings( tySavings, apr)

	var tempRaw =  Array.apply(null, new Array( years * 12 )).map(Number.prototype.valueOf,rawSavings)
	tyRawSavings =  runningTotal(tempRaw);
	tyRawInvestedSavings = compoundSavings( tempRaw, apr )
}

function runningTotal( arr ){

	function sum(arr, index){
		return arr.slice(0,index).reduce(function(a,b){return a + b})
	}
	return arr.map( function(a,b,c){ return (b === 0) ?  a :  a + sum(c,b)})

}


var vpW = $('.container-fluid').width(),
	w = vpW > 1140 ? vpW: 1140;

var h = 500;
var barpadding = 0;
var margins = { top: 5, bottom: 20, right: 20, left: 20}
	w -= margins.right
function getMaxOfArray(numArray) {
    return Math.max.apply(null, numArray);
}

function getMinOfArray(numArray) {
    return Math.min.apply(null, numArray);
}

function updateScale(maxdata, mindata){
	//console.log('scales')
	var max = getMaxOfArray( maxdata ),
		min = getMinOfArray( mindata )

	//console.log(max +', ' + min)
	scale = d3.scale.linear()
					.domain([min, max])
					.range([5, 500])
	return scale
}

function updateScaleByValue(max, min){
	

	scale = d3.scale.linear()
					.domain([min, max])
					.range([1, 500])
	return scale
}
var scale 

/*
var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
*/
var svg = d3.select('#savings-chart')
			.append('svg')
			.attr('width', w)
			.attr('height',h)
			
			.attr('class', 'graph')
			
var dataset = savings.values
var l = savings.values.length
var dw = Math.round( (w / l) - ( barpadding))

function setBasis( arr ){

	l = arr.length
	dw = (w/l) - 1
}

var tip = d3.tip().attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    return "<span style='color:white'>"+ numeral(d).format('$0,0') + "</span>";
  })

svg.call(tip)

function makeBarGraphs( income, expenses, savings ){
	var cumulative = runningTotal( savings ),
		bigarray = income.concat( expenses ),
		baseline = expenses.max,
		maxincome = [ income.max, cumulative.max ].max,
		minmin = [income.min, expenses.min].min,
		fullmax = maxincome + baseline,
		c = []
	
setBasis(income)
svg.selectAll('rect').remove()
	if( arguments[3] === 'invest'){
	 	console.log('invested')
	 	c = compoundSavings( savings, 0.08)
	 	updateScaleByValue( c.max, minmin )
		 

	 	svg.selectAll('invested')
			.data(c)
			.enter()
			.append('rect')
			.attr('class', 'stuff')
			.attr('class', 'invested')
			.attr('x',function(d,i){ return i * (dw+1)})
			.attr('y',function(d,i){ return  h - scale(baseline)})
			.attr('width', dw)
			.attr('height', 0)
			.attr('fill', 'purple')
			.style('opacity', 0.8)
			.on('mouseover', tip.html(function(d){return '<span>Invested</span><br><span>' + numeral(d).format('$0,0') +'</span>'}))
			.on('mouseover', tip.show)
		    .on('mouseout', tip.hide)
			.transition()
				.delay(function(d,i){ return 1800 + i * 5})
				.duration(1000)
				.ease('back-out')
			.attr('y',function(d,i){ return  h - scale(baseline) - scale(d)})
			.attr('height', function(d){ return scale(d);})
	 
	}else{ 
		updateScaleByValue( fullmax, minmin ) 
	}
	
	
	

	
	svg.selectAll('cumulative')
	.data(cumulative)
	.enter()
	.append('rect')
	.attr('class', 'stuff')
	.attr('class', 'cumulative')
	.attr('x',function(d,i){ return i * (dw+1)})
	.attr('y',function(d,i){ return  h - scale(baseline)})
	.attr('width', dw)
	.attr('height', 0)
	.attr('fill', '#7B9F35')
	.style('opacity', 0.8)
	.on('mouseover', tip.html(function(d){return '<span>Cum Savings</span><br><span>' + numeral(d).format('$0,0') +'</span>'}))
			
	.on('mouseover', tip.show)
    .on('mouseout', tip.hide)
	.transition()
		.delay(function(d,i){ return 1520 + i * 5})
		.duration(1000)
		.ease('back-out')
	.attr('y',function(d,i){ return  h - scale(baseline) - scale(d)})
	.attr('height', function(d){ return scale(d);})
	
	
	


	svg.selectAll('income')
	.data(income)
	.enter()
	.append('rect')
	.attr('class', 'stuff')
	.attr('class', 'income')
	.attr('x',function(d,i){ return i * (dw+1)})
	.attr('y',function(d,i){ return  h - scale(d) - scale(baseline) })
	.attr('width', dw - barpadding)
	.attr('height', function(d){ return scale(d);})
	.attr('fill', '#354F00')
	.style('opacity', '0.8')
	.on('mouseover', tip.html(function(d){return '<span>Income</span><br><span>' + numeral(d).format('$0,0') +'</span>'}))
			
	.on('mouseover', tip.show)
      .on('mouseout', tip.hide)


	svg.selectAll('expenses')
	.data(expenses)
	.enter()
	.append('rect')
	.attr('class', 'stuff')
	.attr('class', 'expenses')
	.attr('x',function(d,i){ return i * (dw+1)})
	.attr('y',function(d,i){ return  h - scale(d) -scale(baseline) })
	.attr('width', dw - barpadding)
	.attr('height', function(d){ return scale(d);})
	.attr('fill', 'red')
	.style('opacity', 0.5)
	.on('mouseover', tip.html(function(d){return '<span>Expenses</span><br><span>' + numeral(d).format('$0,0') +'</span>'}))
			
	.on('mouseover', tip.show)
    .on('mouseout', tip.hide)




	svg.selectAll('.expenses')
	.data(expenses)
	.transition().duration(1500).ease('back-out') 
	.attr("transform", function(d){ return "translate(0,"+ scale(d)+")" })
	function incomeScale(d,i){
		var move = scale(d)
		if( income[i] < d){
			move = scale(d) -  scale( d - income[i]) + 2
		}
		return 'translate(0,' + move +')'

	}

	svg.selectAll('.income')	
	.data(expenses)
	.transition().duration(1500).ease('back-out') 
	.attr("transform", function(d,i){ return incomeScale(d,i) })
	  

	 
      
}


function makeBarGraph( dataset, klass, color, wid ){
	wid = wid === undefined ?  0 : wid;
	setBasis(dataset)
	svg.selectAll(klass).remove()

	svg.selectAll(klass)
	.data(dataset)
	.enter()
	.append('rect')
	.attr('class', 'stuff')
	.attr('class', klass)
	.attr('x',function(d,i){ return i * (dw+1)})
	.attr('y', 500)
	.attr('width', dw - barpadding - wid)
	.attr('height', function(d){ return scale(d);})
	.attr('fill', color)
	.transition().duration(1500).ease('back-out')
	.attr('y',function(d){ return  h - scale(d); })
	.attr("transform", "translate(" + margins.left + "," + margins.top + ")");

}

function makeAxis( years ){
	svg.selectAll('.tick').remove()
	var margin = {top: 10, right: 30, bottom: 30, left: 30},
    width = w - margin.left - margin.right,
    height = 500 
 
var x = d3.scale.linear()
    .domain([0, years])
    .range([0, w]);
 
var data = Array.apply(null, {length: years}).map(Number.call, Number)


var xAxis = d3.svg.axis()
    .scale(x)
    .orient("top")
    .tickValues(data)
    .innerTickSize([450])
    .outerTickSize([450]);
 
	svg.append("g")
    .attr("class", "x axis")
    .attr("width", 2)
    .attr("transform", "translate(5," + height + ")")
    .call(xAxis);
 
}

function setupGraph( years, apr, savings ){
	makeAllYears( years, apr, savings )
	makeBarGraphs( tyIncome,tyExpenses, tySavings)
}

Object.defineProperties( Array.prototype, { last: { get: function(){ return this.slice(-1)[0] } } } )
Object.defineProperties( Array.prototype, { max: { get: function(){ return Math.max.apply(null, this)} } } )
Object.defineProperties( Array.prototype, { min: { get: function(){ return Math.min.apply(null, this)} } } )

function graphTwenty( years){

	var max = Math.max( investedSavings.last,
						tyCumSavings.last, 
						tyRawSavings.last, 
						tyRawInvestedSavings.last)
	
	var min = 

	setBasis( years * 12)
	svg.selectAll('rect').remove()
	updateScale([max], tySavings )
	//updateScale(tyCumSavings)

	//makeBarGraph(tyRawSavings, 'trs', '#729134')
	makeBarGraph(tyRawInvestedSavings, 'tris', '#729134')
	makeBarGraph(investedSavings, 'x', '#BFD98D')
	makeBarGraph(tyCumSavings, 'a', '#92B056')
	makeBarGraph(tyIncome, 'b', '#377171')
	makeBarGraph(tyExpenses, 'c', '#E89797')
	makeBarGraph(tySavings, 'd', '#729134')

 	makeAxis(years )

}


function graphMint(){
	updateScale(cumSavings)

	makeBarGraph(cumSavings, 'a', 'blue')
	makeBarGraph(mintIncome, 'b', 'green')
	makeBarGraph(mintExpenses, 'c', 'red')
	makeBarGraph(mintSavings, 'd', '#5555FF')

}


function updateSavingsGraph(){
	dataset = savings.values
	//console.log('values ' + savings.values)
	updateScale(income.values)

	

	makeBarGraph(income.values, 'income', 'blue')
	makeBarGraph(housing.values, 'housing', 'red')
	makeBarGraph(housing.values, 'expenses', 'purple')
	makeBarGraph(savings.values, 'savings', '#48ca3b')
}
