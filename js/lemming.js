const Lemming =function(){
    return {
        x :500,
        y : 90,
        w : 5,
        h : 5,
        direction : 1,
        action : 'walk',
        actionTick : 0,
        setAction(action){
            this.actionTick = 0;
            this.action = action;
        },
        get groundX(){
            return Math.round( this.x + this.w- (this.w/2) );
        },
        get groundY(){
            return Math.round( this.y + this.h-1 );
        },
        isGround(){

        }
    }
}

export {Lemming};