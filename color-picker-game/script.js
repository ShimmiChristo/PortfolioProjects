
var allTiles = document.querySelectorAll('.tile');
var currentHexColorTitle = document.getElementById("current-color-title");
// var currentHexColor = document.getElementById("current-color");
var currentHexColor = document.querySelector(".container");
var container = document.querySelector(".container");
var currentColorBackground;
var difficulty = document.querySelector('input[name="difficulty"]');


// var restart = createTiles();
createTiles();
function createTiles(event) {
    if (difficulty.checked !== false) {
        document.querySelectorAll('.easy').forEach((x) => {
            x.style.display = 'none';
        });
        console.log(difficulty);
    } else {
        document.querySelectorAll('.easy').forEach((x) => {
            x.style.display = 'inline-block';
        });
    }
    
    var colorArray = [  '#FF6633', '#FFB399', '#FF33FF', '#FFFF99', '#00B3E6', 
                    '#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D',
                    '#80B300', '#809900', '#E6B3B3', '#6680B3', '#66991A', 
                    '#FF99E6', '#CCFF1A', '#FF1A66', '#E6331A', '#33FFCC',
                    '#66994D', '#B366CC', '#4D8000', '#B33300', '#CC80CC', 
                    '#66664D', '#991AFF', '#E666FF', '#4DB3FF', '#1AB399',
                    '#E666B3', '#33991A', '#CC9999', '#B3B31A', '#00E680', 
                    '#4D8066', '#809980', '#E6FF80', '#1AFF33', '#999933',
                    '#FF3380', '#CCCC00', '#66E64D', '#4D80CC', '#9900B3', 
                    '#E64D66', '#4DB380', '#FF4D4D', '#99E6E6', '#6666FF' ];
    var randArray = [];
    var i = 0;

    allTiles.forEach((x)=> {
        var randomColor = colorArray[Math.floor(Math.random()*colorArray.length)]; // random number generator
        randArray.push(randomColor);
        x.style.background = randomColor;
        x.style.opacity = 1;
    });
        var randColorBackground = randArray[Math.floor(Math.random()*randArray.length)];
        currentHexColor.style.backgroundColor = randColorBackground;
        currentHexColorTitle.textContent = randColorBackground;
        currentColorBackground = currentHexColor.style.backgroundColor;
        // currentHexColor.style.opacity = 0;
        container.style.backgroundColor = '#fff';
}

function clickColor(e, currentColorBackground) {
    var clicked = e.target.style.background;
    var rgb = clicked.substring(4, clicked.length-1)
        .replace(/ /g, '')
        .split(',');
    var first = Number(rgb[0]);
    var second = Number(rgb[1]);
    var third = Number(rgb[2]);
    var hexCode =  "#" + first + second + third;
    rgbToHex(first, second, third);
    checkColor(e.target, currentColorBackground);
}
function checkColor(e, currentColorBackground) {
    if(e.classList.contains('tile') && e.style.backgroundColor != currentColorBackground) {
        e.style.opacity = '0';
    } else if (e.style.backgroundColor == currentColorBackground) {
        allTiles.forEach((x) => {
            // console.log(x.style.backgroundColor);
            x.style.backgroundColor = currentColorBackground;
            x.style.opacity = 1;
            container.style.opacity = 1;
            container.style.backgroundColor = currentColorBackground;
        });
        return;
    }
}






// -------------------------------------

// hex to rgb
const hexToRgb = hex =>
  hex.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i
             ,(m, r, g, b) => '#' + r + r + g + g + b + b)
    .substring(1).match(/.{2}/g)
    .map(x => parseInt(x, 16))


// rgb to hex code
function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
    // console.log(hex);
}
function rgbToHex(r,g,b) {
    // console.log( "#" + componentToHex(rgb[0]) + componentToHex(rgb[1]) + componentToHex(rgb[2]));
    var callback = "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
    // console.log(callback);
    // return "#" + componentToHex(rgb[0]) + componentToHex(rgb[1]) + componentToHex(rgb[2]);
}

