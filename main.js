import {Engine} from './js/engine.js';
import {Map} from './js/map.js';
import {Actions} from './js/actions.js';
import {FPS} from './js/lib/fps-observer.js';
import {Lemming} from './js/lemming.js';
import {Viewport} from './js/viewport.js';


window.Engine = Engine;
window.Map = Map;
window.Actions = Actions;
window.FPS = FPS;
window.Lemming = Lemming;

window.action = 'erase';

Map.load('./map2.png').then( ()=>{ 
    console.log('loaded')
    Engine.frame() 
});


let clicked = false;
container.onmousedown = (e)=>{ clicked = true; }
container.onmouseup   = (e)=>{ clicked = false; }


container.onclick= e=>{
    if(window.action === 'zoomIn'){
        Viewport.zoomTo( Viewport.scale + Viewport.scaleFactor , e.layerX , e.layerY  )
    }
    if(window.action === 'zoomOut'){
        Viewport.zoomTo( Viewport.scale - Viewport.scaleFactor , e.layerX , e.layerY  )
    }
}

container.onmousemove= e=>{
    Viewport.Cursor.x = e.layerX;
    Viewport.Cursor.y = e.layerY;

    Map.Cursor.x = Math.round( ( Viewport.Cursor.x/Viewport.scale ) + Viewport.Scroll.x );
    Map.Cursor.y = Math.round( ( Viewport.Cursor.y/Viewport.scale ) + Viewport.Scroll.y );

    if(clicked){
        if(window.action === 'erase'){
            Map.Pixel.erase(e.layerX -1, e.layerY -1);
            Map.Pixel.erase(e.layerX +0, e.layerY -1);
            Map.Pixel.erase(e.layerX +1, e.layerY -1);


            Map.Pixel.erase(e.layerX -1, e.layerY +0);
            Map.Pixel.erase(e.layerX +0, e.layerY +0);
            Map.Pixel.erase(e.layerX +1, e.layerY +0);

            Map.Pixel.erase(e.layerX -1, e.layerY +1);
            Map.Pixel.erase(e.layerX +0, e.layerY +1);
            Map.Pixel.erase(e.layerX +1, e.layerY +1);
        }
        else if(window.action=== 'draw'){
            Map.Pixel.draw(e.layerX -1, e.layerY -1);
            Map.Pixel.draw(e.layerX +0, e.layerY -1);
            Map.Pixel.draw(e.layerX +1, e.layerY -1);


            Map.Pixel.draw(e.layerX -1, e.layerY +0);
            Map.Pixel.draw(e.layerX +0, e.layerY +0);
            Map.Pixel.draw(e.layerX +1, e.layerY +0);

            Map.Pixel.draw(e.layerX -1, e.layerY +1);
            Map.Pixel.draw(e.layerX +0, e.layerY +1);
            Map.Pixel.draw(e.layerX +1, e.layerY +1);
        }
    }
}