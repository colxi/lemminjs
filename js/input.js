import {Viewport} from './viewport.js';

const Input = {
    
};


// Handle mousenwheel zoom
Viewport.Layers.container.onwheel = function(e){
    e.preventDefault();
    let direction = e.deltaY > 0 ? 1 : -1;
    let newScale= Viewport.scale + ( Viewport.scaleFactor * direction );
    Viewport.zoomTo(newScale, e.offsetX , e.offsetY);
}
  
// handlencursor keys to move scroll
window.onkeydown = function(event){
    event.preventDefault();
    if(event.keyCode == 37)      Viewport.Scroll.x -=10;
    else if(event.keyCode == 39) Viewport.Scroll.x +=10;
    else if(event.keyCode == 38) Viewport.Scroll.y -=10;
    else if(event.keyCode == 40) Viewport.Scroll.y +=10;
};
  

export {Input}