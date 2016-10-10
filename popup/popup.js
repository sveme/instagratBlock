let minutesInput = document.getElementById("minutes");
let hoursInput = document.getElementById("hours");
let blockNow = document.getElementById("blockbtn");

function validateInput(e) {
	let val = e.target.value;
	console.log(val);
	if (!Number.isSaveInteger(val)) {
		setFalseInput(e.target);
	}
	else {
		setCorrectInput(e.target);
	}
}

function setFalseInput(target) {
	blockNow.removeListener(blockSite);
	target.classList.add("btn--inactive");
	target.classList.remove("btn:hover");
}

function setCorrectInput(target) {
	blockNow.addEventListener("click", blockSite);
	target.classList.remove("btn--inactive");
	target.classList.add("btn");
}

// communication with background script
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

// event listeners for the block button and to check that the inputs are correct
blockNow.addEventListener("click", blockSite);
minutesInput.addEventListener("input", validateInput);
hoursInput.addEventListener("input", validateInput);
