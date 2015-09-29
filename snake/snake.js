// Constants
var SNAKE_LENGTH = 5;
var ANIMATION_INTERVAL = 60;

$(document).ready(function () {
  // Get canvas element, its context, and its dimensions
  var canvas = $('#canvas')[0];
  var ctx = canvas.getContext('2d');
  var w = $('#canvas').width();
  var h = $('#canvas').height();

  // Initialize some variables for the state of the game
  var cellWidth = 10;
  var direction;
  var food;
  var score;
  var animationTimer;

  //Lets create the snake now
  var snake_array; //an array of cells to make up the snake

  function init() {
    // Set the direction to right initially
    direction = 'right';

    // Create the snake and first food
    create_snake();
    create_food();

    // Set the score to zero
    score = 0;

    // Run the `paint` function every 60ms to animate the game
    clearInterval(animationTimer);
    animationTimer = setInterval(paint, ANIMATION_INTERVAL);
  }

  init();

  function create_snake() {
    // Initialize empty snake
    snake_array = [];

    // Starting at the top left, create the cells to form the snake
    for(var i = SNAKE_LENGTH - 1; i >= 0; i--) {
      snake_array.push({x: i, y:0});
    }
  }

  //Lets create the food now
  function create_food() {
    food = {
      x: Math.round(Math.random()*(w-cellWidth)/cellWidth),
      y: Math.round(Math.random()*(h-cellWidth)/cellWidth),
    };
    //This will create a cell with x/y between 0-44
    //Because there are 45(450/10) positions accross the rows and columns
  }

  //Lets paint the snake now
  function paint() {
    //To avoid the snake trail we need to paint the BG on every frame
    //Lets paint the canvas now
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = 'black';
    ctx.strokeRect(0, 0, w, h);

    //The movement code for the snake to come here.
    //The logic is simple
    //Pop out the tail cell and place it infront of the head cell
    var nx = snake_array[0].x;
    var ny = snake_array[0].y;
    //These were the position of the head cell.
    //We will increment it to get the new head position
    //Lets add proper direction based movement now
    if(direction == 'right') nx++;
    else if(direction == 'left') nx--;
    else if(direction == 'up') ny--;
    else if(direction == 'down') ny++;

    //Lets add the game over clauses now
    //This will restart the game if the snake hits the wall
    //Lets add the code for body collision
    //Now if the head of the snake bumps into its body, the game will restart
    if (nx == -1 || nx == w/cellWidth || ny == -1 || ny == h/cellWidth || check_collision(nx, ny, snake_array)) {
      //restart game
      init();
      //Lets organize the code a bit now.
      return;
    }

    //Lets write the code to make the snake eat the food
    //The logic is simple
    //If the new head position matches with that of the food,
    //Create a new head instead of moving the tail
    if(nx == food.x && ny == food.y)
      {
        var tail = {x: nx, y: ny};
        score++;
        //Create new food
        create_food();
      }
      else
        {
          var tail = snake_array.pop(); //pops out the last cell
          tail.x = nx; tail.y = ny;
        }
        //The snake can now eat the food.

        snake_array.unshift(tail); //puts back the tail as the first cell

        for(var i = 0; i < snake_array.length; i++)
        {
          var c = snake_array[i];
          //Lets paint 10px wide cells
          paint_cell(c.x, c.y);
        }

        //Lets paint the food
        paint_cell(food.x, food.y);
        //Lets paint the score
        var score_text = 'Score: ' + score;
        ctx.fillText(score_text, 5, h-5);
  }

  //Lets first create a generic function to paint cells
  function paint_cell(x, y)
  {
    ctx.fillStyle = 'blue';
    ctx.fillRect(x*cellWidth, y*cellWidth, cellWidth, cellWidth);
    ctx.strokeStyle = 'white';
    ctx.strokeRect(x*cellWidth, y*cellWidth, cellWidth, cellWidth);
  }

  function check_collision(x, y, array)
  {
    //This function will check if the provided x/y coordinates exist
    //in an array of cells or not
    for(var i = 0; i < array.length; i++)
    {
      if(array[i].x == x && array[i].y == y)
        return true;
    }
    return false;
  }

  //Lets add the keyboard controls now
  $(document).keydown(function(e){
    var key = e.which;
    //We will add another clause to prevent reverse gear
    if(key == '37' && direction != 'right') direction = 'left';
    else if(key == '38' && direction != 'down') direction = 'up';
    else if(key == '39' && direction != 'left') direction = 'right';
    else if(key == '40' && direction != 'up') direction = 'down';
    //The snake is now keyboard controllable
  });
});
