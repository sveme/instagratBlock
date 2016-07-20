/* TODO
size of popup needs to be adapted
popup needs to have better CSS
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
	let hours;
	let minutes;
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
		console.error(exception); //FIXME remove
		minutes = 0;
	}
	let blockUntil = Date.now();
	if (hours > 0){
		blockUntil += hours*(60*60*1000); // convert to milliseconds
	}
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
