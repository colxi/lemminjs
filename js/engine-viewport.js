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



Engine.Viewport = {
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

        if( value ) Engine.Viewport.Layers.container.removeAttribute('hide-device-cursor');
        else Engine.Viewport.Layers.container.setAttribute('hide-device-cursor',true);
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
        Engine.Viewport.Layers.sprites.fillStyle = "#FFFFF";

        Engine.Viewport.Layers.sprites.fillRect(
            ( Engine.Viewport.Cursor.x / Engine.Viewport.scale ) - 5, 
            Engine.Viewport.Cursor.y  / Engine.Viewport.scale,
            11,
            1
        );
        Engine.Viewport.Layers.sprites.fillRect(
            Engine.Viewport.Cursor.x / Engine.Viewport.scale, 
            ( Engine.Viewport.Cursor.y / Engine.Viewport.scale ) - 5  ,
            1,
            11
        );
        return true;
    },

    setCursor(x,y){
        Engine.Viewport.Cursor.x = x;
        Engine.Viewport.Cursor.y = y;

        let mapCoords = Engine.Viewport.getMapCoordinates(x,y);
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

        let previousScale = Engine.Viewport.scale;
  
        // if Zoom reached the expected level, disable zoom scheduler and return
        if( Engine.Viewport.scale === TARGET_ZOOM.level  ){
            TARGET_ZOOM = false;
            return;
        }

        if( TARGET_ZOOM.level > Engine.Viewport.scale ){
            // ZOM IN, apply a Viewport.scaleStep scale ipncrease
            Engine.Viewport.scale += Engine.Viewport.scaleStep;
            // if applying increment, zoom level became bigger than target zoom, limit it
            if( Engine.Viewport.scale > TARGET_ZOOM.level ) Engine.Viewport.scale = TARGET_ZOOM.level;
        }else{
            // ZOM OUT
            Engine.Viewport.scale -= Engine.Viewport.scaleStep;
            // if applying increment, zoom level became bigger than target zoom, limit it
            if( Engine.Viewport.scale < TARGET_ZOOM.level ) Engine.Viewport.scale = TARGET_ZOOM.level;
        }

        if( Engine.Viewport.scale < 1 && !Engine.Viewport.allowNegativeScale ) Engine.Viewport.scale = 1;
        
        // calculate the new scroll values
        Engine.Viewport.Scroll.x += ( TARGET_ZOOM.x / previousScale ) - ( TARGET_ZOOM.x / Engine.Viewport.scale);
        Engine.Viewport.Scroll.y += ( TARGET_ZOOM.y / previousScale ) - ( TARGET_ZOOM.y / Engine.Viewport.scale);
        
        // experimental : limit scroll to prevent negative scrolls
        if( Engine.Viewport.Scroll.x < 0) Engine.Viewport.Scroll.x = 0;
        if( Engine.Viewport.Scroll.y < 0) Engine.Viewport.Scroll.y = 0;
    
        // apply new scale in a non acumulative way
        Engine.Viewport.Layers.map.setTransform(1, 0, 0, 1, 0, 0);
        Engine.Viewport.Layers.map.scale(Engine.Viewport.scale, Engine.Viewport.scale);

        // apply new scale in a non acumulative way
        Engine.Viewport.Layers.sprites.setTransform(1, 0, 0, 1, 0, 0);
        Engine.Viewport.Layers.sprites.scale(Engine.Viewport.scale, Engine.Viewport.scale);

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
     *                      If no zoom factor is provided use Engine.Viewport.scaleFactor default value, and if no coordinates
     *                      are provided use the center of the vieport, as zooming target coordinates
     * 
     */
    zoomTo( level = Engine.Viewport.scaleFactor, x = Math.round(Engine.Viewport.width/2), y = Math.round(Engine.Viewport.height/2) ){
        TARGET_ZOOM = {
            x : x,
            y : y,
            level : level
        }
    },

    scrollTo(x,y){

    }
}


Engine.Viewport.Layers.map.imageSmoothingEnabled     = false;
Engine.Viewport.Layers.sprites.imageSmoothingEnabled = false;

Engine.Viewport.Layers.container.addEventListener( 'mousemove', e=>{
    if( Engine.Viewport.captureCursor ){
        Engine.Viewport.setCursor( e.layerX, e.layerY );
    }
});

