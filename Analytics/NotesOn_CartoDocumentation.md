# Notes on CARTO Documentation

## Glossary

From [https://carto.com/help/glossary/](https://carto.com/help/glossary/)

* **.carto** - compressed file format, contains:
    * basemap
    * connected map layers
    * custom styling
    * analysis
    * widgets
    * legends
    * attributions
    * metadata
    * custom SQL queries
* **aggregations** - using one map symbol to represent multiple features
* **Airship** - design lib for building Location Intelligence apps
* **Anonymous Maps** - let you instantiate a map with private data
* **attributions** - data sources used in a map
* **Auth API** - CARTO auth
* **auto style** - builder widget feature enabling viewers to auto apply styles to map with a toggle button; purpose is to temporarily highlight your selected widget results using cartography
* **basemap** - image tiles that render the map background
* **Batch Queries** - method for requesting long running queries via the SQL API
* **blend modes** - style the way colors of overlapping geometries interact
* **booelan** - `true` or `false`
* **buckets** - groupings for interval or greater data
* **buffer** - area covering all points within a given distance
* **Builder** - CARTO's drag and drop analysis tool, replaced Editor.
* **CARTO dashboard** - login landing page
* **CARTO On-Premises** - local install of CARTO
* **CARTO Solution** - web app that combines data streams and applies analyses
* **CARTO VL** - JS lib for the CARTO APIs that builds custom maps leveraging vector rendering
* **CARTO.js** - JS lib for the CARTO APIs; part of CARTO Engine ecosystem
* **CARTOcolors** - Custom color schemes with some web based enhancements
* **CartoCSS** - style sheets for maps; can be applied via the STYLE tab of a map layer, or via CARTO.js and the Maps API
* **`cartodb_id`** - Primary key of any CARTO dataset
* **CARTOframes** - Python package for integrating CARTO maps, analysis, and data services into data science workflows
* **category** - Categorical data buckets for styling
* **category widget** - In Builder, they filter by selected string columns
* **centroid** - geometric center of one or a group of features
* **choropleth map** - thematic map using colored, shaded, or patterned regions
* **classification methods** - grouping functions for bucketing
* **cluster** - group of points with similar attributes or coordinates
* **ColorBrewer** - collection of standard color schemes in Builder and TurboCARTO
* **credits** - some sort of API call limiter
* **Data Library** - public data libs available in CARTO
* **Data Observatory** - access for enterprise accounts to a set of curated datasets
* **Data Services API** - location based services for customizing subsets of data for visualization
* **data source** - original source of the data from a layer
    * in Builder, this is an analysis layer node or a dataset
    * in CARTO.js and CARTO VL, a dataset or SQL query
    * in CARTOframes, dataframes or other Python objects
* **data type** - auto assigned data type given on upload to CARTO
* **database** - PostgreSQL / PostGIS behind the scenes
* **database connector** - The Import API can be used to connect to an external database that then caches into a CARTO table
* **dataset** - single database table with geographic and thematic information
* **dataview** - in CARTO.js, they're a way to extract data from a source
* **decimal degrees** - lat/lon geo coordinates as decimal fractions
* **Editor** - the old web-based visualization interface
* **embed map** - CARTO map that can be embedded into an HTML element
* **Engine** - open source tool that lets you use APIs to build 'advanced, dynamic geospatial datasets and scalable maps'
* **equal intervals** - bucketing scheme with evenly sized buckets
* **event** - JS events
* **expression** - CARTO VL expressions are building blocks for CARTO VL styling and dataview-like functionality
* **feature** - single element on a map representing a row in a dataset
* **field** - data container, usually refers to a column in a database or a field in a data entry form
* **filtering** - conditional display of data or features
* **formula widget** - in Builder, calculates aggregated values from numeric columns
* **geocoding** - match data to map geometries
* **GeoJSON** - open JSON standard for geodata
* **geometry** - point/line/polygon, etc.
* **Geopackage** - GPKG, open data format implemented in SQLite
* **heads/tails** - classification method best for data with heavy-tailed distributions. Done by dividing values into large (head) and small (tail) around the arithmetic mean. Division repeats continuously until the specified number of bins is met or there is only one remaining value. Helps reveal the underlying scaling pattern of far more small values than large ones.
* **heatmap** - In Builder, variation of a Torque map. Creates a map of point data by a slowly changing dimension of time. Can be static or animated. Greater color intensity indicates higher data density.
* **hexbins** - in Builder, when styling point geometries, ties styling to aggregated values. Useful for large datasets
* **histogram widget** - shows distribution of values
* **Import API** - allows upload, job status checks, and delete/list importing processes
* **interactivity** - behavior of features on click, hover, etc.
* **intersect** - analytical operation
* **isoline** - line on a map along which there is a constant value, like temp (isotherm), precipitation, travel time (isochrone), or distance (isodistance)
* **jenks** - classification method for natural breakpoints
* **join** - spatial join is a GIS op that adds data from one feature layer's attribute table to another, using spatial conditions
* **KML** - Keyhole Markup Language
* **labels** - text identifying a mpa feature
* **layer** - visual representation of the geographic and thematic info in a dataset
* **layer node** - in Builder, if you have an analysis workflow applied to your map layer (A, B, C, D), the analyzed data is included as a node (A1, A2, B1, B2, etc) within your data. You can chain several different analysis nodes to a single map layer.
* **layer selector** - in Builder, LAYER SELECTOR lets you display the visible layers on your map visualization. 
* **Leaflet** - CARTO.js has Leaflet integration libraries if you are mapping with CARTO Engine, to create overlays with images.
* **limit** - API call limits
* **map view** - viewer stats for web maps
* **MAPS API** - lets you generate maps based on data hosted in CARTO, and apply custom SQL and CartoCSS to the data
* **Mobile SDK** - maps for mobile
* **Named Maps** - same as Anonymous Maps except the MapConfig is stored on the server and the map is given a unique name
* **normalized data** - data on a standard scale
* **OGR/GDAL** - feature set manipulation libraries for vector/raster data
* **overviews** - data simplification layers at different zoom levels
* **proportional symbols** - symbols whose size is linked to an attribute
* **quantiles** - classification method good for linearly distributed data
* **quota** - API limits
* **ramp** - TurboCARTO expression for generating data driven gradients
* **raster tiles** - in Builder and CARTO.js, basemaps are tiled
* **routing** - point to point navigation on a network
* **shapefile** - ESRI file format
* **SQL API** - lets you interact with tables and data stored in CARTO
* **square aggregation** - aggregation method for point data that displays data aggregated in squares, based on an aggregation operation. Useful for large datasets.
* **static map/image** - can be generated with the Static Maps API in CARTO.js
* **stroke** - styling line weight
* **symbology** - graphic representing a map feature
* **Sync Tables** - store data from a remote file, refresh their contents periodically
* **the_geom** - default column name that CARTO uses to store geospatial data, in a dataset. Displays lat/long in a single projection. using WGS84
* **the_geom_webmercator** - stores data in web mercator
* **time series widget** - lets you set a temporal parameter on your data
* **Torque.js** - rendering method for data animation
* **TurboCARTO** - CartoCSS preprocessor for styling data-driven maps
* **variable** - CARTO VL variable is a named CARTO VL expression
* **vector tile** - packets of geodata
* **visualization** - Viz object in CARTO VL combines styling and dataview-like functionality
* **webmap** - map in a browser done with seamlessly joining tiles
* **widget** - dynamic filter in CARTO Builder. Embedded with your visualization, do not modify your original data.
* **WMS** - Web Map Service, standard protocol from Open Geospatial Consortium for serving georeferenced map images
* **WMTS** - Web Map Tile Service, standard protocol for serving pre-rendered or run-time generated georeferenced map tiles
* **zoom levels** - numeric values from 1 (global scale) to 18-20 (local scale) used in web mapping
