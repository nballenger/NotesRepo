# Notes on Learning Geospatial Analysis with Python, 2nd Ed.

By Joel Lawhead, Packt Publishing 2015

ISBN 978-1-78355-242-9

## Preface

* Book is going to use pure python 3
* Effort made to use no dependencies whenever possible
* Requirements are python 3.4 or higher

## Chapter 1: Learning Geospatial Analysis with Python

### Common vector GIS concepts

* Vector data is x/y/z, with ancillary metadata
* Points combined to form lines and polygons to model objects
* Vector data has higher accuracy potential than raster
* Bounding box or min. bounding box is smallest rectangle capable of containing an entire set of points
* Convex hull is the smallest polygon capable of same
* Buffers can be established around any point/line/polygon
* Adjacent polygons can be combined via a dissolve operation
* Complex polygons can be simplified to a smaller point set by generalizing
* Polygons and lines can be intersected for analysis
* Sets can be merged to combine non-overlapping shapes
* Important operation is point-in-polygon, for determining whether a point falls within a specified polygon
* You can do point in polygon with ray casting--take a point, test for whether it's on the polygon boundary, if not draw a ray in any direction and count the overlaps with the boundary. Odd number, inside, even number outside.
* Union combines overlapping polygons
* Joins can be done based on spatial features
* Rules about polygons for geospatial:
    * Must have at least four points
    * First and last points must be the same
    * Boundary should not overlap itself
    * Polygons in a layer should not overlap
    * A polygon in a layer inside another polygon is a hole in the outer

### Common raster data concepts

* Band math operations are done on matrices of raster data
* Change detection is looking at two different rasters of the same area and looking for changes
* Histograms give statistical breakdown of a raster
* Feature extraction is pulling vector data from a raster
* Supervised classification can locate classes of bands
* Unsupervised classification groups pixels without outside reference info

## Chapter 2: Geospatial Data

## Chapter 3: The Geospatial Technology Landscape

* Libraries can be assigned to one or more of these high level capabilities:
    * Data access
    * Computational geometry / data reprojection
    * Visualization
    * Metadata tools
* There are a small number of root libraries that do a lot of the work
* GDAL, OGR, PROJ.4, GEOS are probably the biggest
* They're all C or C++ for speed

### Data Access

* Geospatial datasets are generally quite large and complex
* Libraries have to be extremely efficient

#### GDAL

* Stands for Geospatial Data Abstraction Library
* Has a single, abstract data model for raster data types
* Consolidates unique data access libraries for different formats, makes a common API for reading and writing data
* Summary of raster abstraction:
    * GDAL Dataset
        * GDAL Rasterband (part of Overviews)
            * Raster (0-n bands): Width pixels, Height lines
            * Data type: Byte, UInt16, Int16, UInt32, Int32, Float32, Float64, CInt16, CInt32CFloat32, Cfloat64
            * Block size: data chunk read size
        * Projection
            * Coordinate system
            * Georeferencing: affine geo transform, ground control points
        * Metadata
            * Arbitrary tagging system
        * Overviews
            * Freestanding bands with reduced resolution
            * 0-n overview bands

#### OGR

* OGR Simple Features Library does vector data work
* GDAL/OGR can be included in proprietary software without source code release
* Capabilities:
    * Uniform vector data and modeling abstraction
    * Vector data re-projection
    * Vector data format conversion
    * Attribute data filtering
    * Basic geometry filtering including clipping and point-in-polygon testing
* Architecture portions:
    * Geometry
    * Feature definition
    * Feature
    * Spatial reference
    * Layer
    * Data source
    * Drivers
* Can represent 70+ data formats
* One quirk: Layer concept is used even for data formats with a single layer

### Computational Geometry

* Algorithms for vector operations
* Libraries here are the major packages for computational geometry algorithms

#### The PROJ.4 projection library

* Created by Jerry Evenden at USGS in the '90s
* Now a project of the Open Source Geospatial Foundation
* Transforms data among thousands of coordinate systems
* Provides a simple syntax for describing any projection
* Available through GDAL and OGR, but sometimes useful to access directly to work with individual points, since most libs that use it only let you reproject entire datasets

#### CGAL

* Computational Geometry Algorithms Library
* Open source, not specifically for geospatial work, but commonly used
* Often referenced as a source for proper algorithms

#### JTS

* Java Topology Suite, pure java computational geometry library

#### GEOS

* Geometry Engine, Open Source
* C++ port of JTS
* Most commonly used through other APIs
* Can be compiled with GDAL to give OGR all capabilities

#### PostGIS

* Most commonly used spatial database
* Basically a module on top of postgres, gets a bunch of power from GEOS
* Implements OGC Simple Features specification for SQL
* Provides computational geometry in the db
* Features:
    * Geo types like points, linestrings, polygons, multipoints, etc.
    * Spatial functions for deriving new geometries
    * Spatial measurements like perimeter, length, area
    * Spatial indexing using an R-Tree
    * Basic geospatial raster data type
    * Topology data types
    * US Geocoder based on TIGER census data
    * JSONB datatype for JSON and GeoJSON

#### SpatiaLite

* Extension for SQLite to do spatial data types and indexing
* Adds OGC Simple Features specification and map projections

#### Routing

* Niche area of computational geometry
* Contenders for this are Esri's Network Analyst and pgRouting for PostGIS
* pgRouting adds routing functionality to a geodatabase

### Desktop Tools (incl. visualization)

* Two categories of GUI tool:
    * geospatial viewers
    * geospatial analysis tools

#### Quantum GIS / QGIS

* Open source GIS
* Written in C++ using Qt
* Similar to commercial systems
* Modules can be written in Python
* Has a robust package management system
* Entire api available through `qgis.utils.iface`
* Based on GDAL/OGR, can use PostGIS

#### OpenEV

* Open source viewer for satellite images
* Uses GDAL and Python
* Very fast raster viewer, though also gives you all functions of GDAL/OGR and PROJ.4
* Can overlay vector data, supports some basic editing
* Built largely in python, has a python console

#### GRASS GIS

* Started by army corps of engineers in '82
* Built for UNIX
* Transferred to community development in 1995
* Can feel esoteric to modern GIS users
* Lots of specialized stuff built for it over the years, so it's still developed against and used
* QGIS can integrate with it and run GRASS functions
* GRASS gui is built with wxPython

#### uDig

* Java based GIS viewer, built on top of Eclipse IDE

#### gvSIG

* Java based desktop GIS, open source

#### OpenJUMP

* Java based desktop GIS (Java Unified Mapping Platform)

#### Google Earth

* Definitely a data viewer
* Consumes KML, Keyhole Markup Language

#### NASA World Wind

* Open source virtual global and geospatial viewer

#### ArcGIS

* Commercial products by ESRI

### Metadata Management

* OGC standard for metadata management is the Catalog Service for the Web (CSW)

#### GeoNetwork

* Open source, Java based catalog server for managing spatial data

#### CatMDEdit

* Java based metadata editor focused on the geospatial data from the National Geographic Institute of Spain and several collaborators

## Chapter 4: Geospatial Python Toolbox

### Installing third-party python modules

#### Installing GDAL 

* Basically just `brew install gdal`

### Python networking libraries for acquiring data

#### The Python urllib module
