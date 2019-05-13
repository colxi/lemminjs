import {Map} from './map.js';


let Actions = {
    fall(lem){
        lem.y++;
        if( !Map.isPixelTransparent(lem.groundX, lem.groundY) ){ 
            lem.y--;
            lem.setAction('walk');
            return;
        }

    },
    walk(lem){
        if(lem.actionTick % 3) return;
        lem.x  = lem.x + ( 1 * lem.direction );
        
        // if should fall... adjust y coordinate
        if( Map.isPixelTransparent(lem.groundX, lem.groundY+1) &&
            Map.isPixelTransparent(lem.groundX + (1 *lem.direction), lem.groundY+1) &&
            Map.isPixelTransparent(lem.groundX + (2 *lem.direction), lem.groundY+1) ){ 
            lem.y++;
            // if the fall is bigger than 3 pixels, set falling action
            if( Map.isPixelTransparent(lem.groundX, lem.groundY+1) && 
                Map.isPixelTransparent(lem.groundX, lem.groundY+2) &&
                Map.isPixelTransparent(lem.groundX, lem.groundY+3) &&
                Map.isPixelTransparent(lem.groundX, lem.groundY+4) 
            ) lem.setAction('fall');
            return;
        }
        // if it shouldnt fall... keep walking
        else{
            if( Map.isPixelTransparent(lem.groundX, lem.groundY) ){ /* do nothing */}
            else if( Map.isPixelTransparent(lem.groundX, lem.groundY-1) ) lem.y -= 1;
            else if( Map.isPixelTransparent(lem.groundX, lem.groundY-2) ) lem.y -= 2;
            else{
                lem.direction *= -1;
                lem.x  = lem.x + ( 1 * lem.direction );
            } 

            if( !Map.isPixelTransparent(lem.groundX, lem.groundY-3) ||
                !Map.isPixelTransparent(lem.groundX, lem.groundY-4) 
            ){ 
                lem.direction *= -1;
                lem.x  = lem.x + ( 1 * lem.direction );
            }
        }


    }
}

export {Actions}