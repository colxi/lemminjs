import {Engine} from './js/engine.js';
import {Map} from './js/map.js';
import {Actions} from './js/actions.js';

window.Engine = Engine;
window.Map = Map;
window.Actions = Actions;


let clicked = false;
sprites.onmousedown = (e)=>{ clicked = true; }
sprites.onmouseup   = (e)=>{ clicked = false; }


sprites.onmousemove= e=>{
    if(clicked){
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
}