"use strict";

import Vector from "./utilMath.js";

class Input {
    constructor() {
        this.mouse = {pos: new Vector(), worldPos: new Vector(), down: false};
        this.keys = {};
    }

    updateMouse(screen, event) {
        const screenX = screen.getBoundingClientRect().left;
        const screenY = screen.getBoundingClientRect().top;
        this.mouse.pos.x = event.clientX - screenX;
        this.mouse.pos.y = event.clientY - screenY;
    };

    updateWorldMouse(cam, screen) {
        this.mouse.worldPos = this.mouse.pos.screenToWorld(cam, screen);
    };

    isKeyDown(key) {
        if(this.keys[key.toLowerCase()]) {return true;};
        return false;
    };

    setKeyDown(key) {
        this.keys[key.toLowerCase()] = true;
    };

    setKeyUp(key) {
        this.keys[key.toLowerCase()] = false;
    };
};

const input = new Input();

export { input };