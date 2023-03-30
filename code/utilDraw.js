class draw {
    static width = 1;
    static color = 'black';
    static clear() {
        ctx.clearRect(0, 0, screen.width, screen.height);
        //ctx.beginPath();
    };
    static circle(vector, radius) {
        ctx.arc(vector.x, vector.y, radius, 0, Math.PI*2);
    };
    static circleStroke(vector, radius) {
        ctx.lineWidth = this.width;
        ctx.strokeStyle = this.color;
        ctx.beginPath();
        this.circle(vector, radius);
        ctx.stroke()
    };
    static circleFill(vector, radius) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        this.circle(vector, radius);
        ctx.fill();
    };
    static line(vectorStart, vectorEnd) {
        ctx.moveTo(vectorStart.x, vectorStart.y);
        ctx.lineTo(vectorEnd.x, vectorEnd.y);
    };
    static lineStroke(vectorStart, vectorEnd) {
        ctx.lineWidth = this.width;
        ctx.strokeStyle = this.color;
        ctx.beginPath();
        this.line(vectorStart, vectorEnd);
        ctx.stroke();
    };
};