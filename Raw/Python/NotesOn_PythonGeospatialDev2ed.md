# Notes on Python Geospatial Development, 2nd ed.

_By Erik Westra, Packt Publishing 2013_

## Executive Summary

### Core Mapping and GIS Concepts

There are two primary problems in geo-spatial work of any kind: 

* Encoding geodetic (precise, physical) locations as internally coherent datasets
* Visualizing those datasets as useful information

#### Encoding Geodetic Points with Latitude/Longitude

Any arbitrary point on the oblate spheroid of the Earth can be encoded as a latitude and longitude pair. Both numbers are expressed either as degrees-minutes-seconds, or decimal degrees.

**Understanding Latitude and Longitude**:

Imagine the Earth is a giant, hollow, translucent sphere. You are floating near its center. No, hold up, floating's no good. Ok, you're standing on a flat, translucent plane near the center of the big hollow sphere. Much better. The flat plane is at the level of the equator, so you've got a hemisphere above you and a hemisphere below you.

Looking toward the absolute center of the sphere, you see a big telescope. It's mounted such that it can be cranked around in a circle to point anywhere along the ring of the equator. Also, a separate crank lets it be pointed vertically anywhere from straight up to straight down. In combination the cranks let you look from the center of the Earth at any point on its surface.



#### Visualizing Geospatial Datasets via Projections and Datums

## Chapter Summaries

### Preface

* Book will cover python gis stuff, including GeoDjango, Mapnik, and PostGIS
* Tools and libraries used in the book:
    * GDAL/OGR
    * GEOS
    * Shapely
    * Proj
    * ``pyproj``
    * ``MySQL``
    * MySQLdb
    * SpatiaLite
    * ``pysqlite``
    * PostgreSQL
    * PostGIS
    * ``pyscopg2``
    * Mapnik
    * Django

### Chapter 1: Geospatial Development Using Python

* Chapter covers:
    * Python, the standard library, pypi
    * Geospatial data/development terminology
    * Over view of accessing, manipulating, displaying geospatial data
    * General applications and trends in geo dev

#### Python

* It's high level, has libraries, big package index

#### Geospatial Development

* **geospatial** &mdash; info located on the earth's surface via coordinates
* It often associates data with a location.
* **geospatial development** &mdash; writing software to access, manipulate, and display geospatial info
* **geographical information system (GIS)** &mdash; systems of connected geospatial data
* **projection** &mdash; method for representing the earth's surface in a coordinate system. A coordinate in one system may not correspond to the same real world location in a separate projection.

#### Applications of Geospatial Development

* Analyzing geospatial data &mdash; how far from X to Y? How many buildings in this area?
* Visualizing geospatial data &mdash; drawing maps based on vector and raster data files
* Creating a geospatial mashup &mdash; tacking a dataset and/or visualization onto an existing tool like google maps

#### Recent Developments

* Google maps/earth made GIS type tech widely available
* Google's choice of underlying projections standardized some stuff more broadly
* GPS provides an easy way of geocoding data to locations
* Spatial APIs have made GIS building easier
* The Open Geospatial Consortium [http://www.opengeospatial.org](http://www.opengeospatial.org) is working on standards like GML, KML, GeoRSS, WMS, WFS, WCS, etc.
* Generally becoming more 'democratized'

### Chapter 2: GIS

* Chapter covers:
    * GIS concepts
    * Data formats for geospatial data
    * Some processes for working with geo data

#### Core GIS Concepts

* **Location**
    * Points on the earth's surface, often represented as latitude/longitude
    * Explanation of latitude and longitude:
        * Think of the earth as a hollow sphere with a vertical axis, a horizontal axis/plane, and a center/focus.
        * For an arbitrary point on the earth's surface, draw a ray from the center of the earth to that point.
        * The angle made by that ray and the horizontal plane through the earth's equator is its **latitude**. Points north of the equator range from 0&deg; to 180&deg;, points south from 0&deg; to -180&deg;. For instance, a point in North America, located about halfway between the equator and the north pole, would have a latitude of about 45&deg;, while a point in Australia about halfway between the equator and the south pole would have a latitude of about -45&deg;.
        * The angle made by that ray and a vertical plane through the earth's prime meridian (located at the Royal Observatory in Greenwich, England) is its **longitude**. Points to the east of Greenwich go from 0&deg; to 180&deg;, to the west from 0&deg; to -180&deg;. For example, a point in central China would be at about 90&deg;, while a point in eastern North America would be at about -90&deg;.
    * Horizontal lines drawn around the earth, equally vertically spaced, are called **parallels**, while great circles drawn vertically (and equally spaced horizontally) are called **meridians**.
    * A latitude and longitude pair forms a **geodetic location**&mdash;a precise point on the earth's surface.
    * This is in contrast to a street address, which is a **civic location**, or an electoral ward, which is a **jurisdictional location**.
* **Distance**
    * **Angular distance** &mdash; angle formed between rays projected from the earth's center to two points on its surface.
    * **Linear distance** &mdash; Straight line distance on the earth's surface.
    * **Traveling distance** &mdash; How far you would have to travel from point A to reach point B, taking routing into consideration.
    * **Great circle distance** &mdash; The length of an arc between two points on the surface of the earth, taking the curvature of the surface into consideration.
    * **Haversine formula** &mdash; calculates great circle distance based on latitude/longitude of two points.
* **Units**
    * Distance units in datasets can be metric or imperial, and the base unit may be anything from millimeters to U.S. Survey feet to nautical miles.
    * Latitude and longitude are written in degrees, minutes and seconds: <code>176&deg; 14' 4''</code>
    * They may also be notated as decimal degrees: <code>176.234436&deg;</code>
    * Lat/long numbers may be signed with negative/positive, or quadrant (N, S, E, W)
* **Projections**
    * Projections are mathematical transforms that unwrap a three dimensional surface onto a two dimensional plane.
    * There are hundreds of different projections. Each has strengths and weaknesses.
    * There are three basic types: cylindrical, conical, and azimuthal
    * **Cylindrical projections**
        * Imagine the earth's features drawn onto a translucent globe with a light source at the center. If you wrapped a flat sheet of paper vertically around the globe (to make a cylinder), the light source would _project_ the image drawn on the globe onto the paper. If you traced the projected shapes and unrolled the paper, you would have a map of the features on the globe. The map would naturally have the greatest fidelity at the globe's equator, since that is where it was closest to the paper, while shapes nearer the poles would be increasingly distorted.
        * The most common projections of this type are the Mercator, Equal-Area cylindrical, and Universal Transverse Mercator.
        * Mercator is notable for being the first map projection that allowed a navigator to draw straight lines between any sets of two points on the map and directly compare the distances they represented.
    * **Conic prjections**
        * A conic projection is like a cylindrical projection, except instead of wrapping paper around a translucent globe into a cylinder, the paper is wrapped into a cone pointing in a direction.
        * Common conic projections are the Albers Equal-Area, the Lambert Conformal Conic, and the Equidistant.
        * Conic projections aligned to one of the poles are useful for displaying areas that are wide but not high, like Russia.
    * **Azimuthal projections**
        * Similar setup (translucent globe with a light source in the center), this time the paper is flat and tangent to a single point on the surface. Picture the globe sitting on the paper, and tracing what is projected onto the flat surface.
        * Common azimuthal projections are the Gnomonic, Lambert Equal-Area Azimuthal, and Orthographic.
        * Useful for emphasizing the spherical nature of the earth&mdash;look like the earth seen from a point in space.
        * Don't generally show more than half the earth's surface, grow distorted near the edges (like the cylindrical projections near the poles).
    * It is mathematically impossible to project a three dimensional shape onto a flat plane without introducing distortion&mdash;choosing a projection is about choosing the distortion that either helps your work or hurts it the least.
* **Coordinate Systems**
    * Two types: projected and unprojected coordinate systems.
    * **Unprojected** systems refer directly to a point on the earth's surface, as latitude and longitude do.
    * It can be very difficult to do the math to derive, for instance, distance between points using unprojected coordinates.
    * **Projected** coordinate systems refer to points on a specific map projection of the earth. Much of the math becomes easier on a two dimensional plane, and certain projections have properties that make specific operations (distance, etc) easier or harder.
    * Projected coordinate systems typically have an origin and map units, and may shift the origin via "false northing" and "false easting" to achieve a specific effect.
    * For example, "the Universal Transverse Mercator (UTM) coordinate system divides the world up into 60 different 'zones', each zone using a different map projection to minimize projection errors. Within a given zone, the coordinates are measured as the number of meters away from the zone's origin, which is the intersection of the equator and the central meridian for that zone. False northing and false easting values are then added to the distance in meters away from this reference point to avoid having to deal with negative numbers."
    * If two points are from different coordinate systems, one of them must be converted to match the other's system before performing calculations on them together.
* **Datums**
    * Datums are mathematical models of the three dimensional earth used to describe locations on the earth's surface, consisting of a set of reference points combined with a (again, three dimensional) model of the shape of the earth.
    * The reference points describe the location of other points on the earth's surface (so you can say "X is y distance from reference point Z").
    * The model of the earth's shape is used for projecting the earth onto a two dimensional plane (imagine the translucent globe is a sphere in one datum, and a slightly squashed, "oblate spheroid" in a more topologically correct datum's model).
    * Via reference points and models, datums are used for both map projections and creating/using coordinate systems.
    * There are (as with projections) hundreds of datums in use, though most apply to only a localized area.
    * There are three main **reference datums** in use:
        * **NAD 27** &mdash; North American Datum of 1927; model is the 'Clarke Spheroid' off 1866, reference points center on Meades Ranch in Kansas. Local datum for North America.
        * **NAD 83** &mdash; North American Datum of 1983; model is the 1980 Geodetic Reference System, GRS 80. Local data for US, Mexico, Central America.
        * **WGS 84** &mdash; World Geodetic System of 1984; global datum for entire world; model is the Earth Gravitational Model of 1996, EGM 96; reference points are based on the IERS International Reference Meridian. For the US, basically identical to NAD 83. **Used by GPS, so all GPS derived data uses WGS 84 as its original datum.**
    * Always find out which datum your data is based in&mdash;points may not colocate between datums.
* **Shapes**
    * Shapes are generally points, lines, and outlines/polygons.
    * A **point** is a single coordinate described by two or more numbers.
    * A **path** or **line** or **linestring** or **polyline** is a series of ordered points connected by straight lines.
    * An **outline** or **polygon** is an _exterior ring_ defined by a polyline connected at the ends, and may optionally have _interior rings_ to define exclusion zones within the overall shape boundary.

#### GIS Data Formats

* A data format describes how geospatial data is stored in a file or files on a storage medium, or during transmission across a network.
* Typically a GIS format will support
    * geospatial data describing features (points, polylines, polygons)
    * standardized metadata attached to the file, about projection, datum, etc
    * arbitrary metadata attached to features, representing the dataset being geolocated
    * display information attached to features, like line style, color, etc.
* Two main forms of GIS data: raster and vector
* **Raster data** &mdash; grid / matrix of values representing individual datapoints, with the boundaries of the grid conforming to a space within a coordinate set. Data points within the grid will typically be rendered as pixels to show either photographic detail or false-color images of relative data values.
* Common raster formats: 
    * Digital Raster Graphic (DRG), stores scans of paper maps
    * Digital Elevation Model (DEM), USGS uses for elevation data
    * Band Interleaved by Line (BIL), Band Interleaved by Pixel (BIP), Band Sequential (BSQ), all used for remote sensing data.
* **Vector data** &mdash; point, polyline, polygon data, mapped to a coordinate system, with metadata describing / naming / dictating display for each feature.
* Common vector formats:
    * Shapefile, open spec from ESRI for storing / exchanging GIS data
    * Simple features, OpenGIS standard for geodata
    * TIGER/Line, text based format from US Census Bureau. More recent data is in shapefile, so TIGER/Line is historical data only.
    * Coverage, proprietary format from ESRI for ARC/INFO
* Common microformats present in geodata:
    * Well-known Text (WKT), text format for a single geo feature
    * Well-known Binary (WKB), binary format for a single geo feature
    * GeoJSON, open format, JSON based
    * Geography Markup Language (GML), open standard, XML based

#### Working with GIS Data Manually

* Example section, for getting some GIS data and installing GDAL python library
* Get the data: [http://www2.census.gov/geo/tiger/TIGER2012/STATE/tl_2012_us_state.zip](http://www2.census.gov/geo/tiger/TIGER2012/STATE/tl_2012_us_state.zip)
* Unzip the archive, should give you files in ``.dbf``, ``.prj``, ``.shp``, ``.shp.xml``, and ``.shx``, which make up a Shapefile with outlines of all US states.
* Get the GDAL python library from [http://gdal.org](http://gdal.org), install it
* Test with ``>>> import osgeo``

**To get to that point, create an Ubuntu 14.04 LTS virtual machine, and then:**

```
sudo aptitude update
sudo aptitude install python2.7-gdal
mkdir -p ~/py-geodata/data; cd ~/py-geodata/data
wget http://www2.census.gov/geo/tiger/TIGER2012/STATE/tl_2012_us_state.zip
sudo aptitude install unzip
unzip ./tl_2012_us_state.zip
mkdir ~/py-geodata/scripts; cd ~/py-geodata/scripts
```

In the scripts directory, create ``analyze.py``:

```Python
#!/usr/bin/env python2.7

import osgeo.ogr

shapefile = osgeo.ogr.Open('../data/tl_2012_us_state.shp')
numLayers = shapefile.GetLayerCount()

print "Shapefile contains %d layers" % numLayers
print

for layerNum in range(numLayers):
    layer = shapefile.GetLayer(layerNum)
    spatialRef = layer.GetSpatialRef().ExportToProj4()
    numFeatures = layer.GetFeatureCount()
    print "Layer %d has spatial reference %s" % (layerNum, spatialRef)
    print "Layer %d has %d features:" % (layerNum, numFeatures)
    print

    for featureNum in range(numFeatures):
        feature = layer.GetFeature(featureNum)
        featureName = feature.GetField("NAME")

        print "Feature %d has name %s" % (featureNum, featureName)
```

When run, it will tell you about the contents of the shapefile.

The following will show data about the New Mexico feature:

```Python
#!/usr/bin/env python2.7

import osgeo.ogr

shapefile = osgeo.ogr.Open("../data/tl_2012_us_state.shp")
layer = shapefile.GetLayer(0)
feature = layer.GetFeature(2)

print "Feature 2 has the following attributes:"
print

attributes = feature.items()

for key,value in attributes.items():
    print "  %s = %s" % (key, value)

geometry = feature.GetGeometryRef()
geometryName = geometry.GetGeometryName()

print
print "Feature's geometry data consists of a %s" % geometryName
```

The New Mexico feature is a polygon. The following will look closer at it:

```Python
#!/usr/bin/env python2.7

import osgeo.ogr

def analyzeGeometry(geometry, indent=0):
    s = []
    s.append("  " * indent)
    s.append(geometry.GetGeometryName())
    if geometry.GetPointCount() > 0:
        s.append(" with %d data points" % geometry.GetPointCount())
    if geometry.GetGeometryCount() > 0:
        s.append(" containing:")

    print "".join(s)

    for i in range(geometry.GetGeometryCount()):
        analyzeGeometry(geometry.GetGeometryRef(i), indent+1)

shapefile = osgeo.ogr.Open("../data/tl_2012_us_state.shp")
layer = shapefile.GetLayer(0)
feature = layer.GetFeature(2)
geometry = feature.GetGeometryRef()

analyzeGeometry(geometry)
```

Finally this will find the distance from northernmost to southernmost points in California:

```Python
#!/usr/bin/env python2.7

import osgeo.ogr

def findPoints(geometry, results):
    for i in range(geometry.GetPointCount()):
        x, y, z = geometry.GetPoint(i)
        if results['north'] == None or results['north'][1] < y:
            results['north'] = (x,y)
        if results['south'] == None or results['south'][1] > y:
            results['south'] = (x,y)
    for i in range(geometry.GetGeometryCount()):
        findPoints(geometry.GetGeometryRef(i), results)

shapefile = osgeo.ogr.Open("../data/tl_2012_us_state.shp")
layer = shapefile.GetLayer(0)
feature = layer.GetFeature(55)
geometry = feature.GetGeometryRef()

results = {'north': None, 'south': None}

findPoints(geometry, results)

print "Northernmost point is (%0.4f, %0.4f)" % results['north']
print "Southernmost point is (%0.4f, %0.4f)" % results['south']

import math

lat1 = results['north'][1]
long1 = results['north'][0]

lat2 = results['south'][1]
long2 = results['south'][0]

rLat1 = math.radians(lat1)
rLong1 = math.radians(long1)
rLat2 = math.radians(lat2)
rLong2 = math.radians(long2)

dLat = rLat2 - rLat1
dLong = rLong2 - rLong1
a = math.sin(dLat/2)**2 + math.cos(rLat1) * math.cos(rLat2) * \
        math.sin(dLong/2)**2

c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
distance = 6371 * c

print "Great circle distance is %0.0f kilometers" % distance
```

### Chapter 3: Python Libraries for Geospatial Development

* Chapter covers python tools for:
    * reading/writing geospatial data
    * dealing with map projections
    * analyzing / manipulating geospatial data
    * visualizing geospatial data

#### Reading and Writing Geospatial Data

* Look at two popular libraries, GDAL and OGR
##### GDAL/OGR
* Geospatial Data Abstraction Library (GDAL) was originally a raster library, while OGR was for vector. The libraries are partially merged, called GDAL. Referred to in the text as GDAL/OGR to avoid confusion, and GDAL to mean the raster portion.
* GDAL has the following data model for raster data:
    * A **dataset** holds all the raster data in a collection of "bands", and the metadata for all bands together.
    * The shared metadata is:
        * **Raster size** is the overall width and height in pixels
        * **Georeferencing transform** converts (x,y) coordinates in the raster image to georeferenced coordinates.
        * Two types of georeference transforms:
            * **Affine transformation** or **linear transformations** are formulae allowing X/Y offset, scale, and shear operations to be performed
            * **Ground Control Points (GCPs)** related one or more positions in the raster to equivalent georeferenced coordinates. GDAL does not translate coordinates using GCPs.
        * **Coordinate system** describes the georeferenced coordinates produced by the georeferencing transform. Includes projection, datum, units, and scale.
        * **Metadata** include additional information about the dataset as a whole.
    * A **raster band** represents a band, channel, or layer in an image.
    * Each raster band contains:
        * **Band raster size**, the width/height for the data in the band. Can be at a different scale than the entire dataset, giving finer or less fine resolution.
        * **Band metadata** specific to that band
        * **Color table** mapping pixel values to colors
        * **raster data**
    * Example: GDAL calculating average heights from a DEM:

```Python
from osgeo import gdal, gdalconst
import struct

dataset = gdal.Open("../data/e10g")
band = dataset.GetRasterBand(1)

fmt = "<" + ("h" * band.XSize)

totHeight = 0

for y in range(band.YSize):
    scanline = band.ReadRaster(0, y, band.XSize, 1, 
                               band.XSize, 1, band.DataType)
                               
    values = struct.unpack(fmt, scanline)
    
    for value in values:
        if value == -500:
            # Special height value for ocean, ignore it
            continue
            
        totHeight = totHeight + value
        
    average = totHeight / (band.XSize * band.YSize)
    print "Average height =", average
```

    * Program pulls a raster band from the DEM, reads scanlines, uses ``struct`` to read individual height values from the scanline.
* **OGR Design**
    * OGR data model is a **data source** (file, URL, other source), which has one or more **layers** representing sets of related data.
    * Each layer has a spatial reference, list of features
    * The **spatial reference** gives projection and datum
    * **Features** are a signifcant element in a layer, like a state, a road, an island. Each feature has a list of attributes, and a geometry.
    * **Attributes** give meta data about features
    * **Geometry** gives the physical shape or location of the feature. They're recursive data structures that can contain other sub geometries, like a country containing states.
    * Geometry in OGR is based on the Open Geospatial Consortium's "Simple Features" model
    * Example of using OGR to read a shapefile, print the NAME of each attribute and the geometry type:

```Python
from osgeo import ogr

shapefile = ogr.Open("../data/TM_WORLD_BORDERS-0.3.shp")
layer = shapefile.GetLayer(0)

for i in range(layer.GetFeatureCount()):
    feature = layer.GetFeature(i)
    name = feature.GetField("NAME")
    geometry = feature.GetGeometryRef()
    print i, name, gemoetry.GetGeometryName()
```

* **Documentation**
    * GDAL/OGR and cli tools are all C/C++, and all the docs are for that language even though Python bindings exist.
    * The docs use C/C++ style method signatures, the python bindings have changed the names to be more pythonic.
    * There's docstrings in the library though, so you can use ``pydoc -g osgeo`` to read them.
    * Not all methods are documented, may have to use original docs for some stuff.
* **Availability**
    * It's at [http://gdal.org](http://gdal.org)
    * Put it on a *nix box.

#### Dealing with Projections
    
* Naturally 3D Geodetic locations usually need to be mapped into a 2D projection to work with them.
* Common problem is converting between projections, which you can do with ``pyproj``
* It's a wrapper for a library called ``PROJ.4``, which came from USGS.
* ``pyproj`` has two main parts, Proj and Geod. Proj converts lat/long to native xy map coordinates. Geod does great circle distance/angle calculations.
* **Proj**
    * A new ``Proj`` instance needs to know projection, datum, and some other values about the projection.
    * Ex: Transverse Mercator + WGS84: ``projection = pyproj.Proj(proj='tmerc', ellps='WGS84')``
    * ``projection.transform()`` can convert coordinates between projections.
* **Geod**
    * Does great circle math.
    * New ``Geod`` objects need to know the ellipsoid to use when calculating.
    * ``fwd()`` takes start point, angular direction (azimuth), and distance, returns end point and back azimuth (angle from end point back to start point).
    * ``inv()`` takes two coordinates, returns forward and back azimuth and distance between them
    * ``npts()`` calculates coordinates for _n_ equidistant points on a geodesic line between start and end points.
* Example of using Proj objects to work with UTM Zone 17 and lat/long:

```Python
#!/usr/bin/env python2.7

import pyproj

UTM_X = 565718.5235
UTM_Y = 3980998.9244

srcProj = pyproj.Proj(
    proj='utm',
    zone='11',
    ellps='clrk66',
    units='m')
dstProj = pyproj.Proj(
    proj='longlat',
    ellps='WGS84',
    datum='WGS84')

long,lat = pyproj.transform(srcProj, dstProj, UTM_X, UTM_Y)

print "UTM zone 11 coordinate (%0.4f, %0.4f) = %0.4f, %0.4f" \
    % (UTM_X, UTM_Y, lat, long)

angle = 315 # 315 deg = northeast
distance = 10000

geod = pyproj.Geod(ellps="WGS84")
long2,lat2,invAngle = geod.fwd(long, lat, angle, distance)

print "%0.4f, %0.4f is 10km northeast of %0.4f, %0.4f" \
    % (lat2, long2, lat, long)
```

#### Analyzing and Manipulating Geospatial Data

* Library of choice for computational geometry in python is Shapely
* Shapely is based on the GEOS library that does geospatial data manipulations in C++
* It's essentially a pythonic interface to GEOS
* Key classes in Shapely:
    * Point &mdash; two or three dimensional point in space
    * LineString &mdash; sequence of points joined into a line; can be simple (no crossing segments) or complex (overlapping lines)
    * LinearRing &mdash; LineString that finishes at the starting point
    * Polygon &mdash; filled area, optionally with holes in it
    * MultiPoint &mdash; collection of Points
    * MultiLineString &mdash; collection of LineStrings
    * MultiPolygon &mdash; collection of Polygons
    * GeometryCollection &mdash; collection of any combination of Points, LineStrings, LinearRings and Polygons
* Shapely is a _spatial_ manipulation library, not a geospatial one, so it expects data on a cartesian plane for manipulation.
* Example of using Shapely to create a circle and a square, and calculaate their intersection:

```Python
#!/usr/bin/env python2.7

import shapely.geometry

pt = shapely.geometry.Point(0,0)
circle = pt.buffer(1.0)

square = shapely.geometry.Polygon(
    [(0,0), (1,0), (1,1), (0,1), (0,0)]
)

intersect = circle.intersection(square)

for x,y in intersect.exterior.coords:
    print x,y
```

#### Visualizing geospatial data

* **Mapnik**
    * Takes geodata from a postgis db, shapefile, other GDAL/OGR supported source, renders it
    * Lets you create xml stylesheets that control map creation
    * Written in C++, native bindings for almost everything in python
* **Mapnik Design**
    * Main object is a ``Map``
    * At the top level, a ``Map`` has Width, Height, Spatial Reference, and Background Color
    * A ``Map`` contains a stack of ``Layers``
    * ``Layers`` have Name, Datasource, Spatial Reference, and a stack of Styles
    * ``Map`` also contains a stack of ``Styles``
    * ``Styles`` have a Name and a stack of ``Rules``
    * ``Rules`` have Min/Max Scale, Filter, and a stack of Symbolizers
    * Symbolizers define how features matching the ``Rule`` will be drawn
    * Types of Mapnik Symbolizers:
        * ``LineSymbolizer`` &mdash; strokes a line path
        * ``LinePatternSymbolizer`` &mdash; strokes a line path with an image file
        * ``PolygonSymbolizer`` &mdash; draws polygon interior
        * ``PolygonPatternSymbolizer`` &mdash; draws polygon interior with an image file
        * ``PointSymbolizer`` &mdash; draws a point using an image file
        * ``TextSymbolizer`` &mdash; draws a feature's text from an attribute
        * ``RasterSymbolizer`` &mdash; draws raster data from a GDAL dataset
        * ``ShieldSymbolizer`` &mdash; draws a text label and a point together
        * ``BuildingSymbolizer`` &mdash; uses pseudo-3d effect to draw a polygon of a building
        * ``MarkersSymbolizer`` &mdash; draws blue arrows or SVG markers following direction of polygon/line geometries
    * Symbolizers are instantiated with parameters like

```Python
p = mapnik.PolygonSymbolizer(mapnik.Color(127, 127, 0))
p.fill_opacity = 0.8
p.gamma = 0.65
```

* **Mapnik example displaying a world map:**

```Python
#!/usr/bin/env python2.7

import mapnik

symbolizer = mapnik.PolygonSymbolizer(mapnik.Color("darkgreen"))

rule = mapnik.Rule()
rule.symbols.append(symbolizer)

style = mapnik.Style()
style.rules.append(rule)
layer = mapnik.Layer("mapLayer")
layer.datasource = mapnik.Shapefile(file="TM_WORLD_BORDERS-0.3.shp")
layer.styles.append("mapStyle")

map = mapnik.Map(800,400)
map.background = mapnik.Color("steelblue")
map.append_style("mapStyle", style)
map.layers.append(layer)

map.zoom_all()
mapnik.render_to_file(map, "map.png", "png")
```

### Chapter 4: Sources of Geospatial Data

#### Sources of geospatial data in vector format

* **OpenStreetMap**:
    * [http://openstreetmap.org](http://openstreetmap.org)
    * Uses its own XML based format
    * Defines geodata as nodes (points), ways (point lines), areas (polygons), and relations (collections of elements)
    * Any element can have tags associated with it that provide additional data.
    * Has an API to get data
    * You can get the entire database, called ``Planet.osm`` and process it locally
    * **OpenStreetMap API**:
        * You can ask for data in a bounding box
        * You can ask for changesets that have been applied to the map in a time range
        * You can download a specific element by id, or all associated elements
        * Runs off a python module called ``OsmApi``
    * **``Planet.osm``**:
        * Available as XML or a binary format called PBF
        * It's 20+ gigs
        * Updated weekly, and diffs are produced that you can use to keep a local copy current
        * Data expands out to over 250G, so have to use something like ``imposm`` to parse, or load into a db
        * Most likely you want to load it to postgres with ``osm2pgsql``, a tool available through OpenStreetmap.
        * Once it's loaded, use ``psycopg2`` to talk to postgres
* **TIGER**:
    * Stands for Topologically Integrated Geographic Encoding and Referencing System
    * Has streets, railways, rivers, lakes, geographic boundaries, legal and statistical areas like school districts and urban regions. Also separately has cartographic boundary and demographic files.
    * Only has data for US and protectorates
    * **Data format**:
        * Prior to 2006, it was all in TIGER/Line format, custom text based
        * OGR can read TIGER/Line data
        * Since 2007, all TIGER data has been shapefiles, called TIGER/Line shapefiles
        * Extensive docs are available through the TIGER site
    * **Obtaining and using TIGER data**:
        * Get it from [http://www.census.gov/geo/www/tiger/index.html](http://www.census.gov/geo/www/tiger/index.html)
        * Make sure to download the technical documentation.
* **Natural Earth**:
    * It's at [http://www.naturalearthdata.com](http://www.naturalearthdata.com)
    * Has public domain vector and raster data at high/med/low resolutions
    * Two types of data: cultural map data (countries, placenames, urban areas, provinces, roads, railways) and physical map data (land masses, coastlines, oceans, minor islands, reefs, rivers, lakes, etc)
    * **Data Format**:
        * It's all shapefiles in lat/long, WGS84 datum
    * **Obtaining and using Natural Earth vector data**:
        * Get it from the website.
* **Global, self-consistent, hierarchical, high-resolution shoreline database (GSHHS)**:
    * Put out by US National Geophysical Data Center (part of NOAA)
    * Four levels: ocean boundaries, lake boundaries, island in lake boundaries, pond on island in lake boundaries
    * Built from World Data Bank II and World Vector Shoreline datasets
    * **Data Format**:
        * Available as shapefiles and in a binary format for the 'Generic Mapping Tools' (which don't have python bindings)
        * If you get the shapefiles, you get 20 different ones, for every combination of resolution and level.
        * Resolution and level are coded:
            * Resolution: c (crude), l (low), i (intermediate), h (high), f (full)
            * Levels: 1 (ocean), 2 (lake), 3 (island in lake), 4 (pond on island in lake)
        * Example name: ``GSHHS_f_L1.shp``, which is full resolution ocean boundaries
    * **Obtaining the GSHHS database**:
        * Get it from [http://www.ngdc.noaa.gov/mgg/shorelines/gshhs.html](http://www.ngdc.noaa.gov/mgg/shorelines/gshhs.html)
* **World Borders Dataset**:
    * Very simple dataset of world borders
    * It's a shapefile with a single layer, one feature per country
    * Has some useful attributes per feature like name, ISO, FIPS, UN codes, etc
    * You can get it from [http://thematicmapping.org/downloads/world_borders.php](http://thematicmapping.org/downloads/world_borders.php)


#### Sources of geospatial data in raster format

* Stuff in raster: satellite images, DEMs, shaded relief images
* **Landsat**
    * Images from dedicated satellites, dating back to 1972. Has BW, RGB, Infrared, and Thermal
    * Typically 30m/pixel, BW from Landsat 7 are 15m/pixel
    * Typically available as GeoTIFF, which is geospatially tagged TIFF
    * Separate bands are stored in separate files because it's satellite data.
    * Landsat 7 has red, green, blue, three different infrared, thermal, and high resolution black and white bands
    * You combine the files using GDAL
    * Raw data is distorted by earth's curvature, elevation, etc, so images have to be orthorectified prior to use (most images are downloadable as already orthorectified).
    * Easiest way to get it is via University of Maryland's Global Land Cover Facility website
    * That's at [http://glcf.umiacs.umd.edu/data/landsat](http://glcf.umiacs.umd.edu/data/landsat)
    * They have an FTP site, and tools for selecting areas by "path and row number"
    * Directory and file names include the world reference system (WRS) in use, the path and row number, the satellite number, date, and the band number
    * ``p091r089_7t20001123_z55_nn10.tif.gz`` refers to path ``091``, row ``089``, ``7`` is the satellite number, ``20001123`` is the date, and ``nn10`` says the file is for band 1.
* **Natural Earth**
    * At [http://www.naturalearthdata.com](http://www.naturalearthdata.com)
    * Has five types of raster map at 1:10,000,000 and 1:50,000,000 scales:
        * Cross blended hypsometric tints &mdash; color by elevation/climate
        * natural earth 1 &mdash; backdrops for other info, lightly shaded
        * natural earth 2
        * ocean bottom &mdash; shaed relief + depth-based coloring
        * shaded relief &mdash; grayscale shades based on elevation data
    * Data is in TIFF, except for bathymetry, which is in adobe photoshop
    * all in lat/long projection, WGS84 datum
    * Once you get it, you can open the TIFF via ``gdal_translate``, and the photoshop files with GIMP
* **Global Land One-kilometer Base Elevation (GLOBE)**
    * high quality, medium resolution DEM data for the entire world
    * Data is a raster of 32-bit signed integers representing height above/below sea level in meters.
    * Each pixel represents a square 30 arc-seconds of longitude wide by 30 arc-seconds of latitude high.
    * Pixels are roughly a kilometer square.
    * Raw globe data is just a list of integers in big-endian format, cells read left to right and then top to bottom, from x=0,y=0 to x=10800,y=6000. Can that be right? That's their example, but that's in no way a square.
    * You can get it from [http://www.ngdc.noaa.gov/mgg/topo/globe.html](http://www.ngdc.noaa.gov/mgg/topo/globe.html)
    * If you download a premade tile, you need the header (``.hdr``) file so it can be georeferenced and processed by GDAL. Make sure to export any custom areas in ESRI ArcView format so you get the appropriate header file for GDAL.
    * If you need header files for premade tiles, you can get them from [http://www.ngdc.noaa.gov/mgg/topo/elev/esri/hdr](http://www.ngdc.noaa.gov/mgg/topo/elev/esri/hdr)
    * Put the raw DEM file in the same directory as the header file and open with ``dataset = osgeo.gdal.Open("j10g.bil")``
* **National Elevation Dataset (NED)**
    * High res dem dataset from USGS, for continental US, alaska, hawaii, and US territories
    * Most data at 30m/pixel or 10m/pixel, some areas at 3m/pixel
    * Alaska generally at 60m/pixel
    * Data is in GeoTIFF, ArcGRID, etc, can be processed with GDAL
    * You can get it from [http://ned.usgs.gov](http://ned.usgs.gov) (descriptions) and [http://viewer.nationalmap.gov/viewer/](http://viewer.nationalmap.gov/viewer/) (downloading/viewing)
    * You get a compressed zip via an email link.
    * If you get GeoTIFF, you can open it in GDAL like any raster data
    * If you get DEM data, you may want to look at the ``gdaldem`` utility that makes it easy to view and manipulate DEM raster data.


#### Sources of other types of geospatial data

* **GEOnet Names Server**
    * Large database of place names; official repo of non-American place names
    * Gives lat/long and codes for place type (populated place, administrative district, natural feature, etc), elevation, and code for name type (official, conventional, historical, etc)
    * Data is a tab delimited text file with a header row
    * You can get it info on field codes from [http://earth-info.nga.mil/gns/html/gis_countryfiles.html](http://earth-info.nga.mil/gns/html/gis_countryfiles.html)
    * And the actual dataset at [http://earth-info.nga.mil/gns/html/namefiles.htm](http://earth-info.nga.mil/gns/html/namefiles.htm)
* **Geographic Names Information System (GNIS)**
    * US Equivalent of GEOnet Names Server
    * Comes as pipe delimited text files with a header line
    * You can get it at [http://geonames.usgs.gov/domestic](http://geonames.usgs.gov/domestic)

#### Choosing your geospatial data source

* Simple base maps == World Borders Dataset
* Shaded relief maps == GLOBE or NED data processed with ``gdaldem``; Natural Earth images
* Street map == OpenStreetMap
* City outlines == TIGER; Natural Earth urban areas
* Detailed country outlines == GSHHS level 1
* Photorealistic Earth images == Landsat
* City and place names == GNIS or GEOnet names server


### Chapter 5: Working with Geospatial Data in Python

* Chapter covers:
    * Reading / writing vector and raster data
    * Changing datums and projections used by data
    * Representing and storing geospatial data
    * Doing geospatial calculations on points/lines/polygons
    * Converting/standardizing units of geometry and distance
    
#### Pre-requisites

* GDAL/OGR 1.9+
* pyproj 1.9.2+
* Shapely 1.2+

#### Reading and Writing Geospatial Data

* **Task &mdash; calculate the bounding box for each country in the world**
    * Get the World Borders Dataset
    * Use python to calculate the bounding box by finding min/max lat/long:

```Python
#!/usr/bin/env python2.7

# calcBoundingBoxes.py

from osgeo import ogr

shapefile = ogr.Open("../shared_data/world_borders/TM_WORLD_BORDERS-0.3.shp")
layer = shapefile.GetLayer(0)

countries = [] # List of tuples in format
               # (code, name, minLat, maxLat, minLong, maxLong)

for i in range(layer.GetFeatureCount()):
    feature = layer.GetFeature(i)
    countryCode = feature.GetField("ISO3")
    countryName = feature.GetField("NAME")
    geometry = feature.GetGeometryRef()
    minLong, maxLong, minLat, maxLat = geometry.GetEnvelope()

    countries.append((countryName, countryCode, minLat, 
                      maxLat, minLong, maxLong))

countries.sort()

for name, code, minLast, maxLat, minLong, maxLong in countries:
    print "%s (%s) lat=%0.4f..%0.4f, long=%0.4f..%0.4f" % \
        (name, code, minLat, maxLat, minLong, maxLong)
```

* **Task &mdash; save country bounding boxes into a shapefile**

```Python
#!/usr/bin/env python2.7

# boundingBoxesToShapefile.py

import os, os.path, shutil

from osgeo import ogr
from osgeo import osr

# Open the source shapefile

srcFile = ogr.Open("../shared_data/world_borders/TM_WORLD_BORDERS-0.3.shp")
srcLayer = srcFile.GetLayer(0)

# Open output shapefile

if os.path.exists("bounding-boxes"):
    shutil.rmtree("bounding-boxes")
os.mkdir("bounding-boxes")

spatialReference = osr.SpatialReference()
spatialReference.SetWellKnownGeogCS('WGS84')

driver = ogr.GetDriverByName("ESRI Shapefile")
dstPath = os.path.join("bounding-boxes", "boundingBoxes.shp")
dstFile = driver.CreateDataSource(dstPath)
dstLayer = dstFile.CreateLayer("layer", spatialReference)

fieldDef = ogr.FieldDefn("COUNTRY", ogr.OFTString)
fieldDef.SetWidth(50)
dstLayer.CreateField(fieldDef)

fieldDef = ogr.FieldDefn("CODE", ogr.OFTString)
fieldDef.SetWidth(3)
dstLayer.CreateField(fieldDef)

# Read country features from source shapefile

for i in range(srcLayer.GetFeatureCount()):
    feature = srcLayer.GetFeature(i)
    countryCode = feature.GetField("ISO3")
    countryName = feature.GetField("NAME")
    geometry = feature.GetGeometryRef()
    minLong, maxLong, minLat, maxLat = geometry.GetEnvelope()

    # Save bounding box as feature in output shapefile

    linearRing = ogr.Geometry(ogr.wkbLinearRing)
    linearRing.AddPoint(minLong, minLat)
    linearRing.AddPoint(maxLong, minLat)
    linearRing.AddPoint(maxLong, maxLat)
    linearRing.AddPoint(minLong, maxLat)
    linearRing.AddPoint(minLong, minLat)

    polygon = ogr.Geometry(ogr.wkbPolygon)
    polygon.AddGeometry(linearRing)

    feature = ogr.Feature(dstLayer.GetLayerDefn())
    feature.SetGeometry(polygon)
    feature.SetField("COUNTRY", countryName)
    feature.SetField("CODE", countryCode)
    dstLayer.CreateFeature(feature)
    feature.Destroy()

srcFile.Destroy()
dstFile.Destroy()
```

* **Task &mdash; analyze height data using a digital elevation map**
    * Going to calculate a height histogram for New Zealand
    * Get the DEM data from GLOBE
```Python

```

### Chapter 6: GIS in the Database

* Chapter covers:
    * Spatially enabled databases, spatial indexes
    * summary of open source spatial databases
    * best practices, and working with geo dbs in python

#### Spatially-Enabled Databases

* Spatially-enabled databases are directly aware of spatial concepts
* They can perform operations like:
    * Storing spatial datatypes with their corresponding geometry
    * Running spatial queries like radius search
    * Joining data on spatial characteristics
    * Executing spatial functions like intersection

#### Spatial Indexes

* Spatial indexes are created to speed up geometry based searching
* They're defined the same way as normal indexes, but with the SPATIAL keyword for index type
* All three open source databases with spatial indexes use R-Tree data structures to do it
* PostGIS implements R-Trees using a Generalized Search Tree (GiST) index
* R-Tree index details:
    * They use a minimum bounding rectangle for each geometry
    * The bounding boxes are grouped into a nested hierarchy based on proximity
    * The hierarchy is then represented in a tree data structure
    * That allows fast scanning to find a particular geometry or to compare positions/sizes of various geometries
    * Since every geometry is reduced to a bounding box, R-Trees can support any geometry, not just polygons

#### Open Source Spatially-Enabled Databases

* **MySQL**
    * Has some limited support for spatial features
    * Must use MyISAM storage engine to use a spatial index
    * Has support for spatial datatypes and functions
    * Not always performant, has limited list of spatial functions
* **PostGIS**
    * Extension to PostgreSQL that lets you store geospatial data
    * Install postgres, then postgis extension, then psycopg db adapter
    * Create a role, create a database owned by that role
    * Within that database schema, enable the extension with ``CREATE EXTENSION postgis;``
    * 
    * Example of using it from Python:

```Python
import psycopg2
mydb = 'databaseName'
myuser = 'databaseUser'

conn = psycopg2.connect("dbname=mydb, user=myuser")
c = conn.cursor()

c.execute("DROP TABLE IF EXISTS cities")
c.execute("CREATE TABLE cities (id INTEGER, name VARCHAR(255), PRIMARY KEY (id))")
c.execute("SELECT AddGeometryColumn('cities', 'geom', -1, 'POLYGON', 2)")
c.execute("CREATE INDEX cityIndex ON cities USING GIST (geom)")

conn.commit()
```

* **SpatiaLite**
    * Install the ``libspatialite`` library
    * Use ``pysqlite`` package to access 
    * Example of usage in Python:

```Python
from pysqlite2 import dbapi2 as sqlite

db = sqlite.connect("myDatabase.db")
db.enable_load_extension(True)
db.execute('SELECT load_extension("libspatiallite")')

cursor = db.cursor()
```

#### Commercial Spatially-enabled Databases

* Basically Oracle and SQL Server.

#### Recommended Best Practices

* **Using the db to keep track of spatial references**
    * You should store the spatial reference (coordinate system, datum, projection) for each feature directly in the database, with the feature.
    * Spatial references are generally referenced with an integer value called a Spatial Reference Identifier (SRID)
    * You should use the European Petroleum Survey Group (EPSG) numbers as SRID values.
    * More info on that at [http://epsg-registry.org](http://epsg-registry.org)
    * PostGIS and SpatiaLite add a table called ``spatial_ref_sys`` to any spatially enabled database, which is preloaded with 3,000+ common spatial references by EPSG number
    * Tools that access the database can refer to that table to do on the fly coordinate transforms using the PROJ.4 library
    * PostGIS lets you associate an SRID value with a geometry when importing from WKT with ``ST_GeometryFromText(wkt, [srid])``
    * Use an SRID whenever possible to tell the database what spatial reference your geometry is uisng--PostGIS will do some validation on SRID if a column was set up to use that SRID, which keeps you from mixing spatial references in a table.
* **Using the appropriate spatial reference for your data**
    * With the exception of PostGIS's geography type, the databases assume you're storing projected coordinates
    * You have three options for length and area calculations on geospatial data:
        * Using a database that supports unprojected coordinates
        * Transforming features into projected coordinates to do the math
        * Storing geometries in projected coordinates from the start
    * Using a database that supports geographies:
        * Only PostGIS can work with unprojected coordinates
        * Limitations on its geography datatype include:
            * calculations on unprojected coordinates is order of magnitude slower than projected
            * geography type only supports lat/long on WGS84 datum
            * many functions are not yet supported for unprojected coordinates
    * Transforming features as required:
        * You have to always remember to transform before calculating
        * On the fly transformation of large numbers of geometries is very time consuming
    * Transforming features from the start:
        * Pretty good solution
        * Not always the best solution
    * Using unprojected coordinates:
        * Projected coordinates work best for a limited area of the Earth's surface at once
        * Best to use a projected coordinate system that covers the part you're interested in
* **Avoiding on-the-fly transformations within a query**
    * Imagine a ``cities`` table with a ``geom`` column containing ``POLYGON`` entries in UTM 12N projection (EPSG 32612), with a spatial index.
    * Also imagine a variable, ``pt`` that holds a ``POINT`` geometry in WGS84 unprojected coordinates (EPSG 4326).
    * You want to find the city in ``cities`` that contains point ``pt``
    * Make sure you avoid on-the-fly transformations of large sets of geometries.
    * Example queries, one slow, one fast:

```
-- Very slow, because it transforms every row in cities:
SELECT * FROM cities
WHERE Contains(Transform(geom, 4326), pt);

-- Fast, because it transforms only the single pt var:
SELECT * FROM cities
WHERE Contains(geom, Transform(pt, 32612));
```

* **Don't create geometries within a query**
    * This query would force ``ST_Intersection`` to create and return a geometry to ``ST_IsEmpty`` for every row: ``SELECT * FROM cities WHERE NOT ST_IsEmpty(ST_Intersection(outline, poly));``
    * Whereas this query would not: ``SELECT * FROM cities WHERE ST_Intersects(outline, poly);``
    * General rule: **never call a function that returns a ``Geometry`` object within the ``WHERE`` portion of a query.**
    * Using spatial indexes appropriately:
        * Like any indexing, too few is slow and too many is slow
        * Since spatial indexes are based on bounding boxes, they can only tell you if bounding boxes have relationships like overlap or intersection--not the underlying points, lines, and polygons.
        * Spatial indexes are most efficient when dealing with lots of relatively small geometries. Big polygons intersect so many other geometries that the db will fall back to polygon to polygon comparisons outside the index.
        * If your geometries consist of many thousands of vertices, polygon to polygon comparisons (instead of bounding box) will be really expensive. If possible, split large and complex polygons into smaller pieces to improve the usefulness of the spatial index.
* **Knowing the limits of your database's query optimizer**
    * Spatial databases have a spatial query optimizer
    * PostGIS Query optimizer details:
        * PostGIS looks at the amount of information in the database and how it is distributed
        * The query optimizer needs up to date statistics on the database contents to work well
        * It uses a genetic algorithm to determine the best way to run a query
        * To enable it to do a good job, you need to run the ``VACUUM ANALYZE`` command regularly, which will gather statistics on the database so the query optimizer works better.
        * You can see how the query optimizer works with ``EXPLAIN SELECT ...``, which will show you the query plan
    * SpatiaLite query optimizer:
        * Rather naive, only uses B*Tree indices
        * You can create an R-Tree index, but it won't get used unless you explicitly put it in the query
        * ``EXPLAIN QUERY PLAN`` will show you the query explanation

#### Working with Geospatial Databases Using Python

* **Prerequisites**
    * Install MySQL, PostGIS, and SpatiaLite
    * Get the GSHHS shoreline dataset
    * Take a copy of the low resolution ``l`` shapefiles and put them in a separate directory called ``GSHHS_l``
* **Working with PostGIS**

```Python
# Create the gshhs table:
import psycopg2

conn = psycopg2.connect("dbname=mydb, user=myuser")
c = conn.cursor()

c.execute("DROP TABLE IF EXISTS gshhs")
c.execute("""CREATE TABLE gshhs
              id        SERIAL,
              level     INTEGER,
              PRIMARY KEY (id))
          """)
c.execute("CREATE INDEX levelIndex ON gshhs(level)")
c.execute("SELECT AddGeometryColumn('gshhs', 'geom', 4326, 'POLYGON', 2)")
c.execute("CREATE INDEX geomIndex ON gshhs USING GIST (geom)")
c.commit()


# Import data from the shapefile into the db:
import os.path
from osgeo import ogr

for level in [1,2,3,4]:
    fName = os.path.join("GSHHS_l", "GSHHS_l_L"+str(level)+".shp")
    shapefile = ogr.Open(fName)
    layer = shapefile.GetLayer(0)
    for i in range(layer.GetFeatureCount()):
        feature = layer.GetFeature(i)
        geometry = feature.GetGeometryRef()
        wkt = geometry.ExportToWkt()
        c.execute("INSERT INTO gshhs (level, geom) VALUES (%s, ST_GeomFromText(%s, 4326))", (level, wkt))
    c.commit()


# Run VACUUM ANALYZE to improve optimizer
old_level = conn.isolation_level
conn.set_isolation_level(0)
c.execute("VACUUM ANALYZE")
conn.set_isolation_level(old_level)


# Search for UK shoreline with coordinates for London
LONDON = 'POINT(-0.1263 51.4980)'

c.execute("SELECT id, ST_AsText(geom) FROM gshhs " +
          "WHERE (level=%s) AND " +
          "(ST_Contains(geom, ST_GeomFromText(%s, 4326)))",
          (1, LONDON))

shoreline = None
for id, wkt in c:
    shoreline = wkt

f = file("uk-shoreline.wkt", "w")
f.write(shoreline)
f.close()
```

### Chapter 7: Working with Spatial Data

* Chapter is about creating a hypothetical web app called DISTAL (Distance-based Identification of Shorelines, Towns, and Lakes)

#### About DISTAL

* Basic workflow
    1. User selects country, country map is displayed
    2. User sets radius in miles, clicks inside country
    3. System finds all cities/towns in radius of click
    4. Resulting features displayed at higher resolution

#### Designing and Building the Database

* Data required
    * List of countries with boundary map for each
    * Shoreline and lake boundaries
    * List of major cities and towns, with name+point data for each

