
var ci = chrome.identity;
ci.getAuthToken({ interactive: true }, function(token) {
  console.log('token', token);
  if(chrome.runtime.lastError) {
    console.log(chrome.runtime.lastError);
    return;
  }
  access_token = token;
})
