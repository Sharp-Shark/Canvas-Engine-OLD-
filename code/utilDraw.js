"use strict";

export default class Draw {
    constructor(ctx) {
        this.ctx = ctx;
        this.width = 1;
        this.color = "black";
    }

    clear(screen) {
        this.ctx.clearRect(0, 0, screen.width, screen.height);
        //ctx.beginPath();
    };

    circle(vector, radius) {
        this.ctx.arc(vector.x, vector.y, radius, 0, Math.PI*2);
    };

    circleStroke(vector, radius) {
        this.ctx.lineWidth = this.width;
        this.ctx.strokeStyle = this.color;
        this.ctx.beginPath();
        this.circle(vector, radius);
        this.ctx.stroke()
    };

    circleFill(vector, radius) {
        this.ctx.fillStyle = this.color;
        this.ctx.beginPath();
        this.circle(vector, radius);
        this.ctx.fill();
    };

    line(vectorStart, vectorEnd) {
        this.ctx.moveTo(vectorStart.x, vectorStart.y);
        this.ctx.lineTo(vectorEnd.x, vectorEnd.y);
    };

    lineStroke(vectorStart, vectorEnd) {
        this.ctx.lineWidth = this.width;
        this.ctx.strokeStyle = this.color;
        this.ctx.beginPath();
        this.line(vectorStart, vectorEnd);
        this.ctx.stroke();
    };
};