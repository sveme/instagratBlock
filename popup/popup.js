const hoursSelected = document.getElementById("hour");
const minutesSelected = document.getElementById("minutes");

function blockSite(e) {
	let hours = 0;
	let minutes = 0;
	try {
		hours = hoursSelected.value;
	}
	catch(exception) {
		hours = 0;
	}
	try {
		minutes = minutesSelected.value;
	}
	catch (exception){
		minutes = 0;
	}
	// sanitize inputs - make sure that it's numeric only TODO
	console.log("works");
	console.log(hours);
	console.log(minutes);

	let blockUntil = new Date();
	if (hours > 0){
		blockUntil.setHours(hours); // TODO get time arithmetics right
	}
	if (minutes > 0){
		blockUntil.setMinutes(minutes);
	}

	console.log(blockUntil);

	chrome.tabs.getCurrent(
		function(tab){
			let url = tab.url; // TODO allow url matching patterns
	})
	console.log(url);
	let blockedSite = {'url': url, 'blockUntil':blockUntil};
	chrome.runtime.sendMessage(blockedSite);
	window.close();
}

var blockNow = document.getElementById("block");
var blockCancel = document.getElementById("cancel");

blockCancel.addEventListener("click", function(e){
	window.close();
	// close the tab
});
blockNow.addEventListener("click", blockSite);
