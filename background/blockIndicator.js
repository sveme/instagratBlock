let blockdiv = document.createElement('div');
blockdiv.className = 'blockIndicator';
let img = document.createElement('img');
img.setAttribute("src", chrome.extension.getURL("/icons/instagratBlock-32.png"));
//img.setAttribute("src", "/icons/instagratBlock-32.png");
img.setAttribute("style", "width: 32px height: 32px");
img.setAttribute("alt", "Could not be loaded");
blockdiv.appendChild(img);
document.body.appendChild(blockdiv);
