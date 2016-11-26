<template>
  <div id="app">
    <fabric-canvas 
      ref="canvas"
      v-model="canvas"
      @objectModified="fabricObjectModified">
    </fabric-canvas>
    <ol>
      <li v-for="object in canvas.objects">
        <b><input type="text" v-model="object.fill"></b>
        <input type="number" v-model="object.scaleX">
      </li>
    </ol>
  </div>
</template>

<script>
let fixture = { canvas: {"objects":[{"type":"rect","originX":"left","originY":"top","left":114,"top":87,"width":20,"height":20,"fill":"red","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeLineJoin":"miter","strokeMiterLimit":10,"scaleX":1,"scaleY":1,"angle":45,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","globalCompositeOperation":"source-over","transformMatrix":null,"skewX":0,"skewY":0,"rx":0,"ry":0},{"type":"rect","originX":"left","originY":"top","left":200,"top":100,"width":20,"height":20,"fill":"green","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeLineJoin":"miter","strokeMiterLimit":10,"scaleX":1,"scaleY":1,"angle":45,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","globalCompositeOperation":"source-over","transformMatrix":null,"skewX":0,"skewY":0,"rx":0,"ry":0}],"background":""}, meta: {}};

export default {
  name: 'app',
  data() {
    return {
      state: fixture
    }
  },
  computed: {
    activeObject() {
      return this.state.canvas.objects.find((object) => {
        return object._uid === this.state.meta.activeObject;
      });
    }
  },
  methods: {
    fabricObjectModified(obj) {
      console.log('I am catching this event!', obj);
      console.log(this);
    }
  }
}
</script>
