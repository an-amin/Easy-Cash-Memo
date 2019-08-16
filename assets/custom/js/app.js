const _today_	= new Date,
	_year_	= _today_.getFullYear(),
	_month_	= _today_.getMonth(),
	_date_	= _today_.getDate();

var cash_memo_tr = function(sl=0){
	return `
                <tr class="inputRow">
                  <td class="index text-right tdSL">${sl}</td>
                  <td class="tdDescription">
                    <div class="input-group input-group-sm">
                      <input name="product_description" type="text" class="form-control inputDescription" placeholder="Enter description..." required="">
                    </div>
                  </td>
                  <td class="tdQty">
                    <div class="input-group input-group-sm">
                      <input name="product_qty" type="number" class="form-control text-center inputQty" placeholder="0" value="1" step="1" min="1" required="">
                    </div>
                  </td>
                  <td class="tdRate">
                    <div class="input-group input-group-sm">
                      <input name="product_rate" type="number" class="form-control text-right inputRate" placeholder="00.00" step="0.01" min="1" required="">
                    </div>
                  </td>
                  <td class=" text-right">
                    <span class="tdAmount">00.00</span>
                    <input name="product_amount" type="hidden" class="inputAmount">
                  </td>
                  <td class="text-center">
                    <a title="Delete this row" class="text-danger delete_row" href="javascript:void(0);"><i class="fa fa-times-circle"></i></a>
                  </td>
                </tr>`;
};

var overlay = `
    <div id="overlay">
      <h1 class="text-center">
        <i class="fa fa-sync fa-spin fa-4x"></i>
      </h1>
    </div>`;


(function($){
	$(document).ready(function(){

		// $('.toolTip').tooltip();
		$(document).find('.toolTip').tooltip();

		const releaseYear = Number($(document).find('#releaseYear').text());

		if(releaseYear<_year_)
			$(document).find('#thisYear').html( '-' + _year_);


		$(document).on('click', '.delete_row', function(){
			$(this).closest('tr').remove();
			sortTblIndex();
			updateAmount();
		});


		$(document).on('click', '#add_new_cash_memo_tr', function(){
			let last_sl = $('#myTable>tbody>tr').length;
			$('#myTable>tbody').append(cash_memo_tr(++last_sl));
			$('#myTable>tbody>tr:last-child>td:nth-child(2) input').focus();
			updateAmount();
		});



		$(document).on('submit', '#form', function(e){
			e.preventDefault();
			if(!confirm('Do you confirm?'))
				return undefined;

			openOverlay();
			// setTimeout(closeOverlay, 5000);
			let formData = $(this).serializeArray();

			let memo 		= {},
				custommer 	= {},
				product 	= {
					title 	:[],
					qty 	:[],
					rate 	:[],
					amount  :[]
				},
				total		= {};
			memo.no 		= formData[0].value; 
			memo.date 		= formData[1].value; 
			custommer.name 	= formData[2].value; 
			custommer.addr 	= formData[3].value; 
			custommer.mob 	= formData[4].value; 
			total.amount	= formData[formData.length-2].value;
			total.in_words 	= formData[formData.length-1].value; 

			delete formData[formData.length-2];
			delete formData[formData.length-1];
			delete formData[4];
			delete formData[3];
			delete formData[2];
			delete formData[1];
			delete formData[0];

			// console.log(formData);
			$.each(formData, function(i,v){
				// console.log(i,v);
				if(v!=undefined){
					switch(v.name)
					{
						case "product_description" : 
							product.title.push(v.value); 
							break;
						case "product_qty" : 
							product.qty.push(v.value); 
							break;
						case "product_rate" : 
							product.rate.push(v.value); 
							break;
						case "product_amount" :
							product.amount.push(v.value); 
							break;
					}
				}
			});

			let memo_tbl = [],
				allData = {};

			$.each(product.title, function(i){
				let row = {};
					row.title = product.title[i];
					row.qty = product.qty[i];
					row.rate = product.rate[i];
					row.amount = product.rate[i];
				memo_tbl.push(row);
			});

			allData = {
				memo		: memo,
				customer	: custommer,
				item_tbl 	: memo_tbl,
				total 		: total
			};
			generatePrintLayout(allData);

		});


		$(document).on('keyup', '.inputQty', function(){
			updateAmount(this);
		});


		$(document).on('keyup', '.inputRate', function(){
			updateAmount(this);
		});


		$('.datePicker').datepicker({
			dateFormat 	: 'dd-mm-yy',
			setDate		: _today_
		}).datepicker('setDate', _today_);

		$(document).on('click', '#auto_generate_memo_no', function(){
			$(document).find('input#memo_no').val(UID());
		});

	});
})(jQuery)