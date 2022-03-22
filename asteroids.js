let canvas;
let context;

let request_id;
let fpsInterval = 1000 / 30; // the denominator is frames-per-second
let now;
let then = Date.now();

let asteroids = []

let player = {
    x : 0,
    y : 150,
    size : 10
}

let moveLeft = false;
let moveUp = false;
let moveRight = false;
let moveDown = false;

document.addEventListener("DOMContentLoaded", init, false);

function init() {
    canvas = document.querySelector("canvas");
    context = canvas.getContext("2d");  

    window.addEventListener("keydown", activate, false);
    window.addEventListener("keyup", deactivate, false);

    draw();
}

function draw() {
    // Dragging down frames-per-second
    request_id = window.requestAnimationFrame(draw);
    let now = Date.now();
    let elapsed = now - then;
    if (elapsed <= fpsInterval) {
        return;
    } 
    then = now - (elapsed % fpsInterval);

    if (asteroids.length < 10) {
        let a = {
            x : canvas.width,
            y : randint(0, canvas.height),
            size : randint(5, 15),
            xChange : randint(-10, -1),
            yChange : 0
        };
        asteroids.push(a);
    }
    //asteroids
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "yellow";
    for (let a of asteroids) {
        context.fillRect(a.x, a.y, a.size, a.size);
    }
    // player
    context.fillStyle = "cyan";
    context.fillRect(player.x, player.y, player.size, player.size);
    // check for win
    if (player.x + player.size >= canvas.width) {
        stop();
        return;
    }
    // check for collision
    for (let a of asteroids) {
        if (player_collides(a)) {
            stop();
            return;
        }
    }
    // position asteroids
    for (let a of asteroids) {
        if (a.x + a.size < 0) {
            a.x = canvas.width;
            a.y = randint(0, canvas.height);
        } else {
            a.x = a.x + a.xChange;
            a.y = a.y + a.yChange;
        }
    }
    // move player
    if (moveRight) {
        player.x = player.x + player.size;
    }
    if (moveUp) {
        player.y = player.y - player.size;
    }
    if (moveDown) {
        player.y = player.y + player.size;
    }
    if (moveLeft) {
        player.x = player.x - player.size;
    }
}
// generating randint 
function randint(min, max) {
    return Math.round(Math.random() * (max - min)) + min;
}
// Managing key presses
function activate(event) {
    let key = event.key;
    if (key === "ArrowLeft") {
        moveLeft = true;
    } else if (key === "ArrowUp") {
        moveUp = true;
    } else if (key === "ArrowRight") {
        moveRight = true;
    } else if (key === "ArrowDown") {
        moveDown = true;
    }
}
function deactivate(event) {
    let key = event.key;
    if (key === "ArrowLeft") {
        moveLeft = false;
    } else if (key === "ArrowUp") {
        moveUp = false;
    } else if (key === "ArrowRight") {
        moveRight = false;
    } else if (key === "ArrowDown") {
        moveDown = false;
    }
}
// Check for collision
function player_collides(a) {
    if (player.x + player.size < a.x || 
        a.x + a.size < player.x ||
        player.y > a.y + a.size ||
        a.y > player.y + player.size) {
            return false;
        } else {
            return true;
        }
}
// stopping the game
function stop() {
    window.removeEventListener("keydown", activate, false);
    window.removeEventListener("keyup", deactivate, false);
    window.cancelAnimationFrame(request_id);
}