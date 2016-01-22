ig.module('plugins.entity-extension')
    .requires('impact.entity')
    .defines(function () {
        var Center = function (parent) {
            this.parent = parent;
        }
        Object.defineProperties(Center.prototype, {
            x: {
                get: function () {
                    return this.parent.pos.x + this.parent.size.x / 2;
                }
            },
            y: {
                get: function () {
                    return this.parent.pos.y + this.parent.size.y / 2;
                }
            }
        });

        var Screen = function (parent) {
            this.parent = parent;
        }
        Object.defineProperties(Screen.prototype, {
            x: {
                get: function () {
                    return this.parent.pos.x - ig.game.screen.x;
                }
            },
            y: {
                get: function () {
                    return this.parent.pos.y - ig.game.screen.y;
                }
            }
        });

        ig.Entity.inject({
            init: function (x, y, settings) {
                this.parent(x, y, settings);
                this.center = new Center(this);
                this.screen = new Screen(this);
            },
            getPinPosition: function (x, y) {
                var cos = Math.cos(this.currentAnim.angle);
                var sin = Math.sin(this.currentAnim.angle);
                return {
                    x: this.pos.x + x * cos - y * sin,
                    y: this.pos.y + x * sin + y * cos
                };
            },
        });

        Object.defineProperties(ig.Entity.prototype, {
            left: {
                get: function () {
                    return this.pos.x;
                }
            },
            right: {
                get: function () {
                    return this.pos.x + this.size.x;
                }
            },
            top: {
                get: function () {
                    return this.pos.y;
                }
            },
            bottom: {
                get: function () {
                    return this.pos.y + this.size.y;
                }
            },
            offscreen: {
                get: function () {
                    return this.right < ig.game.screen.x || this.left > ig.game.screen.x + ig.system.width
                        || this.bottom < ig.game.screen.y || this.top > ig.game.screen.y + ig.system.height;
                }
            }
        });
    });