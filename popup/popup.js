let blockedSites = {"site": "", "blockHours": 0, "blockMinutes": 0, "timeNow": 0};

function blockSite(e){
	let hours = document.getElementById("hour").value
	let minutes = document.getElementById("minutes").value
	let timeNow = date.timeNow; //?
	let website = 
	
	// sent message to background script to add to newly blocked website
	// get the selected time and add it to the list of things to block
	window.close();
}

let blockNow = document.getElementById("block");
let blockCancel = document.getElementById("cancel");

blockCancel.addEventListener("click", function(e){
	window.close();
	// close the tab
});
blockNow.addEventListener("click", blockSite);