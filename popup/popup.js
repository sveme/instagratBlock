/* TODO
size of popup needs to be adapted
popup needs to have better CSS
icon is horrible - single color, all white or grey, just a white or grey circle with red cake slice
why does popup need so long to show up?
*/

const hoursSelected = document.getElementById("hour");
const minutesSelected = document.getElementById("minute");

function send(blockedSite){
	chrome.runtime.sendMessage(blockedSite, function(response){
		console.log(response.message);
	});
	window.close();
}

function blockSite(e) {
	let hours = 0;
	let minutes = 0;
	try {
		hours = hoursSelected.value;
	}
	catch(exception) {
		console.error(exception);
		hours = 0;
	}
	try {
		minutes = minutesSelected.value;
	}
	catch (exception){
		console.error(exception);
		minutes = 0;
	}
	// sanitize inputs - make sure that it's numeric only TODO
	let blockUntil = Date.now();
	if (hours > 0){
		blockUntil += hours*(60*60*1000); // convert to milliseconds
	}
	if (minutes > 0){
		blockUntil += minutes*(60*1000); // convert to milliseconds
	}

	chrome.tabs.query({active: true}, function(tabs){
			console.log(tabs[0]);
			let url = tabs[0].url; // TODO allow url matching patterns
			console.log(url);
			let blockedSite = {'url': url, 'blockUntil':blockUntil};
			send(blockedSite);
	});
}

// display the currently chosen hours to block
hoursSelected.addEventListener("input", function(e){
	let hoursLabel = document.getElementById("hourLabel");
	hoursLabel.innerHTML = hoursSelected.value + " hours";
});
//display the currently chosen minutes to block
minutesSelected.addEventListener("input", function(e){
	let minutesLabel = document.getElementById("minuteLabel");
	minutesLabel.innerHTML = minutesSelected.value + " minutes";
});
// event listeners for the cancel and block buttons
const blockNow = document.getElementById("block");
const blockCancel = document.getElementById("cancel");
blockCancel.addEventListener("click", function(e){
	window.close();
	// close the tab
});
blockNow.addEventListener("click", blockSite);
