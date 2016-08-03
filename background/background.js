const blockMap = new Map();
const patternList = [];
const urlFilter = { urls: [] };

/* helper functions */
function createURLPattern(url){
  /* create URL filter pattern that matches http and https */
  const pattern = url.replace(/http[s]?/, "http.*");
  return pattern;
}

function createURLRegExp(url){
  /* escape the provided url so that we can test it when the urlFilter
  matched (see here for the source:
  http://stackoverflow.com/questions/3561493/is-there-a-regexp-escape-function-in-javascript/3561711#3561711)
  */
  const escapedUrl = url.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  const pattern = new RegExp(createURLPattern(escapedUrl));
  return pattern;
}

function matchPattern(pattern, testurl){
  return pattern.test(testurl);
}

/* handling new Blocks and webRequest event functions */
function newBlock(block, reply) {
  let regExpPattern = createURLRegExp(block.url); // for use in finding the time until its blocked
  let filterPattern = createURLPattern(block.url); // for use in urlFilter object for webRequest event
  blockMap.set(regExpPattern, {until: block.blockUntil, urlPattern: filterPattern);
  patternList.push(regExpPattern);
  urlFilter.urls.push(filterPattern); // object call-by-ref in webRequest?
  reply({message:'url blocked'});
}

function checkBlock(details) {
  console.log(details);
  // find the matching pattern
  let matchedPattern = patternList.filter(matchPattern, details.url); // but which one if there are multiple matches?
  let block = false;
  const now = Date.now();
  const blockUntil = blockMap.get(matchedPattern[0]).until;
  if (now < blockUntil) {
    block = true;
  }
  else {
    block = false;
    blockMap.delete(matchedPattern[0]); // remove block when block time is superseded
    const pos = urlFilter.urls.indexOf(matchedPattern[0].urlPattern); //get the associated url pattern
    urlFilter.urls.splice(pos); // remove the timed-out block
  }
  if (block) {
    return { cancel: true };
  }
  else {
    return {cancel: false};
  }
}

/* event handling: webRequest and message communication */
chrome.webRequest.onBeforeRequest.addListener(checkBlock, urlFilter, ['blocking']);
chrome.runtime.onMessage.addListener(newBlock);
