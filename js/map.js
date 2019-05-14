// Image Element, where the Map image is initially loaded
let MAP_IMAGE = document.createElement('img');

// because firefox requires a flag to enable ofscreen canvas, regular canvas is used
// this affects the whole implementation, in many points accross the Map module
// let MAP_IMAGE_CANVAS = new OffscreenCanvas(1,1)
let MAP_IMAGE_CANVAS = document.createElement('canvas');
let MAP_IMAGE_CANVAS_CONTEXT = MAP_IMAGE_CANVAS.getContext('2d');

// Variable to store the imageData Extracted from MAP_IMAGE
let MAP_IMAGE_DATA;
// shorthand to to array buffer contained in MAP_IMAGE_DATA.data
let MAP_IMAGE_BUFFER;

// Map Sizes
let MAP_WIDTH = 0;
let MAP_HEIGHT = 0;


let ON_IMAGE_LOAD_RESOLVE;
/**
 * 
 * onMapImageLoad() Is a callback to be executed when the Map Image is loaded.
 *                  It extracts image sizes, and injects the image into the canvas
 *                  to extract the imageData and image array Buffer representation
 * 
 */
const onMapImageLoad = function(){
    console.log('Map image loaded')
    // get sizes of the map
    MAP_WIDTH        = MAP_IMAGE.width;
    MAP_HEIGHT       = MAP_IMAGE.height;
    // set the MAP internal canvas to image size
    MAP_IMAGE_CANVAS.width = MAP_WIDTH;
    MAP_IMAGE_CANVAS.height = MAP_HEIGHT;
    // draw image to internal canvas, to be able to extract the Image Data buffer
    MAP_IMAGE_CANVAS_CONTEXT.drawImage(MAP_IMAGE, 0, 0);
    MAP_IMAGE_DATA   = MAP_IMAGE_CANVAS_CONTEXT.getImageData(0, 0, MAP_WIDTH , MAP_HEIGHT);
    MAP_IMAGE_BUFFER = MAP_IMAGE_DATA.data;
    // resolve !
    return ON_IMAGE_LOAD_RESOLVE();
};


/**
 * 
 * _getPixelIndex() : Returns the index in the Image data Buffer for the requested
 *                   [x,y] coordinates. Index is used to direct acces to ArrayBuffer
 * 
 */
const _getPixelIndex = function(x,y){
    return ( (y * MAP_WIDTH) + x ) * 4;
};


const Map = {
    get width(){ return MAP_WIDTH },
    get height(){ return MAP_HEIGHT },

    load(src){
        return new Promise( resolve=>{
            console.log('Loading map image', src)
            ON_IMAGE_LOAD_RESOLVE = resolve;
            MAP_IMAGE.src = src;
            MAP_IMAGE.onload = onMapImageLoad;
        })
    },

    getImage : function(){
        MAP_IMAGE_CANVAS_CONTEXT.putImageData(MAP_IMAGE_DATA, 0,0);
        return MAP_IMAGE_CANVAS;
        // transferToImageBitmap() requires a an ofscreencanvas not supported yet by firefox
        //return MAP_IMAGE_CANVAS.transferToImageBitmap();
    },

    Pixel : {
        getColor(x,y){
            x=Math.round(x);
            y=Math.round(y);

            let i = _getPixelIndex(x, y);
            return [
                MAP_IMAGE_BUFFER[ i ],     // RED
                MAP_IMAGE_BUFFER[ i + 1 ], // GREEN
                MAP_IMAGE_BUFFER[ i + 2 ], // BLUE
                MAP_IMAGE_BUFFER[ i + 3 ]  // ALPHA
            ]
        },
        draw(x,y){
            x=Math.round(x);
            y=Math.round(y);

            let i = _getPixelIndex(x, y);
            MAP_IMAGE_BUFFER[i] = 255;
            MAP_IMAGE_BUFFER[i+1] = 255;
            MAP_IMAGE_BUFFER[i+2] = 255;
            MAP_IMAGE_BUFFER[i+3] = 255;
        },
        erase(x,y){
            x=Math.round(x);
            y=Math.round(y);

            let i = _getPixelIndex(x, y);
            MAP_IMAGE_BUFFER[i] = 0;
            MAP_IMAGE_BUFFER[i+1] = 0;
            MAP_IMAGE_BUFFER[i+2] = 0;
            MAP_IMAGE_BUFFER[i+3] = 0;
        },
        isTransparent(x,y){
            x=Math.round(x);
            y=Math.round(y);
        
            let pixel = _getPixelIndex(x,y);
            let alpha = pixel + 3;
            return ( MAP_IMAGE_BUFFER[alpha] === 0) ? true : false;
        }
    },


}

export {Map};