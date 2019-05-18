import {Engine} from '../js/engine.js';

function checkGroundCollision( sprite ){
    let x = Math.floor( this.x +5 - (5/2) );
    let y = Math.floor( this.y + 5-1 );

}



function canGoDown( actor ){
    /*
    Engine.Animations
    actor.x 
    actor.action.animation.imageBitmap.width + ()
    let bottomX = Math.floor( sprite.x + 5 - (5/2) );
    let bottomY = Math.floor( sprite.y + 5-1 );

    if( Engine.Map.Pixel.isTransparent(lem.attributes.groundX, lem.attributes.groundY+1) &&
        Engine.Map.Pixel.isTransparent(lem.attributes.groundX + (1 *lem.attributes.direction), lem.attributes.groundY+1) &&
        Engine.Map.Pixel.isTransparent(lem.attributes.groundX + (2 *lem.attributes.direction), lem.attributes.groundY+1) ){
        return true;
    }
    */
}

let myStates = {
    fall(lem){
        lem.y++;
        if( !Engine.Map.Pixel.isTransparent(lem.attributes.groundX, lem.attributes.groundY) ){ 
            lem.y--;
            lem.setState('walk');
            return;
        }

    },
    walk(lem){
        if(lem.actionTick % 3) return;
        lem.x  = lem.x + ( .5 * lem.attributes.direction );
        
        // if should fall... adjust y coordinate
        if( Engine.Map.Pixel.isTransparent(lem.attributes.groundX, lem.attributes.groundY+1) &&
            Engine.Map.Pixel.isTransparent(lem.attributes.groundX + (1 *lem.attributes.direction), lem.attributes.groundY+1) &&
            Engine.Map.Pixel.isTransparent(lem.attributes.groundX + (2 *lem.attributes.direction), lem.attributes.groundY+1) ){ 
            lem.y++;
            // if the fall is bigger than 3 pixels, set falling action
            if( Engine.Map.Pixel.isTransparent(lem.attributes.groundX, lem.attributes.groundY+1) && 
                Engine.Map.Pixel.isTransparent(lem.attributes.groundX, lem.attributes.groundY+2) &&
                Engine.Map.Pixel.isTransparent(lem.attributes.groundX, lem.attributes.groundY+3) &&
                Engine.Map.Pixel.isTransparent(lem.attributes.groundX, lem.attributes.groundY+4) 
            ) lem.setState('fall');
            return;
        }
        // if it shouldnt fall... keep walking
        else{
            if( Engine.Map.Pixel.isTransparent(lem.attributes.groundX, lem.attributes.groundY) ){ } // do nothing 
            else if( Engine.Map.Pixel.isTransparent(lem.attributes.groundX, lem.attributes.groundY-1) ) lem.y -= 1;
            else if( Engine.Map.Pixel.isTransparent(lem.attributes.groundX, lem.attributes.groundY-2) ) lem.y -= 2;
            else{
                lem.attributes.direction *= -1;
                lem.flip.x = !lem.flip.x;
                lem.x  = lem.x + ( 1 * lem.attributes.direction );
            } 

            if( !Engine.Map.Pixel.isTransparent(lem.attributes.groundX, lem.attributes.groundY-3) ||
                !Engine.Map.Pixel.isTransparent(lem.attributes.groundX, lem.attributes.groundY-4) 
            ){ 
                lem.attributes.direction *= -1;
                lem.flip.x = !lem.flip.x;
                lem.x  = lem.x + ( 1 * lem.attributes.direction );
            }
        }


    }
};

export {myStates}