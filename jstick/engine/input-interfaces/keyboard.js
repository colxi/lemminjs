export default {
    name    : 'keyboard',
    signals : [
        ' ', 'TAB', 'CAPSLOCK', 'SHIFT', 'CONTROL', 'META', 'ALT', 'ALTGRAPH', 'ENTER', 'BACKSPACE', 
        'ARROWLEFT', 'ARROWUP', 'ARROWRIGHT', 'ARROWDOWN', 
        'º', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 
        'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', 
        'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Ñ', 'Ç', 
        'Z', 'X', 'C', 'V', 'B', 'N', 'M',
        //',', '.', '-', '_', ';', ':', '´', '¨', '{', '}', '`', '^', '[', ']', '*', '+',
        //'ª', '!', '"', '·', '$', '%', '&', '/', '(', ')', '=', '?', '¿', '¡', '\'', '\\',
        //'|', '@', '#', '~', '€', '¬'
    ],
    enable(){
        JStick.Viewport.Layers.container.addEventListener( 'keyup', keyUp, false);
        JStick.Viewport.Layers.container.addEventListener( 'keydown', keyDown, false );
        return true;
    },
    disable(){
        JStick.Viewport.Layers.container.removeEventListener( 'keyup', keyUp, false);
        JStick.Viewport.Layers.container.removeEventListener( 'keydown', keyDown ,false);
        return true;
    }
};

function keyDown(e){
    e.preventDefault();
    let key = e.key.toUpperCase();
    JStick.Input.__interfaceSignal__( key , true ); 
    return;
}

function keyUp(e){
    e.preventDefault();
    JStick.Input.__interfaceSignal__( key , false ); 
    return;
}
