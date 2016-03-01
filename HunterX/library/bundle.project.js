require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"Ground":[function(require,module,exports){
cc._RFpush(module, 'd537a4Wwg1CdpHkmRm7Imr2', 'Ground');
// scripts\Ground.js

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
// scripts\Util.js

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

        while (openList.lenght !== 0) {
            openList.sort(this._sortF);
            var parent = openList.shift();
            closeList.push(parent);
            if (parent.h === 0) {
                break;
            }
            for (var i = -1; i <= 1; i++) {
                for (var j = -1; i <= 1; i++) {
                    var rawX = parent.x + i;
                    var rawY = parent.y + j;
                    if (this.isInList(rawX, rawY, closeList)) {
                        continue;
                    }
                    if (i === 0 && j === 0) {
                        continue;
                    }
                    var newG = parent.g + (i !== 0 && j !== 0 ? 14 : 10);

                    var neibour = {
                        x: rawX,
                        y: rawY,
                        g: newG,
                        h: (Math.abs(rawX - desTileX) + Math.abs(rawY - desTileY)) * 10,
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
// scripts\hero.js

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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL2RldmVsb3AvQ29jb3NDcmVhdG9yL3Jlc291cmNlcy9hcHAuYXNhci9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiYXNzZXRzL3NjcmlwdHMvR3JvdW5kLmpzIiwiYXNzZXRzL3NjcmlwdHMvVXRpbC5qcyIsImFzc2V0cy9zY3JpcHRzL2hlcm8uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImNjLl9SRnB1c2gobW9kdWxlLCAnZDUzN2E0V3dnMUNkcEhrbVJtN0ltcjInLCAnR3JvdW5kJyk7XG4vLyBzY3JpcHRzXFxHcm91bmQuanNcblxuJ3VzZSBzdHJpY3QnO1xuXG5jYy5DbGFzcyh7XG4gICAgJ2V4dGVuZHMnOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIGN1clRpbGVYOiAxMixcbiAgICAgICAgY3VyVGlsZVk6IDI0LFxuXG4gICAgICAgIHJhZGlvOiAxLFxuICAgICAgICBmaW5hbExpc3Q6IFtdLFxuICAgICAgICBoZXJvOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5Ob2RlXG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgdG9Nb3ZlOiBmdW5jdGlvbiB0b01vdmUoKSB7XG4gICAgICAgIGlmICh0aGlzLmZpbmFsTGlzdC5sZW5naHQgPT09IDApIHtcbiAgICAgICAgICAgIHRoaXMuX3N0YW5kSGVybygpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHZhciBkaXIgPSB0aGlzLmZpbmFsTGlzdC5zaGlmdCgpO1xuXG4gICAgICAgIHRoaXMubm9kZS5ydW5BY3Rpb24oY2Muc2VxdWVuY2UoY2MuY2FsbEZ1bmModGhpcy5fbW92ZUhlcm8oZGlyLmR4LCBkaXIuZHkpLCB0aGlzKSwgY2MubW92ZUJ5KHRoaXMucmFkaW8gKiAoZGlyLmR4ICE9IDAgJiYgZGlyLmR5ICE9IDAgPyAxLjQgOiAxKSAvIDEwLCAtKGRpci5keCArIGRpci5keSkgKiAzMiwgKGRpci5keCAtIGRpci5keSkgKiAyNCksIGNjLmNhbGxGdW5jKHRoaXMudG9Nb3ZlLCB0aGlzKSkpO1xuICAgIH0sXG5cbiAgICBfc3RhbmRIZXJvOiBmdW5jdGlvbiBfc3RhbmRIZXJvKCkge1xuICAgICAgICB0aGlzLmhlcm8uZ2V0Q29tcG9uZW50KCdoZXJvJykudG9TdGFuZCgpO1xuICAgIH0sXG5cbiAgICBfbW92ZUhlcm86IGZ1bmN0aW9uIF9tb3ZlSGVybyhkeCwgZHkpIHtcbiAgICAgICAgdGhpcy5oZXJvLmdldENvbXBvbmVudCgnaGVybycpLnRvV2FsayhkeCArICcnICsgZHkpO1xuICAgIH0sXG5cbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uIG9uTG9hZCgpIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICB2YXIgbXlVdGlsID0gc2VsZi5nZXRDb21wb25lbnQoJ1V0aWwnKTtcbiAgICAgICAgdGhpcy5ub2RlLm9uKCdtb3VzZXVwJywgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICB2YXIgbXlldmVudCA9IG5ldyBjYy5FdmVudC5FdmVudEN1c3RvbSgnbXlDbGljaycsIHRydWUpO1xuICAgICAgICAgICAgbXlldmVudC5zZXRVc2VyRGF0YShldmVudCk7XG5cbiAgICAgICAgICAgIHRoaXMubm9kZS5kaXNwYXRjaEV2ZW50KG15ZXZlbnQpO1xuXG4gICAgICAgICAgICBzZWxmLmZpbmFsTGlzdCA9IFtdO1xuXG4gICAgICAgICAgICBzZWxmLmZpbmFsTGlzdCA9IG15VXRpbC5jb252ZXJ0VG9QYXRoKG15VXRpbC5jb252ZXJ0VG80NShldmVudCksIHNlbGYuY3VyVGlsZVgsIHNlbGYuY3VyVGlsZVkpO1xuICAgICAgICAgICAgc2VsZi50b01vdmUoKTtcbiAgICAgICAgfSwgdGhpcyk7XG4gICAgfVxuXG59KTtcbi8vIGNhbGxlZCBldmVyeSBmcmFtZSwgdW5jb21tZW50IHRoaXMgZnVuY3Rpb24gdG8gYWN0aXZhdGUgdXBkYXRlIGNhbGxiYWNrXG4vLyB1cGRhdGU6IGZ1bmN0aW9uIChkdCkge1xuXG4vLyB9LFxuXG5jYy5fUkZwb3AoKTsiLCJjYy5fUkZwdXNoKG1vZHVsZSwgJzUzMDM4clZsRVJPb0pSaTQ5dGoxZFM1JywgJ1V0aWwnKTtcbi8vIHNjcmlwdHNcXFV0aWwuanNcblxuXCJ1c2Ugc3RyaWN0XCI7XG5cbmNjLkNsYXNzKHtcbiAgICBcImV4dGVuZHNcIjogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge30sXG5cbiAgICBjb252ZXJ0VG80NTogZnVuY3Rpb24gY29udmVydFRvNDUoY2xpY2tFdmVudCkge1xuICAgICAgICB2YXIgdmlzaWJsZVNpemUgPSBjYy5kaXJlY3Rvci5nZXRWaXNpYmxlU2l6ZSgpO1xuICAgICAgICB2YXIgb2xkWCA9IChjbGlja0V2ZW50LmdldExvY2F0aW9uWCgpIC0gdmlzaWJsZVNpemUud2lkdGggLyAyKSAvIDY0O1xuICAgICAgICB2YXIgb2xkWSA9IChjbGlja0V2ZW50LmdldExvY2F0aW9uWSgpIC0gdmlzaWJsZVNpemUuaGVpZ2h0IC8gMikgLyA0ODtcblxuICAgICAgICB2YXIgcmF3TmV3WCA9IG9sZFggKyBvbGRZO1xuICAgICAgICB2YXIgcmF3TmV3WSA9IG9sZFggLSBvbGRZO1xuXG4gICAgICAgIHZhciBuZXdYID0gTWF0aC5mbG9vcihyYXdOZXdYKSArIDE7XG4gICAgICAgIHZhciBuZXdZID0gLU1hdGguZmxvb3IoLXJhd05ld1kpIC0gMTtcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgbmV3WDogbmV3WCxcbiAgICAgICAgICAgIG5ld1k6IG5ld1lcbiAgICAgICAgfTtcbiAgICB9LFxuXG4gICAgY29udmVydFRvUGF0aDogZnVuY3Rpb24gY29udmVydFRvUGF0aChuZXdQb3MsIGN1clRpbGVQb3NYLCBjdXJUaWxlUG9zWSkge1xuICAgICAgICB2YXIgb3Blbkxpc3QgPSBbXTtcbiAgICAgICAgdmFyIGNsb3NlTGlzdCA9IFtdO1xuICAgICAgICB2YXIgZmluYWxMaXN0ID0gW107XG4gICAgICAgIHZhciBuZXdYID0gbmV3UG9zLm5ld1g7XG4gICAgICAgIHZhciBuZXdZID0gbmV3UG9zLm5ld1k7XG4gICAgICAgIGNvbnNvbGUubG9nKFwicG9zeD1cIiArIG5ld1ggKyBcIixwb3N5PVwiICsgbmV3WSk7XG4gICAgICAgIHZhciBzdGFydCA9IHtcbiAgICAgICAgICAgIHg6IGN1clRpbGVQb3NYLFxuICAgICAgICAgICAgeTogY3VyVGlsZVBvc1ksXG4gICAgICAgICAgICBnOiAwLFxuICAgICAgICAgICAgaDogKE1hdGguYWJzKG5ld1gpICsgTWF0aC5hYnMobmV3WSkpICogMTAsXG4gICAgICAgICAgICBwOiBudWxsXG4gICAgICAgIH07XG4gICAgICAgIHN0YXJ0LmYgPSBzdGFydC5nICsgc3RhcnQuaDtcblxuICAgICAgICB2YXIgZGVzVGlsZVggPSBzdGFydC54ICsgbmV3WDtcbiAgICAgICAgdmFyIGRlc1RpbGVZID0gc3RhcnQueSArIG5ld1k7XG5cbiAgICAgICAgb3Blbkxpc3QucHVzaChzdGFydCk7XG5cbiAgICAgICAgd2hpbGUgKG9wZW5MaXN0LmxlbmdodCAhPT0gMCkge1xuICAgICAgICAgICAgb3Blbkxpc3Quc29ydCh0aGlzLl9zb3J0Rik7XG4gICAgICAgICAgICB2YXIgcGFyZW50ID0gb3Blbkxpc3Quc2hpZnQoKTtcbiAgICAgICAgICAgIGNsb3NlTGlzdC5wdXNoKHBhcmVudCk7XG4gICAgICAgICAgICBpZiAocGFyZW50LmggPT09IDApIHtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAtMTsgaSA8PSAxOyBpKyspIHtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBqID0gLTE7IGkgPD0gMTsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciByYXdYID0gcGFyZW50LnggKyBpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgcmF3WSA9IHBhcmVudC55ICsgajtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuaXNJbkxpc3QocmF3WCwgcmF3WSwgY2xvc2VMaXN0KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKGkgPT09IDAgJiYgaiA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdmFyIG5ld0cgPSBwYXJlbnQuZyArIChpICE9PSAwICYmIGogIT09IDAgPyAxNCA6IDEwKTtcblxuICAgICAgICAgICAgICAgICAgICB2YXIgbmVpYm91ciA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHg6IHJhd1gsXG4gICAgICAgICAgICAgICAgICAgICAgICB5OiByYXdZLFxuICAgICAgICAgICAgICAgICAgICAgICAgZzogbmV3RyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGg6IChNYXRoLmFicyhyYXdYIC0gZGVzVGlsZVgpICsgTWF0aC5hYnMocmF3WSAtIGRlc1RpbGVZKSkgKiAxMCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHA6IHBhcmVudFxuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICBuZWlib3VyLmYgPSBuZWlib3VyLmcgKyBuZWlib3VyLmg7XG5cbiAgICAgICAgICAgICAgICAgICAgb3Blbkxpc3QucHVzaChuZWlib3VyKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGRlcyA9IGNsb3NlTGlzdC5wb3AoKTtcbiAgICAgICAgd2hpbGUgKGRlcy5wKSB7XG4gICAgICAgICAgICBkZXMuZHggPSBkZXMueCAtIGRlcy5wLng7XG4gICAgICAgICAgICBkZXMuZHkgPSBkZXMucC55O1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJkeD1cIiArIGRlcy5keCArIFwiLGR5PVwiICsgZGVzLmR5KTtcbiAgICAgICAgICAgIGZpbmFsTGlzdC51bnNoaWZ0KGRlcyk7XG4gICAgICAgICAgICBkZXMgPSBkZXMucDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmluYWxMaXN0O1xuICAgIH0sXG5cbiAgICBfc29ydEY6IGZ1bmN0aW9uIF9zb3J0RihhLCBiKSB7XG4gICAgICAgIHJldHVybiBhLmYgLSBiLmY7XG4gICAgfSxcblxuICAgIGlzSW5MaXN0OiBmdW5jdGlvbiBpc0luTGlzdCh4LCB5LCBsaXN0KSB7XG4gICAgICAgIHZhciBfaXRlcmF0b3JOb3JtYWxDb21wbGV0aW9uID0gdHJ1ZTtcbiAgICAgICAgdmFyIF9kaWRJdGVyYXRvckVycm9yID0gZmFsc2U7XG4gICAgICAgIHZhciBfaXRlcmF0b3JFcnJvciA9IHVuZGVmaW5lZDtcblxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgZm9yICh2YXIgX2l0ZXJhdG9yID0gbGlzdFtTeW1ib2wuaXRlcmF0b3JdKCksIF9zdGVwOyAhKF9pdGVyYXRvck5vcm1hbENvbXBsZXRpb24gPSAoX3N0ZXAgPSBfaXRlcmF0b3IubmV4dCgpKS5kb25lKTsgX2l0ZXJhdG9yTm9ybWFsQ29tcGxldGlvbiA9IHRydWUpIHtcbiAgICAgICAgICAgICAgICB2YXIgaXRlbSA9IF9zdGVwLnZhbHVlO1xuXG4gICAgICAgICAgICAgICAgaWYgKGl0ZW0ueCA9PSB4ICYmIGl0ZW0ueSA9PSB5KSByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICBfZGlkSXRlcmF0b3JFcnJvciA9IHRydWU7XG4gICAgICAgICAgICBfaXRlcmF0b3JFcnJvciA9IGVycjtcbiAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgaWYgKCFfaXRlcmF0b3JOb3JtYWxDb21wbGV0aW9uICYmIF9pdGVyYXRvcltcInJldHVyblwiXSkge1xuICAgICAgICAgICAgICAgICAgICBfaXRlcmF0b3JbXCJyZXR1cm5cIl0oKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgICAgICAgIGlmIChfZGlkSXRlcmF0b3JFcnJvcikge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBfaXRlcmF0b3JFcnJvcjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSxcbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uIG9uTG9hZCgpIHt9XG5cbn0pO1xuLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lLCB1bmNvbW1lbnQgdGhpcyBmdW5jdGlvbiB0byBhY3RpdmF0ZSB1cGRhdGUgY2FsbGJhY2tcbi8vIHVwZGF0ZTogZnVuY3Rpb24gKGR0KSB7XG5cbi8vIH0sXG5cbmNjLl9SRnBvcCgpOyIsImNjLl9SRnB1c2gobW9kdWxlLCAnZjQzMmFLVXRHRkZRcEp2eXVuL0dTSEQnLCAnaGVybycpO1xuLy8gc2NyaXB0c1xcaGVyby5qc1xuXG4ndXNlIHN0cmljdCc7XG5cbmNjLkNsYXNzKHtcbiAgICAnZXh0ZW5kcyc6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgU3RhbmRBbmltTmFtZTogJycsXG4gICAgICAgIFdhbGtBbmltTmFtZTogJycsXG4gICAgICAgIGN1ckRpcjogJydcbiAgICB9LFxuXG4gICAgdG9TdGFuZDogZnVuY3Rpb24gdG9TdGFuZCgpIHtcbiAgICAgICAgdGhpcy5nZXRDb21wb25lbnQoY2MuQW5pbWF0aW9uKS5wbGF5KHRoaXMuU3RhbmRBbmltTmFtZSArIHRoaXMuY3VyRGlyKTtcbiAgICB9LFxuXG4gICAgdG9XYWxrOiBmdW5jdGlvbiB0b1dhbGsoZGlyKSB7XG4gICAgICAgIGlmICh0aGlzLmN1ckRpciA9PT0gZGlyKSByZXR1cm47XG4gICAgICAgIHRoaXMuY3VyRGlyID0gZGlyO1xuICAgICAgICB0aGlzLmdldENvbXBvbmVudChjYy5BbmltYXRpb24pLnBsYXkodGhpcy5XYWxrQW5pbU5hbWUgKyBkaXIpO1xuICAgIH0sXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXG4gICAgb25Mb2FkOiBmdW5jdGlvbiBvbkxvYWQoKSB7fVxuXG59KTtcbi8vIGNhbGxlZCBldmVyeSBmcmFtZSwgdW5jb21tZW50IHRoaXMgZnVuY3Rpb24gdG8gYWN0aXZhdGUgdXBkYXRlIGNhbGxiYWNrXG4vLyB1cGRhdGU6IGZ1bmN0aW9uIChkdCkge1xuXG4vLyB9LFxuXG5jYy5fUkZwb3AoKTsiXX0=
