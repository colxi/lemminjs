
let _stylesDef = `
    [hide-device-cursor]{ cursor : none !important; }

`;

let _styles       = document.createElement('style');
_styles.innerHTML = _stylesDef;
document.body.appendChild(_styles);

const Engine  = {
    rootpath : '',
    status : 1,
    showInfo : true,

    updateInfo(){
        // info panel

        document.getElementById('FPS').innerHTML = Engine.FPS.value;
        document.getElementById("scaleInfo").innerHTML = Engine.Viewport.scale.toFixed(2);
        document.getElementById("scrollInfo").innerHTML = Math.floor(Engine.Viewport.Scroll.x) +' | '+Math.floor(Engine.Viewport.Scroll.y);
        let [ x, y ] = Engine.Viewport.getMapCoordinates( Engine.Viewport.Cursor.x,Engine.Viewport.Cursor.x); 
        document.getElementById('mouseCoords').innerHTML =  x+ ' | ' + y;

        //let b = Map.getBufferIndex(lem.x+lem.w-3,lem.y+lem.h)
        //document.getElementById('mapData').innerHTML= Map.buffer[b+3];
    },

    frame(e){
        if(!this.status) return;
        this.tick();
        requestAnimationFrame( ()=>this.frame() ); // use an arrow function to force the binding
    },

    tick(){
        Engine.Viewport.updateZoom();
        Engine.Viewport.updateScroll();
        Engine.Loop.update();
        Engine.Loop.draw();
        if( Engine.showInfo ) Engine.updateInfo();
    },


    toggle(){
        Engine.status = !Engine.status;
        Engine.frame();
    },
    
    Loop : {
        update(){
            // user provided 
        },
        draw(){
            // user provided 
        }
    }
}




export {Engine};