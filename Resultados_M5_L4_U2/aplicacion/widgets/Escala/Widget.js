define([
  'dojo/_base/declare',
  'dojo/_base/lang',
  'dojo/dom',
  'jimu/BaseWidget'
], function(
  declare, lang, dom,
  BaseWidget
) {
  return declare([BaseWidget], {

    baseClass: 'jimu-widget-escala',
    name: 'Escala',

    postCreate: function() {
      this.map.on('zoom-end', lang.hitch(this, function(evt){
        dom.byId('txtEscala').innerHTML = "Escala actual = 1:" + Math.round(this.map.getScale());
      }));
    },

    // startup: function() {
    //  this.inherited(arguments);
    //  this.mapIdNode.innerHTML = 'map id:' + this.map.id;
    //  console.log('startup');
    // },

    // onOpen: function(){
    //   console.log('onOpen');
    // },

    // onClose: function(){
    //   console.log('onClose');
    // },

    // onMinimize: function(){
    //   console.log('onMinimize');
    // },

    // onMaximize: function(){
    //   console.log('onMaximize');
    // },

    // onSignIn: function(credential){
    //   /* jshint unused:false*/
    //   console.log('onSignIn');
    // },

    // onSignOut: function(){
    //   console.log('onSignOut');
    // }

    // onPositionChange: function(){
    //   console.log('onPositionChange');
    // },

    // resize: function(){
    //   console.log('resize');
    // }

    //methods to communication between widgets:

  });
});