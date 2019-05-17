/**
 
 load spritesheet (image)

 extract sprites (preproces rotate, flip, brighness ...)
 
 define animations with sprites (loop , length, frames...)

 create states
 - assign a state name
 - link it to an animation
 - assign a state update handler

 create actors 
 - 
 


 */
import {Engine} from '../js/engine.js';
import {myStates} from './my-states.js';


(async function(){
    Engine.Viewport.deviceCursor(false);
    // create actors
    let spriteSheet= await Engine.Sprite.loadImage('./spritesheet/lemmings.png');
    let spriteWalk_1 = await Engine.Sprite.fromImageBitmap( spriteSheet, 5, 1, 4, 9 );
    let spriteWalk_2 = await Engine.Sprite.fromImageBitmap( spriteSheet, 21, 0, 5, 10 );
    let walkAnimation = Engine.Sprite.declareAnimation( 
        'walk', 
        true, 
        20, 
        { 
            0  : spriteWalk_1, 
            10 : spriteWalk_2 
        } 
    ); 

    console.log( walkAnimation );


    let Actors = [];
    window.Actors=Actors;

    setInterval( ()=>{
        if(Actors.length>100) return;
        let i = Actors.length;;
        let lemming = Engine.Actor.create( 'lemming-' + i , 'player' , 'walk' );
        
        Object.defineProperty(lemming, 'groundX', {
            get: function() {
                return Math.floor( this.x +5 - (5/2) );
                return Math.floor( this.x + this.w- (this.w/2) );
            }
        });

        Object.defineProperty(lemming, 'groundY', {
            get: function() {
                return Math.floor( this.y + 5-1 );
                return Math.floor( this.y + this.h-1 );
            }
        });
        
        Actors.push( lemming);
    },1000);


    // create states
    Engine.Actor.createState('walk', 'sprite-walk', myStates.walk);
    Engine.Actor.createState('fall', 'sprite-fall', myStates.fall);

    let Sprites = await Engine.Sprite.import('./my-sprites.json');
    let Map     = await Engine.Map.load('./maps/map2.png');

    Engine.Loop.update = function(){
        // iterate lemminjs and update
        for(let i = 0; i < Actors.length; i++) Actors[i].updateState();
    }
    
    Engine.Loop.draw = function(){
        document.getElementById('actorsCounts').innerHTML = Actors.length;
        Engine.Viewport.clear();
        Engine.Map.draw();

        // SPRITES LAYER
        for(let i = 0; i < Actors.length; i++) Actors[i].draw();
        
        // RENDER STAGE :
        Engine.Viewport.drawCursor();

        return;
    }
    Engine.frame();
})();



window.action = 'erase';


let clicked = false;
container.onmousedown = (e)=>{ clicked = true; }
container.onmouseup   = (e)=>{ clicked = false; }


container.onclick= e=>{
    console.log(e)
    if(window.action === 'zoomIn'){
        Engine.Viewport.zoomTo( Engine.Viewport.scale + Engine.Viewport.scaleFactor , e.layerX , e.layerY  )
    }
    if(window.action === 'zoomOut'){
        Engine.Viewport.zoomTo( Engine.Viewport.scale - Engine.Viewport.scaleFactor , e.layerX , e.layerY  )
    }
}


container.onmousemove= e=>{
    if(clicked){
        let [x , y] = Engine.Viewport.getMapCoordinates(e.layerX,e.layerY);


        if(window.action === 'erase'){
            Engine.Map.Pixel.erase(x -1, y -1);
            Engine.Map.Pixel.erase(x +0, y -1);
            Engine.Map.Pixel.erase(x +1, y -1);

            Engine.Map.Pixel.erase(x -1, y +0);
            Engine.Map.Pixel.erase(x +0, y +0);
            Engine.Map.Pixel.erase(x +1, y +0);

            Engine.Map.Pixel.erase(x -1, y +1);
            Engine.Map.Pixel.erase(x +0, y +1);
            Engine.Map.Pixel.erase(x +1, y +1);
        }
        else if(window.action=== 'draw'){
            Engine.Map.Pixel.draw(x -1, y -1);
            Engine.Map.Pixel.draw(x +0, y -1);
            Engine.Map.Pixel.draw(x +1, y -1);

            Engine.Map.Pixel.draw(x -1, y +0);
            Engine.Map.Pixel.draw(x +0, y +0);
            Engine.Map.Pixel.draw(x +1, y +0);

            Engine.Map.Pixel.draw(x -1, y +1);
            Engine.Map.Pixel.draw(x +0, y +1);
            Engine.Map.Pixel.draw(x +1, y +1);
        }
    }
}


