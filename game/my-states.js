import {Engine} from '../js/engine.js';


let myStates = {
    fall(lem){
        lem.y++;
        if( !Engine.Map.Pixel.isTransparent(lem.groundX, lem.groundY) ){ 
            lem.y--;
            lem.setState('walk');
            return;
        }

    },
    walk(lem){
        if(lem.actionTick % 3) return;
        lem.x  = lem.x + ( .5 * lem.direction );
        
        // if should fall... adjust y coordinate
        if( Engine.Map.Pixel.isTransparent(lem.groundX, lem.groundY+1) &&
            Engine.Map.Pixel.isTransparent(lem.groundX + (1 *lem.direction), lem.groundY+1) &&
            Engine.Map.Pixel.isTransparent(lem.groundX + (2 *lem.direction), lem.groundY+1) ){ 
            lem.y++;
            // if the fall is bigger than 3 pixels, set falling action
            if( Engine.Map.Pixel.isTransparent(lem.groundX, lem.groundY+1) && 
                Engine.Map.Pixel.isTransparent(lem.groundX, lem.groundY+2) &&
                Engine.Map.Pixel.isTransparent(lem.groundX, lem.groundY+3) &&
                Engine.Map.Pixel.isTransparent(lem.groundX, lem.groundY+4) 
            ) lem.setState('fall');
            return;
        }
        // if it shouldnt fall... keep walking
        else{
            if( Engine.Map.Pixel.isTransparent(lem.groundX, lem.groundY) ){ } // do nothing 
            else if( Engine.Map.Pixel.isTransparent(lem.groundX, lem.groundY-1) ) lem.y -= 1;
            else if( Engine.Map.Pixel.isTransparent(lem.groundX, lem.groundY-2) ) lem.y -= 2;
            else{
                lem.direction *= -1;
                lem.x  = lem.x + ( 1 * lem.direction );
            } 

            if( !Engine.Map.Pixel.isTransparent(lem.groundX, lem.groundY-3) ||
                !Engine.Map.Pixel.isTransparent(lem.groundX, lem.groundY-4) 
            ){ 
                lem.direction *= -1;
                lem.x  = lem.x + ( 1 * lem.direction );
            }
        }


    }
};

export {myStates}