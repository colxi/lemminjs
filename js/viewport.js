// initiate variables : canvas ref, offsets, scale...


let Viewport = {
    Scroll : {
        x : 0,
        y : 0
    },
    allowNegativeScale : false,
    scale : 1,
    scaleFactor : 0.1
}

const context   = document.getElementById('map').getContext('2d');


// Handle mousenwheel zoom
document.getElementById('sprites').onwheel = function(e){
  console.log('scroll')
  e.preventDefault();
  let previousScale= Viewport.scale;
  
  // calculate scale direction 6 new scale value
  let direction = e.deltaY > 0 ? 1 : -1;

  Viewport.scale += Viewport.scaleFactor * direction;
  if( Viewport.scale < 1  && !Viewport.allowNegativeScale ) Viewport.scale = 1;
  
  // calculate the new scroll values
  Viewport.Scroll.x += ( e.offsetX / previousScale )  - (e.offsetX  / Viewport.scale);
  Viewport.Scroll.y += ( e.offsetY / previousScale ) - ( e.offsetY / Viewport.scale);
  
  // experimental : limit scroll to prevent negative scrolls
  if( Viewport.Scroll.x < 0) Viewport.Scroll.x = 0;
  if( Viewport.Scroll.y < 0) Viewport.Scroll.y = 0;

  // apply new scale in a non acumulative way
  context.setTransform(1, 0, 0, 1, 0, 0);
  context.scale(Viewport.scale, Viewport.scale);
}


// clear canvas and draw two boxes
function render(){
  /*
    context.beginPath();
  context.clearRect(0,0,context.canvas.width/Viewport.scale, context.canvas.height/Viewport.scale);
  context.rect(100-Viewport.Scroll.x,50-Viewport.Scroll.y,50,50);
  context.rect(200-Viewport.Scroll.x,50-Viewport.Scroll.y,50,50);
  context.stroke();
  let info        = document.getElementById("zoomInfo");
  info.innerHTML=`
  Scale : ${Viewport.scale} <br>
  Scroll: ${Viewport.Scroll.x},${Viewport.Scroll.y} <br>
  `
  requestAnimationFrame( render );
*/
}

// handlencursor keys to move scroll
window.onkeydown = function(event){
    event.preventDefault();
    if(event.keyCode == 37)      Viewport.Scroll.x -=10;
    else if(event.keyCode == 39) Viewport.Scroll.x +=10;
    else if(event.keyCode == 38) Viewport.Scroll.y -=10;
    else if(event.keyCode == 40) Viewport.Scroll.y +=10;
};

context.canvas.focus()
//render()

export {Viewport};