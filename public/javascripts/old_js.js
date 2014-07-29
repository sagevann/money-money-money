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


function overYears(values, years, up ){

	up = up ? up : 0;

	var arr = []
	for( var i = 0; i < years * 12; i++){
		var it = i >= values.length ? i % values.length : i;

		arr.push(  values[it] * ( 1 + ( up / 12 * i ))  )
	}

	return arr
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