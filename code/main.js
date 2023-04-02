"use strict";

import Draw from './utilDraw.js';
import Vector from './utilMath.js';
import input  from './utilInput.js';

let screen = document.getElementById('screen');
screen.x = screen.getBoundingClientRect().left;
screen.y = screen.getBoundingClientRect().top;
let ctx = screen.getContext("2d");

const draw = net Draw(ctx);
c

let kbKeys = {};

function resizeCanvas () {
    screen.width = document.documentElement.clientWidth - 4;
    screen.height = document.documentElement.clientHeight - 4;
};

/*
CODE ABOVE IS FROM PREVIOUS ENGINE AND MIGHT BE REMOVED OR REFINED
*/

let cam = {pos: new Vector(), vel: new Vector(), zoom: 1, zoomVel: 0, angle: 0, angleVel: 0};

let idToAssign = 0;

let pb2 = new PhysObject(new CircleCollider(new Vector(0, 200), 50));
let pb = new PhysObject(new CircleCollider(new Vector(200, 0), 50));
pb.decel = 0.99;

function main() {
    draw.clear();
    // Apply forces
    cam.vel.translate(new Vector(input.isKeyDown('d')-input.isKeyDown('a'), input.isKeyDown('s')-input.isKeyDown('w')).setScaler(2/cam.zoom).rotate(0-cam.angle));
    cam.zoomVel += (input.isKeyDown('q')-input.isKeyDown('e')) * cam.zoom * 0.005;
    cam.angleVel += (input.isKeyDown('z')-input.isKeyDown('c')) * 0.035;
    // Apply vel
    cam.pos.translate(cam.vel);
    cam.zoom = Math.max(cam.zoom + cam.zoomVel, 0.001);
    cam.angle += cam.angleVel;
    // Friction
    cam.vel.scale(0.8);
    cam.zoomVel *= 0.8;
    cam.angleVel *= 0.5;
    // Update mouse world position
    input.updateWorldMouse();

    // Change relative-to-origin displacement vector
    if(input.mouse.down) {
        pb.vel.translate(input.mouse.pos.clone().screenToWorld().translate(pb.collider.pos.clone().reflect()).setScaler(0.1));
    };
    
    pb.physUpdate();
    pb.solveCollision(pb2);

    // Dot at world center
    draw.color = 'grey';
    draw.circleFill(new Vector(0, 0).worldToScreen(), 10*cam.zoom);
    // Draw Player
    draw.color = 'black';
    draw.width = 10*cam.zoom;
    draw.circleStroke(pb.collider.pos.clone().worldToScreen(), pb.collider.radius*cam.zoom);
    draw.circleStroke(pb2.collider.pos.clone().worldToScreen(), pb2.collider.radius*cam.zoom);
    // Dot at screen center
    draw.color = 'grey';
    draw.circleFill(cam.pos.clone().flipY().worldToScreen(), 5);
    // Dot at cursor
    draw.color = 'black';
    draw.circleFill(input.mouse.pos, 5);

    requestAnimationFrame(main);
};

resizeCanvas();
requestAnimationFrame(main);

/*
CODE BELOW IS FROM PREVIOUS ENGINE AND MIGHT BE REMOVED OR REFINED
*/

window.onresize = () => {
    resizeCanvas();
};

window.addEventListener('keydown', (event) => {
    if(event.code == 'Space') {
        input.setKeyDown(event.code);
    } else {
        input.setKeyDown(event.key);
    };
});

window.addEventListener('keyup', (event) => {
    if(event.code == 'Space') {
        input.setKeyUp(event.code);
    } else {
        input.setKeyUp(event.key);
    };
});

window.addEventListener('mousedown', (event) => {
    input.mouse.down = true;
});

window.addEventListener('mouseup', (event) => {
    input.mouse.down = false;
});

window.addEventListener('mousemove', (event) => {
    input.updateMouse(event);
});