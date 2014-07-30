
var config = generateOptions( 1140, 500, 5, 20, 20, 20, 0)
//set up graph basics 
//var barpadding = 0,
//	margins = { top: 5, bottom: 20, right: 20, left: 20},
//	h = 500,
//	vpW = $('.container-fluid').width(),
//	w = vpW > 1140 ? vpW: 1140,
//	l = 0,
//	dw = 0,

var	scale,
	monthlyScale
	
//	w -= margins.right

//the svg element to graph on
function createChartArea( selector, width, height, klass ){

	klass = klass ? klass : 'chartArea'

	return d3.select(selector)
			 .append('svg')
			 .attr('width', width)
			 .attr('height', height)
			 .attr('class', klass )

}

//this could be more abstracted but works for now
function createBarTooltip( klass, title ){

	var fc = function(d) { return "<span style='color:white'>" + numeral(d).format('$0,0') + "</span>"; }
    			
	return d3.tip()
			 .attr('class', klass)
  			 .offset([-10, 0])
  			 .html( fc )
}

var svg = createChartArea( '#savings-chart', config.width, config.height, 'graph')
/*
var svg = d3.select('#savings-chart')
			.append('svg')
			.attr('width', config.width)
			.attr('height',config.height)
			.attr('class', 'graph')
*/

//setup d3 tool tip
var tip = createBarTooltip( 'i-tip')

svg.call(tip)



function graphSimulatedYears( income, expenses, years, apr){
	
	var m = simulateCashFlowOverYears(income, expenses, years)
	
	apr = apr < 1 ? apr : apr / 100.0; 
	return makeBarGraphs( m.income, m.expenses, m.savings, apr )

}

function updateScaleByArray(maxdata, mindata){
	var max = getMaxOfArray( maxdata ),
		min = getMinOfArray( mindata )

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

function updateMonthlyScaleByValue( max, min ){
	monthlyScale = d3.scale.linear()
					.domain([min, max])
					.range([1, 250])
	return monthlyScale
}


function makeBarGraphs( income, expenses, savings, apr ){
	console.log( 'makeBarGraphs')

	var cumulative = runningTotal( savings ),
		baseline = expenses.max,
		maxincome = [ income.max, cumulative.max ].max,
		minmin = [income.min, expenses.min].min,
		fullmax = maxincome + baseline,
		fv = []
		
	updateMonthlyScaleByValue( income.max, income.min )
	
	svg.selectAll('rect').remove()
	
	config.configureBars(income)

 	fv = compoundSavings( savings, apr)
 	//console.log( 'makeBarGraphs ' + fv[3])
 	
 	updateScaleByValue( fv.max, minmin )
	
 

 	function graphBar( target, klass, dataset, config, tooltip ){
 		var t = target.selectAll(klass)
                  .data(dataset).enter()
          				.append('rect')
          				.attr('class', klass)
          				.attr('x',function(d,i){ return i * (config.bars.width + 1)})
          				.attr('y',function(d,i){ return  config.height })
          				.attr('width', config.bars.width)
          				.attr('height', 0)
          				.attr('fill', 'purple')
          				.style('opacity', 0.8)

    if( tooltip ){
      t.on('mouseover', tooltip.show)
       .on('mouseout', tooltip.hide)
    }
        
          	t.transition()
          	   .delay(function(d,i){ return 1800 + i * 5})
          	   .duration(1000)
          	   .ease('back-out')
          	   .attr('y',function(d,i){ return  config.height - scale(d)})
               .attr('height', function(d){ return scale(d);})
    return t;

 	}

    graphBar( svg, 'invested', fv, config, tip )
  /*


 	svg.selectAll('invested')
		.data(fv).enter()
		.append('rect')
		.attr('class', 'stuff')
		.attr('class', 'invested')
		.attr('x',function(d,i){ return i * (config.bars.width + 1)})
		.attr('y',function(d,i){ return  config.height })
		.attr('width', config.bars.width)
		.attr('height', 0)
		.attr('fill', 'purple')
		.style('opacity', 0.8)
		.on('mouseover', tip.show)
	    .on('mouseout', tip.hide)
		.transition()
			.delay(function(d,i){ return 1800 + i * 5})
			.duration(1000)
			.ease('back-out')
		.attr('y',function(d,i){ return  config.height - scale(d)})
		.attr('height', function(d){ return scale(d);})
 /*
	
	svg.selectAll('cumulative')
	.data(cumulative)
	.enter()
	.append('rect')
	.attr('class', 'stuff')
	.attr('class', 'cumulative')
	.attr('x',function(d,i){ return i * (dw+1)})
	.attr('y',function(d,i){ return  h })
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
	.attr('y',function(d,i){ return  h - scale(d)})
	.attr('height', function(d){ return scale(d);})
	
	var oldScale = scale
	scale = monthlyScale
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
	
	//.on('mouseover', tip.html(function(d){return '<span>Expenses</span><br><span>' + numeral(d).format('$0,0') +'</span>'}))
	//.on('mouseover', tip.show)
    //.on('mouseout', tip.hide)

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
	  
	 scale = oldScale
*/
	 return [ income, expenses, savings, fv]
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

Object.defineProperties( Array.prototype, { last: { get: function(){ return this.slice(-1)[0] } } } )
Object.defineProperties( Array.prototype, { max: { get: function(){ return Math.max.apply(null, this)} } } )
Object.defineProperties( Array.prototype, { min: { get: function(){ return Math.min.apply(null, this)} } } )


