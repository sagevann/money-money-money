//Financial calculation tools

function compound(principal, rate, periods){
	var periodicRate = 1.0 + rate  / periods
	return principal * Math.pow(periodicRate, periods)
}


function compoundSavings( cf, apr ){
	var fv = [], 
		i = 1,
		daily = 360.0,
		apm = apr / 12.0

	fv[0] = cf[0]

	for( i; i < cf.length; i++ ){
		if( cf[i] > 0 ){
			fv[i] = compound( fv[i - 1], apm, daily ) + cf[i]
		} else {
			fv[i] = fv[i -1] + cf[i]
		}

		console.log(fv[i])
	}

	return fv.map( function(x){ return Math.round( x, 0)})
}

function runningTotal( arr ){
	function sum(arr, index){
		return arr.slice(0,index).reduce(function(a,b){return a + b})
	}
	return arr.map( function(a,b,c){ return (b === 0) ?  a :  a + sum(c,b)})

}

//Standard Deviation
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

//uses d3.random.normal to create a function that will
//generate random normal values given an array
//returns a function
function createRnormFromArray( arr ){
	var m = d3.mean(arr),
		s = sd(arr)

	return d3.random.normal(m,s)
}

//given an array of values and a number of years
//this will create a random normal probabilty function
//and then iterate 
function monthlyRandomValuesOverYears( input, years ){

	var i = 0, 
		v =[],
		generator = createRnormFromArray( input )

	for(i; i < years * 12; i++){
		var g = generator()
		v.push( Math.abs(g) )
	}

	return v
}


function applyValueFloor( arr, floor ){
	return arr.map( function(a){ return a > floor ? a : floor })
}

function monthlyRandomValuesOverYears( seed, years ){

	var i = 0, 
		v =[],
		generator = createRnormFromArray( seed )

	for(i; i < years * 12; i++){
		var g = generator()
		v.push( Math.abs(g) )
	}

	return v
}

function simulateCashFlowOverYears( seedIncome, seedExpenses, years){
	
	var a = { income:   monthlyRandomValuesOverYears( seedIncome, years),
			  expenses: applyValueFloor( monthlyRandomValuesOverYears( seedExpenses, years), d3.min( seedExpenses )  )
			 }
		a.savings = a.income.map(function(b,i){ return b - a.expenses[i]})

	return a;
}
