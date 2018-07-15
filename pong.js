var canvas;
var canvasContext;
var ballX;
var ballSpeedX = 5;
var ballY;
var ballSpeedY = 4;
var paddle1Y = 250;
var paddle2Y = 250;
var paddleHeight = 100;
var paddleWidth = 10;
var player1Score = 0;
var player2Score = 0;
const WinningScore  = 5;
var showingWinScreen = false;

window.onload = function () {
  canvas = document.getElementById('gameCanvas');
  canvasContext = canvas.getContext('2d');

  var framesPerSecond = 30;
  ballReset();
  setInterval(function () {
    drawEverything();moveEverything();
  },

1000 / framesPerSecond);
  canvas.addEventListener('mousedown', handleMouseClick);
  canvas.addEventListener('mousemove', function (evt) {
    var mousePos = calculateMousePos(evt);
    paddle1Y = mousePos.y - (paddleHeight / 2);
  }
);
};

function handleMouseClick(evt) {
  if (showingWinScreen) {
    player1Score = 0;
    player2Score = 0;
    showingWinScreen = false;

  }
}

function drawEverything() {
  //Create Canvas
  colorRect(0, 0, canvas.width, canvas.height, '#333');
  canvasContext.fillStyle = 'white';

  if (showingWinScreen) {
    if (player1Score >= WinningScore) {
      canvasContext.fillText('You beat the computer!', (canvas.width / 2 - 30), 400);
    }else if (player2Score >= WinningScore) {
      canvasContext.fillText('Sorry computer wins!', (canvas.width / 2 - 30), 400);
    }

    canvasContext.fillText('Click to Continue', (canvas.width / 2 - 30), 500);
    return;
  }

  //Create Paddle
  colorRect(0, paddle1Y, paddleWidth, paddleHeight, 'white');

  //Create Computer Paddle
  colorRect((canvas.width - paddleWidth), paddle2Y, paddleWidth, paddleHeight, 'white');

  //Draws the Ball
  colorCircle(ballX, ballY, 10, 'white');
  canvasContext.fillText(player1Score, 100, 100);
  canvasContext.fillText(player2Score, canvas.width - 100, 100);
  drawNet();
}

function computerMovements() {
  var paddle2YCenter = paddle2Y + (paddleHeight / 2);
  if (paddle2YCenter < ballY - 35) {
    paddle2Y += 6;
  } else if (paddle2YCenter > ballY + 35) {
    paddle2Y -= 6;
  }
}

function drawNet() {
  for (i = 5; i < canvas.height; i += 40) {
    colorRect(canvas.width / 2 - 1, i, 2, 15, 'grey');
  }
}

//Moving Parts
function moveEverything() {
  if (showingWinScreen) {
    return;
  }

  computerMovements();
  ballX += ballSpeedX;
  ballY += ballSpeedY;
  if (ballY > canvas.height || ballY < 0)  {
    ballSpeedY = -ballSpeedY;
  }

  if (ballX > canvas.width - paddleWidth)  {
    if (ballY > paddle2Y && ballY < paddle2Y + paddleHeight) {
      ballSpeedX = -ballSpeedX;

      //Crazy Angles Stuff
      var delltaY = ballY - (paddle2Y + paddleHeight / 2);
      ballSpeedY = delltaY * 0.35;
    }else {
      ballSpeedY = ballSpeedY;
      player1Score++; //Must be before ball reset
      ballReset();
    }
  }

  if (ballX < paddleWidth) {
    if (ballY > paddle1Y && ballY < paddle1Y + paddleHeight) {
      ballSpeedX = -ballSpeedX;
      var delltaY = ballY - (paddle1Y + paddleHeight / 2);
      ballSpeedY = delltaY * 0.35;
    } else {
      ballSpeedY = ballSpeedY;
      player2Score++; // Must be before ball reset
      ballReset();
    }
  }
}

//Create Circles
function colorCircle(centerX, centerY, radius, color) {
  canvasContext.beginPath();
  canvasContext.fillStyle = color;
  canvasContext.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
  canvasContext.fill();
}

//create Boxes
function colorRect(leftX, topY, width, height, drawColor) {
  canvasContext.fillStyle = drawColor;
  canvasContext.fillRect(leftX, topY, width, height);
}

function calculateMousePos(evt) {
  var rect = canvas.getBoundingClientRect();
  var root = document.documentElement;
  var mouseX = evt.clientX - rect.left - root.scrollLeft;
  var mouseY = evt.clientY - rect.top - root.scrollTop;
  return {
    x: mouseX,
    y: mouseY,
  };
}

function ballReset() {
  if (player1Score >= WinningScore || (player2Score >= WinningScore)) {
    showingWinScreen = true;
  }else {
    ballSpeedX = -ballSpeedX;
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
  }
}
