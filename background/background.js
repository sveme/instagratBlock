// needs to get a message from the popup script about which sites to block
const blockList = new Map();
const urlFilter = { urls: [] };

function newBlock(block, reply) {
  console.log(block);
  blockList.set(block.url, block.blockUntil);
  console.log(blockList);
  urlFilter.urls.append(block.url);
  console.log(urlFilter.urls);
  reply({message:'url blocked'});
}
function checkBlock(details) {
  console.log(details);
  let block = false;
  const now = Date.now();
  const blockUntil = blockList.get(details.url); // TODO change so that it works with url matches
  if (now < blockUntil) {
    block = true;
  }
  else {
    block = false;
    blockList.delete(details.url); // remove block when block time is superseded
    const pos = urlFilter.urls.indexOf(details.url);
    urlFilter.urls.splice(pos); // remove the timed-out block
  }
  if (block) {
    return { cancel: true };
  }
  else {
    return {};
  }
}

chrome.webRequest.onBeforeRequest.addListener(checkBlock, urlFilter, ['blocking']);
chrome.runtime.onMessage.addListener(newBlock);
