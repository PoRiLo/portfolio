/*
Prueba final de la lección M5 L3 - API de ArcGIS para JavaScript 
Creado con la versión 4.14 del API, presciendiendo de Dojo
Alumno: Rubén Dorado Sánchez-Castillo
*/

/*
Por legibilidad y claridad, he optado por crear la lista de módulos 
aparte y colocar la función que crea el mapa fuera de la función require
y llamarla desde allí. 
*/

// Definiendo variables globales
const modulos = [
  'esri/Map',
  'esri/views/MapView',
  'esri/layers/FeatureLayer',
  'esri/Graphic',
  'esri/views/draw/Draw',
  'esri/tasks/support/Query',
  'esri/widgets/Legend',
  'esri/widgets/Search',
  'esri/widgets/BasemapGallery',
  'esri/widgets/ScaleBar',
  'esri/widgets/Popup'
];
// URLs de las capas en el servicio de mapas
const UrlLyrCities = "https://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer/0";
const UrlLyrStates = "https://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer/2";

/*
Crea el mapa y la vista, es la función principal llamada desde require
*/
function mapBuilder(
  Map, MapView, FeatureLayer, 
  Graphic, Draw, Query,
  Legend, Search, BasemapGallery, ScaleBar, Popup
) {

  /*
  Controlador del botón Seleccionar ciudades
  Inicia la función Draw, se dibuja un polígono, lo almacena en el espacio
  de dibujo y selecciona los elementos solapados por su geometría
  */
  // Registrando el controlador del boton "Seleccionar ciudades"
  const btnPintaYQuery = document.getElementById('pintaYQuery');
  btnPintaYQuery.addEventListener('click', fPintaYQuery);

  // Inicia el dibujo del polígono
  function fPintaYQuery(){

    // Despeja el espacio de trabajo
    mainView.graphics.removeAll();

    // Inicia la herramienta de dibujo y crea una acción de dibujo de polígono
    var draw = new Draw({
      view: mainView
    });
    var action = draw.create('polygon', {mode: "click"});

    // llamada a la función que actualiza el polígono en pantalla al crear o eliminar vértices
    action.on([
      'vertex-add', 
      'vertex-remove', 
      'cursor-update'
    ], function(event) {
      createGraphic(event);
    });

    // al finalizar el polígono pasa el control a la función que realiza la consulta
    action.on([
      'draw-complete', 
    ], function(event) {
      poligono = createGraphic(event);
      consultaCiudades(poligono);
    });
  }

  // Esta es la función que realiza la consulta y la representa en pantalla
  function consultaCiudades(result) {

    var queryCities = lyrCities.createQuery();
    queryCities.geometry = result.geometry;
    queryCities.spatialRelationship = "contains";
    queryCities.returnGeometry = true;

    lyrCities.queryFeatures(queryCities)
    .then(function(results) {
      results.features.map(function(graphic) {
        graphic.symbol = {
          type: "simple-marker",
          style: "diamond",
          size: 9,
          color: "cyan"
        }
        mainView.graphics.add(graphic)
      });
    });
  }

  /*
  Actualiza la representación gráfica del poligono en el espacio de dibujo
  Es llamada cada vez que se crea o elimina un vertice durante el dibujo 
  del polígono al pulsar "Seleccionar Ciudades".
  Devuelve un objeto tipo Graphic
  */
  function createGraphic(event) {
    var vertices = event.vertices;

    // Despeja el espacio de trabajo
    mainView.graphics.removeAll();

    var graphic = new Graphic({
      geometry: {
        type: "polygon",
        rings: vertices,
        spatialReference: mainView.spatialReference
      },
      symbol: {
        type: "simple-fill",
        color: [100, 100, 200, .5],
        style: "solid",
        outline: {
          color: [25, 25, 50, 1],
          width: 2
        }
      }
    });
    
    mainView.graphics.add(graphic);

    return graphic;
  };

  /* 
  Controlador del botón Ir a estado
  */
  // Registrando el controlador del boton "Ir al estado"
  const btnProgButtonNode = document.getElementById('progButtonNode');
  btnProgButtonNode.addEventListener('click', function() {
    fQueryEstados().then(displayEstado);
  });

  // primera parte del controlador: consulta a la feature layer
  // la función devuelve un objeto tipo Feature Set
  function fQueryEstados(){
    // captura el nombre del estado de la caja de texto
    const estado = document.getElementById('dtb').value;

    var queryStates = lyrStates.createQuery();
    queryStates.where = "STATE_NAME = '" + estado + "'";
    queryStates.returnGeometry = true;

    return lyrStates.queryFeatures(queryStates);
  }

  // Segunda parte del controlador: dibujar los elementos y centrar la vista
  // la función toma un objeto Feature Set y lo dibuja en el espacio de 
  // dibujo de la vista
  function displayEstado(result) {
    mainView.graphics.removeAll();

    var feature = result.features.map(function(graphic) {
      graphic.symbol = {
        type: "simple-fill",
        color: [0, 0, 255, 0.25],
        style: "solid",
        outline: {
          color: [55, 40, 40, 1],
          width: 2
        }
      }
      return graphic;
    });
  
    mainView.graphics.addMany(feature);

    // centra la vista en el Estado seleccionado
    mainView.goTo(result.features);
  }


  /*
  Creando el mapa
  */
  var mainMap = new Map({
    basemap: 'topo'
  });

  // Cargando las capas del servicio de mapas
  var lyrStates = new FeatureLayer({
    url: UrlLyrStates,
    renderer: {
      type: "simple",
      symbol: {
        type: "simple-fill",
        color: [ 255, 128, 0, 0.25 ],
        outline: {
          width: 2,
          color: "black"
        }
      }
    }
  });
  var lyrCities = new FeatureLayer({
    url: UrlLyrCities,
    renderer: {
      type: "simple",
      symbol: {
        type: "simple-marker",
        size: 6,
        color: "yellow"
      }
    }
  });
  mainMap.add(lyrStates);
  mainMap.add(lyrCities);


  /* 
  Creando la vista de mapa
  */
  var mainView = new MapView({
    container: 'map',
    map: mainMap
  });

  // centrando la vista en la extensión de las capas
  lyrStates.queryExtent().then(function(results){
    mainView.goTo(results.extent);
  });


  // Creando la leyenda
  var legend = new Legend({
    view: mainView,
    container: legendDiv
  });


  // Añadiendo el widget de búsqueda
  var searchWidget = new Search({
    view: mainView,
    container: searchDiv
  });


  // Añadiendo el widget de selección de mapa base
  var basemapWidget = new BasemapGallery({
    view: mainView,
    label: 'Mapa base'
  })
  mainView.ui.add(basemapWidget, {
    position: 'top-right'
  });


  // Añadiendo el widget de barra de escala
  var scaleBar = new ScaleBar({
    view: mainView,
    style: 'ruler',
    unit: 'metric'
  });
  mainView.ui.add(scaleBar, {
    position: 'bottom-right'
  });


  // Añadiendo el widget Popup que soporta la acción de la tarea Identify
  var popup = {
    title: "Estado: {STATE_NAME}",
    content: [
      {
        type: "fields",
        fieldInfos: [
          {
            fieldName: "POP2000",
            label: "Población"
          },
          {
            fieldName: "POP00_SQMI",
            label: "Población por milla cuadrada"
          },
          {
            fieldName: "ss6.gdb.States.area",
            label: "Área"
          },
        ]
      }
    ],
    autoCloseEnabled: true
  };
  lyrStates.popupTemplate = popup
};


/*
Llamada a la función require que construye el mapa
*/
require(modulos, mapBuilder);