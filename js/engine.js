import {Map} from './map.js';
import {FPS} from './lib/fps-observer.js';
import {Viewport} from './viewport.js';
import {Input} from './input.js';
import {Sprite} from './sprite.js';
import {Actor} from './actor.js';


let _stylesDef = `
    [hide-device-cursor]{ cursor : none !important; }

`;

let _styles       = document.createElement('style');
_styles.innerHTML = _stylesDef;
document.body.appendChild(_styles);

const Engine  = {
    Map      : Map,
    FPS      : FPS,
    Input    : Input,
    Viewport : Viewport,
    Sprite   : Sprite,
    Actor    : Actor,
    rootpath : '',

    RUNNING : 1,
    DEBUG   : 1,

    Lemminjs : [],
    status : 1,

    showInfo : true,

    updateInfo(){
        // info panel
        document.getElementById('FPS').innerHTML = Engine.FPS.value;
        document.getElementById("scaleInfo").innerHTML = Engine.Viewport.scale.toFixed(2);
        document.getElementById("scrollInfo").innerHTML = Math.floor(Engine.Viewport.Scroll.x) +' | '+Math.floor(Engine.Viewport.Scroll.y);
        document.getElementById('mouseCoords').innerHTML = Engine.Map.Cursor.x + ' | ' + Engine.Map.Cursor.y;
        //let b = Map.getBufferIndex(lem.x+lem.w-3,lem.y+lem.h)
        //document.getElementById('mapData').innerHTML= Map.buffer[b+3];
    },

    frame(e){
        if(!this.status) return;
        this.tick();
        requestAnimationFrame( ()=>this.frame() ); // use an arrow function to force the binding
    },

    tick(){
        Viewport.updateZoom();
        Viewport.updateScroll();
        Engine.Loop.update();
        Engine.Loop.draw();
        if( Engine.showInfo ) Engine.updateInfo();
    },


    toggle(){
        this.status = !this.status;
        this.frame();
    },
    
    Loop : {
        update(){
            /* user provided */
        },
        draw(){
            /* user provided */
        }
    }
}


window.Engine = Engine;


export {Engine};