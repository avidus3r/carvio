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
var phone;
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

document.querySelector('.reply_button').addEventListener('click', function(e) {
  setTimeout(function(){
    phone = document.querySelector('.reply-tel-number');
    var pattern = /\(\d+\)\s\d+\-\d+/;
    phone = phone.innerText.match(pattern)[0];
  },2000);
});
document.querySelector('.reply_button').dispatchEvent(new Event('click'));

saveBtn.addEventListener('click', function() {
  var items = attrs;
  var obj = {};
  var arr = {};
  obj['url'] = location.href || 'n/a';
  obj['posttitle'] = document.querySelector('#titletextonly').innerText || 'n/a';
  obj['price'] = price.innerText || 'n/a';
  obj['phone'] = phone || 'n/a';
  
  items.forEach(function(item, index) {
    if(index === 0) {
      var ymm = item.innerText.split(' ');
      var year = ymm.shift();
      obj['year'] = year || 'n/a';
      obj['make'] = ymm.join(' ') || 'n/a';
    } else {
      var subItems = attrs[index].querySelectorAll('span');
      subItems.forEach(function(subItem, subIndex) {
        var label = subItems[subIndex].innerText;
        label = label.split(': ');
        var r = new RegExp('\\n');
        arr[label[0]] = label[1].replace(r, '') || 'n/a';
      });
    }
  });
  obj['trim'] = arr['type'] || 'n/a';
  obj['odometer'] = arr['odometer'] || 'n/a';
  obj['engine'] = arr['cylinders'] || 'n/a';
  obj['drivetrain'] = arr['drive'] || 'n/a';
  obj['fuel'] = arr['fuel'] || 'n/a';
  obj['transmission'] = arr['transmission'] || 'n/a';
  obj['interior'] = arr['interior'] || 'n/a';
  obj['exterior'] = arr['exterior'] || 'n/a';
  obj['vin'] = arr['VIN'] || 'n/a';
  obj['title'] = arr['title status'] || 'n/a';
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
