const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const version = urlParams.get('version');

const paragraph = document.getElementsByClassName('version');
const text = document.createTextNode(" v" + version);

for (let i = 0; i < paragraph.length; i++){
    paragraph[i].appendChild(text);
}