<template>
  <canvas :id='id'></canvas>
</template>

<script>
import { fabric } from 'fabric';
import equal from 'deep-equal';
import canvasInit from './utils/canvasInit';
  
export default {
  name: 'fabric-canvas',
  props: {
    value: {
      type: Object,
      default() { return {}; }
    }
  },
  data() {
    return {
      activeObject: null,
      canvas: {},
      id: `fabric_canvas_${this._uid}`
    }
  },
  mounted() {
    canvasInit(this);
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
        this.activeObject = this.$canvas.getActiveObject();
        if( !equal(this.$canvas.toObject(), val) ) {
          this.$canvas.loadFromJSON( val, this.load );
        }
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
        return this.activeObject && obj._uid === this.activeObject._uid;
      });
      
      this.$canvas.renderAll.call(this.$canvas);
      if(oldActiveObject)
        this.$canvas.setActiveObject(oldActiveObject);
    },
    /*
     * Emits an `input` event with the new object representation of the canvas.
     */
    syncCanvas() {
      let canvasObj = this.$canvas.toObject();
      
      this.$emit('input', canvasObj);
    }
  }
}
</script>