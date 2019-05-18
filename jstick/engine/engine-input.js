import {JStick} from '../jstick.js';

JStick.Input = {
    
};


// Handle mousenwheel zoom
JStick.Viewport.Layers.container.onwheel = function(e){
    e.preventDefault();
    let direction = e.deltaY > 0 ? 1 : -1;
    let newScale= JStick.Viewport.scale + ( JStick.Viewport.scaleFactor * direction );
    JStick.Viewport.zoomTo(newScale, e.offsetX , e.offsetY);
}
  
// handlencursor keys to move scroll
window.onkeydown = function(event){
    event.preventDefault();
    if(event.keyCode == 37)      JStick.Viewport.Scroll.x -=10;
    else if(event.keyCode == 39) JStick.Viewport.Scroll.x +=10;
    else if(event.keyCode == 38) JStick.Viewport.Scroll.y -=10;
    else if(event.keyCode == 40) JStick.Viewport.Scroll.y +=10;
};
  

