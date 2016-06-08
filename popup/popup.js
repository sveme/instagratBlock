function blockSite(e){
	console.log("works");
	let hours = document.getElementById("hour").value;
	let minutes = document.getElementById("minutes").value;
	let blockUntil = new Date();
	if (hours > 0){
		blockUntil.setHours(hours);
	}
	if (minutes > 0){
		blockUntil.setMinutes(minutes);
	}

	console.log(hours);
	console.log(minutes);
	console.log(blockUntil);

	chrome.tabs.getCurrent(
		function(tab){
			let url = tab.url; // TODO allow url matching patterns
	})
	console.log(url);
	let blockedSite = {"url": url, "blockUntil":blockUntil};
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
