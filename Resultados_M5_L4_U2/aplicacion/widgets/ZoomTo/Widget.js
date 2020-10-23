define([
  'dojo/_base/declare', 
  'jimu/BaseWidget',
  'esri/geometry/Point',
  'dojo/dom',
  'dojo/on'
], function(
  declare, 
  BaseWidget,
  Point,
  dom,
  on
) {
  return declare([BaseWidget], {
    baseClass: 'jimu-widget-zoomTo',
    name: 'ZoomTo',

    onZoomClick: function() {
      var lat = dom.byId('latitud');
      var lon = dom.byId('longitud');
      var lvl = dom.byId('levelZoom');
      var punto = new Point(lon.value, lat.value);

      this.map.centerAndZoom(punto, lvl.value)
    }
  });
});