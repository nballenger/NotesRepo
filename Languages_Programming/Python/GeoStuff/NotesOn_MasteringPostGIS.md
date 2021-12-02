# Notes on Mastering PostGIS

By D. Mikiewicz, M. Mackiewicz, T. Nycz; Packt Publishing, May 2017

ISBN 9781784391645

# Importing Spatial Data

Focus of this chapter:

* Importing flat data via `psql` and `pgAdmin`, extracting spatial info from flat data
* Importing shapefiles with `shp2pgsql`
* Importing vector data with `ogr2ogr`
* Importing vector data with GIS clients
* Importing OpenStreetMap data
* Connecting to external data sources with data wrappers
* Loading rasters with `raster2pgsql`
* Importing data with `pgrestore`

## Obtaining Test Data

Datasources:

* Earthquakes (CSV/KML): https://earthquake.usgs.gov/earthquakes/map/
* UK Ordnance Survey sample data: https://www.ordnancesurvey.co.uk/business-and-government/licensing/sample-data/discover-data.html
    * AddressBase in CSV/GML
    * Code-point Polygons in SHP, TAB, MIF
    * Points of interest in TXT
* NaturalEarth: http://www.naturalearthdata.com/downloads/110m-physical-vectors/
    * 110M coastlines
    * 110M land
    * 50M gray earth

### Setting up the Database

* DB is named `mastering_postgis`, created from `postgis` template
* Examples import data into tables in the `data_import` schema
* Book examples are on port 5434, adjust as necessary

## Importing Flat Data

* Flat data has no explicitly expressed geometry
* Non-spatial format, text-based files

### Importing data using psql

* Will use a `\COPY` command
* Requires first defining a data model for the incoming datae

#### Importing data interactively

#### Importing data non-interactively

### Importing data using pgAdmin

### Extracting spatial info from flat data

## Importing shape files with shp2pgsql

### shp2pgsql in cmd

### The shp2pgsql GUI version

## Importing vector data with ogr2ogr

### Importing GML

### Importing MIF and TAB

### Importing KML

## Importing data using GIS clients

# Spatial Data Analysis

Focus of this chapter:

* Composing and decomposing geometries
* Spatial measurement
* Geometry bounding boxes
* Geometry simplification
* Geometry validation
* Intersecting geometries
* Nearest feature queries
