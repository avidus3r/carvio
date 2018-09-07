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
  var items = attrs[attrs.length-1].querySelectorAll('span');
  var obj = {};
  items.forEach(function(item, index) {
    var label = items[index].innerText;
    label = label.split(': ');
    obj[label[0]] = label[1];
  });
  console.log(obj);
});
