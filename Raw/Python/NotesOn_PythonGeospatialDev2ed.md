# Notes on Python Geospatial Development, 2nd ed.

_By Erik Westra, Packt Publishing 2013_

## Executive Summary

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
