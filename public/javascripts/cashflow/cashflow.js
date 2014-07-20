//set up to accept expenses
function CashFlow( ){
	var o = arguments[0] ? arguments[0] : { in: 1000.0, out: 500.0, housing: 500.0 }
	console.log(o)
	this.in = o.in ? o.in : 1000.00;
	this.housing = o.housing ? o.housing : 500.00;
	this.out = o.out ? o.out : 500.00;
	this.other = [0]
	

	this.addCashFlow = function( cf ){
		var c = { 	in: cf.in + this.in,
				  	out: cf.out + this.out,
				  	housing: cf.housing + this.housing 
				 }
		return new CashFlow( c )
	}
}


Object.defineProperties( CashFlow.prototype,
	 		{ 
	 			expenses:   { get: function(){ return this.housing + this.out + this.purchases } },
	 			savings: 	{ get: function(){ return this.in - this.expenses }},
	 			purchases:  { get: function(){ return this.other.reduce(function(c,p,i,v){return c+p })},
	 						  set: function(v){ this.other.push(v)}}, 
	 			toObj:   	{ get: function(){ return { in: this.in, out: this.out, housing: this.housing }} }
		   }
);

function Simulation( ){
	var o = arguments[0] ? arguments[0] : { periods: 24, cashFlow: new CashFlow()}
	this.periods = o.periods ? o.periods : 24; //months
	this.cashFlow = o.cashFlow ? o.cashFlow : new CashFlow( {in: 10000.0, out: 4000.00, housing: 2500.00 })
	this.yearly = { income: 	this.cashFlow.in * 12.0,
					expenses: 	this.cashFlow.expenses * 12.0,
					savings: 	this.cashFlow.savings * 12.0,
					housing:  	this.cashFlow.housing * 12.0,
				  }
	this.purchases = {}

	this.cumulative = function(end){
		var c = [ { cashflow: this.cashFlow, purchases: this.purchases[0], net: 'foo'}]
		for( var i = 1; i < end; i++){
			c.push( { cashflow: c[i-1].cashflow.addCashFlow( this.cashFlow ), purchases: this.purchases[i] })
		}

		return c;
	}//cumulative

	this.newPurchase = function( period, purchase ){
		this.purchases[period] = purchase;
	}
}

//sum up properties of objects in an array
function sumObjects( a, obj, prop){
	return a.reduce( function(p, c, i, arr){ return p + arr[i][obj][prop] });
}

function Purchase( item, cost){
	this.item = item ? item : 'EXPENSE'
	this.cost = cost ? cost : 0
}

	function makeCashFlowRow( cfa, prop, row_class ){
		var el = $(row_class)
		for( var i = 0; i < cfa.length; i ++){ el.append('<td>$'+cfa[i].cashflow[prop]+'</td>') }
	}

	function makePeriodsRow( c ){
		var el=$('.periods')
		for( var i = 0; i < c.length; i ++){ el.append('<td>Month '+i+'</td>') }
	} 


function makeSimulation(){
	var m_i = Number($('#m-income').val()), 
		m_o = Number($('#m-spending').val()),
		m_h = Number($('#m-housing').val())

	console.log( 'ms ' + m_h +','+m_o+','+m_i)
	return new Simulation( { periods: 36, cashFlow: new CashFlow( { in: m_i, out: m_o, housing: m_h }) });
}

function makePurchasesRow( cfa ){
		var el = $('.purchases'),
			p = 0

		for( var i = 0; i < cfa.length; i ++){ 
			var c = 0, s = ''
			console.log('i ' + i +', ' + sim.purchases[i])
			if( sim.purchases[i]  ){c = sim.purchases[i].cost; s='red'}
			el.append('<td class="'+s+'">$'+c+'</td>') 
		}
	}
function makeNetRow(cfa){
	var el = $('.net'),
		ex = 0
		for( var i = 0; i < cfa.length; i ++){ 
			
			console.log('i ' + i +', ' + sim.purchases[i])
			if( sim.purchases[i]  ){ex += sim.purchases[i].cost;}
			f = cfa[i].cashflow.savings - ex
			el.append('<td>$'+f+'</td>') 
		}

}

function addPurchaseToSim(){
	var p = Number($('#p-time').val()),
		item = $('#p-item').val(),
		cost = Number($('#p-cost').val())

	console.log( 'adding ' + p +',' +item+','+cost)

	purchases.push({ p:p, purch: new Purchase(item, cost)})
}


var purchases = []
var periods = { '1m': 1, '3m': 3, '6m': 6, '1Y':12, '2Y':24, '3Y':36, '5Y':60, '10Y':120, '15Y':15*12, '20Y':240, '30Y':360 }

var sim = new Simulation( { periods: 36, cashFlow: new CashFlow( { in: 12000.0, out: 7500.0, housing: 300.0 }) });

$(function(){
	
	var s = new Simulation( { periods: 36, cashFlow: new CashFlow( { in: 12000.0, out: 7500.0, housing: 300.0 }) });
	//var c = s.cumulative(12)
	
	$('.make-cashflow').click(function(){ sim = makeSimulation(); makeCashFlowTable( sim.cumulative(12) ) })
	$('.add-purchase').click(function(){ addPurchaseToSim() })

	var makeCashFlowTable =function(c){
		makePeriodsRow(c)
		makeCashFlowRow(c, 'in', '.income')
		makeCashFlowRow(c, 'expenses', '.expenses')
		makeCashFlowRow(c, 'savings', '.savings')
		for(var i = 0; i < purchases.length; i++){

			sim.newPurchase( purchases[i].p, purchases[i].purch)
		}
		makePurchasesRow(c)
		makeNetRow(c)
	}
});



