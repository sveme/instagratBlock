const blockMap = new Map();
const urlFilter = { urls: [] };
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
  let filterPattern = createURLPattern(block.url); // for use in urlFilter object for webRequest event
  blockMap.set(regExpPattern, {until: block.blockUntil, urlPattern: filterPattern});
  //urlFilter.urls.push(filterPattern); // object call-by-ref in webRequest?
  patternList.push(regExpPattern);
  //console.log(urlFilter.urls);
  console.log(blockMap);
  reply({message:'url blocked'});
}

function checkBlock(details) {
  console.log(details);
  // find the matching pattern
  let matchedPattern = patternList.filter(function (pattern){
      return pattern.test(details.url);
    });

  let block = false;
  const now = Date.now();
  const blockUntil = blockMap.get(matchedPattern[0]).until;
  if (now < blockUntil) {
    block = true;
  }
  else {
    block = false;
    blockMap.delete(matchedPattern[0]); // remove block when block time is superseded
    //const pos = urlFilter.urls.indexOf(matchedPattern[0].urlPattern); //get the associated url pattern
    const pos = patternList.indexOf(matchedPattern[0].urlPattern); //get the associated url pattern
    //urlFilter.urls.splice(pos); // remove the timed-out block
    patternList.splice(pos); //TODO
  }
  //console.log(urlFilter.urls);
  console.log(blockMap);
  console.log(matchedPattern);
  if (block) {
    console.log("blocked!")
    return { cancel: true };
  }
  else {
    console.log("Not blocked!")
    return {cancel: false};
  }
}

/* event handling: webRequest and message communication */
chrome.runtime.onMessage.addListener(newBlock);
urlFilter.urls = ["<all_urls>"]
chrome.webRequest.onBeforeRequest.addListener(checkBlock, urlFilter, ['blocking']);
