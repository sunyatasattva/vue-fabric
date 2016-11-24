import fabricEvents from './fabricEvents';
import colonsToCamelCase from './colonsToCamelCase';
import debounce from 'lodash.debounce';

const eventRemap = function(canvas, component, events = fabricEvents) {
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
  const canvas = new fabric[namespace](component.$el);
    
  component.$canvas = canvas;

  eventRemap(canvas, component);

  canvas.loadFromJSON( component.value, canvas.renderAll.bind(canvas) );

  canvas.on('after:render', debounce(() => { component.syncCanvas(); }, 100) );
}

export default init;