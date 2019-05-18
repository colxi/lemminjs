import {Engine} from '../jstick/jstick.js';
import {Sprite}    from '../jstick/components/Sprite.js';
import {Animation} from '../jstick/components/Animation.js';
import {State}     from '../jstick/components/State.js';
import {Actor}     from '../jstick/components/Actor.js';
import {PixelMap}  from '../jstick/components/PixelMap.js';


import {myStates} from './my-states.js';


window.Engine = Engine;


(async function(){
    Engine.Viewport.deviceCursor(false);


    // Load the spritesheet
    let spriteSheet  = await Engine.Image.load( './spritesheet/lemmings.png' );
    // generate walking animation with the walking sprites from spritesheet
    let walkAnimation = new Animation({
        0  : await new Sprite( spriteSheet,  5,  1, 4, 9 ), 
        10 : await new Sprite( spriteSheet, 21,  0, 5, 10 ), 
        20 : await new Sprite( spriteSheet, 36,  1, 6, 9 ), 
        30 : await new Sprite( spriteSheet, 52,  1, 5, 9 ), 
        40 : await new Sprite( spriteSheet, 69,  1, 4, 9 ), 
        50 : await new Sprite( spriteSheet, 85,  0, 5, 10 ), 
        60 : await new Sprite( spriteSheet, 100, 1, 6, 9 ),
        70 : await new Sprite( spriteSheet, 116, 1, 5, 9 ) 
    } , 80 , true ); 

    let walkState = new State( 'walk', walkAnimation, myStates.walk );
    let fallState = new State( 'fall',  walkAnimation, myStates.fall );

    let Actors = [];
    let interval = setInterval( ()=>{
        Actors.push(
            new Actor({
                states : [walkState, fallState],
                state  : 'walk',
                x      : 500,
                y      : 80,
                attributes : {
                    direction : 1
                }
            }) 
        );
        if( Actors.length > 10 ) clearInterval( interval );
    }, 1000);


    let pixelMap = await new PixelMap('./maps/map2.png');


    /** LOOP : UPDATE */
    Engine.Loop.update = function(){
        // iterate all actors and update their States
        for(let i = 0; i < Actors.length; i++){ 
            Actors[i].updateState( pixelMap );
        }
    }
    
    /* LOOP : DRAW */
    Engine.Loop.draw = function(){
        document.getElementById('actorsCounts').innerHTML = Actors.length;
        Engine.Viewport.clear();
        pixelMap.draw( );

        // RENDER LAYER :
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



