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
  'esri/tasks/support/Query',
  'esri/widgets/Fullscreen',
  'esri/widgets/Home'
];

// World Countries Feature Layer service from ESRI Living Atlas
lyrCountriesURL = 'https://services.arcgis.com/P3ePLMYs2RVChkJx/ArcGIS/rest/services/World_Countries_(Generalized)/FeatureServer/0';

// Initializing variables
var countryList = [];
var gameList = [];
var target = [];
var timer = 0;
var inGame = false;
var interval;

// Builder function, called from _require_
function mapBuilder(
  Map, SceneView, Camera, FeatureLayer, Query, Fullscreen, Home
) {

  // assigning variables to HTML elements
  var btnOne = document.getElementById('Btn1');
  var btnTwo = document.getElementById('Btn2');
  var divTimer = document.getElementById('timerDiv');
  var divQuest = document.getElementById('questDiv');
  var divClicked = document.getElementById('clickedDiv');
  var divList = document.getElementById('listDiv');

  // button event handlers
  btnOne.addEventListener('click', fStartGame);
  btnTwo.addEventListener('click', fPassCountry);

  // Button one. Starts the game Sets inGame = true and initiates the timer
  function fStartGame() {
    if (inGame) {
      timer -= 20;
      target = gameList.shift();
      divQuest.textContent = "Find " + target
    } else {
      inGame = true;
      timer = 180.0;
      gameList = fShuffle(countryList);
      target = gameList.shift();
      btnOne.textContent = "Pass";
      btnTwo.textContent = "Give Up";
      divList.textContent = "Countries found so far:"
      divQuest.textContent = "Find " + target
      mainView.graphics.removeAll();  //clears the graphics layer
      lyrCountries.visible = true;  //makes the countries visible
      interval = setInterval(fUpdateTimer, 100);  //starts the timer
    }
  };

  // Pass button: dismisses a country and takes a penalty
  function fPassCountry() {
    if (inGame) {
      fGameOver();
    } else {
      mainView.graphics.removeAll();  //clears the graphics layer
      divList.textContent = "Countries found so far:"
      lyrCountries.visible = true;
    }
  };

  // Called by the timer function to update the timer
  function fUpdateTimer() {
    timer -= .1;
    divTimer.textContent = "Time left: " + Math.round(timer);
    if (timer <= 0) {
      fGameOver();
    };
  };

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
  };

  // Shuffles an array using the Fisher-Yates algorithm
  function fShuffle(array) {
    var m = array.length, t, i;
    while (m) {
      i = Math.floor(Math.random() * m--);
      t = array[m];
      array[m] = array[i];
      array[i] = t;
    }
    console.log("shuffled list: " + array);
    return array;
  };

  // On mouse click on a country, captures the graphic geometry, checks whether it is the 
  // right country and applies the appropriate actions
  function checkCountry(hitTestResponse) {
    
    // Looks for the clicked country and gets its attributes
    let clickedCountry = hitTestResponse.results.filter(function(result) {
      return result.graphic.layer === lyrCountries;
    })[0].graphic; // captures the graphic
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
    if (inGame) {
      if (clickedCountryName == target) {
        divList.innerHTML += "<p>" + clickedCountryName + "</p>";
        mainView.graphics.add(clickedCountry);
        timer += 5;
        mainView.goTo(clickedCountry); // takes the camera focus to the country
        target = gameList.shift();
        divQuest.textContent = "Find " + target;
      } else {
        timer -= 5;
      }
    }
  };


  /*
   * Creating the Scene
   */
  // creating the Feature Layer object
  const lyrCountries = new FeatureLayer({
    url: lyrCountriesURL,
    outFields: ["COUNTRY"],
    visible: true,
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
  
  // mouse event watcher
  mainView.on('click', function (event) {
    mainView.hitTest(event).then(checkCountry); // if there is a hit, it returns a Graphic() object, else returns undefined
  });

  // popupating the list of countries in startup by querying the feature layer view. 
  // Later on this list will be shuffled every time the button Start is pressed, that way 
  // we only need to execute the query on this instance
  mainView.whenLayerView(lyrCountries).then(function (layerView) {
    layerView.watch("updating", function (value) {
      if (!value) {
        // wait for the layer view to finish updating to query all the features available
        layerView.queryFeatures({
          outFields: ["COUNTRY"],
          orderByFields: ["FID"]
        }).then(function (results) {
          graphics = results.features;
          graphics.forEach(function (result, index) {
            let name = result.attributes.COUNTRY;
            countryList.push(name);
          });
        }).catch(function (error) {
          console.error("query failed: ", error);
        });
      }
    });
  });
  console.log(countryList);
};


/*
Call to function _require_ to build the scene
*/
require(modules, mapBuilder);