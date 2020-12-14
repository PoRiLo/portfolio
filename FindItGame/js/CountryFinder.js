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
  'esri/layers/FeatureLayer',
  'esri/tasks/support/Query',
  'esri/widgets/Fullscreen',
  'esri/widgets/Home'
];

// World Countries Feature Layer service from ESRI Living Atlas
lyrCountriesURL = 'https://services.arcgis.com/P3ePLMYs2RVChkJx/ArcGIS/rest/services/World_Countries_(Generalized)/FeatureServer/0';

// Initializing variables
var countries = [];
var timer = 0;
var inGame = false;
var interval;

// Builder function, called from _require_
function mapBuilder(
  Map, SceneView, FeatureLayer, Query, Fullscreen, Home
) {

  // assigning variables to HTML elements
  var btnStart = document.getElementById('startBtn');
  var btnPass = document.getElementById('passBtn');
  var divTimer = document.getElementById('timerDiv');
  var divQuest = document.getElementById('questDiv');
  var divClicked = document.getElementById('clickedDiv');
  var divList = document.getElementById('listDiv');

  // button event handlers
  btnStart.addEventListener('click', fStartGame);
  btnPass.addEventListener('click', fPassCountry);

  // Start game button. Sets inGame = true and initiates the timer
  function fStartGame() {
    if (inGame) {
      btnStart.textContent = "Start";
      fGameOver();
      return;
    };
    inGame = true;
    timer = 180.0;
    countries = [];
    btnStart.textContent = "Give up";
    btnPass.textContent = "Pass";
    divList.textContent = "Countries found so far:"
    mainView.graphics.removeAll();  //clears the graphics layer
    lyrCountries.visible = true;  //makes the countries visible
    pickRandomCountry().then(nameRandomCountry); //call to put a new random country in the search list
    interval = setInterval(fUpdateTimer, 100);  //starts the timer
  };

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
    countries.push(name);
    console.log(countries);
  };

  // Called by the timer function to update the timer
  function fUpdateTimer() {
    timer -= .1;
    divTimer.textContent = "Time left: " + Math.round(timer);
    divQuest.textContent = "Find " + countries[countries.length - 1]
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
    btnStart.textContent = "Start";
    btnPass.textContent = "Practice";
    divQuest.textContent = " ";
    divTimer.textContent = "Game Over";
    divClicked.textContent = " ";
  };

  // Pass button: dismisses a country and takes a penalty
  function fPassCountry() {
    if (inGame) {
      timer -= 20;
      pickRandomCountry().then(nameRandomCountry); //call to get a random country
    } else {
      mainView.graphics.removeAll();  //clears the graphics layer
      divList.textContent = "Countries found so far:"
      lyrCountries.visible = true;
    }
  };


  // On mouse click on a country, captures the graphic geopmetry, checks whether it is the 
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
      if (countries[countries.length - 1] == clickedCountryName) {
        divList.innerHTML += "<p>" + clickedCountryName + "</p>";
        mainView.graphics.add(clickedCountry);
        timer += 5;
        pickRandomCountry().then(nameRandomCountry); //call to get a new random country
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
  
  // mouse event watcher
  mainView.on('click', function (event) {
    mainView.hitTest(event).then(checkCountry); // if there is a hit, it returns a Graphic() object, else returns undefined
  });

};

/*
Call to function _require_ to build the scene
*/
require(modules, mapBuilder);