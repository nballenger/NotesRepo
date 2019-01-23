# Notes on Learning Geospatial Analysis with Python, 2nd Ed.

By Joel Lawhead, Packt Publishing, Dec. 2015; ISBN 9781783552429

# Chapter 1: Learning Geospatial Analysis with Python

## GIS concepts

* Thematic maps - portray a specific theme
    * Minimal geographic features to avoid distracting from the theme
    * Mostly include political boundaries but avoid navigational marks
    * Use landmarks to orient the reader
    * Common uses:
        * Visualizaing health issues
        * Election results
        * Environmental phenomena
    * Tell a story, serve a purpose
    * Still only models / narratives about reality
* Spatial databases
    * Organized collection of information
    * May be a DBMS, or not
    * Most DBMS's typically contain scalar and blob data
    * Spatial / geodatabases extend RDBMSs to store / query data in two or three dimensional space
    * Some account for time series data as well
* Spatial indexing
    * Organizing geospatial data for faster retrieval
* Metadata
    * Provides traceability for source and history of datasets
    * Summarizes technical details of the dataset
    * Several possible standards:
        * ISO 19115-1, which gives hundreds of fields to describe a geospatial dataset
        * ISO 19115-2 gives extensions for imagery and gridded data
    * Example fields:
        * spatial representation
        * temporal extent
        * lineage
    * Open Geospatial Consortium (OGC) created the Catalog Service for the Web (CSW) to manage metadata
    * `pycsw` library implements the CSW standard
* Map projections
    * Basic problem is always 3D projected onto 2D
    * Choice is always a compromise about what to preserve and what to give up
    * Projections are typically a set of 40+ parameters
    * Format is either XML or Well-Known-Text (WKT), that defines the transform
    * Intl. Association of Oil and Gas Producers (IOGP) maintains a registry of most common projections
    * That was formerly European Petroleum Survey Group (EPSG)
    * Entries are still called EPSG codes
    * 5000 plus entries in the registry
    * Previously projections were a huge hassle in terms of data storage and maintenance
    * Many data formats for geospatial don't actually include the projection info, so it has to be in metadata, which is risky from a management perspective
    * Thankfully high speed transfer and cheap storage addresses a lot of that
    * Most data formats now have metadata formats defining projection, or it lives in the file header
    * There are global basemaps, that give you common projections like Google Mercator/Web Mercator
    * Web Mercator is EPSG:3857 (or deprecated EPSG:900913)
    * Modern software can often reproject on the fly
    * Closely related issue: geodetic datums
    * A datum is a model of the earth's surface that matches the location of features on Earth to a coordinate system. Most common is probably WGS 84, used by GPS devices
* Rendering
    * Geodata vector data exists as 2- or 3-tuples of (x,y[,z])
    * Geodata is stored in a coordinate system representing a grid overlaid on the earth (3 dimensional)
    * Screen coordinates / pixel coordinates are a 2d grid
    * XY world coordinates map to pixel coordinates pretty simply by a scaling algorithm
    * The z coordinate has to go through a transform to be mapped onto the 2d plane
    * For remote sensing / raster data, challenge is file size and compression
    * Lossless compression is possible, though rendering is still computationally expensive

## Remote Sensing Concepts

* Sources of raster geodata can include ground based radar, laser range finders, specialized devices and detectors for gas, radiation, EM, etc.
* For purposes of this text, looking at remote sensing platforms that capture large amounts of Earth data, including Earth imaging systems, some elevation data, and some weather systems
* Images as data
    * Raster data is captured as square tiles
    * If it's multi-spectral, it will contain multiple bands in arrays
    * An array item in one of these 2d arrays represents both space and some other value, reflectance or whatever
* Remote sensing and color
    * Visible light data in RGB can be captured and displayed per pixel
    * Non-visible EM can be shown in false color

## Common vector GIS concepts

* Data structures
    * Vector data has at minimum x/y values per point, sometimes a z value
    * Coordinates are combined to form points, lines, and polygons
    * Typically represents elevation better than raster data
    * It's more costly to collect than raster data
    * Two important concepts for vector data structures:
        * Bounding box / min bounding box - smallest rectangle bounding all points in a set
        * Convex hull - smallest convex polygon bounding all points in a set
    * the bounding box always contains the convex hull
* Buffer
    * Buffer operations can apply to points, lines, and polygons
    * Buffers create a polygon around the original object at a fixed distance
    * Buffers are used for proximity analysis
* Dissolve
    * Creating one polygon out of two or more adjacent ones
* Generalize
    * Reducing the number of points being used to define an object, for efficiency
* Intersect
    * Discover whether one part of a feature intersects with one or more additional features
* Merge
    * Combines two or more non-overlapping shapes into a multishape object
    * Multishape objects maintain separate geometries but are treated as a single feature with a single attribute set
* Point in Polygon
    * Check to see whether a point falls inside or outside a given polygon
    * Most commonly done with ray casting
        * Check to see if the point is on the polygon boundary
        * Draw a line from the point in a single direction
        * Count the number of times the line crosses the polygon boundary until it reaches the bounding box of the polygon
        * If the number is odd, the point is inside, if even, the point is outside
* Union
    * Combine two or more overlapping polygons in a single shape
* Join
    * SQL join, combines tabular data
    * Spatial join defined by a spatial db extension will combine features similar to an SQL join, but does so based on feature proximity. For instance, you could derive county name from features inside a county.
* Geospatial rules about polygons
    * These are rules of thumb about how geospatial polygons differ from mathematical polygons:
        * Polygons must have at least four points, first and last must be the same
        * A polygon boundary should not overlap itself
        * Polygons in a data layer should not overlap
        * A polygon in a layer inside another polygon is a hole in the underlying polygon
    * Different geospatial software resolves those rules differently
    * Best practice is to make sure your polygons obey those rules
    * By definition a polygon is a closed shape. Some software will error if you haven't explicitly duplicated the first point as the last point in the polygon's dataset, some will close it automatically without complaining. 
    * How the polygon is defined is dictated by the data format

## Common raster data concepts

* Band math
    * Multidimensional array math, typically matrix ops from linear algebra
* Change detection
    * Highlight changes between images taken at different times
* Histogram
    * Statistical distribution of values in the dataset
    * Used for analysis and operations like contrast increases
* Feature extraction
    * Manual or automatic digitization of features in an image to form vector data
* Supervised classification
* Unsupervised classification

## Creating the simplest possible Python GIS

# Chapter 2: Geospatial Data

## Overview of common data formats

* Typical data sources may be:
    * Spreadsheets, CSV, TSV
    * Geotagged photos
    * Lightweight binary points, lines, polygons
    * Multi-GB satellite or aerial rasters
    * Elevation data like grids, point clouds, integer based images
    * XML
    * JSON
    * Databases
    * Web services
* Before 2004 it was hard to get geodata
* Then Google Maps and Google Earth came out, Microsoft launced TerraServer, and Open Geospatial Consortium developed Web Map Service to 1.3.0. 
* Esri also released v9 of ArcGIS server
* These all drove things towards common basemaps and Googles web map tiling model
* Gmaps was served dynamically with AJAX, and scaled really solidly
* Also offered people the ability to mashup data with an API
* There are distributed geospatial layers like OpenLayers, that gives an API richer than Gmaps
* Complimentary to that is OpenStreetMap, which has global, street-level vector data
* Incentives changed, siloed data started opening up some
* Analysts benefited:
    * Data distribution started being standardized to Mercator
    * Google standardized datum on WGS 84, as does GPS

## Data structures

* Common traits of geodata across formats
    * Geolocation
    * Subject information

## Spatial indexing

* Indexing algorithms
    * Quadtree index
        * series of different algorithms based on a common theme
        * Each node in the index has four children
        * Child nodes are typically square or rectangular
        * When a node contains a specified number of features, it splits if additional features are added
        * Dividing space into nested squares speeds up spatial search
        * Software only has to handle five points at a time and use gt/lt comparisons to check for point inclusion in a node
        * Most commonly found as file based indices
    * R-tree index
        * More sophisticated than quadtrees
        * Handle 3D data
        * Optimized to store the index in a way compatible with how a database uses disk / memory
        * Nearby objects are aggregated into hierarchical nodes that are balanced at each level
        * Bounding boxes of objects may overlap across nodes (unlike quadtree)
        * Due to complexity / db integration, these are typically found in databases, not files
    * Grids
        * Spatial indexes may use integer grids
        * Coordinates are typically floating point with a fixed degree of precision
        * Float computations are expensive compared to integers
        * Indexed search is about initial eliminating possibilities that don't require precision (clearly outside the bounds of hte query)
        * Most spatial indexing algorithms therefore map floats to a fixed size integer grid for initial search, then switch to full resolution for the narrowed dataset
        * Grid sizes can be wildly variant

## Overviews

* Most overview data is raster
* They're resampled, lower resolution versions that give thumbnail or preload views at different scales
* Also known as pyramids, 'pyramiding' an image is creating one
* Usually preprocessed and stored with the full resolution data, embedded or in a separate file
* Vector data also has a concept of overviews, typically created on the fly because vectors are scalable
* Sometimes vector data is rasterized by converting to a thumbnail image, stored with or embedded in the image header

## Metadata

* Most data formats contain the footprint or bounding box of the data on the earth
* Detailed metadata is typically stored outside the data file
* Formats include
    * US Federal Geographic Data Committee (FGDC) Content Standard for Digitial Geospatial Metadata (CSDGM)
    * ISO
    * Newer EU format, Infrastructure for Spatial Information in the European Community (INSPIRE)

## File Structure

* Human readable formats are easy to poke around in
* Binary data you can get at with the `struct` module or a third party library
* Example of parsing the bounding box out of a shapefile:

    ```Python
    import struct
    bb = {}
    with open("hancock.shp", "rb") as f:
        f.seek(36)
        bb['min_lon'] = struct.unpack("<d", f.read(8))
        bb['min_lat'] = struct.unpack("<d", f.read(8))
        bb['max_lon'] = struct.unpack("<d", f.read(8))
        bb['max_lat'] = struct.unpack("<d", f.read(8))
    ```
    
## Vector data

* OGC has 16+ formats for vector data
* Stores only geometric primitives, as associated points
* Geospatial vector data stores Earth-based points, not screen based
* Typically linked to info about the object being represented
* Geospatial vector data typically contains no styling information
* Geospatial vectors typically include very primitive geometries for points, lines, and polygons, no curves
* You can store vector data in human readable formats like CSV, text, GeoJSON, XML
* In the early 90's data was all binary, then switched to XML. File sizes are greater, but they're more portable / genericized.
* Open source library OGR has 86+ supported vector formats
* Commercial counterpart, Safe Software's Feature Manipulation Engine (FME) has 188+

### Shapefiles

* Most ubiquitous format, Esri shapefile
* Released the spec as an open format in 1998
* Basically all GIS software reads it
* OGR works on it, as do the modules Shapely and Fiona (based on OGR)
* The format consists of multiple files (3 at minimum, up to 15)
* Required file types within the standard:
    * `.shp`
        * Purpose: shapefile, contains the geometry
        * Some software will accept only `.shp` without the `.shx` or `.dbf`
    * `.shx`
        * Purpose: shape index file; fixed sized record index referencing the geometry for fast access
        * Meaningless without the `.shp`
    * `.dbf`
        * Purpose: database file, holds geometry attributes
        * Can be accessed separately sometimes, as the format predates `.shp`. Openable by spreadsheets.
* Optional file types within the standard:
    * `.sbn`
        * Purpose: spatial bin file, the shapefile spatial index
        * Has bounding boxes of features mapped to a 256x256 integer grid
    * `.sbx`
        * Purpose: Fixed sized record index for the `.sbn` file
        * Ordered record index of a spatial index
    * `.prj`
        * Purpose: Map projection info stored in well known text format
        * May also accompany raster data, needed for on the fly reprojection
    * `.fbn`
        * Purpose: Spatial index of read only features
        * Very rarely used
    * `.fbx`
        * Purpose: Fixed-size record index of the `.fbn` spatial index
        * Very rarely used
    * `.ixs`
        * Purpose: Geocoding index
        * Common in geocoding applications including driving directions
    * `.mxs`
        * Purpose: Another type of geocoding index
        * Less common than `.ixs`
    * `.ain`
        * Purpose: Attribute index
        * Mostly legacy format, rarely used now
    * `.aih`
        * Purpose: Attribute index
        * Accompanies `.ain` files
    * `.qix`
        * Purpose: Quadtree index
        * Spatial index created by open source community because Esri `.sbn` and `.sbx` files were undocumented
    * `.atx`
        * Purpose: Attribute index
        * More recent, Esri specific attribute index for fast queries
    * `.shp.xml`
        * Purpse: Metadata
        * Geospatial metadata container, can be any of multiple XML standards
    * `.cpg`
        * Purpose: Code page file for `.dbf`
        * Used for internationalization of the `.dbf` files
* If you want to rename a shapefile, you must rename all associated files as well
* Records in these files are not numbered
* Records include geometry, the `.shx` index record, and the `.dbf` record
* Those are stored in a fixed order
* Records are numbered dynamically on opening them but the numbers are not saved
* Deleting a record will bump its number next time it is opened
* Don't base anything on record number unless you create a new, secondary identifier in the `.dbf` file and assign each record a number.
* If you edit shapefiles, do it with software that manages the file(s) as a shared dataset.

### CAD files

* CAD formats are mostly from Autodesk via AutoCAD
* Two typically seen formats are
    * Drawing Exchange Format (DXF)
    * Drawing (DWG, autocad native)
* Features of these file types:
    * Curves
    * Surfaces
    * 3d solids
    * Text rendered as objects
    * Text styling
    * Viewport configuration
* If you encounter CAD data, best to ask if you can get shapefiles

### Tag-based and markup-based formats

* Typically XML
* May also be well-known text (WKT) for `.prj`
* XML formats include
    * Keyhole Markup Language (KML)
    * OpenStreetMap (OSM)
    * Garmin GPX for GPS data
    * Open Geospatial Consortium's Geographic Markup Language (GML)
    * That's the basis for the OGC Web Feature Service (WFS)
    * GML has been largely superseded by KML and GeoJSON
* XML files have more than just geometry, may have attributes and rendering instructions
* KML is now a fully supported OGC standard
* XML is attractive to geospatial analysts because:
    * It's human readable
    * Can be edited with a text editor
    * Well supported by programming languages
    * By definition easily extensible
* Issues with XML:
    * Inefficient for large data storage
    * Can be cumbersome to edit
    * Errors in datasets are common, most parsers deal with them poorly
* SVG (scalable vector graphics) is a widely supported XML format
* SVG is not a geographic format
* WKT is an older OGC standard
* Example WKT for WGS84 coordinate system:

    ```
    GEOGCS["WGS 84",
        DATUM["WGS_1984",
            SPHEROID["WGS 84",6378137,298.257223563,
                AUTHORITY["EPSG","7030"]],
        PRIMEM["Greenwich",0,
            AUTHORITY["EPSG","8901"]],
        UNIT["degree",0.01745329251994238,
            AUTHORITY["EPSG","9122"]],
        AUTHORITY["EPSG","4326"]]
    ```

* Standards codes can be quite long, EPSG created a numerical coding system to reference projections by shorthand

### GeoJSON

* Standard way to define geometry, attributes, bounding boxes, and projection information
* More compact than XML, though less than binary formats
* Key component of REST web APIs

## Raster data

* Raster datasets are two dimensional arrays
* Can be stored as ASCII or BLOB in databases
* Geospatial raster resolution is not dots per inch, it's ground distance per cell
* May contain multiple bands, meaning that different wavelengths of light can be collected over the same area
* Typical range is 3-7 bands, but can be several hundred
* Can be viewed individually or swapped in and out as the RGB bands of an image
* Can be recombined into a derivative single-band image, and recolored using a set number of classes representing like values
* Raster data often shows up in scientific computing, which uses complex formats including Network Common Data Form (NetCDF), GRIB, and HDF5, which store entire data models
* Raster data can come in a bunch of formats
* Geospatial Data Abstraction Library (GDAL) includes 130+ raster formats

### TIFF files

* Tagged Image File Format, most common geospatial raster format
* Flexible tagging system lets it store any type of data in a single file
* Can have overview images, multiple bands, integer elevation data, basic metadta, internal compression, and a variety of other data typically stored in additional supporting files by other formats
* Anyone can unofficially extend the format by adding tagged data to the file structure
* May mean a "valid" TIFF does not work in some applications, if it has been extended beyond what that application recognizes
* GeoTIFF defines how geospatial data is stored
* May show up as `.tiff`, `.tif`, or `gtif`

### JPEG, GIF, BMP, PNG

* Common image formats, can be used for geospatial data
* Typically rely on accompanying support files for georeferencing
* JPEG is fairly common for geospatial data
* JPEGs have a built in metadata tagging system, EXIF

### Compressed formats

* Geodata rasters tend to be stored using compression because they're real big
* Latest open standard is JPEG 2000
* That includes wavelet compression and georeferenced data
* Multi-resolution Seamless Image Database (MrSID, `.sid`) and Enhanced Compression Wavelet (ECW, `.ecw`) are proprietary wavelet compression formats that come up in geospatial contexts
* TIFF supports compression including Lempel-Ziv-Welch (LZW)
* Compressed data is fine for part of a base map, but should not be used for remote sensing processing

### ASCII grids

* Common for elevation data
* File format created by Esri, but now an unofficial standard, widely supported
* Simple text file with x,y values as rows and columns
* Spatial info for the raster is in a simple header
* Not terribly efficient, but don't require any special libraries either
* Often distributed as zip files
* Headers contain:
    * number of columns
    * number of rows
    * x-axis cell center coordinate | x-axis lower-left corner coordinate
    * y-axis cell center coordinate | y-axis lower-left corner coordinate
    * cell size in mapping units
    * the no-data value (typically 9999)

### World files

* Simple text files that provide geospatial referencing info to any image externally for file formats with no native spatial info
* Recognized by geospatial software due to naming convention
* Most common way to name a world file is to use the raster file name and then alter the extension to remove the middle letter and add `w` to the end
* Examples:
    * `World.jpg` == `World.jpw`
    * `World.tif` == `World.tfw`
    * `World.bmp` == `World.bpw`
    * `World.png` == `World.pgw`
    * `World.gif` == `World.gfw`
* File structure is simple, it's a six line text file:
    * Line 1: Cell size along the x axis in ground units
    * Line 2: Rotation on the y axis
    * Line 3: Rotation on the x axis
    * Line 4: Cell size along the y axis in ground units
    * Line 5: Center x-coordinate of the upper left cell
    * Line 6: Center y-coordinate of the upper left cell
* Rotation is crucial because remote sensing images are often rotated due to teh data collection platform
* Great tool when working with raster data in python

## Point cloud data

* Any data collected as the (x,y,z) location of a surface point based on some sort of focused energy return
* You can get it from lasers, radar, acoustic soundings, or other waveform generators
* Spacing between points is arbitrary and depends on the type and position of the collecting sensor
* Book mostly concerned with LIDAR data and radar data
* Radar point cloud data mostly comes from space missions, LIDAR is terrestrial or airborne
* LIDAR uses laser range finding to model the world at high precision
* LIDAR is a combination of the words light and radar, maybe Light Detection and Ranging
* LIDAR sensors are high-speed, continuous, and have a wide field of view (often 360 from the sensor), so the data doesn't tend to have a regular footprint like other raster datasets
* LIDAR datasets are point clouds because the data is a stream of 3 tuples, where the z value is the distance from the laser to the ranged object, and the x,y are the projected location of that object calculated from the location of the sensor.
* Most common format for LIDAR is LIDAR Exchange Format (LAS)
* Can be represented in many ways including a text file with one tuple per line
* Can be used to create 2D elevation rasters, can be colorized

## Web Services

* Most common protocols are Web Map Service (WMS) that returns a rendered map image and Web Feature Service (WFS) that typically returns GML
* Many WFS services can also return KML, JSON, zipped shapefiles, and other formats

# Chapter 3: The Geospatial Technology Landscape

* Most software, open source and commercial, derives from a few key packages
* High level core capabilities for geospatial libraries:
    * Data access
    * Computational geometry (incl. data reprojection)
    * Visualization
    * Metadata tools
    * Image processing for remote sensing (very fragmented category)
* Most image processing software is based on the core data access libraries with custom image processing logic layered on top
* Common examples of this type of software:
    * Open Source Software Image Map (OSSIM)
    * Geographic Resources Analysis Support System (GRASS)
    * Orfeo ToolBox (OTB)
    * ERDAS IMAGINE
    * ENVI
* Core libraries in use by most other packages:
    * GDAL
    * OGR
    * GEOS
    * PROJ.4

## Data access

* Data access libraries underpin everything else in GIS work
* Accuracy and precision are incredibly important
* Libraries must manage memory efficiently

### GDAL

* Geospatial Data Abstraction Library 
* Gives a single, abstract data model for raster data types
* Consolidates data access libraries for different data formats
* Gives a common read/write API
* Abstraction of the GDAL dataset:
    * GDAL Rasterband
        * Raster (0 to n bands)
            * Width in pixels
            * Height in lines
        * Data Type
            * Byte
            * UInt16 / Int16 / UInt32 / Int32
            * Float32 / Float 64
            * CInt16 / CInt32
            * CFloat32 / CFloat64
        * Block size
            * Data chunk read size
    * Projection
        * Coordinate system
        * Georeferencing
            * Affine geo-transform
            * Ground control points
    * Metadata
        * Arbitrary tagging system
            * Some default tags
            * XML storage ability
    * Overviews
        * Freestanding bands
            * Reduced resolution
        * 0-n overview bands

### OGR
    
* OGR Simple Features Library is the vector companion to GDAL
* At least partial support for 70+ vector formats
* Originally stood for OpenGIS Simple Features Reference Implementation
* Not actually a reference implementation
* Licensed X11/MIT
* Capabilities:
    * Uniform vector data and modeling abstraction
    * Vector data re-projection
    * Vector data format conversion
    * Attribute data filtering
    * Basic geometry filtering including clipping and point-in-polygon testing
* Architectural sections / objects in OGR
    * Geometry
    * Feature definition
    * Feature
    * Spatial reference
    * Layer
    * Data source
    * Drivers
* The Geometry object represents the data model for points, lines, linestrings, polygons, geometrycollections, multipolygons, multipoints, and multilinestrings
* Feature object ties Geometry and Feature Definition info together
* Spatial Reference contains an OGC Spatial Reference definition. What?
* Layer represents features grouped as layers in a data source
* Data Source is the file or database object accessed by OGR
* Driver contains translators for the multiple underlying data formats
* Works smoothly with one quirk: Layer concept is used even for data formats that only contain a single layer. Mild inconvenience.

## Computational Geometry

* Algorithms for ops on vector data
* Most geospatial libraries are separate from graphics libraries because of geospatial coordinate systems
* Screen coordinates are almost entirely positive, geo coordinates can be positive or negative across a meridian
* Some features of OGR move beyond data access into computational geometry
* Geospatial algorithms are pretty hard to implement from scratch.

### PROJ.4 projection library

* Created by Jerry Evenden at USGS in the 90s
* Now a project of the Open Source Geospatial Foundation
* Purpose is to transform data betwene thousands of coordinate systems
* The math to do so is super complex, and nothing approaches PROJ.4
* Uses a simple syntax capable of describing any projection
* Used in virtually every major GIS package that does reprojection
* Has its own command line tools
* Also available through GDAL and OGR
* Access it directly to reproject individual points

### CGAL

* Computational Geometry Algorithms Library
* Originally from late 90s
* Not specifically for geospatial analysis, but commonly used
* Useful for operations like resizing a polygon

### JTS

* Java Topology Suite
* Implements the Open Geospatial Consortium (OGC) Simple Features Specification for SQL
* Has been ported to other languages
* Has a great test program, JTS Test Builder, that gives you a GUI for testing individual functions without writing wrapper scripts
* Lets you interactively test algorithms to verify data or just understand a process
* Has not seen development in a long time

### GEOS

* Geometry Engine - Open Source
* C++ port of the JTS library
* Much larger impact on geospatial work than JTS
* Lots of infrastructure exists for things like python bindings
* Most common usage is via APIs
* Capabilities:
    * OGC Simple Features
    * Geospatial predicate functions
    * Intersects
    * Touches
    * Disjoint
    * Crosses
    * Within
    * Contains
    * Overlaps
    * Equals
    * Covers
    * Geospatial Operations
    * Union
    * Distance
    * Intersection
    * Symmetric Difference
    * Convex Hull
    * Envelope
    * Buffer
    * Simplify
    * Polygon assembly
    * Polygon validation
    * Area
    * Length
    * Spatial Indexing
    * OGC well-known text and well-known binary IO
    * C and C++ API
    * Thread safety
* Can be compiled with GDAL to give OGR all its capability

### PostGIS

* Most common spatial database
* Module on top of PostgreSQL
* Much of the power comes from GEOS library
* Implements OGC Simple Features Specification for SQL
* Allows you to execute both attribute and spatial queries against a dataset
* Spatial operations are available via SQL functions
* Feature set
    * Geospatial geometry types including points, linestrings, polygons, multipoints, multilinestrings, multipolygons, and geometry collections
    * Spatial functions for testing geometric relationships
    * Spatial functions for deriving new geometries
    * Spatial measurements including perimeter, length, area
    * Spatial indexing using R-Trees
    * A basic geospatial raster data type
    * Topology data types
    * US Geocoder based on TIGER census data
    * New JSONB datatype that allows indexing/querying JSON and GeoJSON

### Other spatially-enabled databases

* PostGIS is the standard, but there are others to be aware of
* Oracle Spatial and Graph
    * geospatial data schema
    * spatial indexing system based on R-Tree
    * SQL API for geometric operations
    * Spatial data tuning API for optimizing datasets
    * Topology data model
    * Network data model
    * GeoRaster data type
    * 3D data types including Triangulated Irregular Networks and LIDAR point clouds
    * Geocoder
    * Routing engine for driving direction queries
    * OGC compliance
* ArcSDE, Esri's Spatial Data Engine
    * Rolled into ArcGIS Server
    * Mostly DB independent, supports multiple DB backends
* Microsoft SQLServer
* MySQL

### SpatiaLite

* Extension to SQLite
* Spatial data types and indexing are in SQLite
* This adds OGC Simple Features Specification compliance and map projections

### Routing

* Niche area of computational geometry
* Main contenders for dealing with it are Esri Network Analyst and pgRouting engine for PostGIS

## Desktop tools (including visualization)
