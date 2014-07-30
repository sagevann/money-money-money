//set up graph basics 
//options for large graph
function generateOptions( width, height, top, right, bottom, left, pad  ){
	var options = {}

	options.margin = { 	top: 	top,
					   	bottom: bottom,
						right: 	right,
						left: 	left
					}

	

	options.width = width
	options.height = height
	options.inner = { width:  width - left - right,
					  height: height - top - bottom 
					}

	options.bars = { count: 0,
					 width: 0,
					 pad: pad
					} 
	

	options.configureBars = function( dataArray ){
			this.bars.count = dataArray.length
			this.bars.width = (this.width / this.bars.count )
		}

	return options;


}

