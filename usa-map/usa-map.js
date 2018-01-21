<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
    // $.getJSON("usa-state-capitals.json", function(state) {
    //     // console.log(json); // this will show the info it in firebug console
    // });

console.log('testin');

var states = document.querySelectorAll(".state");
var state_name = document.querySelector(".state_name");
var full_state_name = document.querySelector(".full_state_name");
const statesArray = [];

const requestURL = "usa-state-capitals.json";
var request = new XMLHttpRequest();
request.open('GET', requestURL);
request.responseType = 'json';
request.send();
request.onload = function() {
  var superHeroes = request.response;
  populateHeader(superHeroes);
}
// Steps.
// 1. Get ids (this.id???)
// 2. Get json keys (state names)
// 3. Compare to see if this.id is a json key
// 4. If this.id is a json key, then do something

function populateHeader(jsonObj) {
  // var myH1 = document.createElement('h1');
  // myH1.textContent = jsonObj['squadName'];
  // header.appendChild(myH1);
  var json_states = jsonObj;
  
  // Object.keys(json_states).forEach(key => { console.log(key, json_states[key].name) })

  for (var key in json_states) {
    if (json_states.hasOwnProperty(key)) {
        console.log(key + " -> " + json_states[key].name);
    }
}
}

//return an array of keys that match on a certain value
function getKeys(obj, val) {
    var objects = [];
    for (var i in obj) {
        if (!obj.hasOwnProperty(i)) continue;
        if (typeof obj[i] == 'object') {
            objects = objects.concat(getKeys(obj[i], val));
        } else if (obj[i] == val) {
            objects.push(i);
        }
    }
    return objects;
}



states.forEach(state => state.addEventListener("click", hoverState));
states.forEach(state => state.addEventListener("mouseleave", hoverStateLeave));



function hoverState() {
  state_name.innerHTML = this.id;
  full_state_name.innerHTML = this.textContent;
  
}
function hoverStateLeave() {
  state_name.innerHTML = "";
  full_state_name.innerHTML = "";
}
