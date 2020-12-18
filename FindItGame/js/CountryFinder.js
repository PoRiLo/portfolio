/***********************************************************************
 *  ArcGIS API for JavaScrip v. 4.17                                   *
 *  Find The Country Game, personal project for fun and practice       *
 *  created on December 2020                                           *
 *  Author: Rubén Dorado Sánchez-Castillo                              *
 ***********************************************************************/

//modules called by the _require_ function
const modules = [
  'esri/Map',
  'esri/views/SceneView',
  'esri/Camera',
  'esri/layers/FeatureLayer',
  'esri/widgets/Fullscreen',
  'esri/widgets/Home'
];

// World Countries Feature Layer service from ESRI Living Atlas
lyrCountriesURL = 'https://services.arcgis.com/P3ePLMYs2RVChkJx/ArcGIS/rest/services/World_Countries_(Generalized)/FeatureServer/0';

// Initializing variables
var countryList = [];
var gameList = [];
var target = "";
var timer = 0;
var inGame = false;
var interval;

// Builder function, called from _require_
function mapBuilder(
  Map, SceneView, Camera, FeatureLayer, Fullscreen, Home
) {

  // assigning variables to HTML elements
  var btnOne = document.getElementById('Btn1');
  var btnTwo = document.getElementById('Btn2');
  var divTimer = document.getElementById('timerDiv');
  var divQuest = document.getElementById('questDiv');
  var divClicked = document.getElementById('clickedDiv');
  var divList = document.getElementById('listDiv');

  // button event handlers
  btnOne.addEventListener('click', fBtnOne);
  btnTwo.addEventListener('click', fBtnTwo);

  // Button one: If not inGame => sets inGame = true and creates a timer
  // If inGame => applies a penalty and chooses a new country
  function fBtnOne() {
    if (inGame) {
      timer -= 20;
      let missedCountry = target;
      fFindCountry(missedCountry);
      target = gameList.shift();
      divQuest.textContent = "Find " + target
    } else {
      inGame = true;
      timer = 180.0;
      btnOne.textContent = "Pass";
      btnTwo.textContent = "Give Up";
      divList.textContent = "Countries found so far:"
      divQuest.textContent = "Find " + target
      mainView.graphics.removeAll();  //clears the graphics layer
      lyrCountries.visible = true;
      gameList = countryList.slice();
      fShuffle(gameList);
      console.log(gameList);
      target = gameList.shift();
      divQuest.textContent = "Find " + target;
      interval = setInterval(fUpdateTimer, 100);  //starts the timer
    }
  }

  // Button two: If inGame => ends the game 
  // If not InGame => initiates/stops practice mode
  function fBtnTwo() {
    if (inGame) {
      fGameOver();
    } else {
      if (lyrCountries.visible) {
        divClicked.textContent = " ";
        btnTwo.textContent = "Practice";
        lyrCountries.visible = false;
      } else {
        mainView.graphics.removeAll();  //clears the graphics layer
        divList.textContent = ""
        btnTwo.textContent = "Stop";
        lyrCountries.visible = true;
        gameList = countryList.slice();
        fShuffle(gameList);
        console.log(gameList);
        target = gameList.shift();
        divQuest.textContent = "Find " + target;
      }
    }
  }

  // Called by setInterval, updates the timer
  function fUpdateTimer() {
    timer -= .1;
    divTimer.textContent = "Time left: " + Math.round(timer);
    if (timer <= 0) {
      fGameOver();
    };
  }

  // Events on Game Over
  function fGameOver() {
    clearInterval(interval);
    lyrCountries.visible = false;
    inGame = false;
    timer = 0;
    target = "";
    btnOne.textContent = "Start";
    btnTwo.textContent = "Practice";
    divQuest.textContent = " ";
    divTimer.textContent = "Game Over";
    divClicked.textContent = " ";
  }

  // Shuffles an array using the Fisher-Yates algorithm
  function fShuffle(array) {
    let m = array.length, t, i;
    while (m) {
      i = Math.floor(Math.random() * m--);
      t = array[m];
      array[m] = array[i];
      array[i] = t;
    }
    return array;
  }

  // On mouse click on a country, captures the graphic geometry, checks whether it is the 
  // right country and applies the appropriate actions
  function checkCountry(hitTestResponse) {
    
    // Looks for the clicked country and gets its attributes
    let clickedCountry = hitTestResponse.results[0].graphic; // captures the graphic
    
    clickedCountry.symbol = {
      type: 'simple-fill',  // autocasts as SimpleFillSymbol()
      color: [127, 255, 255, .20],
      style: 'solid',
      outline: {  // autocasts as new SimpleLineSymbol()
        color: [0, 255, 255, 1],
        width: 2
      }
    };

    // takes the name of the clicked Geometry() and displays it in clickedDiv
    // checks if it's the requested country and acts appropriately
    let clickedCountryName = clickedCountry.attributes.COUNTRY;
    divClicked.textContent = "You clicked on " + clickedCountryName;
    if (clickedCountryName == target) {
      mainView.graphics.add(clickedCountry);
      target = gameList.shift();
      divQuest.textContent = "Find " + target;
      if (inGame) {
        divList.innerHTML += "<p>" + clickedCountryName + "</p>";
        timer += 5;
      } else {
        timer -= 5;
      }
    }
  }

  // This function is called when the player pass on a country. It queries the view
  // for the country, takes the focus to the country and draws it in red.
  function fFindCountry(missedCountry) {
    let missGeom;
    let passSymbol = {
      type: 'simple-fill',
      color: [255, 80, 80, .20],
      style: 'solid',
      outline: {
        color: [255, 0, 0, 1],
        width: 2
      }
    };

    let query = lyrCountries.createQuery() 
    query.returnGeometry = true;
    query.where = "COUNTRY = '" + missedCountry + "'";

    lyrCountries.queryFeatures(query).then(function (results) {
      missGeom = results.features;
      missGeom.symbol = passSymbol;
      mainView.graphics.add(results.features);
      mainView.goTo(missGeom); // takes the camera focus to the country
    }).catch(function (error) {
      console.error("queryFeatures error: ", error);
    });
  }


  /*
   * Creating the Scene
   */
  // creating the Feature Layer object
  const lyrCountries = new FeatureLayer({
    url: lyrCountriesURL,
    outFields: ["*"],
    visible: false,
    renderer: {
      type: 'simple',  // autocasts as new SimpleRenderer()
      symbol: {
        type: 'simple-fill',  // autocasts as SimpleFillSymbol()
        style: 'none',
        outline: {  // autocasts as new SimpleLineSymbol()
          color: [127, 255, 127, 1],
          width: 2
        }
      }
    }
  });

  //Initializing the map
  var mainMap = new Map({
    layers: [lyrCountries],
    basemap: 'satellite'
  });

  // Create the SceneView
  var mainView = new SceneView({
    container: "viewDiv",
    map: mainMap,
    environment: {
      starsEnabled: true,
      atmosphereEnabled: true,
      background: {
        type: "color",
        color: "black"
      }
    }
  });

  // initializing widgets
  const fullScreen = new Fullscreen({
    view: mainView,
    container: document.createElement("div")
  });
  const widgHome = new Home({
    view: mainView,
    container: document.createElement("div")
  });

  // Adding widgets and HTML components to the UI
  mainView.ui.add([
    {
      component: "panelDiv",
      position: "top-right",
      index: 0
    }, {
      component: widgHome,
      position: "top-left",
      index: 0
    }, {
      component: fullScreen,
      position: "top-left",
      index: 1
    }
  ]);
  
  // creating the list of countries
  lyrCountries.queryFeatures().then(function (results) {
    results.features.forEach(function (result) {
      countryList.push(result.attributes.COUNTRY);
    });
  });

  // mouse event watcher, the hitTest returns a Graphic() object, else returns undefined
  mainView.on('click', function (event) {
    mainView.hitTest(event).then(
      checkCountry
    ).catch(function (error) {
          console.error("hitTest failed: possibly clicked out of a country. Can be ignored");
    });
  });
}

/*
Call to function _require_ to build the scene
*/
require(modules, mapBuilder);