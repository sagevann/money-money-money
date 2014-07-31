
var config = generateOptions( 1140, 500, 5, 20, 20, 20, 1)
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
	console.log('dw ' + config.bars.width )
	config.configureBars(income)

  console.log('dw1 ' + config.bars.width )

 	fv = compoundSavings( savings, apr)
 	//console.log( 'makeBarGraphs ' + fv[3])
 	
 	updateScaleByValue( fv.max, minmin )
	
  function addAttr( selection, attr ){
        selection.attr(  attr.k,  attr.v)
   }
 
  function addAttrs( selection, attrs){
      for( var i =0; i < attrs.length; i++){
        addAttr( selection, attrs[i])
      }
  }

  function addStyle( selection, style ){
        selection.style(  style.k,  style.v)
   }
 
  function addStyles( selection, styles){
      for( var i =0; i < styles.length; i++){
         addStyle( selection, styles[i])
      }
  }

  function bindTip( selection, tip){
      selection.on('mouseover', tip.show)
               .on('mouseout', tip.hide)
  }

  function addTransition( selection, delayF, dur, ease, attrs ){

    var s = selection.transition()
                     .delay( delayF)
                     .duration(dur)
                     .ease(ease)

        addAttrs( s, attrs )
    return s;
  }

 function addAreaTransition( selection, delayF, dur, ease, y1 ){
    var s = addTransition( selection, delayF, dur, ease, [])
    s.y1(y1.v)

 }

  var transitions = {}
  transitions.invested = function( selection, dur ){
       addTransition( selection, 
                    function(d,i){ return 1800 + i * 5}, 
                    dur, 
                    'back-out', 
                    [ {k: 'y', v: function(d,i){ return  config.height - scale(d); } }, 
                      {k: 'height', v: function(d){ return scale(d) > 0 ? scale(d) : 0; } }
                    ])
    }

    transitions.saved = function( selection, dur ){
       addTransition( selection, 
                    function(d,i){ return 1520 + i * 5}, 
                    dur, 
                    'back-out', 
                    [ {k: 'y', v: function(d,i){ return  config.height - scale(d); } }, 
                      {k: 'height', v: function(d){ return scale(d) > 0 ? scale(d) : 0; } }
                    ])
    }
   
   transitions.general = function( selection, dur ){
       addTransition( selection, 
                    function(d,i){ return 100}, 
                    dur, 
                    'ease-out', 
                    [ {k: 'y', v: function(d,i){ return  config.height - scale(d) - scale(baseline); } }, 
                      {k: 'height', v: function(d){ return scale(d) > 0 ? scale(d) : 0; } }
                    ])
   }

/*
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
*/

function areaTransition(area) {
  d3.selectAll("path")
    .transition()
      .duration(2500)
      .attr("d", area);
}

function areaChart( target, data ){

  target.selectAll('path').remove()
  var x = d3.time.scale()
    .domain( [0, data.length])
    .range([0, config.width]);

  var area = d3.svg.area()
               .x(function(d,i) { return x(i); })
               .y0(config.height)  
               .y1(function(d){ return config.height - scale(d)})

/*
var area = d3.svg.area()
      .x(function(d) { return x(d.d); })
      .y0(h)
      .y1(function(d) { return y(d.x); });
 
  var path = vis.append("svg:path")
      .data([data])
      .attr("d", area);

Then when you want to update the area, you can say:

  path.data([newData]).transition().attr("d", area);

If you like, you can also avoid the data bind and pass the data
directly to the area generator:

  path.transition().attr("d", area(newData));

*/

var foo = []
for( var i = 0; i < data.length; i++ ){ foo.push(0)}
  var t = target.append("path")
             .datum(foo)
             .attr('d', area)
  
  t.transition().delay(500).duration(1500).attr('d', area(data))

console.log('area')


  //t.call( transitions.invested, 1000)
//[ {k: 'y', v: function(d,i){ return  config.height - scale(d) - scale(baseline); } }, 
 //                     {k: 'height', v: function(d){ return scale(d); } }
 //                   ]
}

function monthlyBarGraph( target, klass, dataset, config, attr, styles, transition, tooltip ){

    var t = target
              .selectAll(klass)
              .data(dataset).enter()
              .append('rect')
              .attr('class', klass)
              .attr('x',function(d,i){ return i * (config.bars.width + config.bars.pad)})
              .attr('y',function(d,i){ return  config.height - scale(baseline) })
              .attr('width', config.bars.width)
              .attr('height', 0 );

    if( attr )
      addAttrs( t, attr)

    if( styles)
      addStyles(t, styles)
                
    if( tooltip )
      bindTip( t, tooltip)
    
    //console.log( transition !== '' + ' t')
    if( transition !== ''){ 
    //  t.call( transitions[transition], 1000 )
    }else{
      t.call( transitions.general, 300)
    }  
    return t;
  }


 	function cumulativeBarGraph( target, klass, dataset, config, attr, styles, transition, tooltip ){
 		var t = target
              .selectAll(klass)
              .data(dataset).enter()
      				.append('rect')
      				.attr('class', klass)
      				.attr('x',function(d,i){ return i * (config.bars.width + config.bars.pad)})
      				.attr('y',function(d,i){ return config.height })
      				.attr('width', config.bars.width)
      				.attr('height', 0)

    if( attr )
      addAttrs( t, attr)

    if( styles)
      addStyles(t, styles)
          			
    if( tooltip )
      bindTip( t, tooltip)
    
    //console.log( transition !== '' + ' t')
    if( transition !== ''){ 
      t.call( transitions[transition], 1000 )
    }else{
      t.call( transitions.general, 1000)
    }  
    return t;
 	}


//areaChart( svg, fv)
 
 cumulativeBarGraph( svg, 'invested', fv, config, [{ k: 'fill', v: 'purple'}], [{ k: 'opacity', v: 0.8}], 'invested', tip )
 cumulativeBarGraph( svg, 'cumulative', cumulative, config, [{ k: 'fill', v: '#7B9F35'}], [{ k: 'opacity', v: 0.9}], 'saved', tip)
 monthlyBarGraph( svg, 'income', income, config, [{ k: 'fill', v: '#354F00'}], [{ k: 'opacity', v: 0.8}], '', tip)
monthlyBarGraph( svg, 'expenses', expenses, config, [{ k: 'fill', v: '#F00'}], [{ k: 'opacity', v: 0.8}], '', tip)
 
  /*

 
	
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


