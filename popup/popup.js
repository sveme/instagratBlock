let minutesInput = document.getElementById("minutes");
let hoursInput = document.getElementById("hours");
let blockbtn = document.getElementById("blockbtn");

function validateInput(e) {
	let val = e.target.value;
	console.log(val);
	if (!Number.isInteger(val)) {
		setInvalidInput(e.target);
	}
	else if (val === null) {
		setValidInput(e.target);
	}
	else {
		setValidInput(e.target);
	}
}

function setInvalidInput(target) {
	//blockbtn.removeListener(blockSite);
	//blockbtn.classList.remove("btn--valid");
	//blockbtn.classList.add("btn--invalid");
	target.classList.remove("timepicker--valid");
	target.classList.add("timepicker--invalid");
}

function setValidInput(target) {
	//blockbtn.addEventListener("click", blockSite);
	//blockbtn.classList.remove("btn--invalid");
	//blockbtn.classList.add("btn--valid");
	target.classList.remove("timepicker--invalid");
	target.classList.add("timepicker--valid");
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
blockbtn.addEventListener("click", blockSite);
minutesInput.addEventListener("keyup", validateInput);
hoursInput.addEventListener("keyup", validateInput);
