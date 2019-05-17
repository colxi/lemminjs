import {ImageToolset} from './lib/image-toolset.js'
import {Engine} from './engine.js'

let _spriteConstructor = function Sprite(sprite){
    this.imageBitmap = sprite;
    this.flipX = false;
    this.flipY = false;
    this.offsetX = 0; // or marginX and marginY
    this.offsetY = 0;
    return this;
}

let SPRITES_DEFINITIONS = {
    // "./path/source.json" : { },
    // "./path/source.json" : { },
    // ...
};

let SPRITESHEETS = {
    // "./path/source.png" : imageBitmap,
    // "./path/source.png" : imageBitmap,
    // ...
};

let SPRITES = {
    /*
    "walk" : {
            "spritesheet" : "./path/source.png",
            "loop" : true,
            "length" : 20,
            "frames" : {
                "0" : {
                    regular : {
                        "imageBitmap" : <imageBitmap>,
                        "pivot" : [ 5 ,5 ]    
                    },
                    flipX : {
                        "imageBitmap" : <imageBitmap>,
                        "pivot" : [ 5 ,5 ]    
                    },          
                },             
                "10" : {
                    regular : {
                        "imageBitmap" : <imageBitmap>,
                        "pivot" : [ 5 ,5 ]    
                    },
                    flipX : {
                        "imageBitmap" : <imageBitmap>,
                        "pivot" : [ 5 ,5 ]    
                    },          
                }
            }
        }
    */
};

let spritesheetResolverId = 0;
let spritesheetResolver = {};
let spritesheetOnload = async function( src , id , img){
    if( !SPRITESHEETS.hasOwnProperty( src ) ){
        SPRITESHEETS[src] = await createImageBitmap( img ,0 ,0 , img.width, img.height );
    }
    console.log( 'Engine.Sprite.loadSpritesheetImage() : Spritesheet loaded : ' , src );

    spritesheetResolver[ id ]( SPRITESHEETS[src] );
    delete spritesheetResolver[ id ];
}

let SPRITES_CACHE = new WeakMap();
let MAX_CACHE_SIZE = 320;

const cacheSprite = async function( image ){
    if(image.width > MAX_CACHE_SIZE || image.height > MAX_CACHE_SIZE ) return false;
    
    SPRITES_CACHE.set( image, {
        regular : image,
        flipX   : await ImageToolset.flipImage(image, true, false),
        flipY   : await ImageToolset.flipImage(image, false, true),
        flipXY  : await ImageToolset.flipImage(image, true, true)
    } );
};


const Sprite = {
    async loadImage( src , cache=true ){
        let image = await ImageToolset.loadImage( src );
        if(cache) await cacheSprite( image );
        return image;
    },


    async fromImageBitmap( image, x, y, w, h, cache=true){
        if( !(image instanceof ImageBitmap) ) throw new Error('Argument 1 must be a ImageBitmap');
        let sprite = await ImageToolset.cropImage( image, x, y, w, h);

        if(cache) await cacheSprite( sprite );
        //return sprite;

        return new _spriteConstructor(sprite);
    },

    declareAnimation( name='', loop=true, length=0 , frames={ 0 : Image, 10 : Image } ){ 
        return {
            name,
            loop,
            length,
            frames
        };
    },

    async importAnimationCollection( src ){
        let Animations = {};

        let Collection = fetch( src.json ).json(); 
        for(let animation in Collection ){
            let AnimationFrames = {};
            for(let frame in Collection[animation].frames ){
                let spriteImageRaw = await Sprite.loadImage( Collection[animation].frames[frame].src );
                AnimationFrames[ frame ] = await Sprite.fromImageBitmap(
                    spriteImageRaw , 
                    Collection[animation].frames[frame].x ,
                    Collection[animation].frames[frame].y ,
                    Collection[animation].frames[frame].width ,
                    Collection[animation].frames[frame].height 
                );
            }
            Animations[animation] = await Sprite.declareAnimation( 
                animation,
                Collection[animation].loop, 
                Collection[animation].length, 
                AnimationFrames  
            );
        }
        return Animations;
    },




    async import(src){
        let spriteDefinitions = await Sprite.loadDefinitions(src);
        let spriteSheetImage = await Sprite.loadSpritesheetImage( spriteDefinitions.spritesheet );
        let sprites = await Sprite.generate( spriteDefinitions.spritesheet,  spriteDefinitions.sprites );
        return sprites;
    },


    async loadDefinitions(src=''){
        console.log( 'Engine.Sprite.loadDefinitions() : Loading Sprite definitions : ' , src );
        if( !SPRITES_DEFINITIONS.hasOwnProperty( src ) ){
            SPRITES_DEFINITIONS[src] = await ( await fetch(Engine.rootpath + src ) ).json();
        }
        return SPRITES_DEFINITIONS[src];
    },


    async loadSpritesheetImage(src=''){
        console.log( 'Engine.Sprite.loadSpritesheetImage() : Loading spritesheet : ' , src );
        return new Promise( resolve=>{
            spritesheetResolverId++;
            spritesheetResolver[spritesheetResolverId] = resolve;
            if( !SPRITESHEETS.hasOwnProperty( src ) ){
                console.log( 'Engine.Sprite.loadSpritesheetImage() : Not cached. Loading  : ' , src );
                let img = document.createElement('img');
                img.onload = (e)=> spritesheetOnload(src, spritesheetResolverId, img);
                img.onerror = ()=>{ throw new Error('Engine.Sprite.loadSpritesheetImage() : Spritesheet Image not found : ' + Engine.rootpath +  src) };
                img.src = Engine.rootpath + src;
            }else{
                console.log( 'Engine.Sprite.loadSpritesheetImage() : Cached! : ' + src );
                spritesheetOnload(src, spritesheetResolverId, false);
            }
        })
    },

    // process the whole spritesheed definitio and return all generated Ssprites 
    async generate( spritesheetSrc , sprites ){
        if( !SPRITESHEETS.hasOwnProperty( spritesheetSrc ) ){
            console.log( 'Engine.Sprite.generate() : Spreadsheet' , spritesheetSrc, 'is not yet loaded.'  );
            await Sprite.loadSpritesheetImage( spritesheetSrc );
        }

        console.log( 'Engine.Sprite.generate() : Generating sprites with : ' , spritesheetSrc );
        for(let spriteName in sprites){
            if( !sprites.hasOwnProperty(spriteName) ) continuSe;
            
            console.log( 'Engine.Sprite.generate() : Generating sprite  : ' , spriteName );
            let currentSprite = sprites[spriteName];
            // extract and assign sprite properties
            SPRITES[ spriteName ] = {
                spritesheet : spritesheetSrc,
                loop        : currentSprite.loop,
                length      : currentSprite.length,
                frames      : {}
            };
            // iterate each frame definition
            for( let frame in currentSprite.frames ){
                if( !currentSprite.frames.hasOwnProperty(frame) ) continue;
                
                let currentFrame = currentSprite.frames[ frame ];
                let image = await createImageBitmap( SPRITESHEETS[spritesheetSrc] ,currentFrame.x, currentFrame.y ,currentFrame.width, currentFrame.height );
                SPRITES[ spriteName ].frames[ frame ] = {
                    imageBitmap : image,
                    pivot : currentSprite.frames[ frame ].pivot
                }

            }
        }

        return SPRITES
    },
    
    // return single sprite extracted from Spritesheet image
    async getFromSpritesheet( spritesheetSrc , x, y, width, height){
        if( !SPRITESHEETS.hasOwnProperty( spritesheetSrc ) ){
            console.log( 'Engine.Sprite.getSpriteFromSpritesheet() : Spreadsheet' , spritesheetSrc, 'is not yet loaded.'  );
            await Sprite.loadSpritesheetImage( spritesheetSrc );
        }
        let image = await createImageBitmap( SPRITESHEETS[spritesheetSrc] ,currentFrame.x, currentFrame.y ,currentFrame.width, currentFrame.height );

    },

    getById( name , frame=0 ){
        return SPRITES[name].frames[frame].imageBitmap;
    },

    draw(x=0,y=0,sprite){ 

        let lemCenter = {
            x : x + sprite.width  - 3 - Engine.Viewport.Scroll.x,
            y : y + sprite.height - 1 - Engine.Viewport.Scroll.y,
        }
        Engine.Viewport.Layers.sprites.drawImage( 
            sprite , 
            x - Engine.Viewport.Scroll.x, 
            y - Engine.Viewport.Scroll.y, 
            sprite.width , 
            sprite.height
        );

        // draw lemming
        //Engine.Viewport.Layers.sprites.fillStyle = "#FFFFFFAA";
        //Engine.Viewport.Layers.sprites.fillRect(x, y, lem.w, lem.h);

        // draw axis
        Engine.Viewport.Layers.sprites.fillStyle = "#00FFFF";
        Engine.Viewport.Layers.sprites.fillRect(lemCenter.x, lemCenter.y,1,5);

        // draw ground coord
        Engine.Viewport.Layers.sprites.fillStyle = "#FFFF00";
        Engine.Viewport.Layers.sprites.fillRect(lemCenter.x, lemCenter.y,1,1);
    }
};

export {Sprite};