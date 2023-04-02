Math.lerp = function(a, b, t) {
    return a*(1-t) + b*t;
};

Math.range = function(start, end) {
    let toReturn = [];
    let count = start;
    while(count < end) {
        toReturn.push(count++);
    };
    return toReturn;
};

export class Base {
    constructor() {
    };

    // Creates a duplicate of the object
    clone() {
        let clone = new Vector();
        for(let property in this) {
            clone[property] = this[property];
        };
        return clone;
    };
};

export class UniqueBase extends Base {
    static highestId = 0;
    constructor() {
        super(Base);
        this.id = UniqueBase.highestId++;
    };
};

export class Vector extends Base {
    // Pre-defined vectors
    static zero = new Vector(0, 0);
    static up = new Vector(0, 1);
    static left = new Vector(-1, 0)
    static down = new Vector(0, -1);
    static right = new Vector(1, 0);
    constructor(x=0, y=0) {
        super(Base);
        this.x = x;
        this.y = y;
    };

    // Gets and sets the vector's angle
    getAngle() {
        return Math.atan2(this.y, this.x);
    };

    setAngle(angle) {
        return this.rotate(angle - this.angle);
    };

    get angle() {
        return this.getAngle();
    }

    set angle(angle) {
        return this.setAngle(angle);
    };

    // Gets and sets the scaler aka magnitude
    getScaler() {
        return this.getDistTo(new Vector());
    };

    setScaler(scaler) {
        if(this.scaler == 0) {return this;};
        return this.scale(scaler / this.scaler);
    };

    get scaler() {
        return this.getScaler();
    };

    set scaler(scaler) {
        return this.setScaler(scaler);
    };

    // Clamps the vector's magnitude
    clamp(scaler) {
        if(this.scaler > scaler) {this.scaler = scaler};
        return this;
    };

    // Get distance to
    getDistTo(vector) {
        return Math.sqrt((this.x - vector.x)**2 + (this.y - vector.y)**2);
    };

    // Linear interpolation, if scaler=0.5 the returns midpoint
    lerp(vector, scaler) {
        return new Vector(Math.lerp(this.x, vector.x, scaler), Math.lerp(this.y, vector.y, scaler));
    };

    set(x, y) {
        this.x = x;
        this.y = y
        return this;
    };

    // Same as scaleVector(new Vector(-1, 1)) but faster
    flipX() {
        return this.set(0-this.x, this.y);
    };

    // Same as scaleVector(new Vector(1, -1)) but faster
    flipY() {
        return this.set(this.x, 0-this.y);
    };

    // Same as flipX and flipY combined
    reflect() {
        return this.scale(-1);
    };

    // Adds two vectors
    translate(vector) {
        this.x = this.x + vector.x;
        this.y = this.y + vector.y;
        return this;
    };

    // Translates using polar coordinates instead of a vector
    translatePolar(scaler, angle) {
        return this.translate(new Vector(scaler, 0).rotate(angle));
    };

    rotate(angle) {
        let scaler = this.scaler;
        let a = this.angle;
        return this.set(Math.cos(a + angle) * scaler, Math.sin(a + angle) * scaler);
    };

    scale(scaler) {
        return this.set(this.x * scaler, this.y * scaler);
    };

    scaleByVector(vector) {
        return this.set(this.x * vector.x, this.y * vector.y);
    };

    dotProduct(vector) {
        return this.scaler * vector.scaler * Math.cos(this.angle - vector.angle);
    };

    // Clamps the amount moved to the distance to the vector
    moveTowardsClamped(vector, scaler) {
        this.translate(vector.clone().translate(this.clone().reflect()).setScaler(scaler).clamp(this.getDistTo(vector)));
    };

    moveTowards(vector, scaler) {
        this.translate(vector.clone().translate(this.clone().reflect()).setScaler(scaler));
    };

    // Transforms from world to screen
    worldToScreen(cam, screen) {
        return this.clone().flipY().translate(cam.pos.clone().reflect()).rotate(cam.angle).scale(cam.zoom).translate(new Vector(screen.width/2, screen.height/2));
    };
    
    // Transforms from screen to world
    screenToWorld(cam, screen) {
        return this.clone().translate(new Vector(screen.width/-2, screen.height/-2)).scale(1/cam.zoom).rotate(0-cam.angle).translate(cam.pos).flipY();
    };
};

// Can be used for cameras, particles and things without collision that have velocity
export class KinematicObject extends UniqueBase {
    static objects = [];
    static oldObjects = [];

    static updateObjects() {
        this.oldObjects = [];
        for(let object of this.objects) {
            this.oldObjects.push(object.clone());
        };
        for(let object of this.objects) {
            object.update();
        };
    };

    constructor(pos=new Vector(), radius=1, mass=1, decel=1) {
        super(UniqueBase);
        this.pos = pos;
        this.vel = new Vector();
        this.radius = radius;
        this.mass = mass;
        this.decel = decel;
        KinematicObject.objects.push(this);
    };

    update() {
        this.physUpdate();
        this.logicUpdate();
    };

    physUpdate() {
        this.pos.translate(this.vel);
        this.vel.scale(this.decel);
    };

    logicUpdate() {
    };
};

export class PhysObject extends KinematicObject {
    static objects = [];
    static oldObjects = [];

    constructor(pos=new Vector(), radius=1, mass=1, decel=1) {
        super(KinematicObject);
        this.pos = pos;
        this.vel = new Vector();
        this.radius = radius;
        this.mass = mass;
        this.decel = decel;
        PhysObject.objects.push(this);
    };

    isColliding(physObject) {
        if(this.pos.getDistTo(physObject.pos) <= this.radius + physObject.radius) {
            return true;
        } else {
            return false;
        };
    };
    
    // Collisions are still WIP
    solveCollision(physObject) {
        if(!this.isColliding(physObject) || this.id == physObject.id) {return;};
        let oldPos = this.pos.clone()
        this.pos.moveTowards(physObject.pos, 0-(this.radius+physObject.radius-this.pos.getDistTo(physObject.pos)));
        this.vel.angle = oldPos.clone().translate(this.pos.clone().reflect()).angle - Math.PI;
        this.vel.scale(this.decel);
    };

    physUpdate() {
        for(let object of PhysObject.oldObjects) {
            this.solveCollision(object);
        };
        this.pos.translate(this.vel);
        this.vel.scale(this.decel);
    };
};