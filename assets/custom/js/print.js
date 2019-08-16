$(document).ready(function(){
	const urlParams = new URLSearchParams(window.location.search);
	const printData = JSON.parse(urlParams.get('data'));

	let tr = '';

	$.each(printData.item_tbl, function(i,v){
		tr += `<tr>`;
		tr +=	`<td></td>`;
		tr +=	`<td>${v.title}</td>`;
		tr +=	`<td>${v.qty}</td>`;
		tr +=	`<td>${v.amount}</td>`;
		tr +=`</tr>`;
	});

	let remaining_cols = 15 - printData.item_tbl.length; 

	for(i=0;i<=remaining_cols;++i)
	{
		tr += `<tr><td>${i}</td><td></td><td></td><td></td></tr>`
	}

	$(document).find('#item_tbl>tbody').html(tr);


	console.log(printData);

});