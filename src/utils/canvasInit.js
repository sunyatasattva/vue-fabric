import getFabricEvents from './fabricEvents';
import colonsToCamelCase from './colonsToCamelCase';
import debounce from 'lodash.debounce';

/*
 * Remaps fabric events to component events.
 *
 * Fabric events come in comma separated strings, e.g. `object:added`,
 * instead, for consistency for the Vue ecosystem, we convert them to
 * camel case event names (e.g. `objectAdded`).
 *
 * @param  {fabric.Canvas}  canvas  The fabric canvas instance.
 * @param  {VueComponent}  component  The Vue component instance.
 * @param  {Array}  events  A list of strings of fabric event names.
 *
 * @return  void
 */
const eventRemap = function( canvas, component, events = getFabricEvents() ) {
  events.forEach((e) => {
    canvas.on(e, (opts) => {
      let eventName = colonsToCamelCase(e);
      component.$emit(eventName, opts);
    });
  });
}

/*
 * Initializes the Fabric canvas inside a Vue component.
 *
 * @param  {VueComponent}  component The Vue component instance.
 * @param  {String}  [namespace='Canvas']  The name of the canvas instance.
 * Useful if the original fabric Canvas class was extended by some other class.
 */
const init = function(component, namespace = 'Canvas') {
  const canvas = new fabric[namespace](component.$el, {
    // Disabling this for performance reason: we load the entire canvas
    // every time and perform the render manually instead
    renderOnAddRemove: false,
    width: component.width,
    height: component.height
  });
    
  component.$canvas = canvas;

  eventRemap(canvas, component);

  canvas.loadFromJSON( component.value.canvas, canvas.renderAll.bind(canvas) );

  canvas.on('after:render', debounce(() => { component.syncCanvas(); }, 100) );
}

export default init;