cc._RFpush(module, 'f432aKUtGFFQpJvyun/GSHD', 'hero');
// scripts/hero.js

'use strict';

cc.Class({
    'extends': cc.Component,

    properties: {
        StandAnimName: '',
        WalkAnimName: '',
        curDir: ''
    },

    toStand: function toStand() {
        this.getComponent(cc.Animation).play(this.StandAnimName + this.curDir);
    },

    toWalk: function toWalk(dir) {
        if (this.curDir === dir) return;
        this.curDir = dir;
        this.getComponent(cc.Animation).play(this.WalkAnimName + dir);
    },
    // use this for initialization
    onLoad: function onLoad() {}

});
// called every frame, uncomment this function to activate update callback
// update: function (dt) {

// },

cc._RFpop();