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

const init = function(component) {
  const canvas = new fabric.Canvas(component.$el);
    
  component.$canvas = canvas;

  eventRemap(canvas, component);

  canvas.loadFromJSON( component.value, canvas.renderAll.bind(canvas) );

  canvas.on('after:render', debounce(() => { component.syncCanvas(); }, 100) );
}

export default init;