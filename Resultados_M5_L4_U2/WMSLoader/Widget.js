/*
M5 L4 U2 - Ejercicio 2.3 - Desarrollo de un widget: WMS Loader
Alumno: Rubén Dorado Sánchez-Castillo
*/

define([
  'dojo/_base/declare', 
  'jimu/BaseWidget', 
  'esri/layers/WMSLayer', 
  'esri/layers/WMSLayerInfo', 
  'esri/geometry/Extent'
], function(
  declare, 
  BaseWidget, 
  WMSLayer, 
  WMSLayerInfo, 
  Extent
) {
  return declare([BaseWidget], {

    baseClass: 'jimu-widget-WMSLoader',
    name: 'WMSLoader',

    addWMS: function() {
      if (this.wmsTextBox.value != '') {
        var layerInfo = new WMSLayerInfo({
          name: this.config.nombre_capa,
          title: this.config.titulo_capa
        });
        var resourceInfo = {
          extent: new Extent(-100, 40, -100, 40, {wkid: 4326}),
          layerInfos: [layerInfo]
        };
        var wmsLayer = new WMSLayer(this.wmsTextBox.value, {
          resourceInfo: resourceInfo,
          visibleLayers: [this.config.nombre_capa]
        });
        this.map.addLayer(wmsLayer);
      }
    },
  });
});