/**
 * Copyright @ 2019 Esri.
 * All rights reserved under the copyright laws of the United States and applicable international laws, treaties, and conventions.
 */
define(["esri/core/declare","esri/core/Accessor","esri/core/Evented"],function(e,r,t){var a=e([r,t],{declaredClass:"esri.views.3d.effects.Materials",effectName:"Materials",getOldActiveUnit:function(e){return e._activeTextureUnit>e.parameters.maxVertexTextureImageUnits-1&&console.warn("Many textures are binded now, 3DFx lib may be work abnormally."),0}});return a});