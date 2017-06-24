var goalTimeOne = 10;
var goalTimeTwo = 30;
var goalTimeThree = 60;



function readingGoal(time) {
    var t = document.getElementById(time);
    
}


function toggleVisibility(id) {
    var e = document.getElementById(id);
    var eList = document.getElementsByClassName('list');
    var f; 
    for(var i = 0; i < eList.length; i++ ){
        f = eList[i];
        if(e==f){
            if(e.style.display == 'block'){
            } else{
                e.style.display = 'block';
            }
        }else {
            f.style.display = 'none';
        }
    }
}

function toggleVisibility2(id) {
    var e = document.getElementById(id);
    var eList2 = document.getElementsByClassName('list2');
    var g; 
    for(var j = 0; j < eList2.length; j++ ){
        g = eList2[j];
        if(e==g){
            if(e.style.display == 'block'){
                //e.style.display = 'none';  //toggle the final solution timeframe
            } else{
                e.style.display = 'block';
            }
        }else {
            g.style.display = 'none';
        }
    }
}




