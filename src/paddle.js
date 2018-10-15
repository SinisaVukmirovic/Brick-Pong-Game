export default class Paddle {
    constructor(gameWidth, gameHeight) {
        this.width = 150;
        this.height = 30;

        this.maxSpeed = 5;
        this.speed = 0;

        this.position = {
            x: gameWidth / 2 - this.width / 2,
            y: gameHeight - this.height - 10,
        };
    }

    //==========================================================================
    moveLeft() {
        this.speed = -this.maxSpeed;
    }

    draw(ctx) {
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    }

    //==========================================================================

    update(deltaTime) {
        this.position.x += 5 / deltaTime;

        this.position.x += this.speed;

        if(this.position.x < 0) {
            this.position.x = 0;
        }
        if(this.position.x > GAME_WIDTH - paddle.width) {
            this.position.x = GAME_WIDTH - paddle.width;
        }
    }
}
