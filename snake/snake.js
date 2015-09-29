// Define some constants
var SNAKE_LENGTH = 5;
var ANIMATION_INTERVAL = 60;
var CELL_WIDTH = 10;

// When the page has loaded completely, run the game
$(document).ready(function () {
  // Get canvas element, its context, and its dimensions
  var canvas = $('#canvas')[0];
  var ctx = canvas.getContext('2d');
  var w = $('#canvas').width();
  var h = $('#canvas').height();

  // Declare some variables for the state of the game
  var direction, food, score, animationTimer, snakeArray;

  // Start the game and make it interactive
  init();
  addKeyboardControls();

  function init() {
    // Set the direction to right and the score to zero
    direction = 'right';
    score = 0;

    // Create the snake and first food
    createSnake();
    createFood();

    // Run the `paint` function every 60ms to animate the game
    clearInterval(animationTimer);
    animationTimer = setInterval(paint, ANIMATION_INTERVAL);
  }

  function createSnake() {
    // Initialize empty snake
    snakeArray = [];

    // Starting at the top left, create the cells to form the snake
    for(var i = SNAKE_LENGTH - 1; i >= 0; i--) {
      snakeArray.push({x: i, y:0});
    }
  }

  function createFood() {
    // Pick a random cell to put a new food particle on
    food = {
      x: Math.round(Math.random() * (w - CELL_WIDTH) / CELL_WIDTH),
      y: Math.round(Math.random() * (h - CELL_WIDTH) / CELL_WIDTH)
    };
  }

  function paint() {
    // Clear the whole canvas so the snake doesn't leave a trail
    clearCanvas();

    // Move the snake in the direction it is heading. If there was a collision,
    // stop painting and restart the game
    var newHead = moveSnake();
    if (newHead.collision) {
      init();
      return;
    }

    // Check if the snake ate the food in its new position
    checkIfAteFood(newHead);

    // Paint the new game elements
    paintSnake(newHead);
    paintCell(food.x, food.y);
    paintScore();
  }

  function clearCanvas() {
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = 'black';
    ctx.strokeRect(0, 0, w, h);
  }

  function moveSnake() {
    // Get the coordinates of the snake's head
    var nextX = snakeArray[0].x;
    var nextY = snakeArray[0].y;

    // Move the snake's head in the correct direction
    if (direction == 'right') nextX++;
    else if (direction == 'left') nextX--;
    else if (direction == 'up') nextY--;
    else if (direction == 'down') nextY++;

    // Check if the snake hit anything
    var hitLeftRight = (nextX == -1 || nextX == w / CELL_WIDTH);
    var hitTopBottom = (nextY == -1 || nextY == h / CELL_WIDTH);
    var hitItself = checkCollision(nextX, nextY, snakeArray);

    // If the snake hit anything, return the collision
    if (hitLeftRight || hitTopBottom || hitItself) {
      return {collision: true};
    }

    // If the snake didn't hit anything, return its new position
    return {x: nextX, y: nextY};
  }

  function checkCollision(x, y, array) {
    // If any cell in the array is at the same coordinates as (x, y), return
    // that there was a collision
    for (var i = 0; i < array.length; i++) {
      if (array[i].x == x && array[i].y == y) {
        return true;
      }
    }

    // Otherwise, there was no collision
    return false;
  }

  function checkIfAteFood(newHead) {
    if (newHead.x == food.x && newHead.y == food.y) {
      // Increment the score and create more food
      score++;
      createFood();
    } else {
      // Remove the tail of the snake
      snakeArray.pop();
    }
  }

  function paintSnake(newHead) {
    // Add a new cell where the head should go
    snakeArray.unshift(newHead);

    // Actually paint the snake to the canvas
    for(var i = 0; i < snakeArray.length; i++) {
      var c = snakeArray[i];
      paintCell(c.x, c.y);
    }
  }

  function paintCell(x, y) {
    ctx.fillStyle = 'blue';
    ctx.fillRect(x * CELL_WIDTH, y * CELL_WIDTH, CELL_WIDTH, CELL_WIDTH);
    ctx.strokeStyle = 'white';
    ctx.strokeRect(x * CELL_WIDTH, y * CELL_WIDTH, CELL_WIDTH, CELL_WIDTH);
  }

  function paintScore() {
    var score_text = 'Score: ' + score;
    ctx.fillText(score_text, 5, h - 5);
  }

  function addKeyboardControls() {
    $(document).keydown(function (event) {
      // Get the key code for the arrow they pressed
      var key = event.which;

      // Switch directions but don't let them reverse the way they came
      if (key == 37 && direction != 'right') direction = 'left';
      else if (key == 38 && direction != 'down') direction = 'up';
      else if (key == 39 && direction != 'left') direction = 'right';
      else if (key == 40 && direction != 'up') direction = 'down';
    });
  }
});
