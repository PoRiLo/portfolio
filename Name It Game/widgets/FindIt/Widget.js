///////////////////////////////////////////////////////////////////////////
// Widget Find It! 
// Creado para la prueba final de la materia 5, lección 4 del Master GIS
// Online de ESRI, 6a edición
// Marzo 2020 - Alumno: Rubén Dorado Sánchez-Castillo
///////////////////////////////////////////////////////////////////////////

define([
  'dojo/_base/declare', 
  'jimu/BaseWidget',
  'esri/layers/FeatureLayer',
  'esri/tasks/support/Query'
], function(
  declare, BaseWidget,
  FeatureLayer, Query
) {

  /*
  declarando variables globales
  */
  const lyrCountries = new FeatureLayer({  // Feature Layer de países
    url: 'https://services.arcgis.com/P3ePLMYs2RVChkJx/ArcGIS/rest/services/World_Countries_(Generalized)/FeatureServer/0',
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
  var countries = []; 

  
  return declare([BaseWidget], {
    //Please note that the widget depends on the 4.0 API !!

    baseClass: 'jimu-widget-FindIt',
    name: 'FindIt',

    postCreate: function() {
      this.sceneView.map.add(lyrCountries); // carga la capa de paises
    },

    onOpen: function() {
      // fijando la escena para que se pueda usar con el método on()
      let escena = this.sceneView;

      // lista de contenedores de la UI
      const divPaises = document.getElementById("listaPaises")
        .getElementsByTagName("DIV");

      // limpiando la capa de gráficos y haciendo visible la capa de países
      escena.graphics.removeAll();
      lyrCountries.visible = true;

      /* 
      Creando la lista de países a buscar
      Primero se definen las funciones necesarias
      */
      // elige un país al azar directamente desde la capa de países
      function pickRandomCountry() {
        const randomFID = Math.floor(Math.random()*249); // hay 249 países en la capa
        let query = lyrCountries.createQuery();
        query.where = 'FID = ' + randomFID;
        query.outFields = ["COUNTRY"];

        return lyrCountries.queryFeatures(query);
      }

      // determina el nombre del país y lo añade a la lista de países
      function nameRandomCountry(queryResponse) {
        let name = queryResponse.features[0].attributes.COUNTRY;
        countries.push(name);

        // Se busca el siguiente contenedor vacío en la lista de contenedores y se introduce el país
        for (const i in divPaises) {
          if (divPaises[i].innerHTML == "-") {
            divPaises[i].innerHTML = countries.length + ". " + name;
            break
          }
        }
      }

      // Se llama 4 veces a la función para crear la lista
      for (let i = 0; i < 4; i++) {
        pickRandomCountry().then(nameRandomCountry);
      }

      /*
      Creando las funciones para identificar los elementos clicados
      y actuar en consecuencia
      */
      // captura el gráfico del país clicado, comprueba si su nombre se halla 
      // en la lista y si es así lo resalta
      function checkCountry(hitTestResponse) {
        // Busca el país clicado y obtiene sus atributos
        let clickedCountry = hitTestResponse.results.filter(function(result) {
          return result.graphic.layer === lyrCountries;
        })[0].graphic; // captura el gráfico del país clicado
        clickedCountry.symbol = {
          type: 'simple-fill',  // autocasts as SimpleFillSymbol()
          color: [127, 255, 255, .20],
          style: 'solid',
          outline: {  // autocasts as new SimpleLineSymbol()
            color: [0, 255, 255, 1],
            width: 2
          }
        };

        // comprueba si el país clicado está en la lista, busca una 
        // concordancia y resalta el país en tal caso.
        let clickedCountryName = clickedCountry.attributes.COUNTRY;
        this.paisClicado.innerHTML = clickedCountryName;
        for (const c in countries) {
          if (countries[c] == clickedCountryName) {
            escena.graphics.add(clickedCountry);
            countries.splice(c, 1);  // eliminamos el elemento de la lista para evitar que se vuelva a seleccionar
            for (const i in divPaises) {  // busca el país en la UI y cambia el color
              if (divPaises[i].innerHTML == clickedCountryName) {
                divPaises[i].innerHTML = "-";
              }
            }
          }
        }
      }

      // registra el controlador del botón
      escena.on('click', function (event) {
        var foundIt = escena.hitTest(event).then(checkCountry); // si hay coincidencia devolverá un objeto Graphic(), si no queda undefined
      });
    },

    onClose: function() {
      this.sceneView.graphics.removeAll();
      lyrCountries.visible = false;
      countries = [];
      const divPaises = document.getElementById("listaPaises")
        .getElementsByTagName("DIV");
      for (const i in divPaises) {
        divPaises[i].innerHTML = "-";
      }
    },
  });
});