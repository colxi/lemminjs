import {Map} from './map.js';
import {Lemming} from './lemming.js';
import {FPS} from './lib/fps-observer.js';
import {Viewport} from './viewport.js';
import {Actions} from './actions.js';
import {Input} from './input.js';






const Engine  = {
    Map : Map,
    Lemming : Lemming, 
    FPS : FPS,
    Actions : Actions,
    Input : Input,
    Viewport : Viewport,

    
    RUNNING : 1,
    DEBUG   : 1,

    Lemminjs : [],
    status : 1,
    frame(e){
        if(!this.status) return;
        this.tick();
        requestAnimationFrame( ()=>this.frame() ); // use an arrow function to force the binding
    },
    tick(){
        // update STAGE: 
        
        // iterate lemminjs and update
        for(let i=0;i<Engine.Lemminjs.length;i++){
            let lem = Engine.Lemminjs[i];
            Engine.Actions[lem.action](lem);
            lem.actionTick++;
        }

        // RENDER STAGE :
        Viewport.render();


        return;
    },
    toggle(){
        this.status = !this.status;
        this.frame();
    },
    drawActor(lem){    
        let lemCenter = {
            x : lem.x+lem.w-3,
            y : lem.y+lem.h-1
        }
        
        // draw lemming
        Viewport.Layers.sprites.fillStyle = "#FFFFFFAA";
        Viewport.Layers.sprites.fillRect(lem.x, lem.y, lem.w, lem.h);

        // draw axis
        Viewport.Layers.sprites.fillStyle = "#00FFFF";
        Viewport.Layers.sprites.fillRect(lemCenter.x, lemCenter.y,1,5);

        // draw ground coord
        Viewport.Layers.sprites.fillStyle = "#FFFF00";
        Viewport.Layers.sprites.fillRect(lemCenter.x, lemCenter.y,1,1);
    }
}

Engine.Lemminjs.push( new Lemming() );
setInterval( ()=>{
    if(Engine.status) Engine.Lemminjs.push( new Lemming() );
},3000)





export {Engine};