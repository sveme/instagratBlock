const blockList = new Map();
const urlFilter = { urls: [] };

// how to get the index of the matched url to check whether the block timed out?
function newBlock(block, reply) {
  blockList.set(block.url, block.blockUntil);
  let pattern = createURLPattern(block.url);
  urlFilter.urls.push(pattern);

  reply({message:'url blocked'});
}

function createURLPattern(url){
  // create URL filter pattern that matches http and https and the URL with and without www
  const s1 = url.split("//");
  const addr = s1[1];
  const index = addr.indexOf('www.'); //what about ww3? remove everything 
  if (index >= 0){
    const remAddr = addr.splice(index, addr.length);
  }
  const pattern = "http*://.*" + remAddr;
  return pattern
}

function matchPattern(patternStr, testurl){
  let pattern = new RegExp(patternStr);
  // does it require transformations of the pattern?
  return pattern.test(testurl);
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
