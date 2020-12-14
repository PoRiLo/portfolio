    mainView.whenLayerView(lyrCountries).then(function(layerView){
      return layerView.queryFeatureCount()
    }).then(function(count){
      console.log("total number of client-side graphics: " + count);  // prints the total number of client-side graphics to the console
    });
