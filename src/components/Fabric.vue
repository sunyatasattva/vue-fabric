<template>
  <div>
    <canvas id='c'></canvas>
    <h2 v-if="activeObject">Active object is {{activeObject.fill}}</h2>
    <h2 v-else>No active object</h2>
    <ul>
      <li v-for="object in value.objects"><b>{{object.fill}}:</b> {{object.scaleX}}</li>
    </ul>
  </div>
</template>

<script>
import { fabric } from 'fabric';
import debounce from 'lodash.debounce';
import equal from 'deep-equal';

let oldInit = fabric.Object.prototype.initialize;
let oldToObject = fabric.Object.prototype.toObject;
fabric.Object.prototype.initialize = function() {
  let args = Array.prototype.slice.call(arguments, 0);
  oldInit.apply(this, args);

  if( !this.get('_uid') )
    this.set('_uid', (new Date).getTime() + Math.floor(Math.random() * 1000000));
}

fabric.Object.prototype.toObject = function() {
  let args = Array.prototype.slice.call(arguments, 0);
  let obj = oldToObject.apply(this, args);

  obj._uid = this._uid;
  
  return obj;
}

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
//    const canvas = new fabric.Canvas(this.$el);
    const canvas = new fabric.Canvas('c');
    
    this.$canvas = canvas;
    
    canvas.loadFromJSON(this.value, canvas.renderAll.bind(canvas));
    
    canvas.on('after:render', debounce(() => { this.updateCanvas(); }, 100) );
  },
  updated() {
    console.log('DOM updated');
  },
  watch: {
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
    load() {
      let oldActiveObject = this.$canvas.getObjects().find((obj) => {
        return this.activeObject && obj._uid === this.activeObject._uid;
      });
      
      this.$canvas.renderAll.call(this.$canvas);
      if(oldActiveObject)
        this.$canvas.setActiveObject(oldActiveObject);
    },
    updateCanvas() {
      let canvasObj = this.$canvas.toObject();
      console.log(this.$canvas.getActiveGroup());
      
      this.$emit('input', canvasObj);
    }
  }
}
</script>