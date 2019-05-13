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

let clicked = false;
sprites.onmousedown = (e)=>{ clicked = true; }
sprites.onmouseup   = (e)=>{ clicked = false; }


sprites.onmousemove= e=>{
    if(clicked){
        if(window.action === 'erase'){
            Map.erase(e.layerX -1, e.layerY -1);
            Map.erase(e.layerX +0, e.layerY -1);
            Map.erase(e.layerX +1, e.layerY -1);


            Map.erase(e.layerX -1, e.layerY +0);
            Map.erase(e.layerX +0, e.layerY +0);
            Map.erase(e.layerX +1, e.layerY +0);

            Map.erase(e.layerX -1, e.layerY +1);
            Map.erase(e.layerX +0, e.layerY +1);
            Map.erase(e.layerX +1, e.layerY +1);
        }
        else if(window.action=== 'draw'){
            Map.draw(e.layerX -1, e.layerY -1);
            Map.draw(e.layerX +0, e.layerY -1);
            Map.draw(e.layerX +1, e.layerY -1);


            Map.draw(e.layerX -1, e.layerY +0);
            Map.draw(e.layerX +0, e.layerY +0);
            Map.draw(e.layerX +1, e.layerY +0);

            Map.draw(e.layerX -1, e.layerY +1);
            Map.draw(e.layerX +0, e.layerY +1);
            Map.draw(e.layerX +1, e.layerY +1);
        }
    }
}