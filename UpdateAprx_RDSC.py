# coding: utf-8
"""
Master GIS Online ESRI 2019
Materia 3 Lección 2 Unidad 8 - Automatización de producción de mapas
Ejercicio 8 - Trabajar con el contenido de un proyecto en ArcGIS Pro con Python

Alumno: Rubén Dorado Sánchez-Castillo
"""

# Importing modules
import arcpy, arcpy.mp
print("Modulos importados\nIniciando variables")

# Creo una copia del proyecto y la defino como proyecto activo. Realizo esto al principio en lugar de al final
# del ejercicio ya que es una buena práctica el no alterar el proyecto original y trabajar sobre una copia
print('Copiando el proyecto')
original_project = arcpy.mp.ArcGISProject(r"C:\EsriTraining\PYTS\Map_production\CorvallisMeters.aprx")
original_project.saveACopy(r"C:\EsriTraining\PYTS\Map_production\CorvallisMeters_RDSC.aprx")
project = arcpy.mp.ArcGISProject(r"C:\EsriTraining\PYTS\Map_production\CorvallisMeters_RDSC.aprx")

# Añadiendo una capa al mapa
print('Añadiendo una capa al mapa')
map = project.listMaps()[0]
layer_to_add = arcpy.mp.LayerFile(r"C:\EsriTraining\PYTS\Map_production\Schools.lyrx")
map.addLayer(layer_to_add)

# Moviendo la capa Parkings sobre la capa Schools
print('Moviendo capas')
parkings_layer = map.listLayers("Park*")[0]
schools_layer = map.listLayers("Scho*")[0]
map.moveLayer(schools_layer, parkings_layer, "BEFORE")

# Actualizando elementos del Layout
print('Actualizando elementos del Layout')
layout = project.listLayouts()[0]
layout.name = 'Corvallis Meter Map'
elemList = layout.listElements('TEXT_ELEMENT')
for element in elemList:
    if element.text == 'Corvallis Meters':
        element.text = 'Corvallis Parking Meters Inventory Report'

# Guardando el proyecto
print('Guardando el proyecto')
project.save()

# Eliminando los objetos almacenados en las variables proyecto y capa ¿Por qué es esto necesario? No lo sé
print('Borrando las variables')
del project, map, parkings_layer, schools_layer, layout