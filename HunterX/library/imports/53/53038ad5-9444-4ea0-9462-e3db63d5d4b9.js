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