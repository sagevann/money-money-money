var base = {}
base.price = 450000
base.apr = 0.045
base.term = 30
base.appreciation = 10.9

base.down ={}
base.down.pct = 0.07
base.down.$ = base.price * base.down.pct

base.exp = {} 
base.exp.other = 7200
base.exp.rent = 300

function appreciateHouse( price, months, rate ){
	if(typeof rate === 'undefined') rate = base.appreciation

	if( months === 0 ){
		console.log('price exiting with ' + price.toFixed(0));
		return price.toFixed(0);
	} else {
		console.log( 'else ' + months)
		price = price * (1+( rate / 1200.0) )
		months -= 1
		return appreciateHouse( price, months, rate)
	}
}

function makeMortageFromForm( form_id )
{
	var p = $(form_id)
	var o = {}
		
		o.price	= parseInt( p.find('.price').val() )|| base.price
		o.apr 	= p.find('.apr').val() / 100.0 || base.apr
		o.dPct 	= p.find('.pct-down').val() / 100.0 || base.down.pct
		o.term = p.find('.term').val() || base.term

	console.log( o)
	//	fees 	= $('fees'),
	//	tax 	= $('property-tax')
	return new Mortgage( o )

}

function updateMortgage( form_id ){
	console.log('updatemtg ' + form_id)
	var p = $(form_id)
	var pmt = calcPayment( form_id )
	console.log(pmt)
	p.find('.payment').text('$'+ pmt )
}

function updateDown( form_id ){
	var p = $(form_id), down = convertDownToDollars(form_id)
	p.find('.dollars-down').text('($'+down+')')
	p.find('.down').val(down)
}

//var now_mtg_bb = new Mortgage()
//var then_mtg_bb = new Mortgage()

var mtgs = { now: "#buy-now-mtg", then: "#buy-then-mtg"}

var now_mtg = {}
now_mtg.$p = $(mtgs.now)
now_mtg.id = '#buy-now-mtg'
now_mtg.updateDown = updateDown;
now_mtg.updateMortgage = updateMortgage
now_mtg.$price =	now_mtg.$p.find('.price')
now_mtg.$pctDown =	now_mtg.$p.find('.pct-down')
now_mtg.$apr = 		now_mtg.$p.find('.apr')
now_mtg.$term = 	now_mtg.$p.find('.term')
now_mtg.views = [ now_mtg.id + ' .price', now_mtg.id + ' .pct-down', now_mtg.id + ' .apr', now_mtg.id + ' .term']




var then_mtg = {}
then_mtg.$p = $(mtgs.then)
then_mtg.id = '#buy-then-mtg'
then_mtg.updateDown = updateDown;
then_mtg.updateMortgage = updateMortgage
then_mtg.$price =	then_mtg.$p.find('.price')
then_mtg.$sPeriod =	then_mtg.$p.find('.saving-period')

function updateNewMortgage( ){
	var p = $('.old-price .price').val(),
		m = $('.saving-period').val(),
		r = $('.app-rate').val(),
		d = now_mtg.$pctDown.val( ) 
		np = appreciateHouse( p, m, r)
		console.log('price is ' + np)

		$('.new-price .price').val( np)
		d = np * d / 100.0
		
		var pmt = calcPmt( np, d, now_mtg.$apr.val(), now_mtg.$term.val())
		console.log('pmt for new = ' + pmt)
		then_mtg.$p.find('.payment').text(pmt)

}

$(function(){

	now_mtg.updateMortgage( mtgs.now)
	then_mtg.updateMortgage( mtgs.then)
	updateNewMortgage()
	
	$('#calculate-payment').click( function(e){
		e.preventDefault();
		now_mtg = makeMortageFromForm( )
		updateBaseMortgage( )
	})

	$(now_mtg.views.join(',')).on('change', function(){

		//update old mortgage
		var pmt = calcPmt( $now_mtg.$price.val(), $now_mtg.$pctDown.val() * $now_mtg. )
		now_mtg = makeMortageFromForm( mtgs.now)
		then_mtg.updateMortgage( mtgs.now )
		updateDown(mtgs.now)

	})

	$(then_mtg.$sPeriod).on('change', function(){
		updateNewMortgage()
		//now_mtg = makeMortageFromForm( mtgs.now)
		console.log('then')
		//updateDown(mtgs.then)

	})


	now_mtg.$pctDown.on('change', function(){

		updateDown(mtgs.now)
	})

	
})


