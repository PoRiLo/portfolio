# coding: utf-8
"""
Master GIS Online ESRI 2019
Materia 3 Lección 2 Unidad 6 - Validación de scripts
Ejercicio 6 - Añadir mensajes personalizados a una herramienta de geoprocesamiento

Alumno: Rubén Dorado Sánchez-Castillo
"""

import arcpy

class ToolValidator(object):
    """Class for validating a tool's parameter values and controlling
    the behavior of the tool's dialog."""

    def __init__(self):
        """Setup arcpy and the list of tool parameters.""" 
        self.params = arcpy.GetParameterInfo()

    def initializeParameters(self):
        """Refine the properties of a tool's parameters. This method is 
        called when the tool is opened."""

    def updateParameters(self):
        """Modify the values and properties of parameters before internal
        validation is performed. This method is called whenever a parameter
        has been changed."""

    def updateMessages(self):
        """Modify the messages created by internal validation for each tool
        parameter. This method is called after internal validation."""

        xyCount = arcpy.GetCount_management(self.params[0].value)
		
        if int(xyCount[0]) == 0:
            self.params[0].setErrorMessage("File has no rows. Please select a file with valid rows for tool to run correctly.")
        elif int(xyCount[0]) > 40:
            self.params[0].setWarningMessage("File has {} rows and may take an extended amount of time to process.".format(xyCount[0]))
        else:
            pass
			
    def isLicensed(self):
        """Set whether tool is licensed to execute."""
        return True