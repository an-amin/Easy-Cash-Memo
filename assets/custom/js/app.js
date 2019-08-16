var cash_memo_tr = function(sl=0){
	return `
	<tr class="inputRow">
	  <td class="index text-right tdSL">${sl}</td>
	  <td class="tdDescription">
	    <div class="input-group input-group-sm">
	      <input type="text" class="form-control inputDescription" placeholder="Enter description...">
	    </div>
	  </td>
	  <td class="tdQty">
	    <div class="input-group input-group-sm">
	      <input type="number" class="form-control text-center inputQty" placeholder="0" value="1" step="1" min="1">
	    </div>
	  </td>
	  <td class="tdRate">
	    <div class="input-group input-group-sm">
	      <input type="number" class="form-control text-right inputRate" placeholder="00.00" step="0.01" min="1">
	    </div>
	  </td>
	  <td class="tdAmount text-right">00.00</td>
	  <td class="text-center">
	    <a title="Delete this row" class="text-danger toolTip delete_row" href="javascript:void(0);"><i class="fa fa-times-circle"></i></a>
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

		const _today_	= new Date,
			_year_	= _today_.getFullYear(),
			_month_	= _today_.getMonth(),
			_date_	= _today_.getDate();

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
			updateAmount();
		});



		$(document).on('submit', '#form', function(e){
			e.preventDefault();
			openOverlay();
			setTimeout(closeOverlay, 5000);
		});

		function openOverlay(){
			$('body').append(overlay);
		}
		function closeOverlay(){
			$(document).find('#overlay').remove();
		}
		function sortTblIndex(){
			let tr = $('#myTable>tbody>tr');
			$.each(tr,function(i,v){
				$(v).find('td:first-child').text(++i);
			});
		}

		function updateAmount(This=false){
			if(This)
			{
				let 
					tr = $(This).closest('tr'),
					qty = tr.find('.inputQty').val(),
					rate = tr.find('.inputRate').val(),
					amount = 0;
				qty = qty ? Number(qty) : 0;
				rate = rate ? Number(rate) : 0;
				amount = qty*rate;
				amount = amount ? amount.toFixed(2) : '00.00';
				tr.find('.tdAmount').text(amount);

				let in_words = String(amount),
					in_words_splic = in_words.split('.'),
					taka = 'taka ' + toWords(in_words_splic[0]),
					paisa = ' & paisa ' + toWords(in_words_splic[1]) + ' only.';
				in_words = taka+paisa;

				$(document).find('#in_words').text(in_words);
			}

			let all_tr = $('#myTable>tbody>tr'),
				sum = 0;
			$.each(all_tr, function(i,v){
				sum += Number($(v).find('.tdAmount').text());
			});
			$(document).find('#subTotal').text(sum.toFixed(2));
			// console.log(sum);
		}

		$(document).on('keyup', '.inputQty', function(){
			updateAmount(this);
		});

		$(document).on('keyup', '.inputRate', function(){
			updateAmount(this);
		});



	});
})(jQuery)