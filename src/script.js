// import Paddle from '/src/paddle';
// export - iimport is not working for some reason!!!

let canvas = document.getElementById('game-screen');
let ctx = canvas.getContext('2d');

const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;

// GAME STATES
const GAMESTATE = {
    PAUSED: 0,
    RUNNING: 1,
    MENU: 2,
    GAMEOVER: 3,
    NEWLEVEL: 4
}

// Hmm... Seems like unneeded
// ctx.clearRect(0, 0, 800, 600);

// ctx.fillStyle = '#f00';
// ctx.fillRect(20, 20, 100, 100);

// // Update of fill style so that new elements have that style
// ctx.fillStyle = '#00f';
// ctx.fillRect(420, 300, 50, 50);

// CONSTRUCTOR CLASS FRO PADDLE
class Paddle {
    constructor(game) {
        this.gameWidth = game.gameWidth;

        this.width = 150;
        this.height = 20;

        this.maxSpeed = 5;
        this.speed = 0;

        this.position = {
            x: game.gameWidth / 2 - this.width / 2,
            y: game.gameHeight - this.height - 10,
        };
    }

    moveLeft() {
        this.speed = -this.maxSpeed;
    }

    moveRight() {
        this.speed = this.maxSpeed;
    }

    stop() {
        this.speed = 0;
    }

    draw(ctx) {
        ctx.fillStyle = '#00f';
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    }

    update(deltaTime) {

        this.position.x += this.speed;

        if(this.position.x < 0) {
            this.position.x = 0;
        }
        if(this.position.x > GAME_WIDTH - this.width) {
            this.position.x = GAME_WIDTH - this.width;
        }
    }
}
// END OF CONSTRUCTOR CLASS FOR PADDLE

// CONSTRUCTOR CLASS FOR KEYPRESS EVENT
class InputHandler {

    constructor(paddle, game) {
        document.addEventListener('keydown', (event) => {
            switch(event.keyCode) {
                case 37: 
                    paddle.moveLeft();
                    break;
                case 39:
                    paddle.moveRight();
                    break;
                case 27:
                    game.togglePause();
                    break;
                case 32:
                    game.start();
                    break;
            }
        });   

        // Stopping the paddle when key up
        document.addEventListener('keyup', (event) => {
            switch(event.keyCode) {
                case 37: 
                    if(paddle.speed < 0) {
                        paddle.stop();
                    }
                    break;
                case 39:
                    if(paddle.speed > 0) {
                        paddle.stop();
                    }
                    break;
            }
        });
    }
}
//  END OF CONSRUCTOR CLASS FOR KEYPRESS EVENTS

//  CONSTRUCTOR CLASS FOR BALL
class Ball {

    constructor(game) {

        this.image = document.getElementById('img-ball');

        this.gameWidth = game.gameWidth;
        this.gameHeight = game.gameHeight;

        this.game = game;

        this.size = 20;

        this.reset();
    }

    reset() {
        this.position = { x: 10, y: 400 };
        this.speed = { x: 5, y: -5 };
    }

    draw(ctx) {
        ctx.drawImage(this.image, this.position.x, this.position.y, this.size, this.size);
    }

    update(deltaTime) {
        this.position.x += this.speed.x;
        this.position.y += this.speed.y;

        // checking to see if the ball his wall on left or right
        if(this.position.x < 0 || this.position.x > this.gameWidth - this.size) {
            this.speed.x = -this.speed.x;
        }

        // checking to see if the ball hits the wall on bottom
        if(this.position.y < 0) {
            this.speed.y = -this.speed.y;
        }

        // bottom of game/canvar/gamepla field
        if(this.position.y > this.gameHeight - this.size) {
            this.game.lives--;
        }

        // check collision with pabble
        
        if(detectCollision(this, this.game.paddle)) {
            this.speed.y = -this.speed.y;
            this.position.y = this.game.paddle.position.y - this.size;
        }
    }
}
//  END OF CONSTRUCTOR CLASS FOR BALL

// CONSTRUCTOR CLASS FOR BRICKS
class Brick {

    constructor(game, position) {
        this.image = document.getElementById('img-brick');

        this.game = game;

        this.position = position;
        this.width = 80;
        this.height = 24;

        this.markedForDeletion = false;
    }

    update() {
        if(detectCollision(this.game.ball, this)) {
            this.game.ball.speed.y = -this.game.ball.speed.y;

            this.markedForDeletion = true;
        }
    }

    draw(ctx) {
        ctx.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
    }
}
// END OF CONSTRUCTOR CLASS FOR BRICKS

// LEVELS 
function buildLevel(game, level) {
    let bricks = [];
  
    level.forEach((row, rowIndex) => {
      row.forEach((brick, brickIndex) => {
        if (brick === 1) {
          let position = {
            x: 80 * brickIndex,
            y: 75 + 24 * rowIndex
          };
          bricks.push(new Brick(game, position));
        }
      });
    });
  
    return bricks;
}
  
    const level1 = [
    // [0, 1, 1, 0, 0, 0, 0, 1, 1, 0],
    // [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    // [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    // [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    [0, 0, 0, 0, 0, 0, 0, 1, 0, 0]
    ];
  
    const level2 = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 1, 1, 0, 1, 1, 0, 1, 0],
    [1, 0, 0, 1, 0, 0, 0, 0, 0, 1],
    [0, 1, 0, 1, 0, 1, 0, 1, 0, 1]
    ];

    const level3 = [
    [0, 1, 1, 0, 0, 0, 0, 1, 1, 0],
    [1, 0, 0, 0, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 0, 0, 0, 0, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ];

    const level4 = [
    [0, 1, 1, 0, 0, 0, 0, 1, 1, 0],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ];

    const level5 = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [0, 1, 1, 0, 0, 0, 0, 1, 1, 0],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ];
// end of levels

// function for collision with bricks 
function detectCollision(ball, gameObject) {
    let bottomOfBall = ball.position.y + ball.size;
    let topOfBall = ball.position.y;


    let topOfObject = gameObject.position.y;
    let leftSideOfObject = gameObject.position.x;
    let rightSideOfObject = gameObject.position.x + gameObject.width;
    let bottomOfObject = gameObject.position.y + gameObject.height;
    
    if(bottomOfBall >= topOfObject &&
        topOfBall <= bottomOfObject &&
        ball.position.x >= leftSideOfObject &&
        ball.position.x + ball.size <= rightSideOfObject
    ) {
        return true;
    }
    else {
        return false;
    }
}
// end of collision with bricks


// CONSTRUCTOR CLASS FOR GAME
class Game {

    constructor(gameWidth, gameHeight) {
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;

        this.gameState = GAMESTATE.MENU;

        this.paddle = new Paddle(this);
        this.ball = new Ball(this);

        this.gameObjects = [];

        this.bricks = [];

        this.lives = 1;

        this.levels = [level1, level2, level3];
        this.currentLevel = 0;

        new InputHandler(this.paddle, this);
    }

    // start function
    start() {
        if(this.gameState !== GAMESTATE.MENU && this.gameState !== GAMESTATE.NEWLEVEL) {
            return;
        } 


        this.bricks = buildLevel(this, this.levels[this.currentLevel]);

        this.ball.reset();

        this.gameObjects = [this.ball, this.paddle];

        this.gameState = GAMESTATE.RUNNING;
    }

    update(deltaTime) {
        if(this.lives === 0) {
            this.gameState = GAMESTATE.GAMEOVER;
        }

        if(this.gameState === GAMESTATE.PAUSED ||
           this.gameState === GAMESTATE.MENU ||
           this.gameState === GAMESTATE.GAMEOVER) 
           {
            return;
        }


        // check to see if all bricks are destroyed to move to next level
        if(this.bricks.length === 0) {
            this.currentLevel++;
            this.gameState = GAMESTATE.NEWLEVEL;
            this.start();
        }



        [...this.gameObjects, ...this.bricks].forEach(object => object.update(deltaTime));

        this.bricks = this.bricks.filter(brick => !brick.markedForDeletion);
    }

    draw(ctx) {
        [...this.gameObjects, ...this.bricks].forEach(object => object.draw(ctx));

        if(this.gameState === GAMESTATE.PAUSED) {
            ctx.rect(0, 0, this.gameWidth, this.gameHeight);
            ctx.fillStyle = 'rgba(0,0,0,.5';
            ctx.fill();

            ctx.font = '30px Arial';
            ctx.fillStyle = 'white';
            ctx.textAlign = 'center';
            ctx.fillText('Paused', this.gameWidth / 2, this.gameHeight / 2);
        }

        if(this.gameState === GAMESTATE.MENU) {
            ctx.rect(0, 0, this.gameWidth, this.gameHeight);
            ctx.fillStyle = 'rgba(0,0,0,1';
            ctx.fill();

            ctx.font = '30px Arial';
            ctx.fillStyle = 'white';
            ctx.textAlign = 'center';
            ctx.fillText('Press SPACEBAR to start / Press ESC to pause',
                 this.gameWidth / 2, this.gameHeight / 2);
        }
        
        if(this.gameState === GAMESTATE.GAMEOVER) {
            ctx.rect(0, 0, this.gameWidth, this.gameHeight);
            ctx.fillStyle = 'rgba(0,0,0,1';
            ctx.fill();

            ctx.font = '30px Arial';
            ctx.fillStyle = 'red';
            ctx.textAlign = 'center';
            ctx.fillText('GAME OVER', this.gameWidth / 2, this.gameHeight / 2);
        }
    }

    togglePause() {
        if(this.gameState == GAMESTATE.PAUSED) {
            this.gameState = GAMESTATE.RUNNING;
        }
        else {
            this.gameState = GAMESTATE.PAUSED;
        }
    }
}   
//  END OF CONSTRUCTOR CLASS FOR GAME


let game = new Game(GAME_WIDTH, GAME_HEIGHT);


// Game Loop
let lastTime = 0;

// creating a game loop function
function gameLoop(timeStamp) {

    let deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;

    ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    game.update(deltaTime);
    game.draw(ctx);

    requestAnimationFrame(gameLoop);

}

requestAnimationFrame(gameLoop);