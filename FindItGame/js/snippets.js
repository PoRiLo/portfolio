    mainView.whenLayerView(lyrCountries).then(function(layerView){
      return layerView.queryFeatureCount()
    }).then(function(count){
      console.log("total number of client-side graphics: " + count);  // prints the total number of client-side graphics to the console
    });


  // choosing a random country from the Feature Layer
  function pickRandomCountry() {
    let randomFID = Math.floor(Math.random()*249); // there are 249 countries in the Feature Layer
    let query = lyrCountries.createQuery();
    query.where = 'FID = ' + randomFID;
    query.outFields = ["COUNTRY"];
    
    return lyrCountries.queryFeatures(query);
  };


  // extracting the chosen country name 
  function nameRandomCountry(queryResponse) {
    let name = queryResponse.features[0].attributes.COUNTRY;
    countriesQuest.push(name);
    divQuest.textContent = "Find " + countriesQuest[countriesQuest.length - 1];
    console.log(countriesQuest);
  };


// https://developers.arcgis.com/javascript/latest/sample-code/featurelayerview-query/

