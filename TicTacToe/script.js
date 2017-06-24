var spot = ['one','two','three','four','five','six','seven','eight','nine'];
var board = [];
var winningNums = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6],
];
var user = [];
var computer = [];
var gameOver = false; 

function handler() {
    var index = $(this).index('td');
    if(board.indexOf(index) == -1 && gameOver == false) {  
        board.push(index);
        user.push(index);
        $(this).closest('td').find('div:first').show('fast');
        winner(user);
        if (gameOver == true){
             $(function(){
                $('td').find('div:last').fadeOut(800);
                $('td').find('div:first').delay(800).fadeOut(800);
                $("#xPlayer").delay(1000).fadeIn(100);
                $("#xPlayer").animate({fontSize: '4em'});
               });
        }
        comp();
    } 
}
function winner(player){
    for(var i = 0; i < winningNums.length; i++){
        if (player.indexOf(winningNums[i][0]) >= 0){
            if (player.indexOf(winningNums[i][1]) >= 0){
                if (player.indexOf(winningNums[i][2]) >= 0){
                    gameOver =  true;
                }
            }
        }
    }
}

function comp(){
    var random = Math.floor(Math.random() * $(spot).length);
    var indexComp = $('td').eq(random).index('td');
        if(board.indexOf(indexComp) == -1 && gameOver == false) {  
            board.push(indexComp);
            computer.push(indexComp);
        $('td').eq(random).find('div:last').delay(200).show('fast');
        winner(computer);
            if (gameOver == true){
                $(function(){
                    $('td').find('div:first').fadeOut(800);
                    $('td').find('div:last').delay(800).fadeOut(800);
                    $("#oPlayer").delay(1000).fadeIn(100);
                    $("#oPlayer").animate({fontSize: '4em'});
               });
            }
        } else if (board.length > 8 || gameOver == true) {
            $(function(){
                    $('td').find('div:first').fadeOut(800);
                    $('td').find('div:last').delay(800).fadeOut(800);
                    $("#oPlayer").delay(1000).fadeIn(100);
                    $("#oPlayer").animate({fontSize: '4em'});
               });
        }else{
            return comp();
        } 
}

$( "td" ).click(handler);
$("#reset").on("click", function(){
    $('td').show();
    $('#xPlayer').hide();
    $('#xPlayer').removeAttr('style');
    $('#oPlayer').hide();
    $('#oPlayer').removeAttr('style');
    $('td').find('div').hide();
    board.length = 0;
    user.length = 0;
    computer.length = 0;
    gameOver = false;
    $("#xPlayer").stop(true, true);
});


var numNodes = 0;

function recurseMinimax(board, player) {
    numNodes++;
//    var winner = winner(player);
    if (gameOver = false) {
        switch(winner) {
            case 1:
                // AI wins
                return [1, board]
            case 0:
                // opponent wins
                return [-1, board]
            case -1:
                // Tie
                return [0, board];
        }
    } 
    } 
//        else {
//        // Next states
//        var nextVal = null;
//        var nextBoard = null;
//
//        for (var i = 0; i < 3; i++) {
//            for (var j = 0; j < 3; j++) {
//                if (board[i][j] == null) {
//                    board[i][j] = player;
//                    var value = recurseMinimax(board, !player)[0];
//                    if ((player && (nextVal == null || value > nextVal)) || (!player && (nextVal == null || value < nextVal))) {
//                        nextBoard = board.map(function(arr) {
//                            return arr.slice();
//                        });
//                        nextVal = value;
//                    }
//                    board[i][j] = null;
//                }
//            }
//        }
//        return [nextVal, nextBoard];
//    }
//}

function makeMove() {
    board = minimaxMove(board);
    console.log(numNodes);
    myMove = false;
    updateMove();
}

function minimaxMove(board) {
    numNodes = 0;
    return recurseMinimax(board, true)[1];
}