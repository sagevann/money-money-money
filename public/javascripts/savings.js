
function ValueOverTime( initial, periods ){
	this.initial = initial;
	this.periods = periods;
}

//values 
function valueArray( ){

	var arr = [this.initial]
	for( var i = 2; i <= this.periods; i++){
		arr.push( this.initial * i)
	}
	return arr
}

Object.defineProperties( ValueOverTime.prototype,
	{ 
		values:   { get: valueArray } 
	});

var income   = new ValueOverTime(0,24),
	housing  = new ValueOverTime(0,24),
	expenses  = new ValueOverTime(0,24),
	savings   = new ValueOverTime(0,24)

function setInitial(value, category){
	category['initial'] = Number(value);
	updateSavings()
}

function updateSavings(){
	var saving = income.initial - housing.initial - expenses.initial
	savings.initial = saving

	updateSavingsGraph()
}

$(function(){
	console.log('Savings JS is loaded');
	

	$('#m-income').on('change', function(e){ setInitial( $(this).val(), income) } )
	$('#m-housing').on('change', function(e){ setInitial( $(this).val(), housing) } )
	$('#m-expenses').on('change', function(e){ setInitial( $(this).val(), expenses) } )


})