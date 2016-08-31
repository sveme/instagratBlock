const hoursSelected = document.getElementById("hour");
const minutesSelected = document.getElementById("minute");

function send(blockedSite){
	chrome.runtime.sendMessage(blockedSite, function(response){
		console.log(response.message);
	});
	window.close();
}

function blockSite(e) {
	let minutes;
	try {
		minutes = minutesSelected.value;
	}
	catch (exception){
		console.error(exception);
		minutes = 0;
	}
	let blockUntil = Date.now();
	if (minutes > 0){
		blockUntil += minutes*(60*1000); // convert to milliseconds
	}

	chrome.tabs.query({active: true}, function(tabs){
			let url = tabs[0].url;
			let blockedSite = {'url': url, 'blockUntil':blockUntil};
			console.log(blockedSite);
			send(blockedSite);
	});
}

//display the currently chosen minutes to block
minutesSelected.addEventListener("input", function(e) {
	let minutesLabel = document.getElementById("displayMinutes");
	minutesLabel.innerHTML = minutesSelected.value + " minutes";
});
// event listeners for the cancel and block buttons
const blockNow = document.getElementById("blockbtn");
blockNow.addEventListener("click", blockSite);
