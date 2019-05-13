import {Engine} from './engine.js';

let img = document.getElementById('img');

class c_Map {
    constructor(src){
        this.load(src);
    };
    source =  '';
    imageData = undefined;
    buffer = undefined;
    load(src){
        console.log('Loading map image', src)
        img.src = this.source = src;
        img.onload = ()=>this.onSourceLoad(); // use arrow function to force binding
    };
    onSourceLoad(){
        console.log('Map image loaded... Extracting buffer data and starting game loop',this)
        Engine.Viewport.mapContext.drawImage(img, 0, 0);
        this.imageData = Engine.Viewport.mapContext.getImageData(0, 0, Engine.Viewport.width , Engine.Viewport.height);
        this.buffer = this.imageData.data;
        Engine.frame()
        //ctx.putImageData(imageData, 0, 0);
        return;
    };
    getBufferIndex(x,y){
        return ( (y * Engine.Viewport.width) + x ) * 4;
    };
    erase(x,y){
        let i = this.getBufferIndex(x, y);
        this.buffer[i] = 0;
        this.buffer[i+1] = 0;
        this.buffer[i+2] = 0;
        this.buffer[i+3] = 0;
    };
    draw(x,y){
        let i = this.getBufferIndex(x, y);
        this.buffer[i] = 255;
        this.buffer[i+1] = 255;
        this.buffer[i+2] = 255;
        this.buffer[i+3] = 255;
    };
    isPixelTransparent(x,y){
        x=Math.round(x);
        y=Math.round(y);
    
        let pixel = this.getBufferIndex(x,y);
        let alpha = pixel + 3;
        return ( this.buffer[alpha] === 0) ? true : false;
    }
}
let Map = new c_Map('./map2.png');


export {Map};