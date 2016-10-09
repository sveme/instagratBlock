const minutesInput = document.getElementById("minutes");
const hoursInput = document.getElementById("hours");

function send(blockedSite){
	chrome.runtime.sendMessage(blockedSite, function(response){
		console.log(response.message);
	});
	window.close();
}

function blockSite(e) {
	let minutes = minutesInput.value ? minutesInput.value : 0;
	let hours = hoursInput.value ? hoursInput.value : 0;
	if (minutes === 0 & hours === 0) {
		return;
	}
	let blockUntil = Date.now();
	blockUntil += hours*(3600*1000) + minutes*(60*1000); // convert to milliseconds

	chrome.tabs.query({active: true}, function(tabs){
		let url = tabs[0].url;
		console.log(url);

		let blockedSite = {'url': url, 'blockUntil':blockUntil};
		console.log(blockedSite);
		send(blockedSite);
		});
}

// event listeners for the cancel and block buttons
const blockNow = document.getElementById("blockbtn");
blockNow.addEventListener("click", blockSite);
