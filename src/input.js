export default class InputHandler {

    constructor() {
        document.addEventListener('keydown', (event) => {
            switch(event.keyCode) {
                case 37: 
                    paddle.moveLeft();
                    break;
                case 39:
                    paddle.moveRight();
                    break;
            }
        });   
        // Stopping the paddle when key up
        document.addEventListener('keyup', (event) => {
            switch(event.keyCode) {
                case 37: 
                    paddle.stop();
                    break;
                case 39:
                    paddle.stop();
                    break;
            }
        });
    }

}

    

