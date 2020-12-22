"""
Python snippets used for the End Of Master Project
Master GIS Online ESRI 6th Edition

Rubén Dorado Sánchez-Castillo
"""

import arcpy
import os
arcpy.env.workspace = "D:/MO_ArcGIS/M6 TPFM"
for file in workspace:
    arcpy.JSONToFeatures("myjsonfeatures.json", os.path.join("outgdb.gdb", "myfeatures"))


"""    
Capture the Features stored in the WFS service of the Dutch Cadastre Service.
"""
# Import arcpy module
import arcpy

# Set local variables
WFS_Service = "https://geodata.nationaalgeoregister.nl/inspire/ad/wfs?request=GetFeature&service=WFS&version=2.0.0&typeName=ad:Address&outputFormat=gml3"
WFS_FeatureType = "Address"
Out_Location = "D:\MO_ArcGIS\M6 TPFM\Data"
Out_Name = "Direcciones_WFS"

# Execute the WFSToFeatureClass tool
arcpy.WFSToFeatureClass_conversion(WFS_Service, WFS_FeatureType, Out_Location, Out_Name, True, 1000000, True, False)


"""
Capture the roads that are adequate for residue collection trucks within the target area, with a 500 m buffer to allow 
some flexibility in the route finding.
"""
# Import system modules
import arcpy

# Select all the roads which overlap the garbage management area polygon
milieuzone_roads = arcpy.SelectLayerByLocation_management('Viales_Clip',
                                    'WITHIN_A_DISTANCE',
                                    'milieuzones',
                                    500,
                                    'NEW_SELECTION',
                                    'NOT_INVERT')

# Within selected features, further select only those roads that can be used by
busqueda = "fclass = 'living_street' OR fclass = 'motorway' OR fclass = 'motorway_link' OR fclass = 'primary' OR fclass = 'primary_link' OR fclass = 'residential' OR fclass = 'secondary' OR fclass = 'secondary_link' OR fclass = 'service' OR fclass = 'tertiary' OR fclass = 'tertiary_link' OR fclass = 'trunk' OR fclass = 'trunk_link' OR fclass = 'unclassified'"
arcpy.SelectLayerByAttribute_management(milieuzone_roads,
                             'SUBSET_SELECTION',
                             busqueda)

# Write the selected features to a new featureclass
arcpy.CopyFeatures_management(milieuzone_roads, 'Callejero')



"""
The following script will stablish the listed datasets as versioned
"""

# Import system modules
import arcpy

# Set local variables
Connection = "X:/TPFM_RDSC/FicherosConexionGDB/Supervisor_0@AmsterdamMilieudienstGDB.sde/"
VerDatasets = ["Anidamientos",
               "Arboles",
               "Areas_caninas",
               "Bancos_Vondelpark",
               "Canchas_deportivas",
               "Fallopia_japonica",
               "Panales_polinizadoras",
               "Parques_deportivos",
               "Procesionaria",
               "Residuos_urbanos"]

# Execute RegisterAsVersioned
for dataset in VerDatasets:
    dataset_name = Connection + "amsterdammilieudienstgdb.supervisor_0." + dataset
    arcpy.AddGlobalIDs_management(dataset_name) # Required for breanched datasets
    arcpy.RegisterAsVersioned_management(dataset_name, "NO_EDITS_TO_BASE")



"""
Snippet para la introducción de valores aleatorios del campo 'Tratamientos' en la capa Arboles
En el campo Expression de la herramienta CalculateField se introduce la llamada a la función. El siguiente código se introduce en el Code Block
"""

from random import betavariate

def PopulateTratamientos():

    alfa = .25
    beta = 1
    aleatorio = betavariate(alfa, beta) # generates a random number in the (0, 1) interval following a beta distribution

    if aleatorio < .1:
        return 0
    elif aleatorio < .175:
        return 1
    elif aleatorio < .25:
        return 2
    elif aleatorio < .325:
        return 3
    elif aleatorio < .4:
        return 4
    elif aleatorio < .575:
        return 5
    elif aleatorio < .66:
        return 11
    elif aleatorio < .745:
        return 12
    elif aleatorio < .83:
        return 13
    elif aleatorio < .915:
        return 14
    else:
        return 15


"""
Snippet para la introducción de valores aleatorios del campo 'Podas' en la capa Arboles
En el campo Expression de la herramienta CalculateField se introduce la llamada a la función. El siguiente código se introduce en el Code Block
"""

from random import betavariate

def PopulatePodas():

    alfa = .25
    beta = 1
    aleatorio = betavariate(alfa, beta) # generates a random number in the (0, 1) interval following a beta distribution

    if aleatorio < .35:
        return 0
    elif aleatorio < .7:
        return 1
    else:
        return 2


"""
Snippet para la introducción de valores aleatorios del campo 'Tratamientos' en la capa Procesionaria
En el campo Expression de la herramienta CalculateField se introduce la llamada a la función. El siguiente código se introduce en el Code Block
"""

# Expression

PopulateProcesionaria(!jaar!, !plaagdruk!)

# Code block

from random import betavariate

def PopulateProcesionaria(jaar, plaagdruk):

    alfa = .25
    beta = 1
    aleatorio = betavariate(alfa, beta)

    if jaar == 2019:
        if plaagdruk == 'Hoog':
            if aleatorio < .65:
                return 1
            else:
                return 2
        elif plaagdruk == 'Matig':
            if aleatorio < .35:
                return 0
            elif aleatorio < .8:
                return 1
            else:
                return 2
        else:
            return 0
    else:
        return 0

"""
Snippet para la introducción de valores aleatorios del campo 'Mantemiento' en la capa Areas_caninas
En el campo Expression de la herramienta CalculateField se introduce la llamada a la función. El siguiente código se introduce en el Code Block
"""

# Expression

PopulateDogs()

# Code block

from random import betavariate

def PopulateDogs():

    alfa = .25
    beta = 1
    aleatorio = betavariate(alfa, beta)

    if aleatorio < .667:
        return 0
    elif aleatorio < .8:
        return 1
    else:
        return 2


"""
Snippet para la introducción de valores aleatorios del campo 'recogida' en la capa Contenedores_compostaje
En el campo Expression de la herramienta CalculateField se introduce la llamada a la función. El siguiente código se introduce en el Code Block
"""

# Expression

PopulateCompost(!active!)

# Code block

from random import betavariate

def PopulateCompost(active):

    alfa = .25
    beta = 1
    aleatorio = betavariate(alfa, beta)

    if active == 1:
        if aleatorio < .5:
            return 0
        elif aleatorio < .75:
            return 1
        else:
            return 2
