export default class Ball {

    constructor() {

        this.image = document.getElementById('img-ball');
    }

    draw(ctx) {                 // X   Y   W   H / W,H optional
        ctx.drawImage(this.image, 10, 10, 20, 20);
    }

    update() {
        // to do later
    }

}