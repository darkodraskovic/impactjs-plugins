ig.module(
    'plugins.vehicle'
    )
    .defines(function () {

        ig.Vehicle = {
            maxSpeed: 200,
            maxVel: {x: 500, y: 500},
            accelFactor: 100,
            deccelFactor: 250,
            friction: {x: 150, y: 150},
            maxFriction: 150,
            // 0: stop, 1: forward, -1: backward
            movDir: 0,
            // 0: stop, 1: forward, -1: backward
            accelDir: 0,
            moveAngle: 0,
            turnSpeed: 0.05,
            // 0: stop, -1: left, 1: right
            turnDir: 0,
            driftRecover: 0.5,
            spin: true,
            init: function (x, y, settings) {
                this.maxVel.x = this.maxVel.y = this.maxSpeed;

                // Call the parent constructor
                this.parent(x, y, settings);
            },
            update: function () {
                // turn
                if (this.spin || this.movDir) {
                    this.currentAnim.angle += this.turnSpeed * this.turnDir;
                    this.currentAnim.angle = this.currentAnim.angle % (Math.PI * 2);
                }
                var angle = this.currentAnim.angle;

                // move
                var accelFactor = 0;
                if (this.accelDir) {
                    accelFactor = this.accelFactor * this.accelDir;
                    if (this.accelDir !== this.movDir) {
                        // #docs: .friction.* only applies if .accel.* is 0.
                        accelFactor += this.maxFriction * -this.movDir;
                    }
                }
                this.friction.x = Math.abs(this.maxFriction * Math.cos(this.moveAngle));
                this.friction.y = Math.abs(this.maxFriction * Math.sin(this.moveAngle));
                this.accel.x = accelFactor * Math.cos(angle);
                this.accel.y = accelFactor * Math.sin(angle);

                var vel = this.vel;
                if (vel.x || vel.y) {
                    var movAngle = this.moveAngle = Math.atan2(vel.y, vel.x);
                    var speed = Math.sqrt(vel.x * vel.x + vel.y * vel.y);

                    // move dir
                    var angleDiff = Math.abs(movAngle - angle);
                    if (angleDiff < Math.PI / 2 || angleDiff > Math.PI * 3 / 2) {
                        this.movDir = 1;
                    } else
                        this.movDir = -1;

                    // speed limit
                    speed = speed.limit(0, this.maxSpeed);
                    vel.x = Math.cos(movAngle) * speed;
                    vel.y = Math.sin(movAngle) * speed;

                    // drift recover
                    if (this.turnDir && this.driftRecover) {
                        vel.x = vel.x * (1 - this.driftRecover) + Math.cos(angle) * speed * this.driftRecover * this.movDir;
                        vel.y = vel.y * (1 - this.driftRecover) + Math.sin(angle) * speed * this.driftRecover * this.movDir;
                    }
                } else {
                    this.movDir = 0;
                }

                // Call the parent update() method to move the entity
                // according to its physics                
                this.parent();
            }
        }

    });