const minutesInput = document.getElementById("minutes");
const hoursInput = document.getElementById("hours");
const blockbtn = document.getElementById("blockbtn");
const blockDomainCheckbox = document.getElementById("blockDomainCheckbox");

function keyPressed(e) {
	const keyName = e.key;
	if (keyName === "Enter") {
		blockSite(e);
	}
}

function getDomain(url) {
	const parts = url.split('/');
	const domain = parts[2];
	return parts[0] + '//' + domain + '/';
}

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
	if (minutes === 0 && hours === 0) {
		return;
	}
	let blockUntil = Date.now();
	blockUntil += hours*(3600*1000) + minutes*(60*1000); // convert to milliseconds

	chrome.tabs.query({active: true}, function(tabs){
		let url = tabs[0].url;
		// use the full domain if the corresponding checkbox is active
		if (blockDomainCheckbox.checked) {
			url = getDomain(url);
		}
		console.log(url);
		let blockedSite = {'url': url, 'blockUntil':blockUntil};
		console.log(blockedSite);
		send(blockedSite);
		});
}

// event listeners for the block button
blockbtn.addEventListener("click", blockSite);
hoursInput.addEventListener("keyup", keyPressed);
minutesInput.addEventListener("keyup", keyPressed);
