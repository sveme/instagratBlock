if (typeof(blockdiv) === 'undefined') {
  var blockdiv = document.createElement('div');
}
blockdiv.className = 'blockIndicator';

if (typeof(img) === 'undefined') {
  var img = document.createElement('img');
}
img.setAttribute("src", chrome.extension.getURL("/icons/blockSymbol.png"));
img.setAttribute("alt", "Blocked!");

blockdiv.appendChild(img);
document.body.appendChild(blockdiv);

function removeBlockdiv() {
  let el = document.getElementsByClassName('blockIndicator')[0];
  el.remove();
}

window.setTimeout(removeBlockdiv, 2100);
