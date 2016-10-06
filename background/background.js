/* eslint no-undef: "error" */
const blockMap = new Map();
const urlFilter = { urls: [] };

/* helper functions */
function createURLPattern(url) {
  /* create URL filter pattern that matches http and https */
  let pattern = url.replace(/http[s]?:\/\//, '*://');
  return pattern + "*";
}

function createURLRegExp(url) {
  /* escape the provided url so that we can test it when the urlFilter
  matched (see here for the source:
  http://stackoverflow.com/questions/3561493/is-there-a-regexp-escape-function-in-javascript/3561711#3561711)
  */
  const escapedUrl = url.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  const pattern = new RegExp(createURLPattern(escapedUrl));
  return pattern;
}

/* handling new Blocks and webRequest event functions */
function newBlock(block, reply) {
  /* we use two different patterns describing the URL: the URL pattern is used for
  the webRequest event listeners and uses the scheme defined for webextensions; the
  RegExp pattern is used to figure out which URL pattern was actually triggered
  */
  const regExpPattern = createURLRegExp(block.url); // for use in finding the time until its blocked
  const filterPattern = createURLPattern(block.url); // for use in urlFilter object
  blockMap.set(regExpPattern, { until: block.blockUntil, urlPattern: filterPattern });
  urlFilter.urls.push(filterPattern);
  chrome.webRequest.onBeforeRequest.addListener(checkBlock, urlFilter, ['blocking']);
  console.log(blockMap);
  reply({ message: 'url blocked' });
}

function checkBlock(details) {
  if (blockMap.size === 0) {
    return { cancel: false };
  }
  // find the matching pattern
  let matchedUrlPattern;
  let matchedRegExpPattern;
  blockMap.forEach((val, key) => {
    const rkey = new RegExp(key); // apparently some bug in firefox? key is a string, not a regExp!
    if (rkey.test(details.url)) {
      matchedRegExpPattern = rkey;
      matchedUrlPattern = val;
    }
  }, blockMap);

  console.log(matchedUrlPattern);
  let block = false;
  const now = Date.now();
  const blockUntil = matchedUrlPattern.until;
  if (now < blockUntil) {
    block = true;
  }
  else {
    block = false;
    const pos = urlFilter.urls.indexOf(matchedUrlPattern.urlPattern);
    blockMap.delete(matchedRegExpPattern); // remove block when block time is superseded
    urlFilter.urls.splice(pos, 1);
    // update event listeners with new urlFilter objects
    chrome.webRequest.onBeforeRequest.removeListener(checkBlock);
    chrome.webRequest.onBeforeRequest.addListener(checkBlock, urlFilter, ['blocking']);
  }
  console.log(blockMap);
  if (block) {
    console.log("blocked!");
    const redirectSiteUrl = chrome.extension.getURL("resources/blocked.html");
    console.log(redirectSiteUrl);
    return { redirectUrl: redirectSiteUrl };
    //return { cancel: true };
  }
  else {
    console.log("Not blocked!");
    return { cancel: false };
  }
}
/* event handling: webRequest and message communication */
chrome.runtime.onMessage.addListener(newBlock);
