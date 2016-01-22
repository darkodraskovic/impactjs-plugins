/*
 init: function() {    
 this.camera = new Camera( ig.system.width/4, ig.system.height/3, 5 );
 this.camera.deadzone.size.x = ig.system.width/10;
 this.camera.deadzone.size.y = ig.system.height/3;
 this.camera.lookAhead.x = ig.ua.mobile ? ig.system.width/6 : 0;
 },
 
 loadLevel: function( level ) {        
 this.parent( level );
 
 this.player = this.getEntitiesByType( EntityPlayer )[0];
 
 // Set camera max and reposition deadzone
 this.camera.max.x = this.collisionMap.width * this.collisionMap.tilesize - ig.system.width;
 this.camera.max.y = this.collisionMap.height * this.collisionMap.tilesize - ig.system.height;
 
 this.camera.set( this.player );
 },
 
 update: function() {
 this.camera.follow( this.player );
 this.parent();
 }
 */

ig.module(
    'plugins.camera'
    )
    .requires(
        'impact.impact'
        )
    .defines(function () {
        ig.Camera = ig.Class.extend({
            deadzone: {
                pos: {x: 0, y: 0},
                size: {x: 16, y: 16}
            },
            max: {x: 0, y: 0},
            offset: {x: 0, y: 0},
            pos: {x: 0, y: 0},
            damping: 5,
            lookAhead: {x: 0, y: 0},
            currentLookAhead: {x: 0, y: 0},
            init: function (offsetX, offsetY, damping) {
                this.offset.x = offsetX;
                this.offset.y = offsetY;
                this.damping = damping;
            },
            set: function (entity) {
                this.pos.x = entity.pos.x - this.offset.x;
                this.pos.y = entity.pos.y - this.offset.y;

                this.deadzone.pos.x = entity.pos.x + entity.size.x / 2 - this.deadzone.size.x / 2;
                this.deadzone.pos.y = entity.pos.y + entity.size.y / 2 - this.deadzone.size.y / 2;
            },
            follow: function (entity) {
                this.pos.x = this.move('x', entity.pos.x, entity.size.x);
                this.pos.y = this.move('y', entity.pos.y, entity.size.y);

                ig.game.screen.x = this.pos.x;
                ig.game.screen.y = this.pos.y;
            },
            move: function (axis, pos, size) {
                if (pos < this.deadzone.pos[axis]) {
                    this.deadzone.pos[axis] = pos;
                    this.currentLookAhead[axis] = this.lookAhead[axis];
                }
                else if (pos + size > this.deadzone.pos[axis] + this.deadzone.size[axis]) {
                    this.deadzone.pos[axis] = pos + size - this.deadzone.size[axis];
                    this.currentLookAhead[axis] = -this.lookAhead[axis];
                }

                var campos = this.deadzone.pos[axis] - this.offset[axis] - this.currentLookAhead[axis];
                if (this.damping) {
                    campos = this.pos[axis] + (campos  - this.pos[axis]) * ig.system.tick * this.damping;
                }
                return campos.limit(0, this.max[axis]);
            },
            draw: function () {
                ig.system.context.fillStyle = 'rgba(255,0,255,0.2)';
                ig.system.context.fillRect(
                    (this.deadzone.pos.x - this.pos.x) * ig.system.scale,
                    (this.deadzone.pos.y - this.pos.y) * ig.system.scale,
                    this.deadzone.size.x * ig.system.scale,
                    this.deadzone.size.y * ig.system.scale
                    );
            }
        });
    });