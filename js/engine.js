import {Map} from './map.js';
import {Lemming} from './lemming.js';


let Lemminjs = [];

Lemminjs.push( new Lemming() );
setInterval( ()=>{
    Lemminjs.push( new Lemming() );
},3000)


class c_Engine{
    RUNNING = 1;
    DEBUG   = 1;
    constructor(){
        this.Viewport.mapContext.imageSmoothingEnabled = false;
        this.Viewport.spritesContext.imageSmoothingEnabled = false;
    };
    Viewport = {
        width : document.getElementById('map').width,
        height : document.getElementById('map').height,
        mapCanvas : document.getElementById('map'),
        mapContext : document.getElementById('map').getContext('2d'),
        spritesCanvas : document.getElementById('sprites'),
        spritesContext : document.getElementById('sprites').getContext('2d')
    };
    status = 1;
    frame(e){
        if(!this.status) return;
        this.tick();
        requestAnimationFrame( ()=>this.frame() ); // use an arrow function to force the binding
    };
    tick(){
        // redraw the map to apply any change
        this.Viewport.mapContext.putImageData(Map.imageData, 0, 0);
        //  clean sprites 
        this.Viewport.spritesContext.clearRect(0,0,this.Viewport.width , this.Viewport.height);

        
        for(let i=0;i<Lemminjs.length;i++){
            let lem = Lemminjs[i];
            Actions[lem.action](lem);
            lem.actionTick++;

            this.drawActor(lem);
        }
        
        //document.getElementById('lemCoords').innerHTML= lem.x+lem.w-3 +'-'+ lem.y+lem.h;
        //let b = Map.getBufferIndex(lem.x+lem.w-3,lem.y+lem.h)
        //document.getElementById('mapData').innerHTML= Map.buffer[b+3];


        return;
    };
    toggle(){
        this.status = !this.status;
        this.frame();
    }
    drawActor(lem){    
        let lemCenter = {
            x : lem.x+lem.w-3,
            y : lem.y+lem.h-1
        }
        
        // draw lemming
        this.Viewport.spritesContext.fillStyle = "#FFFFFFAA";
        this.Viewport.spritesContext.fillRect(lem.x, lem.y, lem.w, lem.h);

        // draw axis
        this.Viewport.spritesContext.fillStyle = "#00FFFF";
        this.Viewport.spritesContext.fillRect(lemCenter.x, lemCenter.y,1,5);

        // draw ground coord
        this.Viewport.spritesContext.fillStyle = "#FFFF00";
        this.Viewport.spritesContext.fillRect(lemCenter.x, lemCenter.y,1,1);
    }
}
let Engine = new c_Engine();


export {Engine};