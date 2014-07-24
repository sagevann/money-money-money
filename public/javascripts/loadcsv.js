 $(document).on('change', '.btn-file :file', function() {
    var input = $(this),
        numFiles = input.get(0).files ? input.get(0).files.length : 1,
        label = input.val().replace(/\\/g, '/').replace(/.*\//, '');
    input.trigger('fileselect', [numFiles, label]);
  });


  $('.btn-file :file').on('fileselect', function(event, numFiles, label) {
      console.log('fileselect')
      var input = $(this).parents('.input-group').find(':text'),
          log = numFiles > 1 ? numFiles + ' files selected' : label;
      
      if( input.length ) {
        console.log('log')
          input.val(log);


          $('input[type=file]').parse({
            config: { complete: completeFn},
            before: function(file, inputElem)
            {
              // executed before parsing each file begins;
              // what you return here controls the flow
            },
            error: function(err, file, inputElem, reason)
            {
              // executed if an error occurs while loading the file,
              // or if before callback aborted for some reason
            },
            complete: function(results)
            {
              console.log('completed')
              // executed after all files are complete
              console.log('Results' + results)
            }
          });
      } else {
          if( log ) alert(log);

         
      }
      
  });

function completeFn(results)
{
  
  if (results && results.errors)
  {
    if (results.errors)
    {
      errorCount = results.errors.length;
      firstError = results.errors[0];
    }
    if (results.data && results.data.length > 0)
      rowCount = results.data.length;
  }

  console.log("    Results:", results);

  // icky hack
  loaded_file = results
  buildTable(results)
}


function buildTable(csv){
  console.log( csv.data[0][1])
  var d = csv.data
  var data
  for( var r = 0; r < d.length; r++ ){
    var row = '<tr>'
    for( var c = 0; c < d[r].length; c++){
      row += '<td>'+d[r][c]+'</td>'
    }

    row +='</tr>'
    data +=row
  }

  $('#csv-output').append(data)
}
 