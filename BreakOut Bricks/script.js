var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var score = 0;
var lives = 3;
//defining paddle
var paddleHeight = 10;
var paddleWidth = 75;
var paddleX = (canvas.width - paddleWidth)/2;
var rightPressed = false;
var leftPressed = false;

//defining variables x and y coordinates
var x = canvas.width/2;
var y = canvas.height-30;
var dx = 2;
var dy = -2;
var ballRadius = 10;

//defining Bricks
var brickRowCount = 15;
var brickColumnCount = 17;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;

var bricks = [];
for(var i = 0; i < brickColumnCount; i++){
  bricks[i] = [];
  for(var j = 0; j < brickRowCount; j++){
    bricks[i][j] = { x: 0, j: 0, status: 1};
  }
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

function mouseMoveHandler(e){
  var relativeX = e.clientX - canvas.brickOffsetLeft;
  if(relativeX > 0 && relativeX < canvas.width){
      paddleX = relativeX - paddleWidth/2;
  }
}

function keyDownHandler(e){
  if(e.key == "Right" || e.key == "ArrowRight"){
    rightPressed = true;
  }
  else if(e.key == "Left" || e.key == "ArrowLeft"){
    leftPressed = true;
  }
}

function keyUpHandler(e){
  if(e.key == "Right" || e.key == "ArrowRight"){
    rightPressed = false;
  }
  else if(e.key == "Left" || e.key == "ArrowLeft"){
    leftPressed = false;
  }
}

function collisionDetection() {
    for (var c = 0; c < brickColumnCount; c++) {
        for (var r = 0; r < brickRowCount; r++) {
            var b = bricks[c][r];
            if (b.status == 1) {
                if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
                  dy = -dy;
                    b.status = 0;
                    score++;
                    if(score == brickRowCount*brickColumnCount){
                      alert("YOU WIN!! CONGRATS!");
                      document.location.reload();
                    }
                }
            }
        }
    }
}


function drawBricks(){
  for(var i = 0; i < brickColumnCount; i++){
    for(var j = 0; j < brickRowCount; j++){
      if(bricks[i][j].status == 1){
        var brickX = (i*(brickWidth+brickPadding))+brickOffsetLeft;
        var brickY = (j*(brickHeight+brickPadding))+brickOffsetTop;
        bricks[i][j].x = brickX;
        bricks[i][j].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

function drawPaddle(){
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

//drawing (moving) the ball
function drawBall(){
  ctx.beginPath();
  ctx.arc(x, y, ballRadius,0, Math.PI*2);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

function drawScore(){
  ctx.font = "16px Arial";
  ctx.fillStyle = "#0095DD";
  ctx.fillText("Score: "+score, 8,20);
}

function drawLives(){
  ctx.font = "16px Arial";
  ctx.fillStyle = "#0095DD";
  ctx.fillText("Lives: "+lives, canvas.width - 65, 20);
}

function draw(){
  ctx.clearRect(0,0, canvas.width, canvas.height);
  drawBricks();
  drawBall();
  drawPaddle();
  drawScore();
  drawLives();
  collisionDetection();
  //ball collision detection with frame
  if(x + dx > canvas.width - ballRadius || x + dx < ballRadius){
    dx = -dx;
  }
  if(y + dy <ballRadius){
    dy = - dy
  }
  else if(y + dy > canvas.height - ballRadius ){
    if(x > paddleX && x < paddleX + paddleWidth){
      dy = -dy;
    }
  else{
    lives--;
    if(lives == 0){
      alert("GAME OVER!");
      document.location.reload();
    }
    else{
      x = canvas.width/2;
      y = canvas.height-30;
      dx = 2;
      dy = -2;
      paddleX = (canvas.width - paddleWidth)/2;
    }

  }
}

  if(rightPressed && paddleX < canvas.width - paddleWidth){
    paddleX += 7;
  }
  else if(leftPressed && paddleX > 0){
    paddleX -=7;
  }
  x += dx;
  y += dy;
  requestAnimationFrame(draw);
}
draw();
