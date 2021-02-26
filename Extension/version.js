const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const version = urlParams.get('version')

var paragraph = document.getElementsByClassName('version');
var text = document.createTextNode(" v" + version);

for (var i = 0; i < paragraph.length; i++){
    paragraph[i].appendChild(text);
}