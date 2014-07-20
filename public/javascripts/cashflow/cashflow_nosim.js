

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

	var o = arguments[0] ? arguments[0] : { periods: { '1m':1}, cashflow: new CashFlow()}
	this.periods = { '1m': 1, '3m': 3, '6m': 6, '1Y':12, '2Y':24, '3Y':36, '5Y':60, '10Y':120, '15Y':15*12, '20Y':240, '30Y':360 }
	
	this.cashflow = {}
	this.cashflow.base = o.cashflow ? o.cashflow : new CashFlow( {in: 10000.0, out: 4000.00, housing: 2500.00 })

	this.purchases = {}

	this.cashFlowData = function(){
		//console.log( this.periods + ' is the period')
		var a = [],
			p = this.periods,
			c = this.cashflow

		for( var i in p){

			//console.log('c[' + i + ']=' + c[i])
			//console.log(c)
			c.base = c[i] ? c[i] : c.base
			a.push(c.base)			

		}
		return a
	}//cumulative

	this.cumulativeCashflow = function(){
		var cf = this.cashFlowData(),
			pa = _.map( this.periods, function(a){ return a }),
			cumulative = []
			_.forEach(cf, function(cf,i){    
				var c = {}
				c.in =  pa[i] * cf.in
				c.savings = pa[i] * cf.savings
				c.expenses = pa[i] * cf.expenses

				cumulative.push(c)
				
			})
			
		return  cumulative

	}

	this.newPurchase = function( purchase ){
		this.purchases[purchase.period] = purchase;
		if( purchase.monthly > 0 ){
			var cf = this.cashflow
			this.cashflow[purchase.period] = new CashFlow( { in: cf.in, out: cf.out, housing: purchase.monthly  })
		}
	}
}//simulation


//sum up properties of objects in an array
function sumObjects( a, obj, prop){
	return a.reduce( function(p, c, i, arr){ return p + arr[i][obj][prop] });
}

function Purchase( item, cost, period){

	this.item = item ? item : 'EXPENSE'
	this.cost = cost ? cost : 0
	this.period = period ? period : 0
	this.monthly = arguments[3] ? arguments[3] : 0
}


function makeSimulation(){
	var m_i = Number($('#m-income').val()), 
		m_o = Number($('#m-spending').val()),
		m_h = Number($('#m-housing').val())

	console.log( 'ms ' + m_h +','+m_o+','+m_i)
	return new Simulation( { periods: 36, cashFlow: new CashFlow( { in: m_i, out: m_o, housing: m_h }) });
}


function makeCashFlowRow( cf, prop, row_class ){
	var el = $(row_class)
	for( var i in periods ){ 
		var value = numeral(cf[prop] * periods[i]).format('($0,0)')
		el.append('<td>'+value+'</td>') }
}

function makePeriodsRow( p ){
	console.log('periods row')
	var el=$('.periods')
	for( var i in p){ el.append('<td>'+i+'</td>') }
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
function makeNetRow(cf){
	var el = $('.net'),
		ex = 0
		for( var i in periods){ 
			//if( sim.purchases[i]  ){ex += sim.purchases[i].cost;}
			f = numeral( cf.savings * periods[i] - ex).format('($0,0)')
			el.append('<td>'+f+'</td>') 
		}

}

function addPurchaseToSim(){
	var p = Number($('#p-time').val()),
		item = $('#p-item').val(),
		cost = Number($('#p-cost').val())

	console.log( 'adding ' + p +',' +item+','+cost)

	purchases.push({ p:p, purch: new Purchase(item, cost)})
}

function normalizePurchasePeriod( p ){

	for( var i in periods ){
		if( periods[i] >= p){
			return periods[i]
		}
	}
}

function addPurchase( ){

var p =  periods[ $('#p-time').val() ],
		item = $('#p-item').val(),
		cost = Number($('#p-cost').val())
		monthly = Number($('#p-monthly').val())

	console.log( 'adding ' + p +',' +item+','+cost + ',' + monthly)

	purchases.push( new Purchase(item, cost, p))

}

var purchases = []
var periods = { '1m': 1, '3m': 3, '6m': 6, '1Y':12, '2Y':24, '3Y':36, '5Y':60, '10Y':120, '15Y':15*12, '20Y':240, '30Y':360 }

function makeButtonBar( ){

	for( var i in periods ){
		var c = 'p_' + i
		$('.period-btns').append( '<button type="button" class="btn btn-default '+c+'">'+i+'</button>')
		$( '.'+c).click(function(){ $('#p-time').val( $(this).text() )})
	}
}




