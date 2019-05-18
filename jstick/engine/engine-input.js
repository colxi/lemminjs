import {Engine} from '../jstick.js';

Engine.Input = {
    
};


// Handle mousenwheel zoom
Engine.Viewport.Layers.container.onwheel = function(e){
    e.preventDefault();
    let direction = e.deltaY > 0 ? 1 : -1;
    let newScale= Engine.Viewport.scale + ( Engine.Viewport.scaleFactor * direction );
    Engine.Viewport.zoomTo(newScale, e.offsetX , e.offsetY);
}
  
// handlencursor keys to move scroll
window.onkeydown = function(event){
    event.preventDefault();
    if(event.keyCode == 37)      Engine.Viewport.Scroll.x -=10;
    else if(event.keyCode == 39) Engine.Viewport.Scroll.x +=10;
    else if(event.keyCode == 38) Engine.Viewport.Scroll.y -=10;
    else if(event.keyCode == 40) Engine.Viewport.Scroll.y +=10;
};
  

