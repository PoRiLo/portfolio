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

  timeout = setTimeout(fRandomCamera(), 3000) 

  // To spice things a little, after every right answer there is a pause of 3 seconds and
  // the camera is sent to a different position and perspective
  function fRandomCamera() {
    var cam = new Camera({
      heading: Math.floor(Math.random() * 360),
      tilt: 70 - Math.floor(Math.random() * 50),
      position: {
        latitude: 90 - Math.floor(Math.random() * 180),
        longitude: Math.floor(Math.random() * 360) - 180,
        z: 5000 + Math.floor(Math.random() * 10000)
      }
    });
    mainView.goTo(cam);
  };
