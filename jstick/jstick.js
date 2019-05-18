import {Engine} from './engine/engine-core.js';
import './engine/engine-viewport.js';
import {FPS} from './lib/fps-observer.js';
import './engine/engine-image.js';
import './engine/engine-map.js';
import './engine/engine-input.js';
import './engine/engine-sprite.js';
import './engine/engine-cache.js';


Engine.FPS = FPS;

export {Engine};