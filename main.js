import {Engine} from './js/engine.js';
import {Map} from './js/map.js';
import {Actions} from './js/actions.js';
import {FPS} from './js/lib/fps-observer.js';
import {Lemming} from './js/lemming.js';


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
sprites.onmousedown = (e)=>{ clicked = true; }
sprites.onmouseup   = (e)=>{ clicked = false; }


sprites.onmousemove= e=>{
    Engine.Cursor.x = e.layerX;
    Engine.Cursor.y = e.layerY;

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