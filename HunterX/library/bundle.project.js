require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"Ground":[function(require,module,exports){
cc._RFpush(module, 'd537a4Wwg1CdpHkmRm7Imr2', 'Ground');
// scripts/Ground.js

'use strict';

cc.Class({
    'extends': cc.Component,

    properties: {
        curTileX: 12,
        curTileY: 42,

        radio: 1,
        finalList: [],
        hero: {
            'default': null,
            type: cc.Node
        }
    },

    toMove: function toMove() {
        if (this.finalList.length === 0) {
            this._standHero();
            return;
        }
        var dir = this.finalList.shift();

        this.node.runAction(cc.sequence(cc.callFunc(this._moveHero(dir.dx, dir.dy), this), cc.moveBy(this.radio * (dir.dx != 0 && dir.dy != 0 ? 1.4 : 1) / 10, -(dir.dx + dir.dy) * 32, (dir.dy - dir.dx) * 24), cc.callFunc(this.toMove, this)));
    },

    _standHero: function _standHero() {
        this.hero.getComponent('hero').toStand();
    },

    _moveHero: function _moveHero(dx, dy) {
        this.hero.getComponent('hero').toWalk(dx + '' + dy);
    },

    // use this for initialization
    onLoad: function onLoad() {
        var self = this;
        var myUtil = self.getComponent('Util');
        this.node.on('mouseup', function (event) {
            var myevent = new cc.Event.EventCustom('myClick', true);
            myevent.setUserData(event);

            this.node.dispatchEvent(myevent);

            self.finalList = [];

            self.finalList = myUtil.convertToPath(myUtil.convertTo45(event), self.curTileX, self.curTileY);
            self.toMove();
        }, this);
    }

});
// called every frame, uncomment this function to activate update callback
// update: function (dt) {

// },

cc._RFpop();
},{}],"Util":[function(require,module,exports){
cc._RFpush(module, '53038rVlEROoJRi49tj1dS5', 'Util');
// scripts/Util.js

"use strict";

cc.Class({
    "extends": cc.Component,

    properties: {},

    convertTo45: function convertTo45(clickEvent) {
        var visibleSize = cc.director.getVisibleSize();
        var oldX = (clickEvent.getLocationX() - visibleSize.width / 2) / 64;
        var oldY = (clickEvent.getLocationY() - visibleSize.height / 2) / 48;

        var rawNewX = oldX + oldY;
        var rawNewY = oldX - oldY;

        var newX = Math.floor(rawNewX) + 1;
        var newY = -Math.floor(-rawNewY) - 1;

        return {
            newX: newX,
            newY: newY
        };
    },

    convertToPath: function convertToPath(newPos, curTilePosX, curTilePosY) {
        var openList = [];
        var closeList = [];
        var finalList = [];
        var newX = newPos.newX;
        var newY = newPos.newY;
        console.log("posx=" + newX + ",posy=" + newY);
        var start = {
            x: curTilePosX,
            y: curTilePosY,
            g: 0,
            h: (Math.abs(newX) + Math.abs(newY)) * 10,
            p: null
        };
        start.f = start.g + start.h;

        var desTileX = start.x + newX;
        var desTileY = start.y + newY;

        openList.push(start);

        while (openList.length !== 0) {
            openList.sort(this._sortF);
            var parent = openList.shift();
            closeList.push(parent);
            if (parent.h === 0) {
                console.log(closeList.length);
                break;
            }
            for (var i = -1; i <= 1; i++) {
                for (var j = -1; i <= 1; i++) {
                    var rawX = parent.x + i;
                    var rawY = parent.y + j;
                    if (this.isInList(rawX, rawY, closeList)) {
                        continue;
                    }

                    var newG = parent.g + (i !== 0 && j !== 0 ? 14 : 10);

                    var neibour = {
                        x: rawX,
                        y: rawY,
                        g: newG,
                        h: Math.max(Math.abs(rawX - desTileX), Math.abs(rawY - desTileY)) * 10,
                        p: parent
                    };
                    neibour.f = neibour.g + neibour.h;

                    openList.push(neibour);
                }
            }
        }
        var des = closeList.pop();
        while (des.p) {
            des.dx = des.x - des.p.x;
            des.dy = des.y - des.p.y;
            console.log("dx=" + des.dx + ",dy=" + des.dy);
            finalList.unshift(des);
            des = des.p;
        };
        return finalList;
    },

    _sortF: function _sortF(a, b) {
        return a.f - b.f;
    },

    isInList: function isInList(x, y, list) {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = list[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var item = _step.value;

                if (item.x == x && item.y == y) return true;
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator["return"]) {
                    _iterator["return"]();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }

        return false;
    },
    // use this for initialization
    onLoad: function onLoad() {}

});
// called every frame, uncomment this function to activate update callback
// update: function (dt) {

// },

cc._RFpop();
},{}],"hero":[function(require,module,exports){
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
},{}]},{},["Util","Ground","hero"])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3dvcmtTb2Z0L0NvY29zQ3JlYXRvci5hcHAvQ29udGVudHMvUmVzb3VyY2VzL2FwcC5hc2FyL25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhc3NldHMvc2NyaXB0cy9Hcm91bmQuanMiLCJhc3NldHMvc2NyaXB0cy9VdGlsLmpzIiwiYXNzZXRzL3NjcmlwdHMvaGVyby5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImNjLl9SRnB1c2gobW9kdWxlLCAnZDUzN2E0V3dnMUNkcEhrbVJtN0ltcjInLCAnR3JvdW5kJyk7XG4vLyBzY3JpcHRzL0dyb3VuZC5qc1xuXG4ndXNlIHN0cmljdCc7XG5cbmNjLkNsYXNzKHtcbiAgICAnZXh0ZW5kcyc6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgY3VyVGlsZVg6IDEyLFxuICAgICAgICBjdXJUaWxlWTogNDIsXG5cbiAgICAgICAgcmFkaW86IDEsXG4gICAgICAgIGZpbmFsTGlzdDogW10sXG4gICAgICAgIGhlcm86IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLk5vZGVcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICB0b01vdmU6IGZ1bmN0aW9uIHRvTW92ZSgpIHtcbiAgICAgICAgaWYgKHRoaXMuZmluYWxMaXN0Lmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgdGhpcy5fc3RhbmRIZXJvKCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGRpciA9IHRoaXMuZmluYWxMaXN0LnNoaWZ0KCk7XG5cbiAgICAgICAgdGhpcy5ub2RlLnJ1bkFjdGlvbihjYy5zZXF1ZW5jZShjYy5jYWxsRnVuYyh0aGlzLl9tb3ZlSGVybyhkaXIuZHgsIGRpci5keSksIHRoaXMpLCBjYy5tb3ZlQnkodGhpcy5yYWRpbyAqIChkaXIuZHggIT0gMCAmJiBkaXIuZHkgIT0gMCA/IDEuNCA6IDEpIC8gMTAsIC0oZGlyLmR4ICsgZGlyLmR5KSAqIDMyLCAoZGlyLmR5IC0gZGlyLmR4KSAqIDI0KSwgY2MuY2FsbEZ1bmModGhpcy50b01vdmUsIHRoaXMpKSk7XG4gICAgfSxcblxuICAgIF9zdGFuZEhlcm86IGZ1bmN0aW9uIF9zdGFuZEhlcm8oKSB7XG4gICAgICAgIHRoaXMuaGVyby5nZXRDb21wb25lbnQoJ2hlcm8nKS50b1N0YW5kKCk7XG4gICAgfSxcblxuICAgIF9tb3ZlSGVybzogZnVuY3Rpb24gX21vdmVIZXJvKGR4LCBkeSkge1xuICAgICAgICB0aGlzLmhlcm8uZ2V0Q29tcG9uZW50KCdoZXJvJykudG9XYWxrKGR4ICsgJycgKyBkeSk7XG4gICAgfSxcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gb25Mb2FkKCkge1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIHZhciBteVV0aWwgPSBzZWxmLmdldENvbXBvbmVudCgnVXRpbCcpO1xuICAgICAgICB0aGlzLm5vZGUub24oJ21vdXNldXAnLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgIHZhciBteWV2ZW50ID0gbmV3IGNjLkV2ZW50LkV2ZW50Q3VzdG9tKCdteUNsaWNrJywgdHJ1ZSk7XG4gICAgICAgICAgICBteWV2ZW50LnNldFVzZXJEYXRhKGV2ZW50KTtcblxuICAgICAgICAgICAgdGhpcy5ub2RlLmRpc3BhdGNoRXZlbnQobXlldmVudCk7XG5cbiAgICAgICAgICAgIHNlbGYuZmluYWxMaXN0ID0gW107XG5cbiAgICAgICAgICAgIHNlbGYuZmluYWxMaXN0ID0gbXlVdGlsLmNvbnZlcnRUb1BhdGgobXlVdGlsLmNvbnZlcnRUbzQ1KGV2ZW50KSwgc2VsZi5jdXJUaWxlWCwgc2VsZi5jdXJUaWxlWSk7XG4gICAgICAgICAgICBzZWxmLnRvTW92ZSgpO1xuICAgICAgICB9LCB0aGlzKTtcbiAgICB9XG5cbn0pO1xuLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lLCB1bmNvbW1lbnQgdGhpcyBmdW5jdGlvbiB0byBhY3RpdmF0ZSB1cGRhdGUgY2FsbGJhY2tcbi8vIHVwZGF0ZTogZnVuY3Rpb24gKGR0KSB7XG5cbi8vIH0sXG5cbmNjLl9SRnBvcCgpOyIsImNjLl9SRnB1c2gobW9kdWxlLCAnNTMwMzhyVmxFUk9vSlJpNDl0ajFkUzUnLCAnVXRpbCcpO1xuLy8gc2NyaXB0cy9VdGlsLmpzXG5cblwidXNlIHN0cmljdFwiO1xuXG5jYy5DbGFzcyh7XG4gICAgXCJleHRlbmRzXCI6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHt9LFxuXG4gICAgY29udmVydFRvNDU6IGZ1bmN0aW9uIGNvbnZlcnRUbzQ1KGNsaWNrRXZlbnQpIHtcbiAgICAgICAgdmFyIHZpc2libGVTaXplID0gY2MuZGlyZWN0b3IuZ2V0VmlzaWJsZVNpemUoKTtcbiAgICAgICAgdmFyIG9sZFggPSAoY2xpY2tFdmVudC5nZXRMb2NhdGlvblgoKSAtIHZpc2libGVTaXplLndpZHRoIC8gMikgLyA2NDtcbiAgICAgICAgdmFyIG9sZFkgPSAoY2xpY2tFdmVudC5nZXRMb2NhdGlvblkoKSAtIHZpc2libGVTaXplLmhlaWdodCAvIDIpIC8gNDg7XG5cbiAgICAgICAgdmFyIHJhd05ld1ggPSBvbGRYICsgb2xkWTtcbiAgICAgICAgdmFyIHJhd05ld1kgPSBvbGRYIC0gb2xkWTtcblxuICAgICAgICB2YXIgbmV3WCA9IE1hdGguZmxvb3IocmF3TmV3WCkgKyAxO1xuICAgICAgICB2YXIgbmV3WSA9IC1NYXRoLmZsb29yKC1yYXdOZXdZKSAtIDE7XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIG5ld1g6IG5ld1gsXG4gICAgICAgICAgICBuZXdZOiBuZXdZXG4gICAgICAgIH07XG4gICAgfSxcblxuICAgIGNvbnZlcnRUb1BhdGg6IGZ1bmN0aW9uIGNvbnZlcnRUb1BhdGgobmV3UG9zLCBjdXJUaWxlUG9zWCwgY3VyVGlsZVBvc1kpIHtcbiAgICAgICAgdmFyIG9wZW5MaXN0ID0gW107XG4gICAgICAgIHZhciBjbG9zZUxpc3QgPSBbXTtcbiAgICAgICAgdmFyIGZpbmFsTGlzdCA9IFtdO1xuICAgICAgICB2YXIgbmV3WCA9IG5ld1Bvcy5uZXdYO1xuICAgICAgICB2YXIgbmV3WSA9IG5ld1Bvcy5uZXdZO1xuICAgICAgICBjb25zb2xlLmxvZyhcInBvc3g9XCIgKyBuZXdYICsgXCIscG9zeT1cIiArIG5ld1kpO1xuICAgICAgICB2YXIgc3RhcnQgPSB7XG4gICAgICAgICAgICB4OiBjdXJUaWxlUG9zWCxcbiAgICAgICAgICAgIHk6IGN1clRpbGVQb3NZLFxuICAgICAgICAgICAgZzogMCxcbiAgICAgICAgICAgIGg6IChNYXRoLmFicyhuZXdYKSArIE1hdGguYWJzKG5ld1kpKSAqIDEwLFxuICAgICAgICAgICAgcDogbnVsbFxuICAgICAgICB9O1xuICAgICAgICBzdGFydC5mID0gc3RhcnQuZyArIHN0YXJ0Lmg7XG5cbiAgICAgICAgdmFyIGRlc1RpbGVYID0gc3RhcnQueCArIG5ld1g7XG4gICAgICAgIHZhciBkZXNUaWxlWSA9IHN0YXJ0LnkgKyBuZXdZO1xuXG4gICAgICAgIG9wZW5MaXN0LnB1c2goc3RhcnQpO1xuXG4gICAgICAgIHdoaWxlIChvcGVuTGlzdC5sZW5ndGggIT09IDApIHtcbiAgICAgICAgICAgIG9wZW5MaXN0LnNvcnQodGhpcy5fc29ydEYpO1xuICAgICAgICAgICAgdmFyIHBhcmVudCA9IG9wZW5MaXN0LnNoaWZ0KCk7XG4gICAgICAgICAgICBjbG9zZUxpc3QucHVzaChwYXJlbnQpO1xuICAgICAgICAgICAgaWYgKHBhcmVudC5oID09PSAwKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coY2xvc2VMaXN0Lmxlbmd0aCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gLTE7IGkgPD0gMTsgaSsrKSB7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaiA9IC0xOyBpIDw9IDE7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgcmF3WCA9IHBhcmVudC54ICsgaTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJhd1kgPSBwYXJlbnQueSArIGo7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmlzSW5MaXN0KHJhd1gsIHJhd1ksIGNsb3NlTGlzdCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIG5ld0cgPSBwYXJlbnQuZyArIChpICE9PSAwICYmIGogIT09IDAgPyAxNCA6IDEwKTtcblxuICAgICAgICAgICAgICAgICAgICB2YXIgbmVpYm91ciA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHg6IHJhd1gsXG4gICAgICAgICAgICAgICAgICAgICAgICB5OiByYXdZLFxuICAgICAgICAgICAgICAgICAgICAgICAgZzogbmV3RyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGg6IE1hdGgubWF4KE1hdGguYWJzKHJhd1ggLSBkZXNUaWxlWCksIE1hdGguYWJzKHJhd1kgLSBkZXNUaWxlWSkpICogMTAsXG4gICAgICAgICAgICAgICAgICAgICAgICBwOiBwYXJlbnRcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgbmVpYm91ci5mID0gbmVpYm91ci5nICsgbmVpYm91ci5oO1xuXG4gICAgICAgICAgICAgICAgICAgIG9wZW5MaXN0LnB1c2gobmVpYm91cik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHZhciBkZXMgPSBjbG9zZUxpc3QucG9wKCk7XG4gICAgICAgIHdoaWxlIChkZXMucCkge1xuICAgICAgICAgICAgZGVzLmR4ID0gZGVzLnggLSBkZXMucC54O1xuICAgICAgICAgICAgZGVzLmR5ID0gZGVzLnkgLSBkZXMucC55O1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJkeD1cIiArIGRlcy5keCArIFwiLGR5PVwiICsgZGVzLmR5KTtcbiAgICAgICAgICAgIGZpbmFsTGlzdC51bnNoaWZ0KGRlcyk7XG4gICAgICAgICAgICBkZXMgPSBkZXMucDtcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIGZpbmFsTGlzdDtcbiAgICB9LFxuXG4gICAgX3NvcnRGOiBmdW5jdGlvbiBfc29ydEYoYSwgYikge1xuICAgICAgICByZXR1cm4gYS5mIC0gYi5mO1xuICAgIH0sXG5cbiAgICBpc0luTGlzdDogZnVuY3Rpb24gaXNJbkxpc3QoeCwgeSwgbGlzdCkge1xuICAgICAgICB2YXIgX2l0ZXJhdG9yTm9ybWFsQ29tcGxldGlvbiA9IHRydWU7XG4gICAgICAgIHZhciBfZGlkSXRlcmF0b3JFcnJvciA9IGZhbHNlO1xuICAgICAgICB2YXIgX2l0ZXJhdG9yRXJyb3IgPSB1bmRlZmluZWQ7XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGZvciAodmFyIF9pdGVyYXRvciA9IGxpc3RbU3ltYm9sLml0ZXJhdG9yXSgpLCBfc3RlcDsgIShfaXRlcmF0b3JOb3JtYWxDb21wbGV0aW9uID0gKF9zdGVwID0gX2l0ZXJhdG9yLm5leHQoKSkuZG9uZSk7IF9pdGVyYXRvck5vcm1hbENvbXBsZXRpb24gPSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgdmFyIGl0ZW0gPSBfc3RlcC52YWx1ZTtcblxuICAgICAgICAgICAgICAgIGlmIChpdGVtLnggPT0geCAmJiBpdGVtLnkgPT0geSkgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgX2RpZEl0ZXJhdG9yRXJyb3IgPSB0cnVlO1xuICAgICAgICAgICAgX2l0ZXJhdG9yRXJyb3IgPSBlcnI7XG4gICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGlmICghX2l0ZXJhdG9yTm9ybWFsQ29tcGxldGlvbiAmJiBfaXRlcmF0b3JbXCJyZXR1cm5cIl0pIHtcbiAgICAgICAgICAgICAgICAgICAgX2l0ZXJhdG9yW1wicmV0dXJuXCJdKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICAgICAgICBpZiAoX2RpZEl0ZXJhdG9yRXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgX2l0ZXJhdG9yRXJyb3I7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0sXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXG4gICAgb25Mb2FkOiBmdW5jdGlvbiBvbkxvYWQoKSB7fVxuXG59KTtcbi8vIGNhbGxlZCBldmVyeSBmcmFtZSwgdW5jb21tZW50IHRoaXMgZnVuY3Rpb24gdG8gYWN0aXZhdGUgdXBkYXRlIGNhbGxiYWNrXG4vLyB1cGRhdGU6IGZ1bmN0aW9uIChkdCkge1xuXG4vLyB9LFxuXG5jYy5fUkZwb3AoKTsiLCJjYy5fUkZwdXNoKG1vZHVsZSwgJ2Y0MzJhS1V0R0ZGUXBKdnl1bi9HU0hEJywgJ2hlcm8nKTtcbi8vIHNjcmlwdHMvaGVyby5qc1xuXG4ndXNlIHN0cmljdCc7XG5cbmNjLkNsYXNzKHtcbiAgICAnZXh0ZW5kcyc6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgU3RhbmRBbmltTmFtZTogJycsXG4gICAgICAgIFdhbGtBbmltTmFtZTogJycsXG4gICAgICAgIGN1ckRpcjogJydcbiAgICB9LFxuXG4gICAgdG9TdGFuZDogZnVuY3Rpb24gdG9TdGFuZCgpIHtcbiAgICAgICAgdGhpcy5nZXRDb21wb25lbnQoY2MuQW5pbWF0aW9uKS5wbGF5KHRoaXMuU3RhbmRBbmltTmFtZSArIHRoaXMuY3VyRGlyKTtcbiAgICB9LFxuXG4gICAgdG9XYWxrOiBmdW5jdGlvbiB0b1dhbGsoZGlyKSB7XG4gICAgICAgIGlmICh0aGlzLmN1ckRpciA9PT0gZGlyKSByZXR1cm47XG4gICAgICAgIHRoaXMuY3VyRGlyID0gZGlyO1xuICAgICAgICB0aGlzLmdldENvbXBvbmVudChjYy5BbmltYXRpb24pLnBsYXkodGhpcy5XYWxrQW5pbU5hbWUgKyBkaXIpO1xuICAgIH0sXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXG4gICAgb25Mb2FkOiBmdW5jdGlvbiBvbkxvYWQoKSB7fVxuXG59KTtcbi8vIGNhbGxlZCBldmVyeSBmcmFtZSwgdW5jb21tZW50IHRoaXMgZnVuY3Rpb24gdG8gYWN0aXZhdGUgdXBkYXRlIGNhbGxiYWNrXG4vLyB1cGRhdGU6IGZ1bmN0aW9uIChkdCkge1xuXG4vLyB9LFxuXG5jYy5fUkZwb3AoKTsiXX0=
