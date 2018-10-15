export default class Game {
    constructor(game) {

        this.image = document.getElementById('img-ball');

        this.gameWidth = game.gameWidth;
        this.gameHeight = game.gameHeight;

        this.game = game;

        this.position = { x: 10, y: 10 };
        this.speed = { x: 5, y: 5 };
        this.size = 20;
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

        // checking to see if the ball hits the wall on top or bottom
        if(this.position.y < 0 || this.position.y > this.gameHeight - this.size) {
            this.speed.y = -this.speed.y;
        }

        // check collision with pabble
        let bottomOfBall = this.position.y + this.size;
        let topOfPaddle = this.game.paddle.position.y;

        let leftSideOfPaddle = this.game.paddle.position.x;
        let rightSideOfPaddle = this.game.paddle.position.x + this.game.paddle.width;
        
        if(bottomOfBall >= topOfPaddle
            && this.position.x >= leftSideOfPaddle
            && this.position.x + this.size <= rightSideOfPaddle) {
            this.speed.y = -this.speed.y;
            this.position.y = this.game.paddle.position.y - this.size;
        }
    }
}