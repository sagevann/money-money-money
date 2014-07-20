var mintExpenses = [ 467, 5755, 5379, 3432, 8023, 5013,
					 4234, 2922, 2952, 2649, 2346, 3274,
					 
					 4084, 2687, 7026, 2571, 4966, 5253, 
					 10026, 7009, 9078, 14524, 8264, 12603,
					 
					 15138, 12701, 12213, 12441, 9535, 13778, 
					 10063, 9426, 12538, 13593, 7498, 8455,
					 
					 7951, 7420, 8428, 17749, 6778, 4267]

var mintIncome = [	 2090,4050,3986,12812,4230,3946,
					 9166,6034,4546,6938,431,63,

					 26,6096,10321,202,140,3378,
					 5857,6617,4383,6811,12237,26486,
					 
					 23417,39166,254,30973,4726,10890,
					 6106,1185,11748,8346,7724,16025,
					 
					 3891,6193,5326,21150,12717,9995
]

var mintSavings = mintIncome.map( function(inc,i){ return inc - mintExpenses[i]})
var cumSavings = runningTotal(mintSavings),
	cumIncome = runningTotal(mintIncome)
	cumExpense = runningTotal(mintExpenses)

function runningTotal( arr ){

	function sum(arr, index){
		return arr.slice(0,index).reduce(function(a,b){return a + b})
	}
	return arr.map( function(a,b,c){ return (b === 0) ?  a :  a + sum(c,b)})

}


var vpW = $('.container').width(),
	w = vpW > 1140 ? 1140: vpW;
var h = 250;
var barpadding = 1;

function getMaxOfArray(numArray) {
    return Math.max.apply(null, numArray);
}

function getMinOfArray(numArray) {
    return Math.min.apply(null, numArray);
}

function updateScale(dataset){
	console.log('scales')
	var max = getMaxOfArray( dataset ),
		
	console.log(max)
	scale = d3.scale.linear()
					.domain([0, max ])
					.range([0, h])
	return scale
}

var scale = updateScale()

var svg = d3.select('#savings-chart')
			.append('svg')
			.attr('width', w)
			.attr('height',h);

var dataset = savings.values
var l = savings.values.length
var dw = (w / l) - ( barpadding)

function setBasis( arr ){

	l = arr.length
	dw = (w/l) - barpadding
}


function makeBarGraph( dataset, klass, color, wid ){

	wid = wid === undefined ?  0 : wid;
	setBasis(dataset)
	svg.selectAll(klass).remove()

	svg.selectAll(klass)
	.data(dataset)
	.enter()
	.append('rect')
	.attr('class', klass)
	.attr('x',function(d,i){ return i * (dw+1)})
	.attr('y',function(d){ return  h - scale(d) })
	.attr('width', dw - barpadding - wid)
	.attr('height', function(d){ return scale(d);})
	.attr('fill', color)
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
	console.log('values ' + savings.values)
	updateScale(income.values)

	

	makeBarGraph(income.values, 'income', 'blue')
	makeBarGraph(housing.values, 'housing', 'red', 1)
	makeBarGraph(housing.values, 'expenses', 'purple',2)
	makeBarGraph(savings.values, 'savings', '#48ca3b',3)
}
