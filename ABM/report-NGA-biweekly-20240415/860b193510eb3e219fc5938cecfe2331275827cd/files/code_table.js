     $(document).ready(function () {
		 
		 //uses moment module to get dataTables ready for date format
		 $.fn.dataTable.moment( 'DD-MMM-YY' );

         var table = $('#conflictList').DataTable({
             "data": confData.features,
			 "pagingType": "simple_numbers",
             select:"single",
             "columns": [
                 { "data": "properties.date" },
                 { "data": "properties.location" },
                 { "data": "properties.fatalities" },
				                  {
                     "className": 'details-control',
                     "orderable": false,
                     "data": "click",
                     "defaultContent": '',
                     "render": function () {
                         return '<i class="fa fa-plus-square" aria-hidden="true"></i>';
                     },
                     width:"15px"
                 }
             ],
             "order": [[0, 'asc']],
			 //replace 'search' with 'filter'
			 "language": {
    "search": "Filter:"
  },
  			 "columnDefs": [
       {"className": "dt-center", "targets": [ 0, 2, 3 ]}]
         });

         // Add event listener for opening and closing details
         $('#conflictList tbody').on('click', 'td.details-control', function () {
             var tr = $(this).closest('tr');
             var tdi = tr.find("i.fa");
             var row = table.row(tr);

             if (row.child.isShown()) {
                 // This row is already open - close it
                 row.child.hide();
                 tr.removeClass('shown');
                 tdi.first().removeClass('fa-minus-square');
                 tdi.first().addClass('fa-plus-square');
             }
             else {
                 // Open this row
                 row.child(format(row.data())).show();
                 tr.addClass('shown');
                 tdi.first().removeClass('fa-plus-square');
                 tdi.first().addClass('fa-minus-square');
             }
         });

         table.on("user-select", function (e, dt, type, cell, originalEvent) {
             if ($(cell.node()).hasClass("details-control")) {
                 e.preventDefault();
             }
         });
     });

    function format(d){
        
         // `d` is the original data object for the row
         return d.properties.detail;  
    }
	
	
	
	//code for button to show/hide table
	$(document).ready(function(){
        $("#showConflictList").click(function(){
          $("#conflictListBlock").toggle();
        });
      });