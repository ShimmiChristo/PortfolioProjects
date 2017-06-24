var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext("2d");
var x = canvas.width/2; // X axis starting point of ball
var y = canvas.height-30; //Y axis starting point of ball
var dx = 4; 
var dy = -4;
var ballRadius = 10;
var paddleHeight = 10;
var paddleWidth = 75;
var paddleX = (canvas.width-paddleWidth)/2;
var rightPressed = false;
var leftPressed = false;
var brickRowCount = 3;
var brickColumnCount = 5;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;
var score = 0;
var lives = 3;


// 2 dimensional array for bricks at top
var bricks = [];
for (c=0; c<brickColumnCount; c++) {
    bricks[c] = [];
    for (r=0; r<brickRowCount; r++) {
        bricks[c][r] = {x:0, y: 0, status: 1};
    }
}


//**target.addEventListener(type, listener[, options]);
document.addEventListener('keydown', keyDownHandler, false); 
document.addEventListener('keyup', keyUpHandler, false);
document.addEventListener('mousemove', mouseHandler, false);

function keyDownHandler(e) {
    if(e.keyCode == 39){
        rightPressed = true;
    } else if(e.keyCode == 37) {
        leftPressed = true;
    }
}
function keyUpHandler(e) {
    if(e.keyCode == 39){
        rightPressed = false;
    }else if(e.keyCode == 37){
        leftPressed = false;
    }
}
function mouseHandler(e){
    var relativeX = e.clientX - canvas.offsetLeft;
    if(relativeX > 0 && relativeX < canvas.width){
        paddleX = relativeX - paddleWidth/2;
    }
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI*2); //.arc(x,y,r,sAngle,eAngle)
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}
function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}
function drawBricks() {
    for(c=0; c<brickColumnCount; c++) {
        for(r=0; r<brickRowCount; r++) {
            if(bricks[c][r].status == 1){
                var brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft;
                var brickY = (r*(brickHeight+brickPadding))+brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "#0095DD";
                ctx.fill();
                ctx.closePath();   
            }
        }
    }
}

function collisionDetection() {
    for (c=0; c<brickColumnCount; c++) {
        for (r=0; r<brickRowCount; r++) {
            var b = bricks[c][r];
            if(b.status == 1){
                if(x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight){
                    dy = -dy;
                    b.status = 0;
                    score++;
                    if(score == brickRowCount*brickColumnCount) {
                        alert("YOU WIN!");
                        document.location.reload();
                    }
                }
            }
        }
    }
}
function drawScore() {
    ctx.front = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Score: "+score, 8, 20);
}
function drawLives() {
    ctx.front = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Lives: "+lives, canvas.width-65,20);
}

function draw() {
    // clear canvas content before each frame
    ctx.clearRect(0, 0, canvas.width, canvas.height); 
    drawBricks();
    drawBall();
    drawPaddle();
    drawLives();
    drawScore();
    collisionDetection();
    
    // if ball hits sides, move in reverse direction 
    if(x + dx > canvas.width-ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }
    // if ball hits top, move in reverse direction
    if(y + dy < ballRadius) {
        dy = -dy;
        //if ball hits paddle, move in reverse direction
    } else if(y + dy > canvas.height-ballRadius) {
            //if x is between the right and left side of paddle, then do
        if(x > paddleX && x < paddleX + paddleWidth){ 
            dy = -dy;
        } else{
            lives--;
            if(!lives) {
                alert("GAME OVER");
                document.location.reload();
            }else {
                x = canvas.width/2;
                y = canvas.height-30;
                dx = 4;
                dy = (-5);
                paddleX = (canvas.width-paddleWidth)/2;
            }
            
        }
    }
    
    if(rightPressed && paddleX < canvas.width - paddleWidth) {
        paddleX += 7;
    } else if(leftPressed && paddleX > 0) {
        paddleX -= 7;
    }
    
    x += dx; // new X position every update
    y += dy; // new Y position every update
    requestAnimationFrame(draw);
}



draw(); 

