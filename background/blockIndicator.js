if (!blockdiv) {
  let blockdiv = document.createElement('div');
}
blockdiv.className = 'blockIndicator';

let img = document.createElement('img');
img.setAttribute("src", chrome.extension.getURL("/icons/blockSymbol.png"));
//img.setAttribute("style", "width: 32px height: 32px");
img.setAttribute("alt", "Blocked!");

blockdiv.appendChild(img);
document.body.appendChild(blockdiv);

function removeBlockdiv() {
  let el = document.getElementsByClassName('blockIndicator')[0];
  el.remove();
}

window.setTimeout(removeBlockdiv, 2500);
