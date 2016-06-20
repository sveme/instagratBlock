// needs to get a message from the popup script about which sites to block
const blockList = new Map();
const urlFilter = { urls: [] };

function newBlock(block) {
  blockList.set(block.url, block.blockUntil);
  urlFilter.urls.append(block.url);
}
function checkBlock(details) {
  let block = false;
  const now = new Date();
  const blockUntil = blockList.get(details.url); // TODO change so that it works with url matches
  if (now > blockUntil) { // TODO does algebra work on date objects?
    block = true;
  } else {
    block = false;
    blockList.delete(details.url); // remove block when block time is superseded
  }
  if (block) {
    return { cancel: true }; // TODO
  } else {
    return null; // TODO
  }
}
// any web request needs to be filtered - add listener to webRequests
// block a webRequest when url is in blockList
// when timeNow is > blockedTime, remove block from list

chrome.webRequest.onBeforeRequest.addListener(checkBlock, urlFilter, ['blocking']);
chrome.runtime.onMessage.addListener(newBlock);
