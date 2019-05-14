import {Map} from './map.js';
import {Lemming} from './lemming.js';
import {FPS} from './lib/fps-observer.js';
import {Viewport} from './viewport.js';


let Lemminjs = [];

Lemminjs.push( new Lemming() );
setInterval( ()=>{
    if(Engine.status) Lemminjs.push( new Lemming() );
},3000)




const Engine  = {
    RUNNING : 1,
    DEBUG   : 1,
    Viewport : {
        width : document.getElementById('map').width,
        height : document.getElementById('map').height,
        mapCanvas : document.getElementById('map'),
        mapContext : document.getElementById('map').getContext('2d'),
        spritesCanvas : document.getElementById('sprites'),
        spritesContext : document.getElementById('sprites').getContext('2d')
    },
    Cursor : {
        x : 0,
        y : 0,
    },
    status : 1,
    frame(e){
        if(!this.status) return;
        this.tick();
        requestAnimationFrame( ()=>this.frame() ); // use an arrow function to force the binding
    },
    tick(){
        //  clean sprites 
        this.Viewport.spritesContext.clearRect(0,0,this.Viewport.width , this.Viewport.height);

        for(let i=0;i<Lemminjs.length;i++){
            let lem = Lemminjs[i];
            Actions[lem.action](lem);
            lem.actionTick++;

            this.drawActor(lem);
        }

        // redraw the map to apply any changes
        this.Viewport.mapContext.clearRect(0,0, this.Viewport.width/Viewport.scale , this.Viewport.height/Viewport.scale);
        this.Viewport.mapContext.drawImage(Map.getImage() , 0-Viewport.Scroll.x, 0-Viewport.Scroll.y, this.Viewport.width , this.Viewport.height);
        
        document.getElementById('FPS').innerHTML=FPS.value;

        document.getElementById("scaleInfo").innerHTML = Viewport.scale.toFixed(2);
        document.getElementById("scrollInfo").innerHTML = Math.round(Viewport.Scroll.x) +' | '+Math.round(Viewport.Scroll.y);

  

        this.Viewport.spritesContext.fillStyle = "#FFFFFF";
        this.Viewport.spritesContext.fillRect(this.Cursor.x-5, this.Cursor.y ,11,1);
        this.Viewport.spritesContext.fillRect(this.Cursor.x, this.Cursor.y-5 ,1,11);

        
        //document.getElementById('lemCoords').innerHTML= lem.x+lem.w-3 +'-'+ lem.y+lem.h;
        //let b = Map.getBufferIndex(lem.x+lem.w-3,lem.y+lem.h)
        //document.getElementById('mapData').innerHTML= Map.buffer[b+3];


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

Engine.Viewport.mapContext.imageSmoothingEnabled = false;
Engine.Viewport.spritesContext.imageSmoothingEnabled = false;


export {Engine};