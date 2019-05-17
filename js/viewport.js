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

    // Container for Viewport cursor position. Only read mode recomended. To set new coordinates 
    // use Viewport.setCursor ( it will generate automatically scaled Map coordinates too)
    Cursor : {
        x : 0,
        y : 0
    },

    Scroll : {
        x : 0,
        y : 0
    },

    showInfo : true,

    // todo : should be in INPUT module
    allowInput : true,
    // allow/disallow scales lower than 1 (scale reduction)
    allowNegativeScale : false,
    // current scale
    scale : 1,
    // default zoom modifier to apply 
    scaleFactor : 1,
    // zoom modifier to apply in each step until target zoom is reached
    scaleStep : 0.05,

    // native cursor
    deviceCursor( value ){
        if (typeof value !== "boolean"){
            throw new Error('Viewport.deviceCursor() : Argument 1 must be a Boolean');
        }

        if( value ) Viewport.Layers.container.removeAttribute('hide-device-cursor');
        else Viewport.Layers.container.setAttribute('hide-device-cursor',true);
        return true;
    },
    // flag to enable or disable automatic viewport cursor changes tracking 
    captureCursor : true,

    cursor : undefined, // should contain a sprite

   

    /**
     * Viewport.clear() : Clears the Viewport
     */
    clear(){
        // Clean map layer
        Engine.Viewport.Layers.map.clearRect(
            0,
            0, 
            Engine.Viewport.width / Engine.Viewport.scale , 
            Engine.Viewport.height / Engine.Viewport.scale
        );

        // clean sprites layer
        Engine.Viewport.Layers.sprites.clearRect( 
            0, 
            0, 
            Engine.Viewport.width / Engine.Viewport.scale , 
            Engine.Viewport.height / Engine.Viewport.scale
        );

        return true;
    },

    loadCursor(){ /* loads a cursor, and stores it in a CURSORS collection (object with sprites) */},

    drawCursor : function(){     
        // render cursor
        Viewport.Layers.sprites.fillStyle = "#FFFFF";

        Viewport.Layers.sprites.fillRect(
            ( Viewport.Cursor.x / Viewport.scale ) - 5, 
            Viewport.Cursor.y  / Viewport.scale,
            11,
            1
        );
        Viewport.Layers.sprites.fillRect(
            Viewport.Cursor.x / Viewport.scale, 
            ( Viewport.Cursor.y / Viewport.scale ) - 5  ,
            1,
            11
        );
        return true;
    },

    setCursor(x,y){
        Engine.Viewport.Cursor.x = x;
        Engine.Viewport.Cursor.y = y;

        let mapCoords = Viewport.getMapCoordinates(x,y);
        Engine.Map.Cursor.x = mapCoords[0];
        Engine.Map.Cursor.y = mapCoords[1];
    },

    /**
     * 
     * Viewport.getMapCoordinates() : Transform the provided viewport coordinates to map 
     *                                coordinates, considering map scale and map scroll.
     */
    getMapCoordinates( x, y){
        return [
            Math.floor( ( Engine.Viewport.Cursor.x/Engine.Viewport.scale ) + Engine.Viewport.Scroll.x ) ,
            Math.floor( ( Engine.Viewport.Cursor.y/Engine.Viewport.scale ) + Engine.Viewport.Scroll.y )
        ];
    },

    updateZoom(){
        if( !TARGET_ZOOM ) return true;

        let previousScale = Viewport.scale;
  
        // if Zoom reached the expected level, disable zoom scheduler and return
        if( Viewport.scale === TARGET_ZOOM.level  ){
            TARGET_ZOOM = false;
            return;
        }

        if( TARGET_ZOOM.level > Viewport.scale ){
            // ZOM IN, apply a Viewport.scaleStep scale ipncrease
            Viewport.scale += Viewport.scaleStep;
            // if applying increment, zoom level became bigger than target zoom, limit it
            if( Viewport.scale > TARGET_ZOOM.level ) Viewport.scale = TARGET_ZOOM.level;
        }else{
            // ZOM OUT
            Viewport.scale -= Viewport.scaleStep;
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

        // apply new scale in a non acumulative way
        Viewport.Layers.sprites.setTransform(1, 0, 0, 1, 0, 0);
        Viewport.Layers.sprites.scale(Viewport.scale, Viewport.scale);

        return true;
    },

    updateScroll(){
        // perform  SCALE update if is scheduled
        //if( !TARGET_SCROLL ) _applyScroll();
        return true;
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


Viewport.Layers.map.imageSmoothingEnabled     = false;
Viewport.Layers.sprites.imageSmoothingEnabled = false;

Viewport.Layers.container.addEventListener( 'mousemove', e=>{
    if( Engine.Viewport.captureCursor ){
        Engine.Viewport.setCursor( e.layerX, e.layerY );
    }
});

export {Viewport};