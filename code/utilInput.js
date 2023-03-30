class input {
    static mouse = {pos: new Vector(), worldPos: new Vector(), down: false};
    static keys = {};
    static updateMouse(event) {
        screenX = screen.getBoundingClientRect().left;
        screenY = screen.getBoundingClientRect().top;
        this.mouse.pos.x = event.clientX - screenX;
        this.mouse.pos.y = event.clientY - screenY;
    };
    static updateWorldMouse() {
        this.mouse.worldPos = this.mouse.pos.screenToWorld();
    };
    static isKeyDown(key) {
        if(this.keys[key.toLowerCase()]) {return true;};
        return false;
    };
    static setKeyDown(key) {
        this.keys[key.toLowerCase()] = true;
    };
    static setKeyUp(key) {
        this.keys[key.toLowerCase()] = false;
    };
};