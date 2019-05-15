import {Engine} from './engine.js';


// initiate variables : canvas ref, offsets, scale...

let TARGET_ZOOM = false ; /* {
    x : 0,
    y : 0,
    level : 0
}
*/

let TARGET_SCROLL = false; /*{
    x : 0,
    y : 0
}
*/

let zoomStep = 0.05;
const _applyZoom = function(){
    let previousScale = Viewport.scale;
  
    // if Zoom reached the expected level, disable zoom scheduler and return
    if( Viewport.scale === TARGET_ZOOM.level  ){
        TARGET_ZOOM = false;
        return;
    }

    if( TARGET_ZOOM.level > Viewport.scale ){
        // ZOM IN, apply a zoomStep scale ipncrease
        Viewport.scale += zoomStep;
        // if applying increment, zoom level became bigger than target zoom, limit it
        if( Viewport.scale > TARGET_ZOOM.level ) Viewport.scale = TARGET_ZOOM.level;
    }else{
        // ZOM OUT
        Viewport.scale -= zoomStep;
        // if applying increment, zoom level became bigger than target zoom, limit it
        if( Viewport.scale < TARGET_ZOOM.level ) Viewport.scale = TARGET_ZOOM.level;
    }

    if( Viewport.scale < 1 && !Viewport.allowNegativeScale ) Viewport.scale = 1;
    
    // calculate the new scroll values
    Viewport.Scroll.x += ( TARGET_ZOOM.x / previousScale ) - ( TARGET_ZOOM.x / Viewport.scale);
    Viewport.Scroll.y += ( TARGET_ZOOM.y / previousScale ) - ( TARGET_ZOOM.y / Viewport.scale);
    
    // experimental : limit scroll to prevent negative scrolls
    if( Viewport.Scroll.x < 0) Viewport.Scroll.x = 0;
    if( Viewport.Scroll.y < 0) Viewport.Scroll.y = 0;
  
    // apply new scale in a non acumulative way
    Viewport.Layers.map.setTransform(1, 0, 0, 1, 0, 0);
    Viewport.Layers.map.scale(Viewport.scale, Viewport.scale);
}

let Viewport = {
    width : document.getElementById('map').width,
    height : document.getElementById('map').height,
    Layers : {
        container :  document.getElementById('container'),
        // map farest (non interactive & farest layer of map. Usually scenario opaque image. Allows paralax)
        // map behind (non interactive layer of map behind the main map. Allows paralax)
        map     : document.getElementById('map').getContext('2d'),
        sprites : document.getElementById('sprites').getContext('2d'),
        // particles (layer for particles and atmosphere)
        // map front (layer of map in front of sprites, allows paralaxing)
        // window UI (game information, lifes, time etc...)
    },
    Cursor : {
        x : 0,
        y : 0
    },
    Scroll : {
        x : 0,
        y : 0
    },
    allowInput : true,
    allowNegativeScale : false,
    scale : 1,
    scaleFactor : 1,
    render(){
        // perform ZOOM and SCALE if is scheduled
        if( TARGET_ZOOM ) _applyZoom();
        //if( !TARGET_SCROLL ) _applyScroll();


        //  SPRITES LAYER
        Viewport.Layers.sprites.clearRect( 0, 0, Viewport.width , Viewport.height );
        for(let i=0;i<Engine.Lemminjs.length;i++){
            let lem = Engine.Lemminjs[i];
            Engine.drawActor(lem);
        }

        // MAP LAYER
        Viewport.Layers.map.clearRect(0,0, Viewport.width/Viewport.scale , Viewport.height/Viewport.scale);
        Viewport.Layers.map.drawImage( Engine.Map.getImage() , 0-Viewport.Scroll.x, 0-Viewport.Scroll.y, Viewport.width , Viewport.height);
             
        // render cursor
        Viewport.Layers.sprites.fillStyle = "#FFFFFF";
        Viewport.Layers.sprites.fillRect(Viewport.Cursor.x-5, Viewport.Cursor.y ,11,1);
        Viewport.Layers.sprites.fillRect(Viewport.Cursor.x, Viewport.Cursor.y-5 ,1,11);


        // info panel
        document.getElementById('FPS').innerHTML=FPS.value;
        document.getElementById("scaleInfo").innerHTML = Viewport.scale.toFixed(2);
        document.getElementById("scrollInfo").innerHTML = Math.round(Viewport.Scroll.x) +' | '+Math.round(Viewport.Scroll.y);
        document.getElementById('mouseCoords').innerHTML = Engine.Map.Cursor.x + ' | ' + Engine.Map.Cursor.y;
        //let b = Map.getBufferIndex(lem.x+lem.w-3,lem.y+lem.h)
        //document.getElementById('mapData').innerHTML= Map.buffer[b+3];

    },

    /**
     * 
     * Viewport.zoomTo() : With the provided zoom factor, perform a zoom at the provided Viewport coordinates.
     *                      If no zoom factor is provided use Viewport.scaleFactor default value, and if no coordinates
     *                      are provided use the center of the vieport, as zooming target coordinates
     * 
     */
    zoomTo( level = Viewport.scaleFactor, x = Math.round(Viewport.width/2), y = Math.round(Viewport.height/2) ){
        TARGET_ZOOM = {
            x : x,
            y : y,
            level : level
        }
    },
    scrollTo(x,y){

    }
}


Viewport.Layers.map.imageSmoothingEnabled = false;
Viewport.Layers.sprites.imageSmoothingEnabled = false;


export {Viewport};