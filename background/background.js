const blockMap = new Map();
const patternList = [];
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

/* handling new Blocks and webRequest event functions */
function newBlock(block, reply) {
  let regExpPattern = createURLRegExp(block.url); // for use in finding the time until its blocked
  //let filterPattern = createURLPattern(block.url); // for use in urlFilter object for webRequest event
  blockMap.set(regExpPattern, {until: block.blockUntil, urlPattern: "filterPattern"}); //TODO
  patternList.push(regExpPattern);
  console.log(blockMap);
  reply({message:'url blocked'});
}

function checkBlock(details) {
  console.log(details);
  if (patternList.length == 0){
    return {cancel: false};
  }
  // find the matching pattern
  let matchedPattern = patternList.filter(function (pattern){
      return pattern.test(details.url);
    });
  console.log(matchedPattern.length);

  let block = false;
  const now = Date.now();
  const blockUntil = blockMap.get(matchedPattern[0]).until;
  if (now < blockUntil) {
    block = true;
  }
  else {
    block = false;
    blockMap.delete(matchedPattern[0]); // remove block when block time is superseded
    const pos = patternList.indexOf(matchedPattern[0]); //get the associated url pattern
    patternList.splice(pos, 1);
  }
  console.log(blockMap);
  console.log(matchedPattern);
  console.log(patternList);
  if (block) {
    console.log("blocked!")
    const redirectSiteUrl = chrome.extension.getURL("resources/blocked.html");
    return { redirectUrl: redirectSiteUrl };
  }
  else {
    console.log("Not blocked!")
    return {cancel: false};
  }
}

/* event handling: webRequest and message communication */
chrome.runtime.onMessage.addListener(newBlock);
const urlFilter = { urls: ["<all_urls>"] };
chrome.webRequest.onBeforeRequest.addListener(checkBlock, urlFilter, ['blocking']);
