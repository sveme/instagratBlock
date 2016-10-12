let minutesInput = document.getElementById("minutes");
let hoursInput = document.getElementById("hours");
let blockbtn = document.getElementById("blockbtn");

// communication with background script
function send(blockedSite){
	chrome.runtime.sendMessage(blockedSite, function(response){
		console.log(response.message);
	});
	window.close();
}

function blockSite(e) {
	if (!minutesInput.checkValidity() || !hoursInput.checkValidity()) {
		return
	}
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

// event listeners for the block button
blockbtn.addEventListener("click", blockSite);
