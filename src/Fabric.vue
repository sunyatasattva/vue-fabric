<template>
  <canvas :id='id'></canvas>
</template>

<script>
import equal from 'deep-equal';
import canvasInit from './utils/canvasInit';
  
export default {
  name: 'fabric-canvas',
  props: {
    namespace: {
      type: String,
      default: 'Canvas'
    },
    value: {
      type: Object,
      default() { return {}; }
    },
    
    height: {
      type: Number,
      default: 800
    },
    width: {
      type: Number,
      default: 800
    }
  },
  data() {
    return {
      id: `fabric_canvas_${this._uid}`
    }
  },
  mounted() {
    canvasInit(this, this.namespace);
  },
  watch: {
    /*
     * Watches when the object representation of the canvas is changed.
     *
     * It checks if the current canvas and the new mutation are the same,
     * in that case, it doesn't change anything; otherwise, it reloads
     * the whole canvas.
     *
     * Also makes sure that the active object is always up to date.
     */
    value: {
      handler(val, old) {
        if( !equal(this.$canvas.toObject(), val.canvas) ) {
          this.$canvas.loadFromJSON( val.canvas, this.load );
        }
        else
          this.load();
      },
      deep: true
    }
  },
  methods: {
    /*
     * Loads and renders a canvas from an object representation of it.
     */
    load() {
      // Caches the currently active object if it still exists in the
      // new canvas.
      let oldActiveObject = this.$canvas.getObjects().find((obj) => {
        return obj._uid === this.value.meta.activeObject;
      });
      
      this.$canvas.renderAll.call(this.$canvas);
      if(oldActiveObject)
        this.$canvas.setActiveObject(oldActiveObject);
    },
    /*
     * Emits an `input` event with the new object representation of the canvas.
     */
    syncCanvas() {
      let canvasObj = this.$canvas.toObject(),
          activeObject = this.$canvas.getActiveObject()._uid || null;
      
      this.$emit('input', {
        canvas: canvasObj,
        meta: {
          activeObject: activeObject
        }
      });
    }
  }
}
</script>