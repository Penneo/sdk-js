var penneo = require('penneo-js-sdk');
var element = document.getElementById('response');

console.log(penneo);

function createListItem(content) {
    var li = document.createElement('li');
    li.appendChild(document.createTextNode(content));
    element.appendChild(li);
}

penneo.casefile.list(function(response) {
    var i;
    for (i = 0; i < response.data.length; i++) {
        createListItem(response.data[i].title);
    }
});
