import {Engine} from '../jstick.js';

Engine.Input = {
    
};




Engine.Map = {
    draw( map ){
        // Draw map data in canvas
        Engine.Viewport.Layers.map.drawImage( 
            map, 
            0 - Engine.Viewport.Scroll.x, 
            0 - Engine.Viewport.Scroll.y, 
            Engine.Viewport.width , 
            Engine.Viewport.height
        )   
    }
};
