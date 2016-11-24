import { fabric } from 'fabric';
import uuid from 'uuid-lib';
import FabricCanvas from './Fabric.vue';

/*
 * Extends Fabric Object initialization.
 *
 * Assigns a UUID to every `fabric.Object`: in this way Vue can always
 * recognize the same objects regardless of whence the canvas is being
 * updated.
 *
 * @return void
 */
const OLD_OBJECT_INIT = fabric.Object.prototype.initialize;

fabric.Object.prototype.initialize = function() {
  let args = Array.prototype.slice.call(arguments, 0);
  OLD_OBJECT_INIT.apply(this, args);

  if( !this.get('_uid') )
    this.set( '_uid', uuid.raw() );
}

/*
 * Extends Fabric Object serialization.
 *
 * Saves the `uid` property during object serialization.
 *
 * @return void
 */
const OLD_OBJECT_TOOBJECT = fabric.Object.prototype.toObject;

fabric.Object.prototype.toObject = function() {
  let args = Array.prototype.slice.call(arguments, 0),
      obj = OLD_OBJECT_TOOBJECT.apply(this, args);

  obj._uid = this._uid;
  
  return obj;
}

const VueFabric = {
  install(Vue,options) {
    Vue.prototype.$fabric = fabric;
    
    Vue.component( 'fabric-canvas', Vue.extend(FabricCanvas) );
  }
}

export default VueFabric;