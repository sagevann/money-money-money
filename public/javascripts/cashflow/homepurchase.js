function HomePurchase(  ){
	var o = arguments[0] ? arguments[0] : { price: 100000.00, down: 20000.0, apr: .04, term: 30, taxrate: 0.12 }
	this.price = o.price ? o.price : 100000.00;
	this.down = o.down ? o.down : 20000.0;
	this.apr = o.apr ? o.apr : .04;
	this.term = o.term ? o.term : 30; //years
	this.taxrate = o.taxrate ? o.taxrate : .012;

}

Object.defineProperties( HomePurchase.prototype,
	 		{ 
	 			principal: 	{ get: function(){ return this.price - this.down;} },
	 			P: 			{ get: function(){ return this.principal }},
	 			i: 			{ get: function(){ return (this.apr <= 1) ?  this.apr /12.0 : this.apr / 1200.0 } },
				n:			{ get: function(){ return this.term * 12 } },
				iN: 		{ get: function(){ return Math.pow( (1 + this.i ), this.n ); } },
				pmt: 		{ get: function(){ return (this.P * (this.i * this.iN) / (this.iN - 1)); } },
				pctDown: 	{ get: function(){ return ((this.down / this.price ) * 100.0 );},
							  set: function(pct){ var d = this.price * pct; ( pct >= 1 ) ? this.down = d/100.0 : this.down = d; }},
				pmi: 		{ get: function(){ return estimatePmi( this.pctDown, this.price )  }},
				taxes: 		{ get: function(){ return ( this.price * this.taxrate ) / 12.0 }},
				piti: 		{ get: function(){ return this.pmt + this.taxes + this.pmi }}
		   }

);

var pmi_co = [ 81.8428571428572, -4.44047619047619,  0.0228571428571432, 0.00333333333333332]

function estimatePmi( p, P ){
	p = (p < 1) ? p * 100.0 : p
	if( p >= 20 ) return 0;

	var base = pmi_co[0] + pmi_co[1] * p + pmi_co[2] * Math.pow(p,2) + pmi_co[3] * Math.pow(p,3)
	var mult = P / 100000.0;
	return  Math.round( mult * base ) 
}

function appreciateHouse( price, months, rate ){
	rate = ( rate > 1 ) ? rate / 100.0 : rate

	if( months === 0 ){
		//console.log('price exiting with ' + price.toFixed(0));
		return Number(price.toFixed(0));
	} else {
		//console.log( 'else ' + months)
		price = price * (1+( rate / 12.0) )
		months -= 1
		return appreciateHouse( price, months, rate)
	}
}

function principalPaid( payment, principal, rate){
	rate = ( rate > 1 ) ? rate / 100.0 : rate
	
	var interest_accrued = principal * rate,
		principal_paid = payment - interest_accrued

		return principal_paid
}

