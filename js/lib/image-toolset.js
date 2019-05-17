let LOAD_IMAGE_RESOLVER = [];
let LOAD_IMAGE_RESOLVER_ID = 0;

const ImageToolset = {
    async loadImage(src){ 
        if( typeof src !== 'string') throw new Error('First argument must be a filepath (string)');
        return new Promise( resolve =>{
            // increase the id conuter
            LOAD_IMAGE_RESOLVER_ID++;
            // save the resolver function using the id as index
            LOAD_IMAGE_RESOLVER[ LOAD_IMAGE_RESOLVER_ID ] = resolve;
            // create an image element
            let img = document.createElement('img');
            // set onload handler : when image is loaded resolve promise
            img.onload = async function(e){
                let image = await createImageBitmap( img, 0 ,0 , img.width, img.height );
                resolve( image )
                delete LOAD_IMAGE_RESOLVER[ LOAD_IMAGE_RESOLVER_ID ]; 
            }
            // set on error handler : if load fails throw an error
            img.onerror = ()=>{ throw new Error('Image not found at ' + src) };
            // done! Set the image source....
            img.src = src;
        });
    },

    async cropImage( image, x, y, w, h){ 
        let croppedImage = await createImageBitmap( image ,x ,y ,w ,h );
        return croppedImage;
    },

    async flipImage(image, horizontal=true, vertical=false){

        let ctx = document.createElement('canvas').getContext('2d');
        ctx.canvas.width= image.width;
        ctx.canvas.height= image.height;

        ctx.setTransform(
            (horizontal ? -1 : 1), 0,        // set the direction of x axis
            0, (vertical ? -1 : 1),          // set the direction of y axis
            (horizontal ? image.width : 0),  // set the x origin
            (vertical ? image.height : 0)    // set the y origin
        );
        ctx.drawImage(image,0,0);

        let flipped = await createImageBitmap( ctx.canvas ,0 ,0 ,image.width ,image.height );
        return flipped;
    },


    
 
}

export {ImageToolset};