# Notes on Geospatial Data and Analysis

By Bill Day, Jon Bruner, Aurelia Moser; O'Reilly Media, Inc, Feb. 2017

ISBN 9781491940556

# 1. An overview of geospatial analytics

* Has contextual roots in print cartography, contemporary development in defense applications, as the DoD has been the biggest consumer of geodata analytics.
* Additional driver has been telecom development. Esri is related to Ericsson in Sweden, and mobile devices yield a large amount of spatial data.
* Lots of other interest areas and drivers: fleet management, disaster recovery, climate change
* "The bottom line here is most often about control systems. Some 'thing' needs to be automated, and that automation process needs to be optimized. If that thing moves within the world, it generates geodata and must leverage spatial analytics."
* Whatever tool chain you use, geospatial work requires atypical data types, numerous layers of detail to process and visualize, and specialized algorithms.
* Sample of complexities in geospatial analysis:
    * Tiling rectangles for raster data
    * Overlays of vector graphics
    * Data sources may require statistical smoothing or interpolation
    * Some data sources have needle-in-haystack problems requiring sophisticated algorithms to identify points of interest, or locations that change drastically over time.
    * Other data sources give metadata for maps, but may provide conflicting info.
    * Data source formatting is a crazy jungle.
    * Data licensing is a pain.
    * Once you solve all that, you still have to have design, data visualization, interpretation, and storytelling skills.
* Historically SQL has been a bad tool for geo analysis, given the prevalence of extremely expensive operations like intersections of regions.
* Purpose built tools have cropped up, like PostGIS
* Even those have a hard time with geospatial big data
* What this report covers:
    * Low-scale commercial desktop GIS tools
    * Medium scale options like PostGIS and Lucene
    * Big data solutions like Hadoop
    * Open data from governments, NGOs, and private enterprises
    * How some of the largest consumers make use of geospatial data

# 2. Core Concepts: Key Issues and Extreme Overgeneralizations

## Sourcing Spatial Data and Global Information Systems

* GIS provides tools for "storing, processing, aggregating, analyzing, displaying, and visualizing spatial data, or any data that holds location information."
* Common mapping software by application type and focus
    * Backend / Database
        * PostGIS/PostgreSQL
        * MySQL + Spatial
        * IBM DB2
        * GSTiles
        * ArcGIS 
        * Oracle Spatial
    * Application Server
        * GeoServer
        * GeoWebCache
        * Tomcat
        * ArcGIS Server
        * Autodesk MapGuide
        * ERDAS APOLLO
        * Intergraph GeoMedia
    * Frontend / UI
        * OpenLayers
        * OpenStreetMap
        * Google Maps
        * Bing Maps
        * CARTO
        * Mapbox
        * GeoScore API
        * QGIS
        * ArcGIS Desktop
        * Google Earth
        * uDig
* "Among contemporary practitioners there's a clear preference for open source tools and an evolving disdain for their proprietary counterparts.

### Formats for Low-Scale Spatial Data

* Low-scale data may not be packaged in geospatial formats like shp, kml, gml.
* May show up as excel, csv, geojson, svg, or standard image formats, and even PDF
* The data may be sorted into broader categories of vector and raster
* Common raster formats:
    * Esri Grid
    * Binary
    * Geographic Tagged Image File Format (GeoTIFF)
    * JPEG 2000
    * ASCII
* Common Vector formats
    * shapefile (shp, shx, dbf)
    * Keyhole markup language (kml)
    * Geography Markup Language (gml)
    * Cartesian coordinate system (xyz)
    * File Geodatabase (gdb)
    * Personal Geodatabase (mdb)
    * OpenStreetMap (osm, pbf)
    * GeoJSON (geojson)
    
### Assessign and Transforming Spatial Data

* Begin by assessing the format of your data, consider the limitations of that format
* Having assessed it, you can do some exploratory map making, which will involve getting it into a format appropriate to your experience and tool chain
* "The developers of the Geospatial Data Abstraction Library maintain a simple but thorough table of outstanding vector formats in OGR, along with their requirements to compile and georeferencing capabilities. GDAL provides raster and, together with OGR, also vector data models that are loosely aligned with the OpenGIS Simple Features Reference Implementation spec (OGR stands for 'OpenGIS Reference')."
* More opaque geoformats like shapefiles can be queried with Spark packages like Spark-DBF, that queries database format files (.dbf) with SparkSQL.
* In general, the mapmaking process will have steps like:
    1. Collect data
    1. Consider data layers for number, type, complexity
    1. Develop questions, interrogate, and query data
    1. Prepare and clean data; georeference or geocode
    1. Analyze data--aggregate datasets, run regressions and statistical processes
    1. Design and deliver results in various formats (web maps, print maps, maps with design flourishes)

## Systems of Layers Plus Planes for Making Maps

* For paper mapping, collections would carry paired works: an atlas that showed landscapes and coordinates, and a gazetteer that provided points with standard naming, points of interest, version history, and semantic or relational context.
* The distinction has largely been lost in the move to digital mapping, but you still need contextual clarification of mapped information.
* "Well-structured maps provide multiple layers of contextual data, establishing the basic physical and political boundaries of our world usefully, without cluttering the interface. Good maps establish a visual hierarchy in conventions and context that help viewers prioritize their focus on a map and meaningfully appreciate the information layers."

### Tools for Adding Context to Spatial Datao

* "One might think of a gazetteer as a tool that applies encyclopedic context to geospatial visualizations."
* "However, what a gazetteer does is subtler than a simple mashup. [...] Gazetteers provide important metadata that supplements mapmaking, and they are the source of your modern web map layers, labels, and nuance that will underscore the type of context you communicate to your viewers."
* "In thinking about the requirements of a gazetteer, we begin to appreciate how geospatial visualization quickly outgrows small-scale tools"

### Layering in Maps

* Interactive maps that provide pan and zoom have to adjust considerably as the user interacts with them.
* Much of that adjustment must happen at the basemap layer
* In thematic maps the basemap is only the first layer, and gives context to the data layers applied above it
* Most geo apps require some kind of tiling and tessellation to coordinate features to a specific level of resolution
* Fast scrolling leads to delayed tile loading
* Architecture of a web map as designed by Beth Schecter of Maptime:
    * Basemap (lowest layer)
    * tile layer
    * UTF grid
    * vector layers

### Mapmaking tools

* There are numerous free tools for small scale point data
* Be cautious about relying on free services, as they can be removed without warning

### Unpacking Multilayered Maps


