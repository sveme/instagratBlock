class BlockedSite {
	constructor(url, hours, minutes, now){
		this.url = url;
		this.hours = hours;
		this.minutes = minutes;
		this.now = now;
	}
}

function blockSite(e){
	console.log("works");
	var hours = document.getElementById("hour").value;
	var minutes = document.getElementById("minutes").value;
	var timeNow = new Date();
	console.log(hours);
	console.log(minutes);
	console.log(timeNow);
	chrome.tabs.getCurrent(
		function(tab){
			var url = tab.url;
	})
	console.log(url);
	var blockedSite = new BlockedSite(url, hours, minutes, timeNow);

	window.close();
}

var blockNow = document.getElementById("block");
var blockCancel = document.getElementById("cancel");

blockCancel.addEventListener("click", function(e){
	window.close();
	// close the tab
});
blockNow.addEventListener("click", blockSite);
