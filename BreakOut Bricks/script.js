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
var colors = [];
for(var i = 0; i < brickColumnCount*level; i++){
  bricks[i] = [];
  colors[i] = []
  for(var j = 0; j < brickRowCount*level; j++){
    bricks[i][j] = { x: 0, j: 0, status: 1};
    colors[i][j] = RandColor();
  }
}
function reset(){
  x = canvas.width/2;
  y = canvas.height-30;
  paddleX = (canvas.width - paddleWidth)/2;
  for(var i = 0; i < brickColumnCount*level; i++){
    bricks[i] = [];
    colors[i] = []
    for(var j = 0; j < brickRowCount*level; j++){
      bricks[i][j] = { x: 0, j: 0, status: 1};
      colors[i][j] = RandColor();
    }
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
    for (var i = 0; i < brickColumnCount*level; i++) {
        for (var j = 0; j < brickRowCount*level; j++) {
            var b = bricks[i][j];
            if (b.status == 1) {
                if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {//if x < starting point of brick: dx = -dx
                    dy = -dy;
                    b.status = 0;
                    score++;
                    if(score == (brickRowCount*level)*(brickColumnCount*level)){
                      if(wins != 3){
                        alert("NEXT LEVEL");
                        wins++;
                        score = 0;
                        level++;
                        reset();
                        requestAnimationFrame(draw);
                        }
                      }
                      else if(wins == 3){
                        alert("Finished the game! CONGRATS!!")
                        score = 0;
                        wins = 0;
                        lives = 3;
                        document.location.reload();
                      }
                  }
              }
          }
      }
}


function drawBricks(){
  for(var i = 0; i < brickColumnCount*level; i++){
    for(var j = 0; j < brickRowCount*level; j++){
      if(bricks[i][j].status == 1){
        if(!wins){
          let brickOffsetTop = canvas.width/2+canvas.height/2 - 500;
          let brickOffsetLeft = canvas.width/2 - 500;
          var brickX = (i*(brickWidth+brickPadding))+brickOffsetTop;
          var brickY = (j*(brickHeight+brickPadding))+brickOffsetLeft;
        }
        else if(wins == 1){
          let brickOffsetTop = canvas.width/2+canvas.height/2 - 700;
          let brickOffsetLeft = canvas.width/2 - 500;
          var brickX = (i*(brickWidth+brickPadding))+brickOffsetTop;
          var brickY = (j*(brickHeight+brickPadding))+brickOffsetLeft;
        }
        else if(wins == 2){
          let brickOffsetTop = canvas.width/2+canvas.height/2 - 900;
          let brickOffsetLeft = canvas.width/2 - 500;
          var brickX = (i*(brickWidth+brickPadding))+brickOffsetTop;
          var brickY = (j*(brickHeight+brickPadding))+brickOffsetLeft;
        }
        bricks[i][j].x = brickX;
        bricks[i][j].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = colors[i][j];
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

function RandColor() {
     var letters = '0123456789ABCDEF';
     var color = '#';
     for (var i = 0; i < 6; i++) {
       color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
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
  drawWins();
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
