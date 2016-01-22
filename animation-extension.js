ig.module('plugins.animation-extension')
    .requires('impact.entity')
    .defines(function () {
        // sequence: int[], pattern: string - forward, backward, pingpong
        ig.Animation.getSequence = function (sequence, pattern) {
            switch (pattern) {
                case 'forward':
                    return sequence.slice();
                    break;
                case 'backward':
                    return sequence.slice().reverse();
                    break;
                case 'pingpong':
                    var s = sequence.slice();
                    s.shift(); s.pop();
                    return sequence.concat(s);
                    break;
                default: 
                    return sequence.slice();
            }
        };
    });