let STATES = {};

let ACTOR_ID = 0;
let Actor = {
    create(name='', type ='', state = '', x=0, y=0){
        let actor = {
            _id        : ACTOR_ID++,
            _stateTick : 0,
            type       : type,
            name       : name,
            x          : 500,
            y          : 90,
            direction  : 1,
            state      : state,
            setState(state){
                this.state = state;
                this._stateTick = 0;
                return true;
            },
            updateState(){
                this._stateTick++;
                STATES[this.state].update( this );
                return true;
            },
            draw(){
                
                let sprite = Engine.Sprite.getById( STATES[this.state].spriteName , 0 );
                Engine.Sprite.draw( this.x, this.y, sprite );
            }
        }
        return actor;
    },
    createState(name='', spriteName='', updateHandler=function(){}, props={} ){
        STATES[name]             = props;
        STATES[name].spriteName  = spriteName;
        STATES[name].update      = updateHandler;
        return STATES[name];
    }
}

export {Actor};