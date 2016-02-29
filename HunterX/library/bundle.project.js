require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"Ground":[function(require,module,exports){
cc._RFpush(module, 'd537a4Wwg1CdpHkmRm7Imr2', 'Ground');
// scripts/Ground.js

'use strict';

cc.Class({
    'extends': cc.Component,

    properties: {
        curTileX: 12,
        curTileY: 24,

        radio: 1,
        finalList: [],
        hero: {
            'default': null,
            type: cc.Node
        }
    },

    toMove: function toMove() {
        if (this.finalList.lenght === 0) {
            this._standHero();
            return;
        }
        var dir = this.finalList.shift();

        this.node.runAction(cc.sequence(cc.callFunc(this._moveHero(dir.dx, dir.dy), this), cc.moveBy(this.radio * (dir.dx != 0 && dir.dy != 0 ? 1.4 : 1) / 10, -(dir.dx + dir.dy) * 32, (dir.dx - dir.dy) * 24), cc.callFunc(this.toMove, this)));
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
        var myUtil = this.getComponent('Util');
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
},{}],"NewScript":[function(require,module,exports){
cc._RFpush(module, '7f9a25q5DhPU6vsCOo6Yl/W', 'NewScript');
// NewScript.js

"use strict";

cc.Class({
    "extends": cc.Component,

    properties: {
        // foo: {
        //    default: null,
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
    },

    // use this for initialization
    onLoad: function onLoad() {}

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
        var newY = Math.floor(rawNewY) - 1;

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
        console.log("posx=" + newX + ",poxy=" + newY);
        var start = {
            x: curTilePosX,
            y: curTilePosY,
            g: 0,
            h: (Math.abs(newX) + Math.abs(newY)) * 10,
            f: this.g + this.h,
            p: null
        };

        var desTileX = start.x + newX;
        var desTileY = start.y + newY;

        openList.push(start);

        while (openList.lenght != 0) {
            openList.sort(this._sortF);
            var parent = openList.shift();
            closeList.push(parent);
            if (parent.h == 0) {
                break;
            }
            for (var i = -1; i <= 1; i++) {
                for (var j = -1; i <= 1; i++) {
                    var rawX = parent.x + i;
                    var rawY = parent.y + j;
                    if (this.isInList(rawX, rawY, closeList)) {
                        continue;
                    }
                    var newG = parent.g + (i != 0 && j != 0 ? 14 : 10);

                    var neibour = {
                        x: rawX,
                        y: rawY,
                        g: newG,
                        h: (Math.abs(rawX - desTileX) + Math.abs(rawY - desTileY)) * 10,
                        f: this.g + this.h,
                        p: parent
                    };
                    openList.push(neibour);
                }
            }
        }
        var des = closeList.pop();
        while (des.p) {
            des.dx = des.x - des.p.x;
            des.dy = des.p.y;
            console.log("dx=" + des.dx + ",dy=" + des.dy);
            finalList.unshift(des);
            des = des.p;
        }
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
},{}]},{},["Util","NewScript","Ground","hero"])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3dvcmtTb2Z0L0NvY29zQ3JlYXRvci5hcHAvQ29udGVudHMvUmVzb3VyY2VzL2FwcC5hc2FyL25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhc3NldHMvc2NyaXB0cy9Hcm91bmQuanMiLCJhc3NldHMvTmV3U2NyaXB0LmpzIiwiYXNzZXRzL3NjcmlwdHMvVXRpbC5qcyIsImFzc2V0cy9zY3JpcHRzL2hlcm8uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiY2MuX1JGcHVzaChtb2R1bGUsICdkNTM3YTRXd2cxQ2RwSGttUm03SW1yMicsICdHcm91bmQnKTtcbi8vIHNjcmlwdHMvR3JvdW5kLmpzXG5cbid1c2Ugc3RyaWN0JztcblxuY2MuQ2xhc3Moe1xuICAgICdleHRlbmRzJzogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICBjdXJUaWxlWDogMTIsXG4gICAgICAgIGN1clRpbGVZOiAyNCxcblxuICAgICAgICByYWRpbzogMSxcbiAgICAgICAgZmluYWxMaXN0OiBbXSxcbiAgICAgICAgaGVybzoge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuTm9kZVxuICAgICAgICB9XG4gICAgfSxcblxuICAgIHRvTW92ZTogZnVuY3Rpb24gdG9Nb3ZlKCkge1xuICAgICAgICBpZiAodGhpcy5maW5hbExpc3QubGVuZ2h0ID09PSAwKSB7XG4gICAgICAgICAgICB0aGlzLl9zdGFuZEhlcm8oKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB2YXIgZGlyID0gdGhpcy5maW5hbExpc3Quc2hpZnQoKTtcblxuICAgICAgICB0aGlzLm5vZGUucnVuQWN0aW9uKGNjLnNlcXVlbmNlKGNjLmNhbGxGdW5jKHRoaXMuX21vdmVIZXJvKGRpci5keCwgZGlyLmR5KSwgdGhpcyksIGNjLm1vdmVCeSh0aGlzLnJhZGlvICogKGRpci5keCAhPSAwICYmIGRpci5keSAhPSAwID8gMS40IDogMSkgLyAxMCwgLShkaXIuZHggKyBkaXIuZHkpICogMzIsIChkaXIuZHggLSBkaXIuZHkpICogMjQpLCBjYy5jYWxsRnVuYyh0aGlzLnRvTW92ZSwgdGhpcykpKTtcbiAgICB9LFxuXG4gICAgX3N0YW5kSGVybzogZnVuY3Rpb24gX3N0YW5kSGVybygpIHtcbiAgICAgICAgdGhpcy5oZXJvLmdldENvbXBvbmVudCgnaGVybycpLnRvU3RhbmQoKTtcbiAgICB9LFxuXG4gICAgX21vdmVIZXJvOiBmdW5jdGlvbiBfbW92ZUhlcm8oZHgsIGR5KSB7XG4gICAgICAgIHRoaXMuaGVyby5nZXRDb21wb25lbnQoJ2hlcm8nKS50b1dhbGsoZHggKyAnJyArIGR5KTtcbiAgICB9LFxuXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXG4gICAgb25Mb2FkOiBmdW5jdGlvbiBvbkxvYWQoKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgdmFyIG15VXRpbCA9IHRoaXMuZ2V0Q29tcG9uZW50KCdVdGlsJyk7XG4gICAgICAgIHRoaXMubm9kZS5vbignbW91c2V1cCcsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgdmFyIG15ZXZlbnQgPSBuZXcgY2MuRXZlbnQuRXZlbnRDdXN0b20oJ215Q2xpY2snLCB0cnVlKTtcbiAgICAgICAgICAgIG15ZXZlbnQuc2V0VXNlckRhdGEoZXZlbnQpO1xuXG4gICAgICAgICAgICB0aGlzLm5vZGUuZGlzcGF0Y2hFdmVudChteWV2ZW50KTtcblxuICAgICAgICAgICAgc2VsZi5maW5hbExpc3QgPSBbXTtcblxuICAgICAgICAgICAgc2VsZi5maW5hbExpc3QgPSBteVV0aWwuY29udmVydFRvUGF0aChteVV0aWwuY29udmVydFRvNDUoZXZlbnQpLCBzZWxmLmN1clRpbGVYLCBzZWxmLmN1clRpbGVZKTtcblxuICAgICAgICAgICAgc2VsZi50b01vdmUoKTtcbiAgICAgICAgfSwgdGhpcyk7XG4gICAgfVxuXG59KTtcbi8vIGNhbGxlZCBldmVyeSBmcmFtZSwgdW5jb21tZW50IHRoaXMgZnVuY3Rpb24gdG8gYWN0aXZhdGUgdXBkYXRlIGNhbGxiYWNrXG4vLyB1cGRhdGU6IGZ1bmN0aW9uIChkdCkge1xuXG4vLyB9LFxuXG5jYy5fUkZwb3AoKTsiLCJjYy5fUkZwdXNoKG1vZHVsZSwgJzdmOWEyNXE1RGhQVTZ2c0NPbzZZbC9XJywgJ05ld1NjcmlwdCcpO1xuLy8gTmV3U2NyaXB0LmpzXG5cblwidXNlIHN0cmljdFwiO1xuXG5jYy5DbGFzcyh7XG4gICAgXCJleHRlbmRzXCI6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgLy8gZm9vOiB7XG4gICAgICAgIC8vICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgIC8vICAgIHVybDogY2MuVGV4dHVyZTJELCAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHlwZW9mIGRlZmF1bHRcbiAgICAgICAgLy8gICAgc2VyaWFsaXphYmxlOiB0cnVlLCAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXG4gICAgICAgIC8vICAgIHZpc2libGU6IHRydWUsICAgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICBkaXNwbGF5TmFtZTogJ0ZvbycsIC8vIG9wdGlvbmFsXG4gICAgICAgIC8vICAgIHJlYWRvbmx5OiBmYWxzZSwgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgZmFsc2VcbiAgICAgICAgLy8gfSxcbiAgICAgICAgLy8gLi4uXG4gICAgfSxcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gb25Mb2FkKCkge31cblxufSk7XG4vLyBjYWxsZWQgZXZlcnkgZnJhbWUsIHVuY29tbWVudCB0aGlzIGZ1bmN0aW9uIHRvIGFjdGl2YXRlIHVwZGF0ZSBjYWxsYmFja1xuLy8gdXBkYXRlOiBmdW5jdGlvbiAoZHQpIHtcblxuLy8gfSxcblxuY2MuX1JGcG9wKCk7IiwiY2MuX1JGcHVzaChtb2R1bGUsICc1MzAzOHJWbEVST29KUmk0OXRqMWRTNScsICdVdGlsJyk7XG4vLyBzY3JpcHRzL1V0aWwuanNcblxuXCJ1c2Ugc3RyaWN0XCI7XG5cbmNjLkNsYXNzKHtcbiAgICBcImV4dGVuZHNcIjogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge30sXG5cbiAgICBjb252ZXJ0VG80NTogZnVuY3Rpb24gY29udmVydFRvNDUoY2xpY2tFdmVudCkge1xuICAgICAgICB2YXIgdmlzaWJsZVNpemUgPSBjYy5kaXJlY3Rvci5nZXRWaXNpYmxlU2l6ZSgpO1xuICAgICAgICB2YXIgb2xkWCA9IChjbGlja0V2ZW50LmdldExvY2F0aW9uWCgpIC0gdmlzaWJsZVNpemUud2lkdGggLyAyKSAvIDY0O1xuICAgICAgICB2YXIgb2xkWSA9IChjbGlja0V2ZW50LmdldExvY2F0aW9uWSgpIC0gdmlzaWJsZVNpemUuaGVpZ2h0IC8gMikgLyA0ODtcblxuICAgICAgICB2YXIgcmF3TmV3WCA9IG9sZFggKyBvbGRZO1xuICAgICAgICB2YXIgcmF3TmV3WSA9IG9sZFggLSBvbGRZO1xuXG4gICAgICAgIHZhciBuZXdYID0gTWF0aC5mbG9vcihyYXdOZXdYKSArIDE7XG4gICAgICAgIHZhciBuZXdZID0gTWF0aC5mbG9vcihyYXdOZXdZKSAtIDE7XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIG5ld1g6IG5ld1gsXG4gICAgICAgICAgICBuZXdZOiBuZXdZXG4gICAgICAgIH07XG4gICAgfSxcblxuICAgIGNvbnZlcnRUb1BhdGg6IGZ1bmN0aW9uIGNvbnZlcnRUb1BhdGgobmV3UG9zLCBjdXJUaWxlUG9zWCwgY3VyVGlsZVBvc1kpIHtcbiAgICAgICAgdmFyIG9wZW5MaXN0ID0gW107XG4gICAgICAgIHZhciBjbG9zZUxpc3QgPSBbXTtcbiAgICAgICAgdmFyIGZpbmFsTGlzdCA9IFtdO1xuICAgICAgICB2YXIgbmV3WCA9IG5ld1Bvcy5uZXdYO1xuICAgICAgICB2YXIgbmV3WSA9IG5ld1Bvcy5uZXdZO1xuICAgICAgICBjb25zb2xlLmxvZyhcInBvc3g9XCIgKyBuZXdYICsgXCIscG94eT1cIiArIG5ld1kpO1xuICAgICAgICB2YXIgc3RhcnQgPSB7XG4gICAgICAgICAgICB4OiBjdXJUaWxlUG9zWCxcbiAgICAgICAgICAgIHk6IGN1clRpbGVQb3NZLFxuICAgICAgICAgICAgZzogMCxcbiAgICAgICAgICAgIGg6IChNYXRoLmFicyhuZXdYKSArIE1hdGguYWJzKG5ld1kpKSAqIDEwLFxuICAgICAgICAgICAgZjogdGhpcy5nICsgdGhpcy5oLFxuICAgICAgICAgICAgcDogbnVsbFxuICAgICAgICB9O1xuXG4gICAgICAgIHZhciBkZXNUaWxlWCA9IHN0YXJ0LnggKyBuZXdYO1xuICAgICAgICB2YXIgZGVzVGlsZVkgPSBzdGFydC55ICsgbmV3WTtcblxuICAgICAgICBvcGVuTGlzdC5wdXNoKHN0YXJ0KTtcblxuICAgICAgICB3aGlsZSAob3Blbkxpc3QubGVuZ2h0ICE9IDApIHtcbiAgICAgICAgICAgIG9wZW5MaXN0LnNvcnQodGhpcy5fc29ydEYpO1xuICAgICAgICAgICAgdmFyIHBhcmVudCA9IG9wZW5MaXN0LnNoaWZ0KCk7XG4gICAgICAgICAgICBjbG9zZUxpc3QucHVzaChwYXJlbnQpO1xuICAgICAgICAgICAgaWYgKHBhcmVudC5oID09IDApIHtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAtMTsgaSA8PSAxOyBpKyspIHtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBqID0gLTE7IGkgPD0gMTsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciByYXdYID0gcGFyZW50LnggKyBpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgcmF3WSA9IHBhcmVudC55ICsgajtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuaXNJbkxpc3QocmF3WCwgcmF3WSwgY2xvc2VMaXN0KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdmFyIG5ld0cgPSBwYXJlbnQuZyArIChpICE9IDAgJiYgaiAhPSAwID8gMTQgOiAxMCk7XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIG5laWJvdXIgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB4OiByYXdYLFxuICAgICAgICAgICAgICAgICAgICAgICAgeTogcmF3WSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGc6IG5ld0csXG4gICAgICAgICAgICAgICAgICAgICAgICBoOiAoTWF0aC5hYnMocmF3WCAtIGRlc1RpbGVYKSArIE1hdGguYWJzKHJhd1kgLSBkZXNUaWxlWSkpICogMTAsXG4gICAgICAgICAgICAgICAgICAgICAgICBmOiB0aGlzLmcgKyB0aGlzLmgsXG4gICAgICAgICAgICAgICAgICAgICAgICBwOiBwYXJlbnRcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgb3Blbkxpc3QucHVzaChuZWlib3VyKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGRlcyA9IGNsb3NlTGlzdC5wb3AoKTtcbiAgICAgICAgd2hpbGUgKGRlcy5wKSB7XG4gICAgICAgICAgICBkZXMuZHggPSBkZXMueCAtIGRlcy5wLng7XG4gICAgICAgICAgICBkZXMuZHkgPSBkZXMucC55O1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJkeD1cIiArIGRlcy5keCArIFwiLGR5PVwiICsgZGVzLmR5KTtcbiAgICAgICAgICAgIGZpbmFsTGlzdC51bnNoaWZ0KGRlcyk7XG4gICAgICAgICAgICBkZXMgPSBkZXMucDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmluYWxMaXN0O1xuICAgIH0sXG5cbiAgICBfc29ydEY6IGZ1bmN0aW9uIF9zb3J0RihhLCBiKSB7XG4gICAgICAgIHJldHVybiBhLmYgLSBiLmY7XG4gICAgfSxcblxuICAgIGlzSW5MaXN0OiBmdW5jdGlvbiBpc0luTGlzdCh4LCB5LCBsaXN0KSB7XG4gICAgICAgIHZhciBfaXRlcmF0b3JOb3JtYWxDb21wbGV0aW9uID0gdHJ1ZTtcbiAgICAgICAgdmFyIF9kaWRJdGVyYXRvckVycm9yID0gZmFsc2U7XG4gICAgICAgIHZhciBfaXRlcmF0b3JFcnJvciA9IHVuZGVmaW5lZDtcblxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgZm9yICh2YXIgX2l0ZXJhdG9yID0gbGlzdFtTeW1ib2wuaXRlcmF0b3JdKCksIF9zdGVwOyAhKF9pdGVyYXRvck5vcm1hbENvbXBsZXRpb24gPSAoX3N0ZXAgPSBfaXRlcmF0b3IubmV4dCgpKS5kb25lKTsgX2l0ZXJhdG9yTm9ybWFsQ29tcGxldGlvbiA9IHRydWUpIHtcbiAgICAgICAgICAgICAgICB2YXIgaXRlbSA9IF9zdGVwLnZhbHVlO1xuXG4gICAgICAgICAgICAgICAgaWYgKGl0ZW0ueCA9PSB4ICYmIGl0ZW0ueSA9PSB5KSByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICBfZGlkSXRlcmF0b3JFcnJvciA9IHRydWU7XG4gICAgICAgICAgICBfaXRlcmF0b3JFcnJvciA9IGVycjtcbiAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgaWYgKCFfaXRlcmF0b3JOb3JtYWxDb21wbGV0aW9uICYmIF9pdGVyYXRvcltcInJldHVyblwiXSkge1xuICAgICAgICAgICAgICAgICAgICBfaXRlcmF0b3JbXCJyZXR1cm5cIl0oKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgICAgICAgIGlmIChfZGlkSXRlcmF0b3JFcnJvcikge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBfaXRlcmF0b3JFcnJvcjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSxcbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uIG9uTG9hZCgpIHt9XG5cbn0pO1xuLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lLCB1bmNvbW1lbnQgdGhpcyBmdW5jdGlvbiB0byBhY3RpdmF0ZSB1cGRhdGUgY2FsbGJhY2tcbi8vIHVwZGF0ZTogZnVuY3Rpb24gKGR0KSB7XG5cbi8vIH0sXG5cbmNjLl9SRnBvcCgpOyIsImNjLl9SRnB1c2gobW9kdWxlLCAnZjQzMmFLVXRHRkZRcEp2eXVuL0dTSEQnLCAnaGVybycpO1xuLy8gc2NyaXB0cy9oZXJvLmpzXG5cbid1c2Ugc3RyaWN0JztcblxuY2MuQ2xhc3Moe1xuICAgICdleHRlbmRzJzogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICBTdGFuZEFuaW1OYW1lOiAnJyxcbiAgICAgICAgV2Fsa0FuaW1OYW1lOiAnJyxcbiAgICAgICAgY3VyRGlyOiAnJ1xuICAgIH0sXG5cbiAgICB0b1N0YW5kOiBmdW5jdGlvbiB0b1N0YW5kKCkge1xuICAgICAgICB0aGlzLmdldENvbXBvbmVudChjYy5BbmltYXRpb24pLnBsYXkodGhpcy5TdGFuZEFuaW1OYW1lICsgdGhpcy5jdXJEaXIpO1xuICAgIH0sXG5cbiAgICB0b1dhbGs6IGZ1bmN0aW9uIHRvV2FsayhkaXIpIHtcbiAgICAgICAgaWYgKHRoaXMuY3VyRGlyID09PSBkaXIpIHJldHVybjtcbiAgICAgICAgdGhpcy5jdXJEaXIgPSBkaXI7XG4gICAgICAgIHRoaXMuZ2V0Q29tcG9uZW50KGNjLkFuaW1hdGlvbikucGxheSh0aGlzLldhbGtBbmltTmFtZSArIGRpcik7XG4gICAgfSxcbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uIG9uTG9hZCgpIHt9XG5cbn0pO1xuLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lLCB1bmNvbW1lbnQgdGhpcyBmdW5jdGlvbiB0byBhY3RpdmF0ZSB1cGRhdGUgY2FsbGJhY2tcbi8vIHVwZGF0ZTogZnVuY3Rpb24gKGR0KSB7XG5cbi8vIH0sXG5cbmNjLl9SRnBvcCgpOyJdfQ==
