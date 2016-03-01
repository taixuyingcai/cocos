cc.Class({
    extends: cc.Component,

    properties: {
        curTileX: 12,
        curTileY: 24,
        
        radio: 1,
        finalList: [],
        hero: {
            default: null,
            type: cc.Node
        },
    },

    toMove: function() {
        if (this.finalList.lenght === 0) {
            this._standHero();
            return;
        }      
        var dir = this.finalList.shift();
        
        this.node.runAction(cc.sequence(
            cc.callFunc(this._moveHero(dir.dx, dir.dy), this),
            cc.moveBy(this.radio * ((dir.dx != 0) && (dir.dy != 0) ? 1.4 : 1) / 10, 
                -(dir.dx + dir.dy) * 32, (dir.dx - dir.dy) * 24
            ),
            cc.callFunc(this.toMove, this)
            ));
    },
    
    _standHero: function() {
      this.hero.getComponent('hero').toStand();  
    },
    
    _moveHero: function(dx, dy) {
        this.hero.getComponent('hero').toWalk(dx + '' + dy);
    },

    // use this for initialization
    onLoad: function () {
        var self = this;
        var myUtil = self.getComponent('Util');
        this.node.on('mouseup', function(event){
            var myevent = new cc.Event.EventCustom('myClick', true);
            myevent.setUserData(event);
            
            this.node.dispatchEvent(myevent);
            
            self.finalList = [];
            
            self.finalList = myUtil.convertToPath(myUtil.convertTo45(event), self.curTileX, self.curTileY);
            self.toMove();  
        }, this);
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
