
define([
  'dojo/_base/declare', 
  'dojo/_base/lang',
  'dojo/dom',
  'jimu/BaseWidget',
  'esri/graphic',
  'esri/Color',
  'esri/symbols/SimpleMarkerSymbol'
], function(
  declare, lang, dom,
  BaseWidget,
  Graphic, Color, SimpleMarkerSymbol
) {
  return declare([BaseWidget], {
    baseClass: 'jimu-widget-addGraphic',
    name: 'addGraphic',
    symbol: null,

    postCreate: function() {
      this.symbol = new SimpleMarkerSymbol();
      this.symbol.setColor(new Color([168, 77, 168, 0.75]));
    },

    onOpen: function(){
      this.map.on('click', lang.hitch(this, function(evt) {
        if (dom.byId('activado').checked) {
          this.map.graphics.clear();
          var point = evt.mapPoint;
          var graphic = new Graphic(point, this.symbol);
          this.map.graphics.add(graphic)
          console.log(graphic.geometry)
        }
      }));
      this.map.graphics.show();
    },

    onClose: function(){
      this.map.graphics.hide();
    },
  });
});