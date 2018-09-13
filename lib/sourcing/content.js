var body = document.querySelector('body');
var panelContainer = document.createElement('div');
var panel = document.createElement('div');
var panelContent = document.createElement('div');
panelContainer.setAttribute('class', 'carvio-container');
panelContent.setAttribute('class', 'carvio-content');

panel.id = 'carvio';
panel.append(panelContent);
body.append(panel);

var attrs = document.querySelectorAll('.attrgroup');
var price = document.querySelector('.price');

var saveBtn = document.createElement('a');
saveBtn.setAttribute('class', 'btn');
saveBtn.id = 'carvioSavePost';
saveBtn.innerText = 'Save';

panelContent.append(price);
attrs.forEach(function(item, index) {
  var attr = item.cloneNode(true);
  panelContent.append(attr);
});

panelContent.append(saveBtn);

saveBtn.addEventListener('click', function() {
  var items = attrs;
  var obj = {};
  obj['price'] = price.innerText;
  items.forEach(function(item, index) {
    if(index > 0) {
      var subItems = attrs[index].querySelectorAll('span');
      subItems.forEach(function(subItem, subIndex) {
        var label = subItems[subIndex].innerText;
        label = label.split(': ');
        obj[label[0]] = label[1];
      });
    } else {
      var ymm = item.innerText.split(' ');
      var year = ymm.shift();
      obj['year'] = year;
      obj['mm'] = ymm.join(' ');
    }
    
  });
  var qs = '';
  for(prop in obj) {
    qs += prop + '=' + obj[prop] + '&';
  }
  var url = 'http://carvio.com:8080/update' + '?' + qs;
  var xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);

  //Send the proper header information along with the request
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  
  xhr.onreadystatechange = function() {//Call a function when the state changes.
    if(this.readyState == XMLHttpRequest.DONE && this.status == 200) {
      // Request finished. Do processing here.
    }
  };
  xhr.send("foo=bar&lorem=ipsum");
});
